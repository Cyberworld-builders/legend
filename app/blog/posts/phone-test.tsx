const markdownContent = `
# phone test
I created this entire commit and deployed it from my phone. I wrote the article and I used to get hug to commit merge and deploy it. I'm actually typing this with voice to text right now.
`;

export default function BlogPost() {
  return {
    props: {
      content: markdownContent
    }
  };
}