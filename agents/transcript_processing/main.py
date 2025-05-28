import os
from github import Github

def get_issue_details(issue_id: str):
    """
    Retrieves GitHub issue details using credentials from GitHub Actions environment
    
    Args:
        issue_id: The ID of the GitHub issue to retrieve
        
    Returns:
        dict containing issue title, body, and comments
    """
    # Get GitHub token from Actions environment
    github_token = os.environ.get("GITHUB_TOKEN")
    if not github_token:
        raise ValueError("GITHUB_TOKEN not found in environment")
        
    # Get repository info from Actions environment
    repository = os.environ.get("GITHUB_REPOSITORY")
    if not repository:
        raise ValueError("GITHUB_REPOSITORY not found in environment")

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
    # Get issue ID from workflow input
    issue_id = os.environ.get("INPUT_ISSUE_ID")
    if not issue_id:
        raise ValueError("Issue ID not provided")
        
    # Get issue details
    issue_details = get_issue_details(issue_id)
    print(f"Retrieved issue details for #{issue_id}")
    print(f"Title: {issue_details['title']}")
    print(f"Number of comments: {len(issue_details['comments'])}")

if __name__ == "__main__":
    main()
