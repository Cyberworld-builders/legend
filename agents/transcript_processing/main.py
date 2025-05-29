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
    Cluster embeddings to identify main topics
    Returns: List of cluster indices for each transcript
    """
    if len(embeddings) < num_topics:
        print(f"Warning: Fewer transcripts ({len(embeddings)}) than requested topics ({num_topics}). Reducing topics.")
        num_topics = max(1, len(embeddings))
    
    kmeans = KMeans(n_clusters=num_topics, random_state=42)
    cluster_labels = kmeans.fit_predict(embeddings)
    
    # Group indices by cluster
    clusters = [[] for _ in range(num_topics)]
    for idx, label in enumerate(cluster_labels):
        clusters[label].append(idx)
    
    return clusters

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
    Generate discussion prompts for each topic
    """
    standard_prompt = """
    Facilitate a focused discussion on the following topic using the provided context.
    Encourage participants to explore key ideas, share insights, and consider implications.
    Use the context to ground the conversation and avoid speculation.
    """
    
    prompts = []
    for cluster in clusters:
        if not cluster:
            continue  # Skip empty clusters
        
        # Get transcripts for this topic
        topic_transcripts = [transcripts[idx] for idx in cluster]
        
        # Generate topic name
        topic_name = generate_topic_name(topic_transcripts, client)
        
        # Retrieve relevant embeddings (search within cluster)
        relevant_ids = [f"transcript_{idx}" for idx in cluster]
        relevant_docs = vector_store.get(ids=relevant_ids)
        
        # Format prompt
        prompt_data = {
            "topic": topic_name,
            "standard_prompt": standard_prompt,
            "context": relevant_docs["documents"],
            "ids": relevant_ids,
            "historical_query": "Placeholder: Query historical embeddings for deeper context (to be implemented)"
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
    
    # Identify topics
    clusters = identify_topics(embeddings, num_topics=4)
    print(f"Identified {len([c for c in clusters if c])} topics")
    
    # Generate discussion prompts
    prompts = generate_discussion_prompts(cleaned_transcripts, vector_store, clusters, client)
    
    # Output prompts
    for i, prompt in enumerate(prompts):
        print(f"\nDiscussion Prompt {i+1}:")
        print(f"Topic: {prompt['topic']}")
        print(f"Standard Prompt: {prompt['standard_prompt']}")
        print("Context (Transcripts):")
        for doc in prompt['context']:
            print(f"- {doc[:100]}...")
        print(f"Document IDs: {prompt['ids']}")
        print(f"Historical Query: {prompt['historical_query']}")

    # Create GitHub issue for each discussion prompt
    github_token = get_github_token()
    repository = get_repository_name()
    g = Github(github_token)
    repo = g.get_repo(repository)
    
    created_issues = []
    for i, prompt in enumerate(prompts):
        try:
            # Format issue description with all prompt details
            description = f"""
Topic: {prompt['topic']}

Discussion Prompt: {prompt['standard_prompt']}

Historical Context Query: {prompt['historical_query']}

Relevant Transcript Excerpts:
{chr(10).join(f'- {doc[:500]}...' for doc in prompt['context'])}

Reference Document IDs: {', '.join(prompt['ids'])}

Generated from parent issue #{issue_id}
"""
            
            # Create issue
            issue = repo.create_issue(
                title=f"Discussion Topic: {prompt['topic']}",
                body=description,
                labels=['transcript-topic']
            )
            created_issues.append(issue.number)
            print(f"Created issue #{issue.number} for topic {i+1}")
            
        except Exception as e:
            print(f"Error creating issue for topic {i+1}: {str(e)}")
    
    print(f"\nCreated {len(created_issues)} discussion topic issues: {created_issues}")

if __name__ == "__main__":
    main()