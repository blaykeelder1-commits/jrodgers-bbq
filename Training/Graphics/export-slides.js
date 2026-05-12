const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const VIDEOS = [
  { file: 'Video-1-Slides.html', prefix: 'V1' },
  { file: 'Video-2-Slides.html', prefix: 'V2' },
  { file: 'Video-3-Slides.html', prefix: 'V3' },
];

const OUTPUT_DIR = path.join(__dirname, '..', 'Exports', 'Slides');

(async () => {
  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const video of VIDEOS) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    const filePath = 'file:///' + path.join(__dirname, video.file).replace(/\\/g, '/');
    console.log(`\nLoading ${video.file}...`);
    await page.goto(filePath, { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait for fonts to load
    await page.evaluate(() => document.fonts.ready);
    await new Promise(r => setTimeout(r, 2000));

    // Get all slide elements
    const slides = await page.$$('.slide');
    console.log(`Found ${slides.length} slides in ${video.file}`);

    // Get slide labels for filenames
    const labels = await page.$$eval('.slide-label', els =>
      els.map(el => el.textContent.trim())
    );

    for (let i = 0; i < slides.length; i++) {
      const slideNum = String(i + 1).padStart(2, '0');
      // Clean the label for use as filename
      let label = labels[i] || `Slide-${slideNum}`;
      // Remove the "SLIDE X — " prefix if present
      label = label.replace(/^SLIDE\s+\d+\s*[—-]\s*/i, '');
      // Clean for filesystem
      label = label.replace(/[^a-zA-Z0-9\s&-]/g, '').replace(/\s+/g, '-').substring(0, 50);

      const filename = `${video.prefix}_${slideNum}_${label}.png`;
      const outputPath = path.join(OUTPUT_DIR, filename);

      // Scroll the slide into view and screenshot it
      await slides[i].scrollIntoView();
      await new Promise(r => setTimeout(r, 200));

      await slides[i].screenshot({
        path: outputPath,
        type: 'png',
      });

      console.log(`  Exported: ${filename}`);
    }

    await page.close();
  }

  await browser.close();
  console.log(`\nDone! All slides exported to: ${OUTPUT_DIR}`);
})();
