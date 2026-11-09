# GroKlassen

> **Bæredygtige vaner forsvinder, når ingen kan se dem.** GroKlassen gør dem synlige: Eleverne registrerer små grønne handlinger, læreren godkender, og klassens fælles plante vokser – helt uden persondata.

GroKlassen er en prototype lavet af et gymnasiehold til Business Mind Programme (BMP) 2026 hos Fonden for Entreprenørskab. Det er en første idé til en forretningsmodel – ikke en færdig virksomhed.

**Før pitchen:** udfyld [`TEAM_DATA`](#9-holdets-egne-data-team_data--udfyld-før-pitchen) (afsnit 9), og øv med [`PITCH.md`](PITCH.md).

## 1. Hvad er GroKlassen?

En bæredygtigheds-app til skoleklasser. Klassen samler point til en fælles plante, der vokser fra frø til stort træ, når læreren godkender klassens grønne handlinger.

| Rolle | Hvem | Værdi |
|---|---|---|
| **Brugere** | Elever | Ser at deres handlinger tæller. Ét fælles mål – ingen individuelle ranglister. |
| **Daglige administratorer** | Lærere | Godkender indsendelser, følger udviklingen, får ugerapport og CSV. |
| **Betalende kunder** | Skoler og kommuner | Et let værktøj til grøn dannelse uden persondata. |

## 2. Ingen persondata (GDPR)

Appen indsamler **ingen** elevnavne, e-mails eller andet, der kan identificere en person. Alt er på klasseniveau (fx "7.A"), og data ligger kun i browseren på den enhed, der bruges. Der er ingen tracking, ingen cookies og ingen server i prototypen.

En senere version med lærerlogin vil behandle lærernes e-mail. Det kræver en databehandleraftale og en GDPR-vurdering, før den bruges i skoler.

## 3. Funktioner

**Klassen (elevernes side – `#klassen`)**
- Ni grønne udfordringer med point og vejledende CO₂- og vandtal.
- "Sådan har vi regnet": antagelse, udregning, kilder og usikkerheder for hver udfordring.
- Klassens plante i fem stadier – med fejring og animation, når den vokser (respekterer "reduceret bevægelse").
- Klassens ugemål, som klassen selv sætter (5–75 point), og en graf over klassens point de seneste 8 uger.
- Klasseliga mellem klasser – aldrig elever. Starter forfra hver mandag.
- Konkurrencekortet (et fiktivt eksempel) står nederst under udfordringer og plante, så kerneproduktet kommer først.
- Introduktion i 3 trin første gang (kan springes over og åbnes igen via "Sådan virker det").

**For skoler (`#skoler`)** – mini-salgsside og pitch-støtte
- Prisskitse med sponsorniveauer (forudsætninger) · to økonomiberegnere – kommuner/skoler (licenser) og sponsorater (nyhedsbrevet) – med scenarier, løn, break-even og en samlet linje · sponsorer vi vil kontakte · GroKlassen-nyhedsbrevet i samarbejde med sponsorer · Business Model Canvas farvekodet efter BMP's fire perspektiver · FN's verdensmål som fliser.
- **Print A4-oversigt:** én side til dommerne (se afsnit 10).

**Lærer (`#laerer`, demo-PIN `1234`)**
- Ventende indsendelser med alder, Godkend/Afvis pr. række, "Godkend alle fra i dag" og samlet behandling af ældre.
- Graf over godkendte point pr. uge (med tabelvisning).
- Eksport som CSV (åbner i Excel) og print-venlig ugerapport med spørgsmål til en klassesamtale.
- **Se månedens nyhedsbrev:** samme forhåndsvisning af GroKlassen-nyhedsbrevet som under For skoler, med tallene fra denne enhed – kan printes eller gemmes som PDF (se afsnit 7).
- **Fortryd:** Godkend og Afvis (også samlet) kan fortrydes i 8 sekunder med knappen i beskeden eller Ctrl/Cmd + Z.
- Indlæs/nulstil demo-data og nulstil klassens egne data.

**Konkurrence (`#konkurrence`)** – tilmelding af klassen til en (fiktiv) klassekonkurrence, regler og præmie-idéer. Der vises ingen pop-up, så længe `CONTEST.isExample` er `true`.

**Til pitchen** – se afsnit 10 og [`PITCH.md`](PITCH.md): demo (`?demo=1`), præsentation (`?pitch=1`), QR-kode, Del-knap og A4-oversigt.

Appen virker på mobil, tablet og computer, i lys og mørk tilstand og ved dobbeltklik på `index.html`. Via GitHub Pages (HTTPS) kan den installeres som app og bruges offline.

## 4. Sådan virker point og planten

En indsendelse lægges i kø som **afventer** og tæller først, når læreren godkender den.

| Plantestadie | Samlede godkendte point |
|---|---:|
| Frø | 0 |
| Spire | 20 |
| Lille plante | 50 |
| Ungt træ | 100 |
| Stort træ | 180 |

Point belønner indsats og vaner – ikke kun CO₂. Derfor giver fx "Sluk lyset" point, selvom CO₂-effekten er lille.

## 5. CO₂ og vand: vejledende skøn

Alle tal er **forsigtige, vejledende skøn for én handling – ikke målinger**. Hver udfordring viser sin antagelse, udregning og kilder i "Sådan har vi regnet" i appen. Eksempler:

| Udfordring | CO₂ (ca.) | Antagelse |
|---|---:|---|
| Cykel eller gå i skole | 400 g | Erstatter 2 km bilkørsel hver vej (4 km) × ca. 0,10 kg/km |
| Plantebaseret frokost | 100 g | 50 g skinke erstattes af 50 g bønnepostej |
| Reparér / byt eller køb brugt | 500 g | 10 % af en ny t-shirts aftryk (ca. 5,2 kg) |
| Sortér affald | 50 g | 50 g plast genanvendes i stedet for at blive brændt |
| Kort bad | 20 g + 15 L vand | 2 minutter kortere med sparebruser og fjernvarme |
| Madpakke uden engangsplast | 20 g | Undgår ca. 10 g engangsplast |
| Sluk lyset | 10 g | 30 min LED-lys i et tomt lokale, dansk strøm 2025 |
| Sluk skærme og opladere | 7 g | Projektor 30 min + standby natten over |

Dansk strøm og fjernvarme er så grønne, at lys, skærme og bad kun sparer få gram. De største gevinster kommer fra transport, mad og forbrug. Kun vand fra vandhanen tælles med. Prototypens gamle tal var for høje (fx lys 0,4 kg) og er rettet for at undgå greenwashing.

Tallene er forsigtige skøn. I appen står usikkerheden ved hvert tal under "Usikkerhed:".

## 6. Fusk-beskyttelse

1. **Én registrering pr. udfordring pr. dag pr. klasse** – også hvis læreren har afvist den.
2. **Dagligt pointloft på 15 point pr. klasse.** Både ventende og godkendte point tæller med. Ved godkendelse tjekkes loftet mod den dag, indsendelsen er fra.
3. **Lærergodkendelse.** Standard-PIN er `1234` og kan ændres øverst i `app.js` (`CONFIG.teacherPin`).
4. **Cooldown på 10 sekunder** mellem indsendelser fra samme klasse – også efter genindlæsning af siden.

**Vigtig begrænsning:** Dette er en prototype, ikke et sikkert kontrolsystem. Data gemmes i browserens `localStorage`, og både data og PIN-kode kan manipuleres af en bruger, der kan ændre browserdata eller læse kildekoden. Reglerne gælder kun i den aktuelle browser, og forskellige enheder deler ikke data. Brug en serverbaseret løsning med login, database og servervalidering, før appen bruges i en rigtig skolekonkurrence.

## 7. Forretningsmodel (hypoteser)

| Niveau | Hypotetisk pris (ekskl. moms) | Indhold |
|---|---|---|
| Prøve | 0 kr. – 1 klasse i 3 måneder | Udfordringer, plante, lærergodkendelse |
| Skolelicens | ca. 1.500 kr. pr. skole pr. år | Alle klasser, liga, dashboard, rapporter, support |
| Kommuneaftale | fra ca. 12.000 kr. pr. år for op til 10 skoler | Samlet rapport til kommunens klimaenhed (kun klasseniveau) |

### Sponsorniveauer (hypoteser – ingen sponsor har sagt ja)

| Niveau | Hypotetisk pris pr. år | Synlighed i månedens nyhedsbrev |
|---|---:|---|
| Støtter | ca. 5.000 kr. | Navnet i en "Tak til"-linje nederst |
| Partner | ca. 15.000 kr. | Afsnittet "Månedens grønne tip fra …" og navnet nederst |
| Hovedsponsor | ca. 40.000 kr. | "Støttet af …" øverst og afsnittet "Månedens grønne tip fra …" |

Priserne står i `SPONSOR_LEVELS` i `app.js`. Sponsorer ses kun i nyhedsbrevet til de voksne – aldrig i elevernes udfordringer – og de får ingen data om elever.

### To økonomiberegnere

GroKlassen har to indtægtsben, som regnes hver for sig. Hver beregner har egne felter, KPI'er, forklaring, graf, tabel, scenarieknapper og "Gendan forudsætninger". Under dem står en samlet linje. Tallene står i `MUNI_SCENARIOS` og `SPONSOR_SCENARIOS` øverst i `app.js`. Alle standardværdier er **forudsætninger**, og "forventet" bruges også i pitchen og på A4-oversigten.

**A · Kommuner og skoler (licenser).** Break-even = det mindste antal kommuneaftaler, der dækker omkostningerne (med de valgte enkeltskoler). Nøgletal: pris pr. elev pr. år (forudsætning: 300 elever pr. skole).

| Scenarie | Kommuneaftaler | Pris pr. aftale | Enkeltskoler × pris | Variable pr. skole | Faste omkostninger | Resultat | Break-even | Pr. elev |
|---|---:|---:|---:|---:|---:|---:|---|---:|
| Forsigtig | 1 | 10.000 kr. | 5 × 1.000 kr. | 200 kr. | 30.000 kr. | −18.000 kr. | 4 kommuneaftaler | 3,33 kr. |
| **Forventet** | 2 | 12.000 kr. | 10 × 1.500 kr. | 150 kr. | 30.000 kr. | **+4.500 kr.** | **2 kommuneaftaler + 10 skolelicenser** | 4 kr. |
| Optimistisk | 4 | 12.000 kr. | 20 × 1.500 kr. | 150 kr. | 36.000 kr. | +33.000 kr. | 1 kommuneaftale | 4 kr. |

**B · Sponsorater (nyhedsbrevet).** Break-even = det mindste antal sponsorer (ved scenariets gennemsnitspris), der dækker nyhedsbrevets omkostninger. Nøgletal: pris pr. modtager pr. nyhedsbrev.

| Scenarie | Støttere / partnere / hovedsponsorer | Nyhedsbreve | Produktion + udsendelse | Salg pr. sponsor | Modtagere | Resultat | Break-even | Pr. modtager |
|---|---|---:|---:|---:|---:|---:|---|---:|
| Forsigtig | 2 / 0 / 0 | 10 | 10 × 1.000 + 1.000 kr. | 1.000 kr. | 1.000 | −3.000 kr. | 3 sponsorer | 1 kr. |
| **Forventet** | 2 / 1 / 0 | 10 | 10 × 1.000 + 1.000 kr. | 1.000 kr. | 2.000 | **+11.000 kr.** | **2 sponsorer** | 1,25 kr. |
| Optimistisk | 3 / 2 / 1 | 10 | 10 × 1.500 + 2.000 kr. | 1.000 kr. | 5.000 | +62.000 kr. | 2 sponsorer | 1,70 kr. |

**Samlet (forventet):** +4.500 kr. + 11.000 kr. = **+15.500 kr. om året**.

Lønnen er 0 kr., fordi holdet arbejder frivilligt i prototypefasen. Skriver man fx 150.000 kr. i løn, stiger break-even for kommuner til 16 kommuneaftaler.

> **Sponsorindtægter er usikre og må aldrig styre elevernes indhold. Sponsorer har ingen indflydelse på udfordringer eller CO₂-tal.**

Referencepriser (set på udbydernes egne hjemmesider 25.10.2026): Grøn Skole/Grønt Flag 3.600 kr./år for en grundskole, Klimakampen 500 kr. pr. klasse pr. 4-ugers kampagne, Gyldendals fagportaler ca. 1.300 kr. pr. klasse pr. år.

### Sponsorer vi vil kontakte (ikke kontaktet)

Under For skoler står syv landsdækkende virksomheder, hvis bæredygtighedsarbejde passer til udfordringerne: Coop Danmark, Salling Group (Netto, føtex, Bilka), Ørsted, Danfoss, Grundfos, DSB og VELUX. **Ingen af dem er kontaktet, og ingen har sagt ja.** Der vises kun navn og én neutral linje – ingen logoer.

### GroKlassen-nyhedsbrevet (i samarbejde med sponsorer)

GroKlassen sender hver måned et nyhedsbrev til lærere, skoleledelse og forældre. Det indeholder månedens grønne tip, samlede tal på tværs af alle klasser (kun klasseniveau), en idé til en klasseaktivitet og en tydeligt mærket annonceboks ("Annonce · i samarbejde med …"). For skoler viser et eksempel med demo-data; Lærer → **Se månedens nyhedsbrev** viser samme forhåndsvisning med tallene fra enheden og kan printes som PDF.

- **Sponsorens navn** står i `TEAM_DATA.sponsor`. Er feltet tomt, står der "Eksempel-sponsor" med mærket EKSEMPEL. Sponsorens tekst til annonceboksen står i `NEWSLETTER.sponsorText`.
- **Regler:** kun til voksne, ingen reklame rettet mod børn, sponsorer vises aldrig i elevernes udfordringer, ingen tilbud eller rabatkoder, og sponsoren kan ikke ændre indhold eller tal.
- **Ingen e-mails:** "Tilmeld" er deaktiveret. Tilmelding åbner, når GroKlassen får login, og kræver samtykke, databehandleraftale og GDPR-vurdering.

## 8. FN's verdensmål og bæredygtighed

GroKlassen bidrager til fire delmål. På siden, i pitchen og på A4 vises de som fliser i FN's farver med egne, enkle ikoner (ikke FN's officielle ikoner):
- **4.7** Uddannelse for bæredygtig udvikling: grøn dannelse i hverdagen.
- **12.5** Mindre affald: sortering, genbrug, madpakke uden engangsplast.
- **12.8** Viden om bæredygtig livsstil: åbne beregninger i "Sådan har vi regnet".
- **13.3** Uddannelse og bevidsthed om klima: klassen ser effekten af sine handlinger.

