const fs = require('fs');
const path = require('path');

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

console.log('--- RUNNING AUDIT ACROSS ALL 9 PAGES ---');

const heroImages = new Map();
const heroTitles = new Map();

pages.forEach(page => {
  const html = fs.readFileSync(page, 'utf8');
  
  // 1. Check Hero section
  const heroMatch = html.match(/<section class="hero-section"[\s\S]*?<\/section>/i);
  if (!heroMatch) {
    console.error(`ERROR: No hero section in ${page}`);
    return;
  }
  const heroHtml = heroMatch[0];

  // 2. Check title
  const titleMatch = heroHtml.match(/<h1[^>]*class="hero-title"[^>]*>([\s\S]*?)<\/h1>/i);
  const titleText = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : 'MISSING';
  if (heroTitles.has(titleText)) {
    console.error(`ERROR: Duplicate title in ${page}: "${titleText}" (also in ${heroTitles.get(titleText)})`);
  } else {
    heroTitles.set(titleText, page);
  }

  // 3. Check image
  const imgMatch = heroHtml.match(/<img[^>]+src="([^">]+)"[^>]*>/i);
  const imgSrc = imgMatch ? imgMatch[1] : 'MISSING';
  if (heroImages.has(imgSrc)) {
    console.error(`ERROR: Duplicate hero image in ${page}: "${imgSrc}" (also in ${heroImages.get(imgSrc)})`);
  } else {
    heroImages.set(imgSrc, page);
  }

  // 4. Check local image existence if not http
  if (!imgSrc.startsWith('http')) {
    const localPath = path.resolve(__dirname, '..', imgSrc);
    if (!fs.existsSync(localPath)) {
      console.error(`ERROR: Hero image file does not exist on disk: ${localPath}`);
    } else {
      console.log(`    File verified on disk (${(fs.statSync(localPath).size / 1024).toFixed(1)} KB)`);
    }
  }

  // 5. Check CSS and JS links
  const hasCss = html.includes('assets/css/hero-animations.css');
  const hasJs = html.includes('assets/js/hero-animations.js');
  if (!hasCss) console.error(`ERROR: Missing hero-animations.css in ${page}`);
  if (!hasJs) console.error(`ERROR: Missing hero-animations.js in ${page}`);

  // 6. Check badges
  const badgeMatches = heroHtml.match(/<div class="hero-badge-item">/g);
  const badgeCount = badgeMatches ? badgeMatches.length : 0;

  console.log(`✓ ${page}:`);
  console.log(`    Title: "${titleText}"`);
  console.log(`    Image: "${imgSrc}"`);
  console.log(`    Badges: ${badgeCount}`);
});

console.log('\n--- VERIFICATION SUMMARY ---');
console.log(`Total Pages Tested: ${pages.length}`);
console.log(`Unique Hero Images: ${heroImages.size} / ${pages.length}`);
console.log(`Unique Hero Titles: ${heroTitles.size} / ${pages.length}`);
