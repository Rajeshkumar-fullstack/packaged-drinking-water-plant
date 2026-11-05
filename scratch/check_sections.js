const fs = require('fs');

['water-cans.html', 'water-bottles.html', 'water-pouches.html'].forEach(f => {
  const html = fs.readFileSync(f, 'utf8');
  console.log('=== ' + f + ' ===');
  const ids = html.match(/id="[^"]+"/g) || [];
  console.log('IDs:', ids.slice(0, 15));
  const h2s = html.match(/<h2[^>]*>[\s\S]*?<\/h2>/gi) || [];
  console.log('H2s:', h2s.map(h => h.replace(/<[^>]+>/g, '').trim()));
  const h3s = html.match(/<h3[^>]*>[\s\S]*?<\/h3>/gi) || [];
  console.log('H3s:', h3s.map(h => h.replace(/<[^>]+>/g, '').trim()));
});
