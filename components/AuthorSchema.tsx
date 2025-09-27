import React from 'react';

interface AuthorSchemaProps {
  name?: string;
  url?: string;
  email?: string;
  jobTitle?: string;
  description?: string;
}

export default function AuthorSchema({ 
  name = "Jay Long",
  url = "https://cyberworldbuilders.com",
  email = "contact@cyberworldbuilders.com",
  jobTitle = "Software Engineer & Founder",
  description = "Professional software engineer specializing in web development, AI integration, automation solutions, and SaaS development with expertise in mixed reality and location-based entertainment technologies."
}: AuthorSchemaProps) {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": name,
    "url": url,
    "email": email,
    "jobTitle": jobTitle,
    "description": description,
    "image": "https://cyberworldbuilders.com/images/logo.png",
    "sameAs": [
      "https://github.com/CyberWorld-builders",
      "https://youtube.com/@cyberbuilders",
      "https://x.com/cyberbuilders",
      "https://www.facebook.com/cyberworldbuilders",
      "https://www.upwork.com/freelancers/jaylongcyberworld"
    ],
    "knowsAbout": [
      "Software Engineering",
      "Web Development",
      "AWS",
      "SaaS Development",
      "JavaScript",
      "TypeScript",
      "React",
      "Node.js",
      "Python",
      "Database Design",
      "API Development",
      "AI Integration",
      "Automation",
      "Mixed Reality",
      "Virtual Reality",
      "Augmented Reality",
      "IoT Development",
      "Location-Based Entertainment",
      "Content Management Systems",
      "SEO Optimization",
      "Digital Marketing",
      "Professional Branding",
      "Generative AI",
      "AI Coding Agents",
      "Human-AI Collaboration",
      "Infrastructure as Code",
      "DevOps",
      "Cloud Architecture",
      "Terraform",
      "Jamstack",
      "Next.js",
      "Content Strategy",
      "Blog Architecture",
      "Schema Markup",
      "Performance Optimization",
      "No-Code Development",
      "Workflow Automation",
      "Voice AI",
      "Music Technology",
      "Audio Analysis",
      "Healthcare Software",
      "EMR Systems",
      "Career Development",
      "Productivity Frameworks",
      "Business Strategy",
      "Technical Writing"
    ],
    "alumniOf": {
      "@type": "Organization",
      "name": "Self-Taught Software Engineer"
    },
    "worksFor": {
      "@type": "Organization",
      "name": "CyberWorld Builders",
      "url": "https://cyberworldbuilders.com"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(personSchema)
      }}
    />
  );
}
