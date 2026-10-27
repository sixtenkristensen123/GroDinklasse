# Ændringslog

## Version 3.3 – 27. oktober 2026 (finpudsning før pitchen)

### Troværdighed og første indtryk
- Alle holdets data står nu i `TEAM_DATA` øverst i scriptet, med en kommentar pr. felt (inkl. sponsor, opfordring, holdnavn, kontakt og udgivet adresse).
- Tomme felter viser en ærlig reservetekst (fx "Vi er i gang med at interviewe lærere"). Gule `[INDSÆT/VALIDÉR/FAKTATJEK]`-pladsholdere og noter til holdet vises kun med `?udkast=1`, sammen med et banner, der viser, hvad der mangler.
- Ødelagt HTML i Problem-kortet er rettet (manglende `</p></div>`).
- QR-kode genereret i selve filen (uden biblioteker) på sidste pitch-trin, bag den nye "Del"-knap og på A4-oversigten. Den peger på den udgivne adresse med `?demo=1`.
- `?demo=1` viser nu også en graf over klassens uger direkte på klassens side (sammen med plante og liga).
- Konkurrencekortet står under udfordringer og plante og er afdæmpet. Der vises ingen pop-up, så længe konkurrencen er et eksempel. Firmanavn fjernet fra præmieidéerne.

### Mobil
- Headeren står på én linje ved 375 px: tema-knappen er et ikon, og den dobbelte "Sådan virker det" er fjernet. Hero, de fire tal og starten på udfordringerne står over folden. Demo-banneret er kortere på mobil, og fanerne klippes ikke længere.

### Økonomi
- Kommuneaftaler (antal × pris, skoler pr. aftale) og samlet indtægt.
- Tre scenarier som knapper (forsigtig, forventet, optimistisk) – alle markeret som antagelser. Forventet giver break-even ved 15 skoler + 1 kommuneaftale.
- Valgfri post "Løn til drift og udvikling" (0 kr. = frivilligt arbejde i prototypefasen).
- Tekst, KPI, tabel og graf bruger samme formler, så break-even altid stemmer; break-even uden for grafen står i tabellen.

### Pitch og A4
- Pitchen: højst 3 punkter pr. trin, BMC-perspektiv på hvert trin, tal fra beregnerens scenarie og et sidste trin med QR-kode og holdets opfordring.
- "Print A4-oversigt" under For skoler: én side til dommerne med værditilbud, kunder, prisskitse, break-even, bæredygtighed, QR-kode og holdets kontakt.

### Deling, vægt og konsistens
- `<meta name="description">` og Open Graph-tags.
- Logoet er indlejret én gang og komprimeret (ca. 37 → 6 kB). Teksten om "ingen billeder" er rettet; filstørrelsen vises automatisk.

### Design (efter `DESIGN-AUDIT.md`)
- Feedback ved selve trykket, pitch-trin der glider ind fra den side, man går mod, toasts der forsvinder ad samme vej, krydstoning ved temaskift, lettere bagtæppe bag dialoger, understøttelse af `prefers-contrast` og `prefers-reduced-transparency`, og brødtekst der følger brugerens tekststørrelse.
- Swipe i pitchen følger fingeren 1:1 med elastisk modstand ved kanterne, kast ud fra fingerens hastighed og en kritisk dæmpet fjeder, der kan gribes igen midt i bevægelsen.
- Fortryd ved Godkend og Afvis (8 sekunder, knap i beskeden eller Ctrl/Cmd + Z – kun seneste handling).
- Beskeder kan nu ses og klikkes oven på modale dialoger (fx fejringen).

### Test og dokumentation
- `e2e.cjs` finder `index.html` ved siden af sig selv, kan køre mod en lokal server og har ca. 135 tjek (bl.a. swipe, touch, Fortryd, `TEAM_DATA`, `?udkast=1`, `?demo=1`, QR, A4 på én side, scenarier, konkurrence, pitch, kontrast og layout).
- README med afsnit om `TEAM_DATA` og tjekliste, ny `PITCH.md` med manuskript og spørgsmål, og ny `DESIGN-AUDIT.md`.

