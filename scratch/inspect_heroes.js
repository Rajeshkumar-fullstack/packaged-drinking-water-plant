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
  console.log('==============================================');
  console.log('FILE:', f);
  
  // Look for hero sections or page header
  const heroMatch = content.match(/<section[^>]*hero[^>]*>([\s\S]*?)<\/section>/i) 
    || content.match(/<section[^>]*page-header[^>]*>([\s\S]*?)<\/section>/i)
    || content.match(/<header[^>]*page-header[^>]*>([\s\S]*?)<\/header>/i);

  if (heroMatch) {
    console.log(heroMatch[0].slice(0, 500) + '\n...\n' + heroMatch[0].slice(-200));
  } else {
    console.log('No hero or page-header section found!');
  }
});
