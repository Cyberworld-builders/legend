import os
import time
import subprocess
import requests
from github import Github
from openai import OpenAI
from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from sklearn.cluster import KMeans
import numpy as np
from typing import List, Dict, Tuple, Optional
import chromadb
from chromadb.config import Settings
from sklearn.metrics import silhouette_score
from sklearn.cluster import DBSCAN

# Load .env file
load_dotenv()

def get_keycloak_token() -> Optional[str]:
    """
    Get Keycloak token for ChromaDB authentication
    Returns None if not configured for remote ChromaDB
    """
    kc_domain = os.environ.get("KC_DOMAIN")
    kc_client_secret = os.environ.get("KC_CLIENT_SECRET")
    
    if not kc_domain or not kc_client_secret:
        return None
    
    try:
        response = requests.post(
            f"https://{kc_domain}/realms/chromadb-realm/protocol/openid-connect/token",
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            data={
                "client_id": "chromadb-client",
                "client_secret": kc_client_secret,
                "grant_type": "client_credentials",
                "scope": "openid"
            }
        )
        response.raise_for_status()
        token_data = response.json()
        return token_data.get("access_token")
    except Exception as e:
        print(f"Error getting Keycloak token: {str(e)}")
        return None

def get_github_token():
    """
    Get GitHub token from environment or GitHub CLI
    """
    github_token = os.environ.get("GITHUB_TOKEN")
    if not github_token:
        try:
            result = subprocess.run(
                ["gh", "auth", "token"], 
                capture_output=True, 
                text=True, 
                check=True
            )
            github_token = result.stdout.strip()
            print("Using GitHub CLI credentials")
        except (subprocess.CalledProcessError, FileNotFoundError):
            raise ValueError("GITHUB_TOKEN not found in environment and GitHub CLI not available")
    return github_token

