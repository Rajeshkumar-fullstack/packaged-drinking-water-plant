const fs = require('fs');
const files = [
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

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const heroMatch = content.match(/<section class="hero-section"[\s\S]*?<\/section>/i);
  console.log('=== ' + f + ' ===');
  if (heroMatch) {
    console.log(heroMatch[0]);
  }
});
