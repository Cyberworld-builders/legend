# Transcript Processing Agent

## Retrieve GitHub Issue
A tool written in typescript that can use the GitHub API to retrieve the description and comments from a given GitHub issue.

## Process Transcript
A tool written in Python that uses the OpenAI API to process a transcript of a voice memo.

## Embed Processed Text
A tool that uses Langchain to embed the processed text into a vector database.

## Generate Topics
A tool that organizes the combined transcripts into topics. 
1. Collect all of the embeddings from the processed text.
2. Determine a set of topics explored in the memos.
3. Organize the embeddings into topics, including the most relevant embeddings from historical memos.

## Generate Discussion Prompts
A tool that generates the prompts that initiate a discussion on a given topic. We will later use this to faciliate a deeper exploration with an LLM.
1. Prepares all of the information from the new memos by topic combined with prominent or relevant information from historical memos.
2. Generates a discussion prompt for each topic.
3. Create a ticket in the GitHub issue for each topic, including the discussion prompt in the description.