**Appen selv er let:** ca. 350 kB i alt (`index.html`, `app.js`, `app.css`, `manifest.json`, `sw.js` og fire ikoner), ingen biblioteker, ingen tracking og ingen server i prototypen. Logoet ligger inde i `index.html` én gang.

## 9. Holdets egne data (`TEAM_DATA`) – udfyld før pitchen

Øverst i `app.js` ligger objektet **`TEAM_DATA`**. Det er det **eneste sted**, I skal rette jeres egne data. Alle tekster i appen, pitchen og A4-oversigten læses derfra. Hvert felt har en kommentar, der fortæller, hvad der skal stå, og hvor det vises.

```js
const TEAM_DATA = {
  sponsor:  "",   // Tomt felt = "Eksempel-sponsor" i nyhedsbrevet
  teamName: "",   // Tomt felt = standardtekst
  ...
};
```

- **Tomt felt (`""`)** → **linjen skjules**, hvor feltet bruges. Undtagelser: `ideaOrigin`, `teamName`, `contact`, `pitchAsk` og `publicUrl` viser en standardtekst fra `TEAM_FALLBACK` lige under `TEAM_DATA`. Siden viser derfor aldrig pladsholdere.
- **Udfyldt felt** → jeres tekst vises, fx "Hvad lærerne selv siger: …".
- **Opfind aldrig** citater, eksperter, brugere, skoler, sponsorer eller aftaler. Tallene i appen er tydeligt markerede forudsætninger.
- **Ingen persondata:** brug fx en fælles hold-mail – ikke private navne, telefonnumre eller e-mails.

