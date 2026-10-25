# GroKlassen

> **Bæredygtige vaner forsvinder, når ingen kan se dem.** GroKlassen gør dem synlige: Eleverne registrerer små grønne handlinger, læreren godkender, og klassens fælles plante vokser – helt uden persondata.

GroKlassen er en prototype lavet af et gymnasiehold til Business Mind Programme (BMP) 2026 hos Fonden for Entreprenørskab. Det er en første idé til en forretningsmodel – ikke en færdig virksomhed.

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
- "Sådan har vi regnet": antagelse, udregning, kilder og faktatjek for hver udfordring.
- Klassens plante i fem stadier – med fejring og animation, når den vokser (respekterer "reduceret bevægelse").
- Klassens ugemål, som klassen selv sætter (5–75 point).
- Klasseliga mellem klasser – aldrig elever. Starter forfra hver mandag.
- Introduktion i 3 trin første gang (kan springes over og åbnes igen via "Sådan virker det").

**For skoler (`#skoler`)** – mini-salgsside og pitch-støtte
- Problem, løsning og det nye · tre roller · prisskitse (hypoteser) · økonomiberegner med break-even og graf · Business Model Canvas farvekodet efter BMP's fire perspektiver · mulige partnere og kanaler · ærlig sammenligning med alternativer · bæredygtighed på tre niveauer · næste skridt.

**Lærer (`#laerer`, demo-PIN `1234`)**
- Ventende indsendelser med alder, Godkend/Afvis pr. række, "Godkend alle fra i dag" og samlet behandling af ældre.
- Graf over godkendte point pr. uge (med tabelvisning).
- Eksport som CSV (åbner i Excel) og print-venlig ugerapport med spørgsmål til en klassesamtale.
- Indlæs/nulstil demo-data og nulstil klassens egne data.

**Til pitchen**
- **Demo-tilstand:** knappen "Prøv med demo-data" eller `index.html?demo=1`. Indlæser 6 ugers opdigtede eksempeldata, tydeligt mærket "DEMO". Demo-data gemmes for sig, så klassens rigtige data aldrig røres. "Nulstil demo" gendanner udgangspunktet med det samme.
- **Præsentationstilstand:** knappen "▶ Pitch" eller `index.html?pitch=1`. Seks trin (Problem → Løsning/demo → Kunder → Forretningsmodel → Bæredygtighed → Næste skridt). Styres med piletaster, swipe, trinknapper og `F` for fuld skærm. `Esc` lukker.
- Kombinér dem: `index.html?demo=1&pitch=1`.
- Demo-klassen 7.A står på 178 point – 2 point fra "Stort træ". Den første godkendelse i demoen får planten til at vokse.

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

**Holdet skal faktatjekke tallene før pitchen** – se den gule "Til faktatjek"-note ved hver udfordring.

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

Økonomiberegnerens antagelser (kan ændres i appen og i `CALC_DEFAULTS` i koden): 25 skoler, 1.500 kr. pr. licens, 150 kr. variable omkostninger pr. skole, hosting 4.000 kr., support 6.000 kr. og udvikling 20.000 kr. pr. år. Faste omkostninger 30.000 kr. → **break-even ved ca. 23 skoler**.

Referencepriser (set 25.10.2026 – faktatjek): Grøn Skole/Grønt Flag 3.600 kr./år for en grundskole, Klimakampen 500 kr. pr. klasse pr. 4-ugers kampagne, Gyldendals fagportaler ca. 1.300 kr. pr. klasse pr. år.

**Priser og betalingsvilje skal valideres gennem interviews og pilotforsøg.** Partnere på "For skoler"-siden er mulige partnere – der er ingen aftaler.

## 8. Bæredygtighed på tre niveauer

- **Miljømæssigt:** synlige grønne vaner inden for transport, mad, affald, forbrug og energi – med ærlige, åbne tal.
- **Socialt:** klassen arbejder mod ét fælles mål. Ingen elev bliver målt, rangeret eller udstillet. Mange forskellige udfordringer, så alle kan bidrage.
- **Økonomisk:** en lille, billig app, hvor en skolelicens skal betale drift og udvikling.
- **Verdensmål:** 4.7, 12 og 13.
- **Appen selv er let:** én fil, ingen tracking, ingen server i prototypen, virker offline.

