const markdownContent = `
# New Test Article
This is an attempt to get a feel for the new workflow.
`;

export default function BlogPost() {
  return {
    props: {
      content: markdownContent
    }
  };
}
