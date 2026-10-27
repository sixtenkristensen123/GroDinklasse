/* Automatisk browsertest af GroKlassen (valgfri – appen virker fint uden).
   Kræver Node.js 18+ og Playwright:  npm install playwright  &&  npx playwright install chromium
   Kør som fil:            node e2e.cjs
   Kør via lokal server:   python3 -m http.server 8000   og så   BASE_URL=http://localhost:8000/ node e2e.cjs
   Valgfrit: npm install jsqr pngjs  – så afkoder testen også QR-koderne fra skærmbilleder. */
const path = require('path');
const fs = require('fs');
const os = require('os');
const { pathToFileURL } = require('url');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');

// index.html ligger ved siden af testen (i roden af repoet) eller i mappen over (hvis testen ligger i tests/).
const LOCAL = [path.join(__dirname, 'index.html'), path.join(__dirname, '..', 'index.html')].find(f => fs.existsSync(f));
const FILE_URL = process.env.BASE_URL ? new URL('index.html', process.env.BASE_URL).href : pathToFileURL(LOCAL).href;
const ALLOWED = process.env.BASE_URL ? new URL(process.env.BASE_URL).origin : 'file:';
const launchOptions = { headless: true, ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) };
const dateKey = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const PLACEHOLDER = /\[(INDSÆT|VALIDÉR|FAKTATJEK)/;
let qrDecode = null;
try { const jsQR = require('jsqr'); const { PNG } = require('pngjs'); qrDecode = buf => { const p = PNG.sync.read(buf); const r = jsQR(new Uint8ClampedArray(p.data), p.width, p.height); return r && r.data; }; } catch (e) { /* valgfrit */ }

let passed = 0, failed = 0;
function check(name, ok, detail = '') {
  if (ok) { passed++; console.log(`  OK   ${name}`); }
  else { failed++; console.log(`  FEJL ${name}${detail ? ' – ' + detail : ''}`); }
}

// Åbner en ny, ren side. Alle forespørgsler ud af appen blokeres og tælles (offline-test).
async function freshPage(browser, opts = {}) {
  const ctx = await browser.newContext({ acceptDownloads: true, viewport: opts.viewport || { width: 1280, height: 800 }, colorScheme: opts.colorScheme || 'light', deviceScaleFactor: opts.scale || 1 });
  const external = [];
  await ctx.route('**/*', route => {
    const url = route.request().url();
    if (url.startsWith(ALLOWED) || url.startsWith('blob:') || url.startsWith('data:')) return route.continue();
    external.push(url);
    return route.abort();
  });
  if (!process.env.BASE_URL) await ctx.setOffline(true);
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
  await page.goto('about:blank');
  await page.goto(FILE_URL);
}
const toastText = page => page.locator('#toastRegion').innerText();
const visibleText = page => page.evaluate(() => document.body.innerText);
async function unlockTeacher(page) {
  await page.click('a[data-view="laerer"]');
  await page.fill('#pinInput', '1234'); await page.press('#pinInput', 'Enter');
}

(async () => {
  const browser = await chromium.launch(launchOptions);
  console.log(`Tester ${FILE_URL}`);

  console.log('\n1. Åbning, offline og uden fejl');
  {
    const { ctx, page, errors, external } = await freshPage(browser);
    await resetStorage(page);
    check('Titlen indeholder GroKlassen', (await page.title()).includes('GroKlassen'));
    check('Metadata: description og Open Graph', await page.evaluate(() => ['meta[name="description"]', 'meta[property="og:title"]', 'meta[property="og:description"]', 'meta[property="og:type"]'].every(s => (document.querySelector(s) || {}).content)));
    check('Introduktionen vises første gang', await page.locator('#onboarding').evaluate(d => d.open));
    await page.click('#obSkip');
    check('Introduktionen kan springes over', !(await page.locator('#onboarding').evaluate(d => d.open)));
    await page.waitForTimeout(700);
    check('Ingen konkurrence-pop-up, så længe konkurrencen er et eksempel', !(await page.locator('#contestPopup').evaluate(d => d.open)));
    await page.reload();
    check('Introduktionen vises ikke igen efter "Spring over"', !(await page.locator('#onboarding').evaluate(d => d.open)));
    check('Logoet er indlejret én gang i filen', fs.readFileSync(LOCAL, 'utf8').split('data:image/png;base64').length - 1 === 1);
    for (const hash of ['#skoler', '#laerer', '#konkurrence', '#klassen']) { await page.goto(FILE_URL + hash); await page.waitForTimeout(150); }
    check('Ingen netværkskald ud af appen', external.length === 0, external.join(', '));
    check('Ingen fejl i konsollen', errors.length === 0, errors.join(' | '));
    await ctx.close();
  }

  console.log('\n2. Hele flowet: indsend → lærer-PIN → godkend → planten vokser → CSV → ugerapport');
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
    // Knapper med aria-disabled kan stadig klikkes (de beholder fokus) – appen skal selv afvise klikket.
    await page.click('[data-challenge="repair"]');
    await page.click('[data-challenge="repair"]', { force: true });
    check('Dobbelt indsendelse afvises', (await toastText(page)).includes('allerede registreret i dag'));
    await page.click('[data-challenge="sort"]', { force: true });
    check('Cooldown blokerer ny indsendelse', (await toastText(page)).includes('Vent'));
    await page.reload();
    const s1 = await page.locator('#status-sort').innerText();
    await page.waitForTimeout(2100);
    const s2 = await page.locator('#status-sort').innerText();
    check('Cooldown tæller videre efter genindlæsning', /Vent \d+ sek/.test(s1) && s1 !== s2, `${s1} → ${s2}`);
    check('Dobbelt indsendelse er stadig blokeret efter genindlæsning', (await page.locator('[data-challenge="repair"]').getAttribute('aria-disabled')) === 'true');
    // Pointloft: fyld dagen op ved at skrive direkte i data (springer cooldown over)
    await page.evaluate(() => {
      const d = classData();
      ['cycle', 'shower', 'lunch'].forEach(id => {
        const c = challengeById(id);
        d.pending.push({ id: 't-' + id, challengeId: id, title: c.title, date: todayKey(), points: c.points, co2: 0, water: 0, submittedAt: Date.now() });
      });
      d.lastSubmission = 0; saveState(); render();
    });
    await page.click('[data-challenge="swap"]', { force: true });  // 4 + 3 + 3 + 3 = 13 brugt, +4 = 17 > 15
    check('Pointloftet på 15 point overholdes', (await toastText(page)).includes('pointloft'));
    // Godkendelse tjekkes mod indsendelsens egen dato
    const old = new Date(); old.setDate(old.getDate() - 3);
    await page.evaluate(k => {
      const d = classData();
      const add = (list, id) => { const c = challengeById(id); list.push({ id: 'o-' + id + list.length, challengeId: id, title: c.title, date: k, points: c.points, co2: 0, water: 0, submittedAt: 1 }); };
      ['cycle', 'repair', 'shower', 'lunch'].forEach(id => add(d.approved, id));   // 13 point den dag
      add(d.pending, 'sort'); add(d.pending, 'lights');                              // 2 + 2 point
      saveState(); render();
    }, dateKey(old));
    await unlockTeacher(page);
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

  console.log('\n5. Holdets data (TEAM_DATA), ?udkast=1 og ?demo=1');
  {
    const { ctx, page, errors } = await freshPage(browser);
    await resetStorage(page, { onboardingDone: true });
    let worst = 0;
    for (const hash of ['#klassen', '#skoler', '#laerer', '#konkurrence']) {
      await page.goto(FILE_URL + hash); await page.waitForTimeout(100);
      if (PLACEHOLDER.test(await visibleText(page))) worst++;
    }
    await page.goto(FILE_URL + '?pitch=1');
    for (let i = 0; i < 6; i++) { if (PLACEHOLDER.test(await page.locator('#pitchSlide').innerText())) worst++; await page.keyboard.press('ArrowRight'); }
    check('Ingen [INDSÆT/[VALIDÉR/[FAKTATJEK synlige uden ?udkast=1 (4 visninger + 6 trin)', worst === 0, `${worst} steder`);
    await page.goto(FILE_URL + '?udkast=1#skoler');
    check('?udkast=1 viser udkast-banneret', await page.locator('#draftBanner').isVisible());
    check('?udkast=1 viser de gule pladsholdere', (await page.locator('#view-skoler .ph').count()) > 5);
    check('?udkast=1 viser noter til holdet', await page.locator('#skoler-canvas .draft-only').isVisible());
    await page.goto(FILE_URL + '#skoler');
    check('Uden udkast er banneret og noterne skjult', !(await page.locator('#draftBanner').isVisible()) && !(await page.locator('#skoler-canvas .draft-only').isVisible()));
    check('Tomme felter viser en ærlig reservetekst', (await page.locator('#skoler-vaerdi').innerText()).includes('Vi er i gang med at interviewe lærere'));
    await page.evaluate(() => { TEAM_DATA.interviewFinding = 'Testfund fra holdet'; applyTeamData(); });
    check('Et udfyldt felt vises med sin tekst før/efter', (await page.locator('#skoler-vaerdi').innerText()).includes('Hvad lærerne selv siger: Testfund fra holdet'));
    check('Prisidéer nævner ingen firmanavne', !/BonBon/i.test(await page.content()));
    // ?demo=1: levende demo med plante, graf og liga – og "Afslut demo" gendanner den tomme tilstand
    await page.goto(FILE_URL + '?demo=1');
    check('?demo=1: demo-banner og mærkning', await page.locator('#demoBanner').isVisible());
    check('?demo=1: voksen plante (Ungt træ)', (await page.locator('#plantStage').innerText()) === 'Ungt træ');
    check('?demo=1: graf med søjler på klassens side', (await page.locator('#classChart .bar[d^="M"]').count()) >= 6);
    check('?demo=1: liga med 3 klasser', (await page.locator('#leagueList .league-row').count()) === 3);
    await page.click('#demoExitBtn');
    check('Afslut demo: tom tilstand (0 point, frø, intet banner)', (await page.locator('#totalPoints').innerText()) === '0' && (await page.locator('#plantStage').innerText()) === 'Frø' && !(await page.locator('#demoBanner').isVisible()));
    check('Afslut demo fjerner ?demo=1 fra adressen', !page.url().includes('demo=1'));
    check('Ingen fejl i konsollen', errors.length === 0, errors.join(' | '));
    await ctx.close();
  }

  console.log('\n6. QR-kode, Del og A4-oversigt');
  {
    const { ctx, page, errors } = await freshPage(browser, { scale: 2 });
    await resetStorage(page, { onboardingDone: true });
    const expected = await page.evaluate(() => demoUrl());
    check('QR peger på den udgivne adresse med ?demo=1', /^https:\/\/.+\?demo=1$/.test(expected), expected);
    await page.click('#shareBtn');
    check('Del åbner en dialog med QR-kode og link', await page.locator('#shareDialog svg.qr').isVisible() && (await page.inputValue('#shareUrl')) === expected);
    if (qrDecode) check('QR-koden i Del kan scannes', qrDecode(await page.locator('#shareQr').screenshot()) === expected);
    await page.click('#shareCopy'); await page.waitForTimeout(100);
    check('Kopiér link giver besked i dialogen', (await page.locator('#shareStatus').innerText()).length > 0);
    await page.keyboard.press('Escape');
    check('Esc lukker Del', !(await page.locator('#shareDialog').evaluate(d => d.open)));
    await page.goto(FILE_URL + '?pitch=1');
    await page.keyboard.press('End');
    await page.waitForTimeout(500); // vent på, at trinnet er gledet helt ind
    check('Sidste pitch-trin har QR-kode og opfordring', await page.locator('#pitchSlide svg.qr').isVisible() && (await page.locator('.pitch-ask').innerText()).length > 10);
    if (qrDecode) check('QR-koden i pitchen kan scannes', qrDecode(await page.locator('#pitchSlide .qr-box').screenshot()) === expected);
    await page.keyboard.press('Escape');
    await page.goto(FILE_URL + '#skoler');
    await page.evaluate(() => { window.print = () => { window.__printed = true; }; });
    await page.click('#a4Btn');
    check('Print A4-oversigt bygger arket og kalder print()', await page.evaluate(() => window.__printed === true && document.body.classList.contains('printing-a4') && !!document.querySelector('#a4Sheet svg.qr')));
    check('A4-arket har ingen pladsholdere og ingen persondata-felter', !PLACEHOLDER.test(await page.locator('#a4Sheet').evaluate(el => el.textContent)));
    await page.emulateMedia({ media: 'print' });
    const pdf = (await page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true })).toString('latin1');
    const pages = (pdf.match(/\/Type\s*\/Page[^s]/g) || []).length;
    check('A4-oversigten fylder præcis én side', pages === 1, `${pages} sider`);
    check('Ingen fejl i konsollen', errors.length === 0, errors.join(' | '));
    await ctx.close();
  }

  console.log('\n7. Økonomi, konkurrence og pitch');
  {
    const { ctx, page, errors } = await freshPage(browser);
    await resetStorage(page, { onboardingDone: true });
    await page.goto(FILE_URL + '#skoler');
    check('Break-even med standardantagelserne (forventet): 15 skoler', (await page.locator('#calcBreakEven').innerText()) === '15 skoler');
    for (const [s, n] of [['careful', '38 skoler'], ['optimistic', '4 skoler'], ['expected', '15 skoler']]) {
      await page.click(`[data-scenario="${s}"]`);
      check(`Scenarie ${s}: break-even ${n}`, (await page.locator('#calcBreakEven').innerText()) === n && (await page.locator(`[data-scenario="${s}"]`).getAttribute('aria-pressed')) === 'true');
    }
    await page.fill('#calcPrice', '3000');
    check('Beregneren regner om (7 skoler ved 3.000 kr.)', (await page.locator('#calcBreakEven').innerText()) === '7 skoler');
    await page.click('#calcReset');
    await page.fill('#calcSalary', '150000');
    check('Løn til drift ændrer break-even (126 skoler ved 150.000 kr.)', (await page.locator('#calcBreakEven').innerText()) === '126 skoler');
    const consistent = await page.evaluate(() => {
      const e = calcEconomy(readCalc()), f = formatNumber(e.breakEven);
      const row = [...document.querySelectorAll('#breakEvenTable tr')].find(tr => tr.textContent.includes('(break-even)'));
      return document.getElementById('calcBreakEven').textContent.startsWith(f) && row && row.cells[0].textContent.startsWith(f)
        && document.querySelector('#breakEvenChart .be-label').textContent.includes(f) && document.getElementById('calcExplain').textContent.includes(f);
    });
    check('Break-even-tekst, KPI, tabel og graf stemmer overens', consistent);
    check('Samlet indtægt inkl. kommuneaftaler vises', (await page.locator('#calcRevenueSplit').innerText()).includes('kommuneaftale'));
    check('Alle 9 BMC-felter vises', (await page.locator('.bmc-cell').count()) === 9);
    // Konkurrence: tilmelding og afmelding
    await page.goto(FILE_URL + '#konkurrence');
    await page.fill('#contestTeam', 'Testholdet');
    await page.fill('#contestStudents', '24');
    await page.check('#contestRules');
    await page.click('#contestForm button[type="submit"]');
    check('Tilmelding gennemføres', await page.locator('#contestDone').isVisible() && (await page.locator('#contestDoneText').innerText()).includes('tilmeldt'));
    await page.goto(FILE_URL + '#klassen');
    check('Klassens side viser tilmeldingen og stillingen', (await page.locator('#contestStatus').innerText()).includes('er tilmeldt') && (await page.locator('#contestBoard .league-row').count()) === 1);
    check('Konkurrencekortet står under udfordringer og plante', await page.evaluate(() => !!(document.querySelector('#view-klassen .layout').compareDocumentPosition(document.getElementById('contestCard')) & Node.DOCUMENT_POSITION_FOLLOWING)));
    await page.goto(FILE_URL + '#konkurrence');
    await page.click('#contestCancel');
    await page.click('#confirmOk');
    check('Afmelding virker', await page.locator('#contestForm').isVisible());
    // Pitch: 6 trin, højst 3 punkter, BMC-perspektiv på hvert trin
    await page.goto(FILE_URL + '?pitch=1');
    check('?pitch=1 åbner præsentationen', await page.locator('#pitch').evaluate(d => d.open));
    let tooMany = 0, noPersp = 0;
    for (let i = 0; i < 6; i++) {
      if (await page.locator('#pitchSlide .pitch-points li').count() > 3) tooMany++;
      if (!(await page.locator('#pitchSlide .persp-chip').isVisible())) noPersp++;
      if (i < 5) await page.keyboard.press('ArrowRight');
    }
    check('Højst 3 punkter pr. trin', tooMany === 0, `${tooMany} trin har flere`);
    check('Hvert trin viser sit perspektiv', noPersp === 0, `${noPersp} mangler`);
    check('Piletaster går til trin 6', (await page.locator('#pitchCount').innerText()) === '6 / 6');
    await page.keyboard.press('ArrowLeft');
    check('Tilbage glider ind fra venstre', await page.locator('#pitchSlide').evaluate(el => el.classList.contains('back')));
    await page.keyboard.press('Escape');
    check('Esc lukker præsentationen', !(await page.locator('#pitch').evaluate(d => d.open)));
    check('Ingen fejl i konsollen', errors.length === 0, errors.join(' | '));
    await ctx.close();
  }

  console.log('\n8. Tilgængelighed: tastatur, fokus, labels, aria-live og kontrast');
  for (const scheme of ['light', 'dark']) {
    const { ctx, page, errors } = await freshPage(browser, { colorScheme: scheme });
    await resetStorage(page, { onboardingDone: true });
    await page.keyboard.press('Tab');
    check(`${scheme}: første Tab rammer "Spring til indhold"`, (await page.evaluate(() => document.activeElement.textContent)).includes('Spring til indhold'));
    await page.keyboard.press('Tab');
    const outline = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
    check(`${scheme}: fokus er synligt (outline)`, outline !== 'none', outline);
    const unlabeled = await page.evaluate(() => [...document.querySelectorAll('input, select, textarea')].filter(el => {
      const id = el.id && document.querySelector(`label[for="${el.id}"]`);
      return !(id || el.closest('label') || el.getAttribute('aria-label') || el.getAttribute('aria-labelledby'));
    }).map(el => el.id || el.name));
    check(`${scheme}: alle formularfelter har en label`, unlabeled.length === 0, unlabeled.join(', '));
    const unnamed = await page.evaluate(() => [...document.querySelectorAll('button')].filter(b => !(b.textContent.trim() || b.getAttribute('aria-label'))).length);
    check(`${scheme}: alle knapper har et navn`, unnamed === 0, String(unnamed));
    check(`${scheme}: alle dialoger har en overskrift`, await page.evaluate(() => [...document.querySelectorAll('dialog')].every(d => d.getAttribute('aria-labelledby'))));
    check(`${scheme}: beskeder og beregner har aria-live`, await page.evaluate(() => ['#toastRegion', '.calc-results', '#shareStatus', '#pinError'].every(s => document.querySelector(s).getAttribute('aria-live') === 'polite')));
    // Kontrast: synlig tekst mod dens faktiske baggrund (WCAG AA: 4,5:1 for tekst)
    const low = [];
    for (const hash of ['#klassen', '#skoler', '#konkurrence']) {
      await page.goto(FILE_URL + '?demo=1' + hash); await page.waitForTimeout(150);
      low.push(...await page.evaluate(() => {
        const rgb = c => { const m = c.match(/[\d.]+/g).map(Number); return { r: m[0], g: m[1], b: m[2], a: m[3] === undefined ? 1 : m[3] }; };
        const lum = ({ r, g, b }) => [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }).reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
        const bgOf = el => { for (let e = el; e; e = e.parentElement) { const c = rgb(getComputedStyle(e).backgroundColor); if (c.a > 0.5) return c; } return rgb(getComputedStyle(document.body).backgroundColor); };
        const out = [];
        document.querySelectorAll('body *').forEach(el => {
          if (!el.offsetParent || el.closest('svg, .qr-box, dialog:not([open])')) return;
          const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
          if (!own) return;
          const fg = rgb(getComputedStyle(el).color), bg = bgOf(el);
          const [a, b] = [lum(fg), lum(bg)].sort((x, y) => y - x);
          const ratio = (a + 0.05) / (b + 0.05);
          if (ratio < 4.5) out.push(`${el.tagName.toLowerCase()}.${el.className || ''} "${el.textContent.trim().slice(0, 30)}" ${ratio.toFixed(2)}`);
        });
        return out;
      }));
    }
    const uniq = [...new Set(low)];
    check(`${scheme}: kontrast ≥ 4,5:1 for al synlig tekst`, uniq.length === 0, uniq.slice(0, 8).join(' · '));
    check(`${scheme}: ingen fejl i konsollen`, errors.length === 0, errors.join(' | '));
    await ctx.close();
  }

  console.log('\n9. Swipe i pitchen og Fortryd');
  {
    const { ctx, page, errors } = await freshPage(browser);
    await resetStorage(page, { onboardingDone: true });
    await page.goto(FILE_URL + '?pitch=1');
    await page.waitForTimeout(500);
    const offset = () => page.evaluate(() => swipeOffset);
    const count = () => page.locator('#pitchCount').innerText();
    const box = await page.locator('#pitchSlideTitle').boundingBox();
    const x0 = box.x + box.width / 2, y0 = box.y + box.height / 2;
    // Langsomt træk: trinnet følger musen 1:1 (efter en dødzone på 10 px), og slip uden fart fjedrer tilbage
    await page.mouse.move(x0, y0); await page.mouse.down();
    for (let i = 1; i <= 12; i++) { await page.mouse.move(x0 - i * 20, y0); await page.waitForTimeout(16); }
    const mid = await offset();
    check('Trinnet følger musen 1:1 under træk', Math.abs(mid - (-240 + 20)) <= 2, `forskydning ${mid.toFixed(1)}`);
    await page.waitForTimeout(150); await page.mouse.up();
    await page.waitForTimeout(900);
    check('Langsomt, kort træk fjedrer tilbage til samme trin', (await count()) === '1 / 6' && (await offset()) === 0);
    // Kast: kort, hurtigt træk skifter trin
    await page.mouse.move(x0, y0); await page.mouse.down();
    await page.mouse.move(x0 - 40, y0); await page.mouse.move(x0 - 90, y0); await page.mouse.move(x0 - 140, y0);
    await page.mouse.up();
    await page.waitForTimeout(900);
    check('Hurtigt kast skifter til næste trin', (await count()) === '2 / 6' && (await offset()) === 0);
    // Elastisk modstand ved første trin
    await page.keyboard.press('Home'); await page.waitForTimeout(400);
    await page.mouse.move(x0, y0); await page.mouse.down();
    for (let i = 1; i <= 15; i++) { await page.mouse.move(x0 + i * 20, y0); await page.waitForTimeout(16); }
    const rb = await offset();
    check('Elastisk modstand ved første trin', rb > 0 && rb < 290 * 0.75, `forskydning ${rb.toFixed(1)} for 290 px træk`);
    await page.waitForTimeout(150); await page.mouse.up(); await page.waitForTimeout(900);
    check('Efter elastikken står trinnet stille på trin 1', (await count()) === '1 / 6' && (await offset()) === 0);
    // Afbrydelse: grib trinnet igen midt i et kast – det fortsætter fra, hvor det er (ingen hop)
    await page.mouse.move(x0, y0); await page.mouse.down();
    await page.mouse.move(x0 - 60, y0); await page.mouse.move(x0 - 130, y0); await page.mouse.up();
    await page.waitForTimeout(60);
    const flying = await offset();
    await page.mouse.down();
    const grabbed = await offset();
    await page.mouse.move(x0 - 125, y0); await page.mouse.move(x0 - 115, y0);
    const followed = await offset();
    check('Et trin i bevægelse kan gribes uden at hoppe', flying !== 0 && Math.abs(grabbed - flying) < 40 && Math.abs(followed - (grabbed + 15)) <= 3, `${flying.toFixed(0)} → ${grabbed.toFixed(0)} → ${followed.toFixed(0)}`);
    await page.waitForTimeout(150); await page.mouse.up(); await page.waitForTimeout(900);
    check('Efter afbrydelsen lander trinnet på et helt trin', /^[12] \/ 6$/.test(await count()) && (await offset()) === 0, await count());
    check('Knapper i trinnet starter ikke et træk', await page.evaluate(() => { const b = document.querySelector('#pitchSlide button'); return !b || !!b.closest('button'); }));
    await page.keyboard.press('Escape');
    check('Ingen fejl i konsollen (swipe med mus)', errors.length === 0, errors.join(' | '));
    await ctx.close();
  }
  {
    // Rigtig touch (via Chrome DevTools-protokollen): vandret stryg skifter trin, lodret gør ikke
    const ctx = await browser.newContext({ viewport: { width: 768, height: 1024 }, hasTouch: true, isMobile: true });
    const page = await ctx.newPage();
    const errors = []; page.on('pageerror', e => errors.push(String(e)));
    await page.goto(FILE_URL); await page.evaluate(() => localStorage.setItem('groklassen-v2', JSON.stringify({ onboardingDone: true })));
    await page.goto(FILE_URL + '?pitch=1'); await page.waitForTimeout(500);
    const cdp = await ctx.newCDPSession(page);
    const touch = async (points, gap = 16) => {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: points[0][0], y: points[0][1] }] });
      for (const [x, y] of points.slice(1)) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y }] }); await page.waitForTimeout(gap); }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    };
    await touch([[600, 400], [560, 402], [500, 404], [420, 405], [340, 406]], 8);
    await page.waitForTimeout(900);
    check('Touch: vandret stryg skifter trin', (await page.locator('#pitchCount').innerText()) === '2 / 6');
    await touch([[400, 300], [402, 360], [404, 440], [405, 520]], 8);
    await page.waitForTimeout(900);
    check('Touch: lodret træk skifter ikke trin', (await page.locator('#pitchCount').innerText()) === '2 / 6' && (await page.evaluate(() => swipeOffset)) === 0);
    check('Ingen fejl i konsollen (touch)', errors.length === 0, errors.join(' | '));
    await ctx.close();
  }
  {
    // Reduceret bevægelse: trinnet flytter sig ikke med fingeren, men et stryg skifter stadig trin
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(FILE_URL); await page.evaluate(() => localStorage.setItem('groklassen-v2', JSON.stringify({ onboardingDone: true })));
    await page.goto(FILE_URL + '?pitch=1'); await page.waitForTimeout(300);
    const box = await page.locator('#pitchSlideTitle').boundingBox();
    const x0 = box.x + box.width / 2, y0 = box.y + box.height / 2;
    await page.mouse.move(x0, y0); await page.mouse.down();
    for (let i = 1; i <= 8; i++) { await page.mouse.move(x0 - i * 20, y0); await page.waitForTimeout(16); }
    const moved = await page.evaluate(() => swipeOffset);
    await page.mouse.up(); await page.waitForTimeout(200);
    check('Reduceret bevægelse: trinnet følger ikke fingeren, men skifter ved stryg', moved === 0 && (await page.locator('#pitchCount').innerText()) === '2 / 6');
    await ctx.close();
  }
  {
    const { ctx, page, errors } = await freshPage(browser);
    await resetStorage(page, { onboardingDone: true });
    await page.click('[data-challenge="cycle"]');
    await unlockTeacher(page);
    await page.locator('#pendingTodayList [data-action="approve"]').first().click();
    check('Godkend viser en Fortryd-knap', await page.locator('.toast-action').isVisible());
    await page.click('.toast-action');
    check('Fortryd gør godkendelsen om (afventer igen, 0 point)', (await page.locator('#kpiPending').innerText()) === '1' && (await page.locator('#kpiTotal').innerText()) === '0');
    await page.locator('#pendingTodayList [data-action="reject"]').first().click();
    check('Afvis fjerner indsendelsen', (await page.locator('#kpiPending').innerText()) === '0');
    await page.keyboard.press('ControlOrMeta+z');
    check('Ctrl/Cmd + Z fortryder afvisningen', (await page.locator('#kpiPending').innerText()) === '1');
    // Kun den seneste handling kan fortrydes
    await page.evaluate(() => { const d = classData(), c = challengeById('sort'); d.pending.push({ id: 't-sort', challengeId: 'sort', title: c.title, date: todayKey(), points: c.points, co2: 0, water: 0, submittedAt: Date.now() + 1 }); saveState(); render(); });
    await page.locator('#pendingTodayList [data-action="approve"]').first().click();
    await page.locator('#pendingTodayList [data-action="approve"]').first().click();
    await page.waitForTimeout(300);
    check('Kun én Fortryd-knap ad gangen (den seneste handling)', (await page.locator('.toast-action').count()) === 1);
    await page.click('.toast-action');
    check('Fortryd ruller kun den seneste godkendelse tilbage', (await page.locator('#kpiTotal').innerText()) === '3' && (await page.locator('#kpiPending').innerText()) === '1');
    // Fortryd kan ses og klikkes oven på fejringen (modal dialog)
    await page.click('a[data-view="klassen"]'); await page.click('#heroDemoBtn');
    await page.click('a[data-view="laerer"]');
    await page.locator('#pendingOlderList [data-action="approve"]').first().click();
    check('Fejringen vises ved nyt stadie', await page.locator('#celebration').evaluate(d => d.open));
    const onTop = await page.evaluate(() => { const b = document.querySelector('.toast-action'); if (!b) return false; const r = b.getBoundingClientRect(); return document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2) === b; });
    check('Fortryd ligger øverst – også oven på fejringen', onTop);
    await page.click('.toast-action');
    check('Fortryd lukker fejringen og sætter planten tilbage (178 point)', !(await page.locator('#celebration').evaluate(d => d.open)) && (await page.locator('#kpiTotal').innerText()) === '178');
    check('Beskedområdet er tilbage på siden, når dialogen lukker', await page.evaluate(() => document.getElementById('toastRegion').parentElement === document.body));
    await page.click('#lockBtn');
    check('Ingen fejl i konsollen (Fortryd)', errors.length === 0, errors.join(' | '));
    await ctx.close();
  }

  console.log('\n10. Mobil, tablet og computer: ingen vandret scroll');
  for (const [w, h] of [[375, 812], [768, 1024], [1280, 800]]) {
    for (const scheme of ['light', 'dark']) {
      const { ctx, page, errors } = await freshPage(browser, { viewport: { width: w, height: h }, colorScheme: scheme });
      await resetStorage(page, { onboardingDone: true });
      let worst = 0;
      for (const q of ['?demo=1#klassen', '?demo=1#skoler', '?demo=1#laerer', '?demo=1#konkurrence', '?demo=1&pitch=1']) {
        await page.goto('about:blank'); await page.goto(FILE_URL + q);
        await page.waitForTimeout(150);
        worst = Math.max(worst, await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth));
      }
      check(`${w}px ${scheme}: ingen vandret scroll og ingen fejl`, worst <= 0 && errors.length === 0, `overløb ${worst}px ${errors.join(' | ')}`);
      if (w === 375) {
        await page.goto('about:blank'); await page.goto(FILE_URL + '#klassen');
        const fold = await page.evaluate(() => ({ stats: document.querySelector('.stats').getBoundingClientRect().bottom, challenges: document.getElementById('challengesTitle').getBoundingClientRect().top, header: document.querySelector('header').getBoundingClientRect().height }));
        check(`375px ${scheme}: hero, de fire tal og udfordringerne står over folden`, fold.stats < h && fold.challenges < h, JSON.stringify(fold));
        check(`375px ${scheme}: headeren står på én linje`, fold.header < 70, `${fold.header}px`);
        const tabs = await page.evaluate(() => { const t = document.querySelector('.tabs'); return t.scrollWidth - t.clientWidth; });
        check(`375px ${scheme}: alle faner kan ses uden at scrolle`, tabs <= 0, `${tabs}px`);
      }
      await ctx.close();
    }
  }

  await browser.close();
  console.log(`\nResultat: ${passed} OK, ${failed} fejl`);
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