## 9. Holdets egne data – udfyld før pitchen

Øverst i `<script>` i `index.html` ligger `TEAM_DATA`. Alt, der står i `[INDSÆT: …]`, `[VALIDÉR: …]` eller `[FAKTATJEK: …]`, vises med gult i appen og i pitch-tilstanden. Ret teksten ét sted, så opdateres alle steder. **Skriv kun det, I faktisk har undersøgt.** Se også tjeklisten i `PITCH.md`.

## 10. Sådan kører du appen lokalt

1. Download eller kopiér filen `index.html` til en mappe på din computer.
2. Dobbeltklik på `index.html`.
3. Filen åbner i din browser. Du behøver ikke installere noget eller have internet.

Hvis browseren blokerer enkelte funktioner ved åbning af en lokal fil, kan du prøve en anden browser eller køre filen via en lokal webserver. GitHub Pages kører den som en almindelig webside.

## 11. Sådan lægger du appen på GitHub og udgiver med GitHub Pages

### A. Opret et repository

1. Gå til [github.com](https://github.com/) og log ind eller opret en konto.
2. Klik på **+** øverst til højre, og vælg **New repository**.
3. Skriv fx `groklassen` som **Repository name**.
4. Vælg **Public**, hvis alle skal kunne se projektet.
5. Du kan markere **Add a README file**, men det er ikke nødvendigt, hvis du uploader din egen README.
6. Klik på **Create repository**.

### B. Upload filerne

1. Åbn dit nye repository.
2. Klik på **Add file** og vælg **Upload files**.
3. Træk `index.html`, `README.md`, `PITCH.md` og `CHANGELOG.md` ind i uploadfeltet.
4. Skriv fx `Tilføj GroKlassen prototype` i feltet **Commit changes**.
5. Klik på **Commit changes**.

Filerne skal ligge direkte i roden af repository'et – ikke i en ekstra undermappe. Filen skal hedde præcis `index.html`. Mappen `.historik` og mappen `tests` behøver du ikke uploade.

### C. Aktivér GitHub Pages

1. Åbn repository'et, og klik på **Settings**.
2. Vælg **Pages** i menuen til venstre. Det kan stå under afsnittet **Code and automation**.
3. Find **Build and deployment**.
4. Under **Source** vælger du **Deploy from a branch**.
5. Under **Branch** vælger du `main` og mappen `/(root)`.
6. Klik på **Save**.
7. Vent et par minutter, og genindlæs siden **Settings → Pages**. GitHub viser adressen til din udgivne side dér.

Adressen vil normalt ligne `https://DIT-GITHUB-NAVN.github.io/groklassen/`. Til pitchen kan du bruge `…/groklassen/?demo=1&pitch=1`. Hvis du ændrer filerne senere, uploader du de nye versioner og laver et nyt commit; GitHub Pages udgiver ændringerne automatisk.

**Bemærk:** GitHub Pages må ikke bruges til at drive en kommerciel tjeneste. Det er fint til prototypen, men en betalt version skal flyttes til en anden hosting.

## 12. Test (valgfrit)

Mappen `tests` indeholder en automatisk browsertest (`tests/e2e.cjs`), der tjekker hele flowet, fusk-reglerne, migrering, offline-brug, tastatur og layout ved 375, 768 og 1280 px i lys og mørk tilstand. Den kræver Node.js og Playwright – se kommentaren øverst i filen. Appen virker fint uden.

## 13. Videreudvikling

- Supabase eller lignende (i en EU-region) til lærerlogin og fælles klassedata på tværs af enheder.
- Servervalidering af pointloft, cooldown og godkendelse.
- Rigtige klassekonti og en fælles liga.
- Faktatjek af CO₂-tal med en fagperson og mulighed for lokale tal (fx egen varmeforsyning).
- Databehandleraftale og privatlivsvurdering, før appen bruges med rigtige skoler.

## 14. Licens og kontakt

**Licens:** Ingen open source-licens er valgt endnu. Vil I tillade andre at genbruge koden, kan I vælge fx MIT og tilføje en `LICENSE`-fil.

**Kontakt:** [INDSÆT: projektets kontaktoplysninger – fx en fælles hold-mail, ikke private oplysninger]
