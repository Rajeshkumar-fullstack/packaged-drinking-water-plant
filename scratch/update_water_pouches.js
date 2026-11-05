const fs = require('fs');

let html = fs.readFileSync('water-pouches.html', 'utf8');

const studioBg = 'background:radial-gradient(circle at 50% 45%, #FFFFFF 0%, rgba(235, 248, 252, 0.95) 55%, rgba(214, 242, 250, 0.9) 100%);';

html = html.split('background:var(--bg-secondary);').join(studioBg);

// Ensure scroll-margin-top is 100px on pouch sections
html = html.replace('id="pouch200ml" style="margin-bottom:5rem; scroll-margin-top:90px;"', 'id="pouch200ml" style="margin-bottom:5rem; scroll-margin-top:100px;"');
html = html.replace('id="pouch500ml" style="scroll-margin-top:90px;"', 'id="pouch500ml" style="scroll-margin-top:100px;"');

fs.writeFileSync('water-pouches.html', html, 'utf8');
console.log('Successfully updated water-pouches.html!');
