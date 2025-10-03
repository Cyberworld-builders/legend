// Test script to check tag lookup
const { getTagData, tagDataMap } = require('./lib/generated-tags/tag-index.ts');

console.log('Testing tag lookup...');

// Test some tags that are failing
const testTags = [
  'web%20development',
  'career%20transition', 
  'AI%20tools',
  'automation',
  'database'
];

testTags.forEach(tag => {
  const result = getTagData(tag);
  console.log(`Tag "${tag}": ${result ? 'FOUND' : 'NOT FOUND'}`);
  if (result) {
    console.log(`  - Post count: ${result.postCount}`);
    console.log(`  - Original tag: ${result.tag}`);
  }
});

console.log('\nMap keys sample:');
const keys = Array.from(tagDataMap.keys()).slice(0, 10);
keys.forEach(key => console.log(`  - "${key}"`));
