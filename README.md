# GroKlassen

> **Bæredygtige vaner forsvinder, når ingen kan se dem.** GroKlassen gør dem synlige: Eleverne registrerer små grønne handlinger, læreren godkender, og klassens fælles plante vokser – helt uden persondata.

GroKlassen er en prototype lavet af et gymnasiehold til Business Mind Programme (BMP) 2026 hos Fonden for Entreprenørskab. Det er en første idé til en forretningsmodel – ikke en færdig virksomhed.

**Før pitchen:** udfyld [`TEAM_DATA`](#9-holdets-egne-data-team_data--udfyld-før-pitchen) (afsnit 9), åbn `index.html?udkast=1` for at se, hvad der mangler, og øv med [`PITCH.md`](PITCH.md).

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
- Problem, løsning og det nye · tre roller · prisskitse (hypoteser) · økonomiberegner med kommuneaftaler, tre scenarier, løn og break-even-graf · Business Model Canvas farvekodet efter BMP's fire perspektiver · mulige partnere og kanaler · ærlig sammenligning med alternativer · bæredygtighed på tre niveauer · næste skridt.
- **Print A4-oversigt:** én side til dommerne (se afsnit 10).

**Lærer (`#laerer`, demo-PIN `1234`)**
- Ventende indsendelser med alder, Godkend/Afvis pr. række, "Godkend alle fra i dag" og samlet behandling af ældre.
- Graf over godkendte point pr. uge (med tabelvisning).
- Eksport som CSV (åbner i Excel) og print-venlig ugerapport med spørgsmål til en klassesamtale.
- **Fortryd:** Godkend og Afvis (også samlet) kan fortrydes i 8 sekunder med knappen i beskeden eller Ctrl/Cmd + Z.
- Indlæs/nulstil demo-data og nulstil klassens egne data.

**Konkurrence (`#konkurrence`)** – tilmelding af klassen til en (fiktiv) klassekonkurrence, regler og præmie-idéer. Der vises ingen pop-up, så længe `CONTEST.isExample` er `true`.

**Til pitchen** – se afsnit 10 og [`PITCH.md`](PITCH.md): demo (`?demo=1`), præsentation (`?pitch=1`), udkast (`?udkast=1`), QR-kode, Del-knap og A4-oversigt.

Appen virker på mobil, tablet og computer, i lys og mørk tilstand, helt offline og ved dobbeltklik på filen.

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

**Holdet skal faktatjekke tallene før pitchen.** På den offentlige side står usikkerhederne som "Usikkert – tjek selv". Med `?udkast=1` vises de i stedet som gule "Til faktatjek"-noter.

## 6. Fusk-beskyttelse

1. **Én registrering pr. udfordring pr. dag pr. klasse** – også hvis læreren har afvist den.
2. **Dagligt pointloft på 15 point pr. klasse.** Både ventende og godkendte point tæller med. Ved godkendelse tjekkes loftet mod den dag, indsendelsen er fra.
3. **Lærergodkendelse.** Standard-PIN er `1234` og kan ændres øverst i JavaScript-koden i `index.html` (`CONFIG.teacherPin`).
4. **Cooldown på 10 sekunder** mellem indsendelser fra samme klasse – også efter genindlæsning af siden.

**Vigtig begrænsning:** Dette er en prototype, ikke et sikkert kontrolsystem. Data gemmes i browserens `localStorage`, og både data og PIN-kode kan manipuleres af en bruger, der kan ændre browserdata eller læse kildekoden. Reglerne gælder kun i den aktuelle browser, og forskellige enheder deler ikke data. Brug en serverbaseret løsning med login, database og servervalidering, før appen bruges i en rigtig skolekonkurrence.

## 7. Forretningsmodel (hypoteser)

| Niveau | Hypotetisk pris (ekskl. moms) | Indhold |
|---|---|---|
| Prøve | 0 kr. – 1 klasse i 3 måneder | Udfordringer, plante, lærergodkendelse |
| Skolelicens | ca. 1.500 kr. pr. skole pr. år | Alle klasser, liga, dashboard, rapporter, support |
| Kommuneaftale | fra ca. 12.000 kr. pr. år for op til 10 skoler | Samlet rapport til kommunens klimaenhed (kun klasseniveau) |

### Økonomiberegneren

Beregneren regner med **skolelicenser og kommuneaftaler** og viser den samlede indtægt. Break-even er det mindste antal skoler med licens, hvor indtægten dækker omkostningerne (med det valgte antal kommuneaftaler). Tekst, KPI, tabel og graf bruger de samme formler, så de altid stemmer overens.

Alle tal er **antagelser** og står i `CALC_SCENARIOS` øverst i scriptet:

| Scenarie | Skolelicenser | Pris | Kommuneaftaler | Variable pr. skole | Faste omkostninger | Break-even |
|---|---:|---:|---:|---:|---:|---|
| Forsigtig | 10 | 1.000 kr. | 0 | 200 kr. | 30.000 kr. | **38 skoler** |
| **Forventet** (standard) | 25 | 1.500 kr. | 1 (10 skoler) | 150 kr. | 30.000 kr. | **15 skoler + 1 kommuneaftale** |
| Optimistisk | 40 | 1.500 kr. | 3 (10 skoler hver) | 150 kr. | 36.000 kr. | **4 skoler + 3 kommuneaftaler** |

Faste omkostninger = hosting og database + support + udvikling + **løn til drift og udvikling**. Lønnen er 0 kr. i alle scenarier, fordi holdet arbejder frivilligt i prototypefasen. Hvis en dommer spørger "Hvem betaler for jeres tid?", kan I skrive fx 150.000 kr. i feltet. Så stiger break-even i det forventede scenarie til 126 skoler, og I kan forklare, hvorfor kommuneaftaler er vigtige.

Referencepriser (set 25.10.2026 – faktatjek): Grøn Skole/Grønt Flag 3.600 kr./år for en grundskole, Klimakampen 500 kr. pr. klasse pr. 4-ugers kampagne, Gyldendals fagportaler ca. 1.300 kr. pr. klasse pr. år.

**Priser og betalingsvilje skal valideres gennem interviews og pilotforsøg.** Partnere på "For skoler"-siden er mulige partnere – der er ingen aftaler.

## 8. Bæredygtighed på tre niveauer

- **Miljømæssigt:** synlige grønne vaner inden for transport, mad, affald, forbrug og energi – med ærlige, åbne tal.
- **Socialt:** klassen arbejder mod ét fælles mål. Ingen elev bliver målt, rangeret eller udstillet. Mange forskellige udfordringer, så alle kan bidrage.
- **Økonomisk:** en lille, billig app, hvor en skolelicens skal betale drift og udvikling.
- **Verdensmål:** 4.7, 12 og 13.
- **Appen selv er let:** én fil på ca. 220 kB (siden viser selv den aktuelle størrelse), ingen biblioteker, ingen tracking, ingen server i prototypen, virker offline. Logoet ligger inde i filen én gang.

## 9. Holdets egne data (`TEAM_DATA`) – udfyld før pitchen

Øverst i `<script>` i `index.html` ligger objektet **`TEAM_DATA`**. Det er det **eneste sted**, I skal rette jeres egne data. Alle tekster i appen, pitchen og A4-oversigten læses derfra. Hvert felt har en kommentar, der fortæller, hvad der skal stå, og hvor det vises.

```js
const TEAM_DATA = {
  interviewsTeachers: "6",   // Antal lærere, I har interviewet – kun tallet
  interviewFinding:   "",    // Tomt felt = ærlig reservetekst
  ...
};
```

- **Tomt felt (`""`)** → appen viser en **ærlig reservetekst**, fx "Vi er i gang med at interviewe lærere" eller "4 uger med rigtige klasser er planlagt". Siden ser derfor aldrig ufærdig ud for dommerne. Reserveteksterne står i `TEAM_FALLBACK` lige under `TEAM_DATA`.
- **Udfyldt felt** → jeres tekst vises, fx "Hvad lærerne selv siger: …".
- **`index.html?udkast=1`** → alle tomme felter vises som gule pladsholdere (`[INDSÆT: …]`, `[VALIDÉR: …]`, `[FAKTATJEK: …]`), og et banner øverst fortæller, hvor mange felter der mangler. Noter til holdet (fx "faktatjek før pitchen") vises også kun her.
- **Skriv kun det, I faktisk har undersøgt.** Opfind aldrig interviews, citater, brugertal, pilotresultater, sponsorer eller partneraftaler.
- **Ingen persondata:** brug fx en fælles hold-mail – ikke private navne, telefonnumre eller e-mails.

### Tjekliste over alle felter

- [ ] `ideaOrigin` – hvordan I fik idéen (1 sætning). *Vises:* For skoler → Problemet og løsningen.
- [ ] `interviewsTeachers` – antal interviewede lærere (kun tallet). *Vises:* For skoler → Kunder og Næste skridt, pitch trin 3.
- [ ] `interviewFinding` – vigtigste fund fra interviewene (1 kort sætning). *Vises:* For skoler → Problemet, pitch trin 1.
- [ ] `targetGrades` – validerede klassetrin, fx "4.–9. klasse". *Vises:* Kunder, Business Model Canvas og A4.
- [ ] `willingnessToPay` – hvad skoleledere/lærere sagde om pris. *Vises:* Prisskitse, Canvas, pitch trin 4 og A4.
- [ ] `feedbackUsed` – hvem I har talt med, og hvad I ændrede bagefter. *Vises:* For skoler → Partnere.
- [ ] `pilotClasses` – antal pilotklasser (kun tallet). *Vises:* Næste skridt og pitch trin 6.
- [ ] `pilotResult` – hvad pilotforsøget viste (1 sætning). *Vises:* Næste skridt.
- [ ] `factChecker` – hvem der faktatjekker CO₂-tallene. *Vises:* Næste skridt og pitch trin 6.
- [ ] `nameCheck` – resultat af tjek af navn/varemærke og domæne. *Vises:* For skoler → Alternativer.
- [ ] `sponsor` – en sponsor, der **har sagt ja**. Sæt også `CONTEST.isExample` til `false`. *Vises:* Konkurrence.
- [ ] `pitchAsk` – jeres opfordring, fx "Vi søger 3 pilotskoler – vil I være med?". *Vises:* pitch trin 6 og A4.
- [ ] `teamName` – holdets navn og evt. skole. *Vises:* A4.
- [ ] `contact` – fælles kontakt (fx hold-mail, ingen private oplysninger). *Vises:* A4.
- [ ] `publicUrl` – den udgivne adresse (er udfyldt). QR-koden peger herhen med `?demo=1`. Ret den, hvis I flytter siden.

Kontrollér til sidst med `index.html?udkast=1`, at banneret skriver, at alle felter er udfyldt (eller at de resterende reservetekster er i orden).

## 10. Demo, udkast, QR-kode og A4 – til pitchen

| Adresse | Hvad sker der? |
|---|---|
| `index.html?demo=1` | Starter straks en frisk demo med 6 ugers **opdigtede** eksempeldata, tydeligt mærket "DEMO": en voksen plante (Ungt træ), en graf over ugerne og en klasseliga. Demo-data gemmes for sig, så klassens rigtige data aldrig røres. "Nulstil demo" gendanner udgangspunktet, og "Afslut demo" viser klassens egne data igen (for en ny besøgende: den tomme tilstand) og fjerner `?demo=1` fra adressen. |
| `index.html?pitch=1` | Åbner præsentationstilstanden i 6 trin. Styres med piletaster, trinknapper og `F` for fuld skærm. På mobil og tablet (og med musen) kan trinnene trækkes: de følger fingeren, og et kast skifter trin. `Esc` lukker. |
| `index.html?demo=1&pitch=1` | Begge dele – den bedste adresse til selve pitchen. |
| `index.html?udkast=1` | Viser de gule pladsholdere og et banner med de felter i `TEAM_DATA`, der mangler. Kan kombineres med de andre, fx `?udkast=1&pitch=1`. |

Demo-klassen 7.A står på 178 point – 2 point fra "Stort træ". Den første godkendelse i lærerområdet får planten til at vokse med en fejring.

**QR-koden** laves i selve filen uden biblioteker (standard-QR, fejlkorrektion M). Den peger på `TEAM_DATA.publicUrl` + `?demo=1`, så dommerne lander i en levende demo og ikke i en tom app. Den vises:
- på **sidste pitch-trin** sammen med holdets opfordring (`pitchAsk`),
- bag knappen **"Del"** i toppen (med "Kopiér link" og – på mobil – "Del …"),
- på **A4-oversigten**.

**Print A4-oversigt** (knap under For skoler) giver én ren A4-side med værditilbud, kunder, prisskitse, break-even (fra beregnerens aktuelle scenarie), bæredygtighed, QR-kode og holdets kontakt fra `TEAM_DATA`. Vælg "Gem som PDF" i printvinduet, hvis I vil sende den. Test den på jeres egen printer før pitchdagen.

## 11. Sådan kører du appen lokalt

1. Download eller kopiér filen `index.html` til en mappe på din computer.
2. Dobbeltklik på `index.html`.
3. Filen åbner i din browser. Du behøver ikke installere noget eller have internet.

Hvis browseren blokerer enkelte funktioner ved åbning af en lokal fil, kan du prøve en anden browser eller køre filen via en lokal webserver. GitHub Pages kører den som en almindelig webside.

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
3. Træk `index.html`, `README.md`, `PITCH.md`, `CHANGELOG.md`, `DESIGN-AUDIT.md` og `e2e.cjs` ind i uploadfeltet.
4. Skriv fx `Opdatér GroKlassen` i feltet **Commit changes**.
5. Klik på **Commit changes**.

Filerne skal ligge direkte i roden af repository'et – ikke i en ekstra undermappe. Filen skal hedde præcis `index.html`.

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

`e2e.cjs` er en automatisk browsertest (ca. 135 tjek), der gennemgår:
- hele flowet (indsend → lærer-PIN → godkend → planten vokser → CSV → ugerapport),
- fusk-reglerne (dobbelt indsendelse, loft og cooldown efter genindlæsning) og migrering,
- `TEAM_DATA`, `?udkast=1` og `?demo=1` (også at ingen pladsholdere er synlige uden udkast),
- QR-koden, Del-knappen og A4-oversigten (præcis én side),
- økonomiens scenarier og break-even, konkurrencetilmelding og -afmelding samt pitchens 6 trin,
- swipe i pitchen (1:1-sporing, elastisk kant, kast, afbrydelse, rigtig touch og reduceret bevægelse) og Fortryd (knap, Ctrl/Cmd + Z, kun seneste handling, oven på fejringen),
- tilgængelighed (tastatur, fokus, labels, `aria-live` og kontrast i begge temaer),
- layout ved 375, 768 og 1280 px i lys og mørk tilstand (ingen vandret scroll, indhold over folden på mobil).

Den kræver Node.js 18+ og Playwright:

```bash
npm install playwright jsqr pngjs
npx playwright install chromium
node e2e.cjs
```

Kør den mod en lokal server med `BASE_URL=http://localhost:8000/ node e2e.cjs` (start serveren med `python3 -m http.server 8000`). `jsqr` og `pngjs` er valgfrie – med dem afkoder testen også QR-koderne. Appen virker fint uden testen.

## 14. Design

`DESIGN-AUDIT.md` er en gennemgang af appens design efter Apples designprincipper (respons, rumlig sammenhæng, reduceret bevægelse, typografi m.m.) med det, der er rettet, og prioriterede forslag til næste runde.

## 15. Videreudvikling

- Supabase eller lignende (i en EU-region) til lærerlogin og fælles klassedata på tværs af enheder.
- Servervalidering af pointloft, cooldown og godkendelse.
- Rigtige klassekonti og en fælles liga.
- Faktatjek af CO₂-tal med en fagperson og mulighed for lokale tal (fx egen varmeforsyning).
- Databehandleraftale og privatlivsvurdering, før appen bruges med rigtige skoler.

## 16. Licens og kontakt

**Licens:** Ingen open source-licens er valgt endnu. Vil I tillade andre at genbruge koden, kan I vælge fx MIT og tilføje en `LICENSE`-fil.

**Kontakt:** se `TEAM_DATA.contact` i `index.html` (en fælles hold-mail – ikke private oplysninger).
