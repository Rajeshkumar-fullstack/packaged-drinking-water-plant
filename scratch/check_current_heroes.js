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
  if (heroMatch) {
    const imgMatch = heroMatch[0].match(/<img[^>]+src="([^">]+)"[^>]*>/i);
    const titleMatch = heroMatch[0].match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    console.log(f + ':');
    console.log('  Image:', imgMatch ? imgMatch[1] : 'NONE');
    console.log('  Title:', titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : 'NONE');
  }
});
