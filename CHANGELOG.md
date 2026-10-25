# Ændringslog

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