### Tjekliste over alle felter

- [ ] `ideaOrigin` – hvordan I fik idéen (1 sætning). *Vises:* For skoler → toppen af siden.
- [ ] `targetGrades` – validerede klassetrin, fx "4.–9. klasse". *Vises:* Business Model Canvas og A4.
- [ ] `sponsor` – en sponsor, der **har sagt ja**. Sæt også `CONTEST.isExample` til `false`. *Vises:* Konkurrence og nyhedsbrevet. Tomt = "Eksempel-sponsor" med mærket EKSEMPEL.
- [ ] `pitchAsk` – jeres opfordring, fx "Hjælp os med at åbne døren til de første kommuner". *Vises:* pitch trin 6 og A4.
- [ ] `teamName` – holdets navn og evt. skole. *Vises:* A4.
- [ ] `contact` – fælles kontakt (fx hold-mail, ingen private oplysninger). *Vises:* A4.
- [ ] `publicUrl` – den udgivne adresse (er udfyldt). QR-koden peger herhen med `?demo=1`. Ret den, hvis I flytter siden.

Uden for `TEAM_DATA` (også i `app.js`): `NEWSLETTER` (sponsorens annoncetekst), `SPONSOR_LEVELS` (sponsorpriser), `MUNI_SCENARIOS` og `SPONSOR_SCENARIOS` (økonomiens forudsætninger) og `CONTEST` (konkurrencen).

