const fs = require('fs');
const html = fs.readFileSync('products.html', 'utf8');

const regex = /<div class="product-card[^>]*>([\s\S]*?)<\/div>\s*<\/div>/g;
let match;
let count = 0;

while ((match = regex.exec(html)) !== null) {
  count++;
  const block = match[0];
  const titleMatch = block.match(/<h3[^>]*class="product-title"[^>]*>([\s\S]*?)<\/h3>/i);
  const imgMatch = block.match(/<img[^>]+src="([^">]+)"/i);
  const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : 'NO TITLE';
  const img = imgMatch ? imgMatch[1] : 'NO IMG';
  const hasFullDetails = block.includes('Full Details');
  const detailsHrefMatch = block.match(/<a[^>]+href="([^">]+)"[^>]*>Full Details/i);
  const detailsHref = detailsHrefMatch ? detailsHrefMatch[1] : 'NONE';
  console.log(`${count}. ${title}`);
  console.log(`   Img: ${img}`);
  console.log(`   Full Details Link: ${detailsHref}`);
}
