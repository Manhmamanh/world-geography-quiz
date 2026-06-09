import puppeteer from 'puppeteer';

async function testUI() {
  console.log('Testing UI with Puppeteer...\n');

  let browser;
  try {
    // Connect to existing Chrome instance or launch new one
    try {
      browser = await puppeteer.connect({
        browserWSEndpoint: 'ws://localhost:9222'
      });
    } catch {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
      });
    }

    const page = await browser.newPage();
    page.setViewport({ width: 1280, height: 720 });

    console.log('Test 1: Loading app...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
    console.log('✓ App loaded\n');

    console.log('Test 2: Checking welcome screen...');
    const title = await page.$eval('h1', el => el.textContent);
    console.log(`✓ Found title: "${title}"\n`);

    console.log('Test 3: Taking screenshot of welcome screen...');
    await page.screenshot({ path: 'welcome-screen.png' });
    console.log('✓ Screenshot saved: welcome-screen.png\n');

    console.log('Test 4: Clicking start button...');
    await page.click('button.start-button');
    await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {});
    await new Promise(r => setTimeout(r, 2000));
    console.log('✓ Quiz started\n');

    console.log('Test 5: Checking first question...');
    const question = await page.$eval('.question-text', el => el.textContent);
    console.log(`✓ Question: "${question.substring(0, 50)}..."\n`);

    console.log('Test 6: Taking screenshot of quiz screen...');
    await page.screenshot({ path: 'quiz-screen.png' });
    console.log('✓ Screenshot saved: quiz-screen.png\n');

    console.log('Test 7: Checking answer options...');
    const options = await page.$$eval('.option-text', els => els.map(el => el.textContent));
    console.log(`✓ Found ${options.length} options\n`);

    console.log('Test 8: Clicking an answer...');
    await page.click('.option');
    await new Promise(r => setTimeout(r, 500));
    console.log('✓ Answer selected\n');

    console.log('Test 9: Checking feedback...');
    const feedback = await page.$('.feedback');
    if (feedback) {
      const text = await page.evaluate(el => el.textContent, feedback);
      console.log(`✓ Feedback shown: "${text.substring(0, 50)}..."\n`);
    }

    console.log('✅ All UI tests passed!\n');

    await browser.close();
  } catch (error) {
    console.error('❌ Test failed:', error);
    if (browser) await browser.close();
    process.exit(1);
  }
}

testUI();
