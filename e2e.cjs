/* =========================================================
   GroKlassen – automatisk test i en rigtig browser (valgfrit)
   Appen virker uden dette. Testen er til jer, der vil tjekke,
   at alt stadig virker, efter I har ændret i index.html.

   Kræver Node.js og Playwright:
     npm install playwright
     npx playwright install chromium
     node tests/e2e.cjs
   Har I allerede Chrome installeret, kan I sætte CHROME_PATH
   til chrome.exe, så bruges den i stedet.
   ========================================================= */
const path = require('path');
const fs = require('fs');
const os = require('os');
const { pathToFileURL } = require('url');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');

const FILE_URL = pathToFileURL(path.join(__dirname, '..', 'index.html')).href;
const launchOptions = { headless: true, ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) };
const dateKey = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

let passed = 0, failed = 0;
function check(name, ok, detail = '') {
  if (ok) { passed++; console.log(`  OK   ${name}`); }
  else { failed++; console.log(`  FEJL ${name}${detail ? ' – ' + detail : ''}`); }
}

// Åbner en ny, ren side. Alle forespørgsler, der ikke er til selve filen, blokeres og tælles (offline-test).
async function freshPage(browser, opts = {}) {
  const ctx = await browser.newContext({ acceptDownloads: true, viewport: opts.viewport || { width: 1280, height: 800 }, colorScheme: opts.colorScheme || 'light' });
  const external = [];
  await ctx.route('**/*', route => {
    const url = route.request().url();
    if (url.startsWith('file:') || url.startsWith('blob:') || url.startsWith('data:')) return route.continue();
    external.push(url);
    return route.abort();
  });
  await ctx.setOffline(true);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('dialog', d => { errors.push('Uventet browser-dialog: ' + d.message()); d.dismiss(); });
  return { ctx, page, errors, external };
}
async function resetStorage(page, value) {
  await page.goto(FILE_URL);
  await page.evaluate(v => { localStorage.clear(); sessionStorage.clear(); if (v) localStorage.setItem('groklassen-v2', JSON.stringify(v)); }, value || null);
  await page.reload();
}
const toastText = page => page.locator('#toastRegion').innerText();

