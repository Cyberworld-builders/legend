import os
import time
import subprocess
from github import Github
from openai import OpenAI
from dotenv import load_dotenv

# Load .env file if it exists (for local development)
load_dotenv()

def get_github_token():
    """
    Get GitHub token from environment or GitHub CLI
    """
    # First try environment variable (works in both pipeline and local with .env)
    github_token = os.environ.get("GITHUB_TOKEN")
    
    if not github_token:
        # Try to get token from GitHub CLI (local development)
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
    # First try environment variable (pipeline)
    repository = os.environ.get("GITHUB_REPOSITORY")
    
    if not repository:
        # Try to get from git remote (local development)
        try:
            result = subprocess.run(
                ["git", "remote", "get-url", "origin"], 
                capture_output=True, 
                text=True, 
                check=True
            )
            remote_url = result.stdout.strip()
            # Extract owner/repo from URL (handles both SSH and HTTPS)
            if "github.com" in remote_url:
                if remote_url.startswith("git@"):
                    # SSH format: git@github.com:owner/repo.git
                    repository = remote_url.split(":")[-1].replace(".git", "")
                else:
                    # HTTPS format: https://github.com/owner/repo.git
                    repository = "/".join(remote_url.split("/")[-2:]).replace(".git", "")
            print(f"Detected repository from git remote: {repository}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            raise ValueError("GITHUB_REPOSITORY not found in environment and git remote not available")
    
    return repository

def get_issue_details(issue_id: str):
    """
    Retrieves GitHub issue details using credentials from GitHub Actions environment or local setup
    
    Args:
        issue_id: The ID of the GitHub issue to retrieve
        
    Returns:
        dict containing issue title, body, and comments
    """
    # Get GitHub token
    github_token = get_github_token()
    
    # Get repository info
    repository = get_repository_name()

    # Initialize GitHub client
    g = Github(github_token)
    
    # Get repository object
    repo = g.get_repo(repository)
    
    try:
        # Get issue by ID
        issue = repo.get_issue(number=int(issue_id))
        
        # Collect issue details
        issue_data = {
            "title": issue.title,
            "body": issue.body,
            "comments": [comment.body for comment in issue.get_comments()]
        }
        
        return issue_data
        
    except Exception as e:
        raise Exception(f"Error retrieving issue {issue_id}: {str(e)}")

def main():
    # Get issue ID from workflow input or command line argument
    issue_id = os.environ.get("INPUT_ISSUE_ID")
    if not issue_id and len(os.sys.argv) > 1:
        issue_id = os.sys.argv[1]
        print(f"Using issue ID from command line: {issue_id}")
    
    if not issue_id:
        raise ValueError("Issue ID not provided. Set INPUT_ISSUE_ID environment variable or pass as command line argument")
    
    # Initialize OpenAI client
    openai_api_key = os.environ.get("OPENAI_API_KEY")
    if not openai_api_key:
        raise ValueError("OPENAI_API_KEY not found in environment")
    
    client = OpenAI(api_key=openai_api_key)
        
    # Get issue details
    issue_details = get_issue_details(issue_id)
    print(f"Retrieved issue details for #{issue_id}")
    print(f"Title: {issue_details['title']}")
    print(f"Number of comments: {len(issue_details['comments'])}")

    # Each comment is a voice memo. We need to loop through all of them and send them to the OpenAI API to be processed for errors, relevance and redundancy using a carefully crafted prompt.
    comments = [issue_details['comments'][0]] if issue_details['comments'] else []
    for i, comment in enumerate(comments):
        print(f"Processing comment {i+1}: {comment[:50]}...")

        cleanup_prompt = """
        You are a helpful assistant that cleans up voice memo transcripts for errors, relevance, and redundancy. 
        Remove any vocal ticks, filler words, and any other non-essential content. 
        The transcription often fails to interpret technology terms, company names, and acronyms, so
        use the context of the entire conversation in order to interpret and correct these.
        Typically, when these memos are recorded, I am either walking the dog or driving. 
        Eliminate any content that that is obviously me talking to the dog, other animals, or other drivers.
        I also often repeat myself, so if I say something twice, remove the first instance.
        """

        try:
            start_time = time.time()
            print(f"Sending request to OpenAI for comment {i+1}...")
            
            # Send the comment to the OpenAI API
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{
                    "role": "system", 
                    "content": cleanup_prompt
                }, {
                    "role": "user", 
                    "content": f"The voice memo transcript is: {comment}"
                }]
            )
            
            end_time = time.time()
            duration = end_time - start_time
            print(f"Response received in {duration:.2f} seconds")
            print(f"Cleaned up comment {i+1}: {response.choices[0].message.content}")
            
        except Exception as e:
            print(f"Error processing comment {i+1}: {str(e)}")
            continue

if __name__ == "__main__":
    main()
