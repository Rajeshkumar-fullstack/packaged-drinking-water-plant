const fs = require('fs');

let html = fs.readFileSync('water-bottles.html', 'utf8');

// 1. Section 1 (250ml)
html = html.replace(
  'id="bottles250-500"',
  'id="bottle250ml"'
);

// 2. Section 3 (1L)
html = html.replace(
  'id="bottles1L-2L"',
  'id="bottle1L"'
);

// 3. Section 4 (2L)
html = html.replace(
  '<!-- 4. 2L Family Travel Pack -->\r\n        <div class="grid-2" style="align-items:center;">',
  '<!-- 4. 2L Family Travel Pack -->\r\n        <div class="grid-2" id="bottle2L" style="align-items:center; scroll-margin-top:100px;">'
);
html = html.replace(
  '<!-- 4. 2L Family Travel Pack -->\n        <div class="grid-2" style="align-items:center;">',
  '<!-- 4. 2L Family Travel Pack -->\n        <div class="grid-2" id="bottle2L" style="align-items:center; scroll-margin-top:100px;">'
);

// 4. Studio lighting background replacement for the 4 bottle images
const studioBg = 'background:radial-gradient(circle at 50% 45%, #FFFFFF 0%, rgba(235, 248, 252, 0.95) 55%, rgba(214, 242, 250, 0.9) 100%);';

html = html.split('background:var(--bg-secondary);').join(studioBg);

fs.writeFileSync('water-bottles.html', html, 'utf8');
console.log('Successfully updated water-bottles.html!');
