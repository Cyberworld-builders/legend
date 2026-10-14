import React from 'react';

export default function AuthorSchema() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Jay Long',
    url: 'https://cyberworldbuilders.com',
    jobTitle: 'Software Engineer and Independent Technologist',
    description: 'Engineer exploring agent systems, human–AI collaboration, creative software, music technology, and immersive experiences.',
    image: 'https://cyberworldbuilders.com/images/logo.png',
    sameAs: [
      'https://github.com/CyberWorld-builders',
      'https://youtube.com/@cyberbuilders',
      'https://x.com/cyberbuilders',
    ],
    knowsAbout: [
      'AI coding agents',
      'Human–AI collaboration',
      'Software engineering',
      'Infrastructure and developer tools',
      'Music technology',
      'Audio analysis',
      'Creative software',
      'Mixed reality',
      'Immersive experiences',
      'Location-based entertainment',
      'Interactive storytelling',
    ],
    affiliation: {
      '@type': 'Organization',
      name: 'CyberWorld Builders',
      url: 'https://cyberworldbuilders.com',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
    />
  );
}