## Version 2 – oktober 2026 (forberedelse til Business Mind Programme)

### Fejlrettelser
- Feedbackbeskeder (fx "Forespørgslen er sendt") vises nu som toast med `aria-live` – før blev de overskrevet med det samme af statuslinjen.
- Ved godkendelse tjekkes pointloftet mod indsendelsens egen dato i stedet for i dag.
- Cooldown-nedtællingen starter igen efter genindlæsning og ved klasseskift.
- Udfordringskortene bygges ikke længere om hvert sekund, så tastaturfokus ikke forsvinder.
- Ventende indsendelser fra tidligere dage vises med alder og kan godkendes eller afvises samlet.
- `prompt()` og `alert()` er erstattet af et rigtigt lærerdashboard og en bekræftelsesdialog.
- Klasseligaen viser ikke længere den valgte klasse to gange.
- En afvist udfordring kan ikke sendes igen samme dag.
- Robusthed: ødelagte rækker i gemte data springes over, titel og point hentes fra koden, et ur, der er stillet tilbage, kan ikke låse klassen, og flere faner holdes synkrone.

### Data
- Ny datastruktur under `groklassen-v2`. Data fra `groklassen-v1` flyttes automatisk over, og den gamle nøgle bevares som backup.
- Demo-data gemmes separat (`groklassen-demo`), så klassens rigtige data aldrig røres.

### Værditilbud
- Ny hero-tekst: problem, løsning og målgruppe.
- Introduktion i 3 trin første gang (kan springes over og åbnes igen).
- Fejring med animation, når planten når et nyt stadie (respekterer reduceret bevægelse).

### Kundeperspektiv
- Lærerdashboard bag demo-PIN: Godkend/Afvis pr. række, "Godkend alle fra i dag", graf over point pr. uge, CSV-eksport og print-venlig ugerapport.
- Klassens ugemål og en klasseliga, der starter forfra hver mandag – aldrig enkelte elever.
- Tre nye udfordringer: Plantebaseret frokost, Byt eller køb brugt, Sluk skærme og opladere.

### Aktivitetsperspektiv og økonomi
- Ny side "For skoler": tre roller, prisskitse (hypoteser), økonomiberegner med break-even, Business Model Canvas farvekodet efter BMP's fire perspektiver, mulige partnere og kanaler, ærlig sammenligning med alternativer og næste skridt.
- Holdets pladsholdere er samlet i `TEAM_DATA` og vises med gult.

### Bæredygtighed
- CO₂- og vandtal er genberegnet forsigtigt (fx lys 0,4 kg → ca. 10 g, cykel 1,2 kg → ca. 400 g) med antagelse, udregning, kilder og faktatjek for hver udfordring i "Sådan har vi regnet".
- Bæredygtighed på tre niveauer, verdensmål, "appen selv er let", tilgængelighed og inklusion samt ingen persondata vises i appen.

### Præsentation
- Demo-tilstand (`?demo=1`) med 6 ugers tydeligt mærkede eksempeldata og "Nulstil demo".
- Præsentationstilstand (`?pitch=1`) i 6 trin med piletaster, swipe og fuld skærm.
- Testet ved 375, 768 og 1280 px i lys og mørk tilstand, offline og som fil.

### Tilgængelighed
- Synlig fokusring med god kontrast, "Spring til indhold", labels på alle felter, unikke knapnavne, tabelvisning af grafer, kontrast tjekket i begge temaer.

### Dokumentation
- `README.md` opdateret, ny `PITCH.md` og ny `CHANGELOG.md`.
- Valgfri browsertest i `tests/e2e.cjs` (54 tjek).

## Version 1
- Første prototype med seks udfordringer, plante i fem stadier, demo-liga, lys/mørk tilstand og lærerområde med PIN.