Kontrollér til sidst siden og alle 6 pitchtrin: alt, der står, skal være rigtigt.

## 10. Demo, QR-kode og A4 – til pitchen

| Adresse | Hvad sker der? |
|---|---|
| `index.html?demo=1` | Starter straks en frisk demo med 6 ugers **opdigtede** eksempeldata, tydeligt mærket "DEMO": en voksen plante (Ungt træ), en graf over ugerne og en klasseliga. Demo-data gemmes for sig, så klassens rigtige data aldrig røres. "Nulstil demo" gendanner udgangspunktet, og "Afslut demo" viser klassens egne data igen (for en ny besøgende: den tomme tilstand) og fjerner `?demo=1` fra adressen. |
| `index.html?pitch=1` | Åbner præsentationstilstanden i 6 trin. Styres med piletaster, trinknapper og `F` for fuld skærm. På mobil og tablet (og med musen) kan trinnene trækkes: de følger fingeren, og et kast skifter trin. `Esc` lukker. |
| `index.html?demo=1&pitch=1` | Begge dele – den bedste adresse til selve pitchen. |

Demo-klassen 7.A står på 178 point – 2 point fra "Stort træ". Den første godkendelse i lærerområdet får planten til at vokse med en fejring.

**QR-koden** laves i selve filen uden biblioteker (standard-QR, fejlkorrektion M). Den peger på `TEAM_DATA.publicUrl` + `?demo=1`, så dommerne lander i en levende demo og ikke i en tom app. Den vises:
- på **sidste pitch-trin** (trin 6, "Vision og opfordring"),
- bag knappen **"Del"** i toppen (med "Kopiér link" og – på mobil – "Del …"),
- på **A4-oversigten**.

