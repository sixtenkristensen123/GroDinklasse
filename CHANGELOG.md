# Ændringslog

## Version 3.5 – 5. november 2026 (sponsoraftaler, nyhedsbrev og en slankere "For skoler"-side)

Bygger videre på den opdelte app fra den forrige upload (`index.html`, `app.js`, `app.css`, `manifest.json`, `sw.js` og `icons/`, der kan installeres som app).

### Tekst og pitch
- **Pitchen har 6 trin:** Problemet, Løsningen (med live-demo og det, der gør os anderledes), Kunden og vejen til kunden, Forretningen, Bæredygtighed og Næste skridt med invitation og QR-kode. Trinnene "Hvorfor os?" og "Beviset mangler endnu" er lagt ind i de andre.
- **Ingen pladsholdere:** `?udkast=1`, udkast-banneret, de gule pladsholdere og noterne til holdet er fjernet. Et tomt felt i `TEAM_DATA` skjuler nu linjen, hvor feltet bruges. Undtagelser er `ideaOrigin`, `teamName`, `contact`, `pitchAsk` og `publicUrl`, der viser en standardtekst.
- **Sikker tone:** undskyldende formuleringer er fjernet eller omskrevet. Eksempler: "Usikkerhed:" ved CO₂-tallene, "Priser og tal er beregnede scenarier." og "Partnere/Sponsorer vi vil kontakte". Mærkatet "Scenarie" står fortsat ved økonomitallene, og demoen er stadig mærket som eksempeldata.

### Økonomi med sponsoraftaler
- Ny indtægtskilde i økonomiberegneren: **sponsoraftaler** (antal 0–20 og pris pr. aftale, hypotese 15.000 kr./år) og en ny omkostning pr. sponsoraftale (hypotese 1.000 kr. til nyhedsbrev og rapportering). Skolelicenser og kommuneaftaler er uændrede.
- Scenarierne: forsigtig 0 sponsorer (break-even 38 skoler), forventet 1 sponsor (5 skoler + 1 kommuneaftale + 1 sponsoraftale) og optimistisk 3 sponsorer (0 skoler + 3 kommuneaftaler + 3 sponsoraftaler). Alle mærket som antagelser.
- Sponsorindtægten indgår i samlet indtægt, resultat, fordelingsteksten, tabellen (ny kolonne "Heraf sponsorer"), grafen (stiplet linje "Faste aftaler") og break-even. Beregneren, pitchtrinnet "Forretningen" og A4-oversigten viser også **break-even uden sponsorer** (15 skoler i det forventede scenarie).
- Ny note: "Sponsorindtægter er usikre og kan ikke alene bære driften. Sponsorer har ingen indflydelse på udfordringer eller CO₂-tal."

### Mulige sponsorer og sponsorniveauer
- Ny sektion **Sponsorer vi vil kontakte** (`#skoler-sponsorer`), mærket IKKE KONTAKTET: Coop Danmark, Salling Group, Ørsted, Danfoss, Grundfos, DSB og VELUX – kun navn og én neutral linje, ingen logoer eller varemærker. Tjekket 5.11.2026. Note om virksomhedsfonde.
- Sponsorniveauer i prisskitsen (hypoteser): Støtter ca. 5.000 kr., Partner ca. 15.000 kr. og Hovedsponsor ca. 40.000 kr. pr. år (`SPONSOR_LEVELS`).

### Månedens nyhedsbrev
- Lærerområdet har et nyt kort **📰 Månedens nyhedsbrev**: et nyhedsbrev for den valgte klasse og måned med point, plantestadie, mest brugte udfordringer, uger med ugemålet nået og vejledende CO₂ – kun klasseniveau.
- Kan printes / gemmes som PDF (samme printmotor som ugerapporten, én side) eller kopieres som tekst til Aula. Ingen tilmelding og ingen e-mails.
- Sponsoreksponering efter niveau: hovedsponsor ("Støttet af" + "Månedens grønne tip fra …"), partner (tippet + navnet nederst) og støtter ("Tak til"-linjen). Læreren kan slå sponsorafsnittet fra. Navnet kommer fra `TEAM_DATA.sponsor` – er feltet tomt, står der "[Jeres sponsor]" med mærkatet "Eksempel · fiktiv sponsor".
- Ny sektion **Månedens nyhedsbrev** (`#skoler-nyhedsbrev`) med regler for sponsorer og et eksempel med demo-data, hvor man kan skifte mellem de tre niveauer.

