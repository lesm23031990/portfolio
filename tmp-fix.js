const fs = require('fs');
const d = fs.readFileSync('src/content/content.json', 'utf8');

// Check the problematic section
const esEnd = d.indexOf('"en"');
console.log('ES section ends at byte index of "en":', esEnd);
console.log('Around that area:', JSON.stringify(d.substring(esEnd - 30, esEnd + 30)));

// Check for unmatched quotes in the ES section
let quotes = [];
for (let i = 0; i < esEnd; i++) {
  if (d[i] === '"' && (i === 0 || d[i-1] !== '\\')) {
    quotes.push(i);
  }
}
console.log('Number of unescaped quotes in ES:', quotes.length);
console.log('Even (should be complete pairs):', quotes.length % 2 === 0);

// Check specifically the default reply string
const defaultIdx = d.indexOf('"default"');
console.log('Default reply at:', defaultIdx);
const defaultStr = d.substring(defaultIdx + 10, d.indexOf(',', defaultIdx));
console.log('Default string raw:', defaultStr.substring(0, 50) + '...');

// Try to parse using eval with proper syntax
try {
  const parsed = JSON.parse(d);
  console.log('SUCCESS - JSON parsed OK');
} catch(e) {
  console.log('FAIL:', e.message);
  // The actual problem: try to find it
  const lines = d.split('\n');
  for (let i = 130; i < 150; i++) {
    console.log(`Line ${i+1}: ${lines[i]}`);
  }
}
