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
  const hasCss = content.includes('hero-animations.css');
  const hasJs = content.includes('hero-animations.js');
  console.log(f + ': CSS=' + hasCss + ', JS=' + hasJs);
});