### En slankere "For skoler"-side
- Fjernet: Problemet og løsningen, Tre roller, Mulige partnere og kanaler, Alternativer og Bæredygtighed på tre niveauer. Business Model Canvas, prisskitsen og Næste skridt er bevaret (Canvas har fået en linje om sponsorer og nyhedsbrev).
- Ny kort sektion **FN's verdensmål, vi bidrager til** (`#skoler-verdensmaal`) med 4.7, 12.5, 12.8 og 13.3. På elevsiden er "Bæredygtighed på tre niveauer" erstattet af én linje om verdensmålene.
- Hoppe-navigationen: Priser, Økonomi, Sponsorer, Nyhedsbrev, Forretningsmodel, Verdensmål, Næste skridt.
- `TEAM_DATA`-felterne `ideaOrigin`, `feedbackUsed` og `nameCheck` er **bevaret og flyttet**: `ideaOrigin` vises nu øverst på "For skoler", `feedbackUsed` og `nameCheck` under Næste skridt. README-tjeklisten er uændret.
- `#appSize` og målingen af filstørrelsen er fjernet sammen med sektionen.
- A4-oversigten er stadig én side: verdensmål i stedet for bæredygtighed, sponsorniveauer i prisskitsen og sponsorer i break-even.

### Rettelser og test
- Swipe i pitchen: et lynhurtigt stryg, hvor browseren slår bevægelserne sammen, skifter nu også trin.
- `e2e.cjs` har 175 tjek (alle består): sponsorfelter og scenarier, break-even med og uden sponsorer, nyhedsbrevet (print, kopiér, sponsorafsnit til/fra, eksempel-mærkat, niveauer), verdensmål og at de fjernede sektioner er væk. Pitchtjekkene forventer nu 6 trin, og mobiltjekket "over folden" følger det nye layout (overskrift, trin og "Registrér en handling").
- `sw.js` har fået et nyt versionsnavn, så installerede enheder henter den nye version.

## Version 3.4 – 3. november 2026 (Apple-design-lag)

Nyt udseende og ny bevægelse efter skillen *apple-design*. **Alt indhold og al logik er uændret** – laget ligger i `<style id="apple-design">` og `<script id="apple-motion">` og kan fjernes igen uden at noget går i stykker. Alle 134 browsertests i `e2e.cjs` består.

### Udseende
- Rolige systemgrå flader med GroKlassens grønne som accent i både lys og mørk tilstand.
- Kort uden hårde kanter: dybde fra blød skygge, større hjørneradius og grupperede flader for rækker (udfordringer, liga, prisniveauer, BMC-felter).
- Knapper som kapsler med tonet flade; den primære handling er fyldt grøn.
- Typografi efter størrelse: tæt linjeafstand og negativ tracking på store overskrifter, balancerede linjeskift, tabeltal i nøgletal.

### Bevægelse og materialer
- Fanerne er en segmenteret kontrol med en markør, der glider til den valgte fane som en kritisk dæmpet fjeder. Den kan afbrydes og vendes midt i bevægelsen.
- Fanerne bliver hængende øverst, når man ruller. Bag dem toner et gennemsigtigt materiale (blur) frem, kun når indhold ruller ind under dem.
- Skift mellem faner: det nye indhold kommer en smule fra den side, fanen ligger.
- Fremdriftsbjælker animeres med `transform` (fjeder) i stedet for `width`.
- Dialoger vokser frem fra knappen, der åbnede dem, og går samme vej tilbage.
- På mobil (≤ 600 px) er dialogerne ark nedefra med et håndtag. Arket følger fingeren 1:1, giver elastisk modstand opad og lukker ved et kast eller et langt træk (Apples momentum-projektion). Ellers fjedrer det tilbage.
- Beskeder (toasts) er en mørk kapsel af materiale.

### Tilgængelighed
- Reduceret bevægelse: kun korte krydstoninger. Reduceret gennemsigtighed: solide flader. Højere kontrast: kanter vises igen.

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
