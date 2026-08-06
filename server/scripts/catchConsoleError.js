'use strict';

const { chromium } = require('playwright');

async function checkConsole() {
  console.log('Launching browser to inspect client JS errors...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', (msg) => {
    console.log(`[BROWSER CONSOLE ${msg.type().toUpperCase()}]:`, msg.text());
  });

  page.on('pageerror', (error) => {
    console.log('[BROWSER PAGE ERROR UNCAUGHT EXCEPTION]:', error.message, '\nSTACK:\n', error.stack);
  });

  try {
    await page.goto('http://localhost:5173/career-roadmap', { waitUntil: 'networkidle', timeout: 10000 });
    console.log('Page loaded. URL:', page.url());
  } catch (err) {
    console.log('Navigation error:', err.message);
  }

  await browser.close();
}

checkConsole().catch(console.error);