def get_repository_name():
    """
    Get repository name from environment or git remote
    """
    repository = os.environ.get("GITHUB_REPOSITORY")
    if not repository:
        try:
            result = subprocess.run(
                ["git", "remote", "get-url", "origin"], 
                capture_output=True, 
                text=True, 
                check=True
            )
            remote_url = result.stdout.strip()
            if "github.com" in remote_url:
                if remote_url.startswith("git@"):
                    repository = remote_url.split(":")[-1].replace(".git", "")
                else:
                    repository = "/".join(remote_url.split("/")[-2:]).replace(".git", "")
            print(f"Detected repository from git remote: {repository}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            raise ValueError("GITHUB_REPOSITORY not found in environment and git remote not available")
    return repository

def get_issue_details(issue_id: str):
    """
    Retrieves GitHub issue details using credentials
    """
    github_token = get_github_token()
    repository = get_repository_name()
    g = Github(github_token)
    repo = g.get_repo(repository)
    
    try:
        issue = repo.get_issue(number=int(issue_id))
        issue_data = {
            "title": issue.title,
            "body": issue.body,
            "comments": [comment.body for comment in issue.get_comments()]
        }
        return issue_data
    except Exception as e:
        raise Exception(f"Error retrieving issue {issue_id}: {str(e)}")

def clean_transcript(client: OpenAI, transcript: str) -> str:
    """
    Clean a single transcript using OpenAI API
    """
    cleanup_prompt = """
    You are a helpful assistant that cleans up voice memo transcripts for errors, relevance, and redundancy. 
    Remove any vocal ticks, filler words, and non-essential content. 
    Correct misinterpreted technology terms, company names, and acronyms using context.
    Eliminate content related to talking to animals or other drivers.
    Remove redundant statements, keeping the most recent instance.
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": cleanup_prompt},
                {"role": "user", "content": f"The voice memo transcript is: {transcript}"}
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error cleaning transcript: {str(e)}")
        return transcript  # Return original if cleaning fails

def create_chroma_client() -> chromadb.Client:
    """
    Create ChromaDB client - either remote (with auth) or local
    """
    chroma_domain = os.environ.get("CHROMA_DOMAIN")
    auth_token = get_keycloak_token()
    
    if chroma_domain and auth_token:
        print(f"Attempting to connect to remote ChromaDB at {chroma_domain}")
        try:
            client = chromadb.HttpClient(
                host=chroma_domain,
                port=443,
                ssl=True,
                headers={"Authorization": f"Bearer {auth_token}"}
            )
            client.heartbeat()
            print("Successfully connected to remote ChromaDB")
            return client
        except Exception as e:
            print(f"Failed to connect to remote ChromaDB: {str(e)}")
            print("Falling back to local ChromaDB")
    
    print("Using local ChromaDB")
    return chromadb.PersistentClient(path="./chroma_db")

def embed_transcripts(transcripts: List[str], collection_name: str) -> Tuple[Chroma, List[str]]:
    """
    Create embeddings for transcripts and store in ChromaDB
    Returns: Chroma vector store and document IDs
    """
    # Initialize OpenAI embeddings
    embeddings = OpenAIEmbeddings(openai_api_key=os.environ.get("OPENAI_API_KEY"))
    
    # Create ChromaDB client
    chroma_client = create_chroma_client()
    
    # Check if collection exists and delete if necessary
    try:
        collections = chroma_client.list_collections()
        if collection_name in [c.name for c in collections]:
            print(f"Collection {collection_name} exists, deleting to avoid conflicts")
            chroma_client.delete_collection(collection_name)
    except Exception as e:
        print(f"Error checking collections: {str(e)}")
    
    # Initialize LangChain ChromaDB wrapper
    vector_store = Chroma(
        client=chroma_client,
        collection_name=collection_name,
        embedding_function=embeddings
    )
    
    # Add transcripts to vector store
    doc_ids = [f"transcript_{i}" for i in range(len(transcripts))]
    vector_store.add_texts(texts=transcripts, ids=doc_ids)
    
    return vector_store, doc_ids

def identify_topics(embeddings: np.ndarray, num_topics: int = 4) -> List[List[int]]:
    """
    Cluster embeddings to identify main topics using adaptive clustering
    Returns: List of cluster indices for each transcript
    """
    # If we have very few transcripts, reduce the number of topics
    if len(embeddings) <= 2:
        print(f"Only {len(embeddings)} transcripts - creating one topic per transcript")
        return [[i] for i in range(len(embeddings))]
    
    # Try different numbers of clusters to find the optimal one
    best_score = -1
    best_clusters = None
    best_n_topics = num_topics
    
    # Test different cluster numbers
    for n in range(2, min(len(embeddings), num_topics + 1)):
        try:
            kmeans = KMeans(n_clusters=n, random_state=42)
            cluster_labels = kmeans.fit_predict(embeddings)
            
            # Calculate silhouette score (higher is better)
            score = silhouette_score(embeddings, cluster_labels)
            print(f"Trying {n} clusters: silhouette score = {score:.3f}")
            
            if score > best_score:
                best_score = score
                best_n_topics = n
                
                # Group indices by cluster
                clusters = [[] for _ in range(n)]
                for idx, label in enumerate(cluster_labels):
                    clusters[label].append(idx)
                best_clusters = clusters
                
        except Exception as e:
            print(f"Error with {n} clusters: {e}")
            continue
    
    # Fallback: if no good clustering found, try DBSCAN for natural grouping
    if best_clusters is None or best_score < 0.2:
        print("K-means clustering not effective, trying DBSCAN for natural grouping...")
        
        # Use DBSCAN to find natural clusters
        dbscan = DBSCAN(eps=0.5, min_samples=1, metric='cosine')
        cluster_labels = dbscan.fit_predict(embeddings)
        
        # Group indices by cluster (ignore noise points marked as -1)
        n_clusters = len(set(cluster_labels)) - (1 if -1 in cluster_labels else 0)
        clusters = [[] for _ in range(max(n_clusters, 1))]
        
        for idx, label in enumerate(cluster_labels):
            if label == -1:  # Noise point - put in its own cluster
                clusters.append([idx])
            else:
                clusters[label].append(idx)
        
        # Remove empty clusters
        clusters = [c for c in clusters if c]
        print(f"DBSCAN found {len(clusters)} natural groupings")
        return clusters
    
    print(f"Selected {best_n_topics} topics with silhouette score {best_score:.3f}")
    return best_clusters

def generate_topic_name(transcripts: List[str], client: OpenAI) -> str:
    """
    Generate a concise topic name for a group of transcripts
    """
    combined_text = " ".join(transcripts[:3])  # Limit to avoid token overflow
    prompt = f"""
    Summarize the following text into a concise topic name (5-10 words):
    {combined_text}
    """
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error generating topic name: {str(e)}")
        return "Unnamed Topic"

def generate_discussion_prompts(
    transcripts: List[str],
    vector_store: Chroma,
    clusters: List[List[int]],
    client: OpenAI
) -> List[Dict]:
    """
    Generate discussion prompts for each topic with full transcript context
    """
    standard_prompt = """
    Facilitate a focused discussion on the following topic using the provided context.
    Encourage participants to explore key ideas, share insights, and consider implications.
    Use the context to ground the conversation and avoid speculation.
    Ask thought-provoking questions that help unpack the deeper themes and practical applications.
    """
    
    prompts = []
    for cluster_idx, cluster in enumerate(clusters):
        if not cluster:
            continue  # Skip empty clusters
        
        # Get transcripts for this topic
        topic_transcripts = [transcripts[idx] for idx in cluster]
        
        print(f"Cluster {cluster_idx + 1}: {len(topic_transcripts)} transcripts, {sum(len(t) for t in topic_transcripts)} total characters")
        
        # Generate topic name
        topic_name = generate_topic_name(topic_transcripts, client)
        
        # Create comprehensive context with full transcripts
        full_context = []
        for i, transcript_idx in enumerate(cluster):
            full_context.append({
                "transcript_id": f"transcript_{transcript_idx}",
                "session_number": transcript_idx + 1,
                "content": transcripts[transcript_idx],
                "word_count": len(transcripts[transcript_idx].split())
            })
        
        # Calculate total word count for this topic
        total_words = sum(tc["word_count"] for tc in full_context)
        
        # Format prompt with rich context
        prompt_data = {
            "topic": topic_name,
            "standard_prompt": standard_prompt,
            "context": full_context,  # Full transcripts instead of truncated
            "ids": [f"transcript_{idx}" for idx in cluster],
            "total_sessions": len(cluster),
            "total_words": total_words,
            "historical_query": f"Query: Find historical discussions related to '{topic_name}' for additional context (to be implemented)"
        }
        prompts.append(prompt_data)
    
    return prompts

def main():
    # Get issue ID
    issue_id = os.environ.get("INPUT_ISSUE_ID")
    if not issue_id and len(os.sys.argv) > 1:
        issue_id = os.sys.argv[1]
        print(f"Using issue ID from command line: {issue_id}")
    
    if not issue_id:
        raise ValueError("Issue ID not provided")
    
    # Initialize OpenAI client
    openai_api_key = os.environ.get("OPENAI_API_KEY")
    if not openai_api_key:
        raise ValueError("OPENAI_API_KEY not found")
    
    client = OpenAI(api_key=openai_api_key)
    
    # Get issue details
    issue_details = get_issue_details(issue_id)
    print(f"Retrieved issue details for #{issue_id}")
    print(f"Title: {issue_details['title']}")
    print(f"Number of comments: {len(issue_details['comments'])}")
    
    # Clean transcripts
    comments = issue_details['comments']
    cleaned_transcripts = []
    for i, comment in enumerate(comments):
        print(f"Processing comment {i+1}: {comment[:50]}...")
        cleaned = clean_transcript(client, comment)
        cleaned_transcripts.append(cleaned)
        print(f"Cleaned comment {i+1}: {cleaned[:50]}...")
    
    if not cleaned_transcripts:
        print("No transcripts to process")
        return
    
    # Embed transcripts
    collection_name = f"issue_{issue_id}_transcripts"
    vector_store, doc_ids = embed_transcripts(cleaned_transcripts, collection_name)
    print(f"Stored {len(doc_ids)} transcripts in ChromaDB")
    
    # Get embeddings for clustering
    embeddings = vector_store._collection.get(include=["embeddings"])["embeddings"]
    embeddings = np.array(embeddings)
    
    # Identify topics with adaptive clustering
    # Use fewer topics for fewer transcripts
    adaptive_num_topics = min(4, max(2, len(cleaned_transcripts) // 2))
    clusters = identify_topics(embeddings, num_topics=adaptive_num_topics)
    print(f"Identified {len([c for c in clusters if c])} topics from {len(cleaned_transcripts)} transcripts")
    
    # Generate discussion prompts
    prompts = generate_discussion_prompts(cleaned_transcripts, vector_store, clusters, client)
    
    # Output prompts
    for i, prompt in enumerate(prompts):
        print(f"\n{'='*60}")
        print(f"Discussion Topic {i+1}: {prompt['topic']}")
        print(f"{'='*60}")
        print(f"Sessions: {prompt['total_sessions']} | Total Words: {prompt['total_words']}")
        print(f"\nStandard Prompt: {prompt['standard_prompt']}")
        print(f"\nHistorical Query: {prompt['historical_query']}")
        print("\nTranscript Sessions:")
        for j, transcript_info in enumerate(prompt['context']):
            print(f"  Session {transcript_info['session_number']}: {transcript_info['word_count']} words")
            print(f"    Preview: {transcript_info['content'][:150]}...")
            print()
        print(f"Document IDs: {', '.join(prompt['ids'])}")
        print(f"{'='*60}")

    # Create GitHub issue for each discussion prompt
    github_token = get_github_token()
    repository = get_repository_name()
    g = Github(github_token)
    repo = g.get_repo(repository)
    
    created_issues = []
    for i, prompt in enumerate(prompts):
        try:
            # Format comprehensive issue description with full context
            transcript_sections = []
            for j, transcript_info in enumerate(prompt['context']):
                transcript_sections.append(f"""
### Session {transcript_info['session_number']} ({transcript_info['word_count']} words)
**Transcript ID:** {transcript_info['transcript_id']}

{transcript_info['content']}

---
""")
            
            description = f"""# Discussion Topic: {prompt['topic']}

**Summary:** {prompt['total_sessions']} transcript sessions, {prompt['total_words']} total words

## Discussion Prompt
{prompt['standard_prompt']}

## Historical Context Query
{prompt['historical_query']}

## Complete Transcript Content
{''.join(transcript_sections)}

## Metadata
- **Reference Document IDs:** {', '.join(prompt['ids'])}
- **Generated from parent issue:** #{issue_id}
- **Total sessions in this topic:** {prompt['total_sessions']}
- **Total word count:** {prompt['total_words']}
"""
            
            # Create issue with comprehensive content
            issue = repo.create_issue(
                title=f"Discussion Topic: {prompt['topic']}",
                body=description,
                labels=['transcript-topic', 'discussion']
            )
            created_issues.append(issue.number)
            print(f"Created issue #{issue.number} for topic '{prompt['topic']}' ({prompt['total_sessions']} sessions, {prompt['total_words']} words)")
            
        except Exception as e:
            print(f"Error creating issue for topic {i+1}: {str(e)}")
    
    print(f"\nCreated {len(created_issues)} discussion topic issues: {created_issues}")

if __name__ == "__main__":
    main()