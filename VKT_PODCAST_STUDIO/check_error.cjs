const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER CONSOLE ERROR:', msg.text());
    }
  });

  page.on('pageerror', error => {
    console.log('BROWSER PAGE ERROR:', error.message);
  });

  try {
    await page.goto('https://vkt-podcast-studio.vercel.app', { waitUntil: 'networkidle0' });
    console.log('Page loaded successfully.');
  } catch (e) {
    console.log('Error loading page:', e.message);
  }

  await browser.close();
})();