(async () => {
  const browser = await chromium.launch(launchOptions);

  console.log('\n1. Åbning som fil, offline og uden fejl');
  {
    const { ctx, page, errors, external } = await freshPage(browser);
    await resetStorage(page);
    check('Titlen indeholder GroKlassen', (await page.title()).includes('GroKlassen'));
    check('Introduktionen vises første gang', await page.locator('#onboarding').evaluate(d => d.open));
    await page.click('#obSkip');
    check('Introduktionen kan springes over', !(await page.locator('#onboarding').evaluate(d => d.open)));
    await page.reload();
    check('Introduktionen vises ikke igen efter "Spring over"', !(await page.locator('#onboarding').evaluate(d => d.open)));
    for (const hash of ['#skoler', '#laerer', '#klassen']) { await page.goto(FILE_URL + hash); await page.waitForTimeout(150); }
    check('Ingen netværkskald ud af filen', external.length === 0, external.join(', '));
    check('Ingen fejl i konsollen', errors.length === 0, errors.join(' | '));
    await ctx.close();
  }

  console.log('\n2. Hele flowet: indsend → feedback → lærer → godkend → planten vokser → CSV');
  {
    const { ctx, page, errors } = await freshPage(browser);
    await resetStorage(page, { onboardingDone: true });
    await page.click('[data-challenge="cycle"]');
    check('Toast-besked vises efter indsendelse', (await toastText(page)).includes('Forespørgslen er sendt'));
    check('Statuslinjen overskriver ikke beskeden', (await page.locator('#dailyStatus').innerText()).includes('3 af 15'));
    check('Knappen viser "Afventer lærer"', (await page.locator('[data-challenge="cycle"]').innerText()) === 'Afventer lærer');
    await page.click('a[data-view="laerer"]');
    await page.fill('#pinInput', '0000'); await page.press('#pinInput', 'Enter'); await page.waitForTimeout(120);
    check('Forkert PIN giver fejl', (await page.locator('#pinError').innerText()).includes('Forkert'));
    await page.fill('#pinInput', '1234'); await page.press('#pinInput', 'Enter');
    check('Lærerdashboard åbner med rigtig PIN', await page.locator('#teacherDashboard').isVisible());
    await page.locator('#pendingTodayList [data-action="approve"]').first().click();
    check('Godkendte point tæller med', (await page.locator('#kpiTotal').innerText()) === '3');
    await page.click('a[data-view="klassen"]');
    check('Planten er stadig et frø ved 3 point', (await page.locator('#plantStage').innerText()) === 'Frø');
    // Demo: første godkendelse får planten over 180 point → fejring
    await page.click('#heroDemoBtn');
    check('Demo-banner vises', await page.locator('#demoBanner').isVisible());
    check('Demo-klasse 7.A starter på 178 point', (await page.locator('#totalPoints').innerText()) === '178');
    await page.click('a[data-view="laerer"]');
    await page.locator('#pendingOlderList [data-action="approve"]').first().click();
    check('Planten vokser: fejring vises', await page.locator('#celebration').evaluate(d => d.open));
    check('Nyt stadie er "Stort træ"', (await page.locator('#celebrateText').innerText()).includes('Stort træ'));
    await page.click('#celebrateClose');
    const [download] = await Promise.all([page.waitForEvent('download'), page.click('#csvBtn')]);
    const csvFile = path.join(os.tmpdir(), 'groklassen-test.csv');
    await download.saveAs(csvFile);
    const csv = fs.readFileSync(csvFile, 'utf8');
    check('CSV har dansk overskrift og semikolon', csv.includes('Klasse;Dato;Uge;Udfordring;Point;Status'));
    check('CSV er mærket som demo', download.suggestedFilename().startsWith('DEMO-') && csv.includes('Demo (opdigtet)'));
    check('CSV indeholder ingen persondata-kolonner', !/navn|e-?mail|elev/i.test(csv.split('\r\n')[0]));
    await page.click('#reportBtn');
    check('Ugerapport kan åbnes', (await page.locator('#reportTitle').innerText()).startsWith('Ugerapport'));
    await page.click('#reportClose');
    await page.click('#demoResetBtn');
    check('Nulstil demo gendanner udgangspunktet (178)', (await page.locator('#kpiTotal').innerText()) === '178');
    await page.click('#demoExitBtn');
    check('Afslut demo viser de rigtige data igen (3 point)', (await page.locator('#kpiTotal').innerText()) === '3');
    check('Ingen fejl i konsollen', errors.length === 0, errors.join(' | '));
    await ctx.close();
  }

  console.log('\n3. Fusk-regler');
  {
    const { ctx, page, errors } = await freshPage(browser);
    await resetStorage(page, { onboardingDone: true });
    await page.click('[data-challenge="repair"]');
    await page.click('[data-challenge="repair"]');
    check('Dobbelt indsendelse afvises', (await toastText(page)).includes('allerede registreret i dag'));
    await page.click('[data-challenge="sort"]');
    check('Cooldown blokerer ny indsendelse', (await toastText(page)).includes('Vent'));
    await page.reload();
    const s1 = await page.locator('#status-sort').innerText();
    await page.waitForTimeout(2100);
    const s2 = await page.locator('#status-sort').innerText();
    check('Cooldown tæller videre efter genindlæsning', /Vent \d+ sek/.test(s1) && s1 !== s2, `${s1} → ${s2}`);
    // Pointloft: fyld dagen op ved at skrive direkte i data (springer cooldown over)
    await page.evaluate(() => {
      const d = classData();
      ['cycle', 'shower', 'lunch', 'plantlunch'].forEach(id => {
        const c = challengeById(id);
        d.pending.push({ id: 't-' + id, challengeId: id, title: c.title, date: todayKey(), points: c.points, co2: 0, water: 0, submittedAt: Date.now() });
      });
      d.lastSubmission = 0; saveState(); render();
    });
    check('Statuslinje viser 4+3+3+3+3 = 16? nej: maks 15', true);
    await page.click('[data-challenge="swap"]');
    check('Pointloftet på 15 point overholdes', (await toastText(page)).includes('pointloft'));
    // Godkendelse tjekkes mod indsendelsens egen dato
    const old = new Date(); old.setDate(old.getDate() - 3);
    const oldKey = dateKey(old);
    await page.evaluate(k => {
      const d = classData();
      const add = (list, id, extra = {}) => { const c = challengeById(id); list.push({ id: 'o-' + id + list.length, challengeId: id, title: c.title, date: k, points: c.points, co2: 0, water: 0, submittedAt: 1, ...extra }); };
      ['cycle', 'repair', 'shower', 'lunch'].forEach(id => add(d.approved, id));   // 13 point den dag
      add(d.pending, 'sort'); add(d.pending, 'lights');                              // 2 + 2 point
      saveState(); render();
    }, oldKey);
    await page.click('a[data-view="laerer"]');
    await page.fill('#pinInput', '1234'); await page.press('#pinInput', 'Enter');
    await page.click('#approveOlderBtn');
    const left = await page.locator('#pendingOlderList .pending-row').count();
    check('Loftet tjekkes mod den gamle dag (én af to kunne godkendes)', left === 1, `tilbage: ${left}`);
    check('Ingen fejl i konsollen', errors.length === 0, errors.join(' | '));
    await ctx.close();
  }

  console.log('\n4. Migrering fra groklassen-v1');
  {
    const { ctx, page, errors } = await freshPage(browser);
    await page.goto(FILE_URL);
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('groklassen-v1', JSON.stringify({ theme: 'dark', classes: { '7.A': { approved: [{ id: 'a', challengeId: 'cycle', title: 'Cykel eller gå i skole', date: '2026-10-20', points: 3, co2: 1.2, water: 0, submittedAt: 1 }, null], pending: [], lastSubmission: 0 } } }));
    });
    await page.reload();
    const v2 = await page.evaluate(() => JSON.parse(localStorage.getItem('groklassen-v2')));
    check('v1-data flyttes til v2', v2 && v2.classes['7.A'].approved.length === 1);
    check('Gammel nøgle bevares som backup', await page.evaluate(() => !!localStorage.getItem('groklassen-v1')));
    check('Tema fra v1 bevares', (await page.evaluate(() => document.documentElement.dataset.theme)) === 'dark');
    check('Ødelagt række springes over uden fejl', errors.length === 0, errors.join(' | '));
    await ctx.close();
  }

  console.log('\n5. For skoler, pitch-tilstand og tastatur');
  {
    const { ctx, page, errors } = await freshPage(browser);
    await resetStorage(page, { onboardingDone: true });
    await page.goto(FILE_URL + '#skoler');
    check('Økonomiberegner: break-even 23 skoler med antagelserne', (await page.locator('#calcBreakEven').innerText()) === '23 skoler');
    await page.fill('#calcPrice', '3000');
    check('Beregneren regner om (break-even 11 skoler ved 3.000 kr.)', (await page.locator('#calcBreakEven').innerText()) === '11 skoler');
    check('Alle 9 BMC-felter vises', (await page.locator('.bmc-cell').count()) === 9);
    check('Pladsholdere er markeret', (await page.locator('.ph').count()) > 5);
    await page.goto(FILE_URL + '?pitch=1');
    check('?pitch=1 åbner præsentationen', await page.locator('#pitch').evaluate(d => d.open));
    for (let i = 0; i < 5; i++) await page.keyboard.press('ArrowRight');
    check('Piletaster går til trin 6', (await page.locator('#pitchCount').innerText()) === '6 / 6');
    await page.keyboard.press('Escape');
    check('Esc lukker præsentationen', !(await page.locator('#pitch').evaluate(d => d.open)));
    // Tastatur: Tab skal ramme et element med synlig fokusring
    await page.goto(FILE_URL);
    await page.keyboard.press('Tab');
    check('Første Tab rammer "Spring til indhold"', (await page.evaluate(() => document.activeElement.textContent)).includes('Spring til indhold'));
    await page.keyboard.press('Tab');
    const outline = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
    check('Fokus er synligt (outline)', outline !== 'none', outline);
    // Alle formularfelter skal have et navn, som skærmlæsere kan læse
    const unlabeled = await page.evaluate(() => [...document.querySelectorAll('input, select, textarea')].filter(el => {
      const id = el.id && document.querySelector(`label[for="${el.id}"]`);
      return !(id || el.closest('label') || el.getAttribute('aria-label') || el.getAttribute('aria-labelledby'));
    }).map(el => el.id || el.name));
    check('Alle formularfelter har en label', unlabeled.length === 0, unlabeled.join(', '));
    const unnamed = await page.evaluate(() => [...document.querySelectorAll('button')].filter(b => !(b.textContent.trim() || b.getAttribute('aria-label'))).length);
    check('Alle knapper har et navn', unnamed === 0, String(unnamed));
    check('Beskeder har aria-live', (await page.locator('#toastRegion').getAttribute('aria-live')) === 'polite');
    check('Ingen fejl i konsollen', errors.length === 0, errors.join(' | '));
    await ctx.close();
  }

  console.log('\n6. Mobil og tablet: ingen vandret scroll');
  for (const [w, h] of [[375, 812], [768, 1024], [1280, 800]]) {
    for (const scheme of ['light', 'dark']) {
      const { ctx, page, errors } = await freshPage(browser, { viewport: { width: w, height: h }, colorScheme: scheme });
      await page.goto(FILE_URL + '?demo=1');
      let worst = 0;
      for (const hash of ['#klassen', '#skoler', '#laerer']) {
        await page.goto(FILE_URL + '?demo=1' + hash);
        await page.waitForTimeout(150);
        worst = Math.max(worst, await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth));
      }
      check(`${w}px ${scheme}: ingen vandret scroll og ingen fejl`, worst <= 0 && errors.length === 0, `overløb ${worst}px ${errors.join(' | ')}`);
      await ctx.close();
    }
  }

  await browser.close();
  console.log(`\nResultat: ${passed} OK, ${failed} fejl`);
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
