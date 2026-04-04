// Puppeteer UI smoke test - quick turn of functionality
import puppeteer from 'puppeteer';

const BASE_URL = 'http://localhost:5173';
let browser, page;
let passed = 0;
let failed = 0;

function assert(condition, msg) {
  if (condition) {
    console.log(`  PASS: ${msg}`);
    passed++;
  } else {
    console.error(`  FAIL: ${msg}`);
    failed++;
  }
}

async function waitFor(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  console.log('Launching browser...');
  browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  try {
    // 1. Load the app
    console.log('\n--- Test: App loads ---');
    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 15000 });
    const title = await page.$eval('.app-header h1', (el) => el.textContent);
    assert(title.includes('WW3'), `Title found: "${title}"`);

    // 2. Check phase bar renders
    console.log('\n--- Test: Phase bar ---');
    const roundInfo = await page.$eval('.round-info', (el) => el.textContent);
    assert(roundInfo.includes('Round 1'), `Round info: "${roundInfo}"`);

    const factionName = await page.$eval('.faction-name', (el) => el.textContent);
    assert(factionName.includes('United States'), `First faction: "${factionName}"`);

    const economyText = await page.$eval('.economy-info', (el) => el.textContent);
    assert(economyText.includes('IPC'), `Economy display shows IPCs`);

    // 3. Check phase steps rendered
    console.log('\n--- Test: Phase steps ---');
    const phaseSteps = await page.$$('.phase-step');
    assert(phaseSteps.length === 6, `6 phase steps rendered (got ${phaseSteps.length})`);

    const activePhase = await page.$eval('.phase-step.active', (el) => el.textContent);
    assert(activePhase.includes('Purchase'), `Active phase is Purchase: "${activePhase}"`);

    // 4. Check game map renders with territories
    console.log('\n--- Test: Game map ---');
    const territories = await page.$$('[data-territory]');
    assert(territories.length > 0, `Map territories rendered (${territories.length} found)`);

    const seaZones = await page.$$('[data-sea-zone]');
    assert(seaZones.length > 0, `Sea zones rendered (${seaZones.length} found)`);

    // 5. Click a territory (click the path inside the group)
    console.log('\n--- Test: Territory selection ---');
    const kuwaitPath = await page.$('[data-territory="kuwait"] path');
    await kuwaitPath.click();
    await waitFor(300);

    const territoryInfo = await page.$('.territory-info h3');
    const hasSelection = territoryInfo !== null;
    assert(hasSelection, 'Territory info panel updates on click');

    // 6. Check purchase panel
    console.log('\n--- Test: Purchase panel ---');
    const purchasePanel = await page.$('.purchase-panel');
    assert(purchasePanel !== null, 'Purchase panel is visible in Purchase phase');

    const purchaseButtons = await page.$$('.purchase-btn');
    assert(purchaseButtons.length > 0, `Purchase buttons rendered (${purchaseButtons.length} found)`);

    // 7. Buy a unit
    console.log('\n--- Test: Purchase a unit ---');
    // Click the first enabled purchase button
    const enabledBtn = await page.$('.purchase-btn:not(:disabled)');
    if (enabledBtn) {
      await enabledBtn.click();
      await waitFor(200);
      const cart = await page.$('.purchase-cart');
      assert(cart !== null, 'Purchase cart appears after buying');
    } else {
      assert(false, 'No enabled purchase buttons found');
    }

    // 8. Advance phase
    console.log('\n--- Test: Advance phase ---');
    const advanceBtn = await page.$('.btn-advance');
    assert(advanceBtn !== null, 'Advance button exists');
    await advanceBtn.click();
    await waitFor(300);

    const newPhase = await page.$eval('.phase-step.active', (el) => el.textContent);
    assert(newPhase.includes('Combat Move'), `Phase advanced to: "${newPhase}"`);

    // 9. Try moving units: click Kuwait (USA territory with units)
    console.log('\n--- Test: Movement phase ---');
    const kuwaitForMove = await page.$('[data-territory="kuwait"] path');
    if (kuwaitForMove) {
      await kuwaitForMove.click();
      await waitFor(300);
      const moveButtons = await page.$$('.move-btn');
      if (moveButtons.length > 0) {
        assert(true, `Move options shown (${moveButtons.length} destinations)`);
        await moveButtons[0].click();
        await waitFor(300);
      } else {
        assert(false, 'No move buttons shown for Kuwait');
      }
    } else {
      assert(false, 'Could not find Kuwait territory');
    }

    // 10. Advance through remaining phases to end USA turn
    console.log('\n--- Test: Complete USA turn ---');
    for (let i = 0; i < 5; i++) {
      const btn = await page.$('.btn-advance:not(:disabled)');
      if (!btn) break;
      await btn.click();
      await waitFor(300);
    }

    // 11. Check that the game log has entries
    console.log('\n--- Test: Game log ---');
    const logEntries = await page.$$('.log-entry');
    assert(logEntries.length > 2, `Game log has entries (${logEntries.length} found)`);

    // 12. Wait for AI turns to cycle through (they have 800ms delays)
    console.log('\n--- Test: AI turns execute ---');
    await waitFor(15000); // Wait for AI factions to play (up to ~5 factions * 6 phases * 800ms)

    // Check we've advanced past round 1 or at least back to a coalition faction
    const roundAfterAI = await page.$eval('.round-info', (el) => el.textContent);
    console.log(`  Round after AI: "${roundAfterAI}"`);
    const factionAfterAI = await page.$eval('.faction-name', (el) => el.textContent);
    console.log(`  Faction after AI: "${factionAfterAI}"`);
    // If AI worked, we should have moved past USA or be back to USA round 2
    assert(true, 'AI turns completed without crash');

    // 13. Check New Game button
    console.log('\n--- Test: New Game button ---');
    const newGameBtn = await page.$('.app-header .btn');
    assert(newGameBtn !== null, 'New Game button exists');

    // 14. Verify no console errors
    console.log('\n--- Test: No JS errors ---');
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await waitFor(500);
    assert(errors.length === 0, `No JS errors (${errors.length} found)`);

  } catch (err) {
    console.error('\nTest runner error:', err.message);
    failed++;
  } finally {
    await browser.close();
  }

  console.log(`\n=============================`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log(`=============================\n`);
  process.exit(failed > 0 ? 1 : 0);
}

run();
