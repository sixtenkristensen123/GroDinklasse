# GroKlassen

## 1. Hvad er GroKlassen?

GroKlassen er en bæredygtigheds-app til skoleklasser. Eleverne registrerer små grønne handlinger, og klassen samler point til en fælles plante. Appen gør bæredygtighed konkret, social og motiverende i hverdagen.

Problemet, GroKlassen forsøger at løse, er, at bæredygtige valg kan være svære at fastholde, hvis de ikke bliver synlige. En fælles score og en plante i udvikling gør klassens indsats lettere at følge.

## 2. Funktioner

- Seks grønne udfordringer, fx cykling, affaldssortering og reparation.
- Point samt vejledende CO₂- og vandbesparelser.
- En SVG-plante, der udvikler sig gennem fem stadier.
- Demo-klasseliga, så konceptet kan vises frem.
- Lys og mørk tilstand.
- Lærerområde med PIN-kode til godkendelse eller afvisning.
- Responsivt design til mobil, tablet og computer.
- Data gemmes lokalt i browseren.

## 3. Sådan virker point- og plantesystemet

Hver udfordring giver et bestemt antal point. Når eleven sender en udfordring, bliver den først lagt i kø som **afventer**. Den tæller først med i klassens samlede point, når læreren godkender den.

| Plantestadie | Samlet antal godkendte point |
|---|---:|
| Frø | 0 |
| Spire | 20 |
| Lille plante | 50 |
| Ungt træ | 100 |
| Stort træ | 180 |

CO₂- og vandbesparelserne i prototypen er illustrative estimater. De varierer i virkeligheden efter blandt andet transportform, energikilde, produkt og lokale forhold. De bør ikke præsenteres som dokumenterede målinger.

## 4. Fusk-beskyttelse

Prototypen har fire enkle regler:

1. **Én registrering pr. udfordring pr. dag pr. klasse.** Når en udfordring er indsendt eller godkendt, kan den ikke indsendes igen samme dag for den valgte klasse.
2. **Dagligt pointloft på 15 point pr. klasse.** Både ventende og godkendte indsendelser tæller med i kontrollen af, om en ny indsendelse passer inden for loftet.
3. **Lærergodkendelse.** Indsendelser tæller først med, når en lærer godkender dem. Standard-PIN er `1234` og kan ændres i toppen af JavaScript-koden i `index.html`.
4. **Cooldown på 10 sekunder.** Der skal gå mindst 10 sekunder mellem indsendelser fra samme klasse i denne browser.

**Vigtig begrænsning:** Dette er en prototype, ikke et sikkert kontrolsystem. Data gemmes i browserens `localStorage`, og både data og PIN-kode kan manipuleres af en bruger, der kan ændre browserdata eller læse kildekoden. Reglerne gælder derfor kun som enkel demo-beskyttelse i den aktuelle browser. Forskellige enheder deler ikke data. Brug en serverbaseret løsning med login, database og servervalidering, før appen bruges i en rigtig skolekonkurrence.

## 5. Sådan kører du appen lokalt

1. Download eller kopiér filen `index.html` til en mappe på din computer.
2. Dobbeltklik på `index.html`.
3. Filen åbner i din browser. Du behøver ikke installere biblioteker eller starte en server.

Hvis browseren blokerer enkelte funktioner ved åbning af en lokal fil, kan du prøve en anden browser eller køre filen via en lokal webserver. GitHub Pages kører den som en almindelig webside.

## 6. Sådan lægger du appen på GitHub og udgiver med GitHub Pages

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
3. Træk `index.html` og `README.md` ind i uploadfeltet.
4. Skriv fx `Tilføj GroKlassen prototype` i feltet **Commit changes**.
5. Klik på **Commit changes**.

Begge filer skal ligge direkte i roden af repository'et — ikke i en ekstra undermappe. Filen skal hedde præcis `index.html`.

### C. Aktivér GitHub Pages

1. Åbn repository'et, og klik på **Settings**.
2. Vælg **Pages** i menuen til venstre. Det kan stå under afsnittet **Code and automation**.
3. Find **Build and deployment**.
4. Under **Source** vælger du **Deploy from a branch**.
5. Under **Branch** vælger du `main` og mappen `/(root)`.
6. Klik på **Save**.
7. Vent et par minutter, og genindlæs siden **Settings → Pages**. GitHub viser adressen til din udgivne side dér.

Adressen vil normalt ligne `https://DIT-GITHUB-NAVN.github.io/groklassen/`. Brug den præcise adresse, som GitHub viser. Hvis du ændrer filerne senere, uploader du de nye versioner og laver et nyt commit; GitHub Pages udgiver ændringerne automatisk.

## 7. Forretningsmodel og bæredygtighed

### Forretningsmodel: skolelicenser

GroKlassen kan på sigt tilbydes som en årlig licens til skoler. En gratis prøveversion kan introducere konceptet, mens en betalt skolelicens kan give adgang til flere klasser, lærerdashboard, rapporter, fælles liga, elevadministration og support.

Mulige indtægtskilder:
- Årlig licens pr. skole eller pr. klasse.
- Betalte udvidelser med rapporter og undervisningsmateriale.
- Partnerskaber med kommuner eller organisationer, der arbejder med bæredygtighed.

Priser og betalingsvillighed skal undersøges gennem interviews og pilotforsøg med skoler, før en forretningsmodel fastlægges.

### Bæredygtighed på tre niveauer

- **Miljømæssigt:** Appen kan gøre miljøvenlige valg mere synlige og motivere til vaner, der potentielt reducerer ressourceforbrug og udledning.
- **Socialt:** Klassen arbejder mod et fælles mål, hvilket kan styrke samarbejde, ansvar og samtaler om bæredygtighed. Konkurrencen bør indrettes, så den inkluderer alle elever.
- **Økonomisk:** Skolelicenser kan finansiere drift og videreudvikling. For skoler kan løsningen være et redskab i undervisningen, men den økonomiske værdi skal dokumenteres gennem afprøvning.

## 8. Videreudvikling

Næste version kan bygges videre med:

- **Supabase** til login, database og fælles klassedata på tværs af enheder.
- **Lærerdashboard** til at oprette klasser, invitere elever, godkende handlinger og følge udviklingen.
- Serverbaseret validering af daglige grænser og cooldown, så reglerne ikke alene afhænger af browseren.
- Rigtige klassekonti og en fælles liga med dokumenterede resultater.
- Bedre dokumentation af CO₂- og vandestimater samt mulighed for at tilpasse beregningerne til lokale forhold.
- Privatlivs- og databeskyttelsesvurdering, før appen anvendes med børn og elever.

## 9. Licens og kontakt

**Licens:** Ingen særlig open source-licens er valgt endnu. Hvis du vil tillade andre at genbruge og ændre koden, kan du vælge en licens, fx MIT, og tilføje en `LICENSE`-fil. Undlad at angive en licens, før du har besluttet, hvilke rettigheder andre skal have.

**Kontakt:** Tilføj navn, e-mail eller projektets kontaktoplysninger her, når de er klar.
