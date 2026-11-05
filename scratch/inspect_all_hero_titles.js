const fs = require('fs');

const pages = [
  'index.html',
  'home-2.html',
  'about.html',
  'products.html',
  'water-cans.html',
  'water-bottles.html',
  'water-pouches.html',
  'quality-reports.html',
  'contact.html'
];

pages.forEach(p => {
  const c = fs.readFileSync(p, 'utf8');
  const lines = c.split('\n');
  lines.forEach((l, i) => {
    if (l.includes('hero-title')) {
      console.log(`${p}:${i+1}: ${l.trim()}`);
      for (let j = 1; j <= 4; j++) {
        if (lines[i+j] && !lines[i+j].includes('hero-title')) {
          console.log(`   ${lines[i+j].trim()}`);
          if (lines[i+j].includes('</h1>')) break;
        }
      }
    }
  });
});