**Print A4-oversigt** (knap under For skoler) giver én ren A4-side med værditilbud, kunder, prisskitse, økonomi for licenser og sponsorater (forventet scenarie), FN's verdensmål som fliser, QR-kode og holdets kontakt fra `TEAM_DATA`. Vælg "Gem som PDF" i printvinduet, hvis I vil sende den. Test den på jeres egen printer før pitchdagen.

## 11. Sådan kører du appen lokalt

Appen består nu af flere filer, som skal ligge i **samme mappe** (ikonerne i undermappen `icons/`):

```
index.html   app.js   app.css   manifest.json   sw.js
icons/apple-touch-icon.png   icons/icon-192.png   icons/icon-512.png   icons/maskable-512.png
```

1. Download hele mappen (på GitHub: **Code → Download ZIP**), og pak den ud.
2. Dobbeltklik på `index.html`. Appen åbner i browseren og virker uden internet.
3. Installation som app og offline-cache (`sw.js`) virker kun via HTTPS, fx GitHub Pages. Som lokal fil viser appen "Offlinefunktion er ikke klar" – det er forventet.

Vil du teste installation og offline lokalt, så start en lille webserver i mappen (`python3 -m http.server 8000`), og åbn `http://localhost:8000/`.

## 12. Sådan lægger du appen på GitHub og udgiver med GitHub Pages

### A. Opret et repository

1. Gå til [github.com](https://github.com/) og log ind eller opret en konto.
2. Klik på **+** øverst til højre, og vælg **New repository**.
3. Skriv fx `groklassen` som **Repository name**.
4. Vælg **Public**, hvis alle skal kunne se projektet.
5. Du kan markere **Add a README file**, men det er ikke nødvendigt, hvis du uploader din egen README.
6. Klik på **Create repository**.

### B. Upload filerne

1. Åbn dit repository.
2. Klik på **Add file** og vælg **Upload files**.
3. Træk disse filer ind i uploadfeltet: `index.html`, `app.js`, `app.css`, `manifest.json`, `sw.js`, `README.md`, `PITCH.md`, `CHANGELOG.md`, `DESIGN-AUDIT.md` og `e2e.cjs`.
4. Træk også hele mappen **`icons`** ind (med de fire PNG-filer). GitHub bevarer mappen, når du trækker selve mappen ind.
5. Skriv fx `Opdatér GroKlassen` i feltet **Commit changes**.
6. Klik på **Commit changes**.

Filerne skal ligge direkte i roden af repository'et – ikke i en ekstra undermappe – og ikonerne i `icons/`. Filen skal hedde præcis `index.html`. Uploader du kun nogle af filerne, så husk, at `index.html`, `app.js` og `app.css` hører sammen: upload altid alle tre.

**Når I ændrer appen:** skift versionsnavnet i `CACHE` øverst i `sw.js`. Så henter installerede enheder den nye version og viser "En ny version er klar".

### C. Aktivér GitHub Pages

1. Åbn repository'et, og klik på **Settings**.
2. Vælg **Pages** i menuen til venstre. Det kan stå under afsnittet **Code and automation**.
3. Find **Build and deployment**.
4. Under **Source** vælger du **Deploy from a branch**.
5. Under **Branch** vælger du `main` og mappen `/(root)`.
6. Klik på **Save**.
7. Vent et par minutter, og genindlæs siden **Settings → Pages**. GitHub viser adressen til din udgivne side dér.

Adressen vil normalt ligne `https://DIT-GITHUB-NAVN.github.io/groklassen/`. Skriv den i `TEAM_DATA.publicUrl`, så QR-koden peger rigtigt. Til pitchen kan du bruge `…/groklassen/?demo=1&pitch=1`. Hvis du ændrer filerne senere, uploader du de nye versioner og laver et nyt commit; GitHub Pages udgiver ændringerne automatisk.

**Bemærk:** GitHub Pages må ikke bruges til at drive en kommerciel tjeneste. Det er fint til prototypen, men en betalt version skal flyttes til en anden hosting.

## 13. Test (valgfrit)

`e2e.cjs` er en automatisk browsertest (175 tjek), der gennemgår:
- hele flowet (indsend → lærer-PIN → godkend → planten vokser → CSV → ugerapport),
- fusk-reglerne (dobbelt indsendelse, loft og cooldown efter genindlæsning) og migrering,
- `TEAM_DATA` (tomme felter skjuler linjen) og `?demo=1` (også at ingen pladsholdere er synlige),
- QR-koden, Del-knappen og A4-oversigten (præcis én side),
- de to økonomiberegnere (scenarier, break-even, nøgletal, samlet linje), konkurrencetilmelding og -afmelding samt pitchens 6 trin,
- sponsorer vi vil kontakte (7 virksomheder, ingen logoer), sponsorniveauer, nyhedsbrevet (i samarbejde med sponsor, annonceboks, deaktiveret tilmelding, print på én side), verdensmål-fliserne og at de fjernede sektioner er væk,
- swipe i pitchen (1:1-sporing, elastisk kant, kast, afbrydelse, rigtig touch og reduceret bevægelse) og Fortryd (knap, Ctrl/Cmd + Z, kun seneste handling, oven på fejringen),
- tilgængelighed (tastatur, fokus, labels, `aria-live` og kontrast i begge temaer),
- layout ved 375, 768 og 1280 px i lys og mørk tilstand (ingen vandret scroll; på mobil står overskrift, trin og "Registrér en handling" over folden).

Den kræver Node.js 18+ og Playwright:

```bash
npm install playwright jsqr pngjs
npx playwright install chromium
node e2e.cjs
```

Kør den mod en lokal server med `BASE_URL=http://localhost:8000/ node e2e.cjs` (start serveren med `python3 -m http.server 8000`). `jsqr` og `pngjs` er valgfrie – med dem afkoder testen også QR-koderne. Appen virker fint uden testen.

## 14. Design

`DESIGN-AUDIT.md` er en gennemgang af appens design efter Apples designprincipper (respons, rumlig sammenhæng, reduceret bevægelse, typografi m.m.) med det, der er rettet, og prioriterede forslag til næste runde.

Udseendet og bevægelsen følger skillen *apple-design* (se `DESIGN-AUDIT.md`, runde 3). Stilen ligger i `app.css` og bevægelsen i `app.js`.

## 15. Videreudvikling

- Supabase eller lignende (i en EU-region) til lærerlogin og fælles klassedata på tværs af enheder.
- Servervalidering af pointloft, cooldown og godkendelse.
- Rigtige klassekonti og en fælles liga.
- Faktatjek af CO₂-tal med en fagperson og mulighed for lokale tal (fx egen varmeforsyning).
- Databehandleraftale og privatlivsvurdering, før appen bruges med rigtige skoler.

## 16. Licens og kontakt

**Licens:** Ingen open source-licens er valgt endnu. Vil I tillade andre at genbruge koden, kan I vælge fx MIT og tilføje en `LICENSE`-fil.

**Kontakt:** se `TEAM_DATA.contact` i `app.js` (en fælles hold-mail – ikke private oplysninger).
