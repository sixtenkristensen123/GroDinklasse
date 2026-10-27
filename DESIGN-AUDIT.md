# Designgennemgang efter "apple-design"

Gennemgang af GroKlassen (`index.html`) ud fra skillen *apple-design*, der oversætter Apples designprincipper fra WWDC-talks til web: respons, direkte manipulation, afbrydelige animationer, rumlig sammenhæng, materialer, reduceret bevægelse, typografi og de otte designprincipper.

Gennemgangen er lavet på skærmbilleder af alle fire visninger og pitch-tilstanden ved 375, 768 og 1280 px i lys og mørk tilstand og ved at læse CSS og JavaScript.

**Kort sagt:** Fundamentet er stærkt: systemfont, ægte lys/mørk-tilstand, respekt for reduceret bevægelse, ærlig feedback og meget fokus på privatliv. De største huller var feedback ved selve trykket, retningen på animationer og enkelte bratte overgange. De små huller er rettet i denne runde. De store står som forslag nedenfor.

## Det, der allerede virker godt

| Princip (skill-afsnit) | Hvor i appen |
|---|---|
| **Ansvar og privatliv** (§16.3) | Ingen persondata, alt på klasseniveau, ingen tracking. Det står tydeligt i footer, CSV og rapport. |
| **Feedback i fire slags** (§16) | Status (dagens point og cooldown pr. udfordring), gennemførelse (toasts), advarsel (pointloft) og fejl (rød toast, forkert PIN). |
| **Handlefrihed og tilgivelse** (§16.2) | Bekræftelsesdialog bruges kun til handlinger, der ikke kan fortrydes: nulstil klasse, afmeld og afvis alle. |
| **Reduceret bevægelse** (§14) | Glid, vækst-animation, faldende blade og toasts slås fra med `prefers-reduced-motion`. Smooth scroll respekterer det også. |
| **Typografi** (§15) | Systemfonten bruges. Tracking følger størrelsen: negativ på store overskrifter (−0,02 til −0,04 em) og positiv på små versaler (+0,05 til +0,08 em). Brødtekst står på 0. |
| **Farver, der tilpasser sig** (§16.7) | Alle farver er CSS-variabler med et mørkt sæt. Grafer følger temaet. QR-koden er altid sort på hvidt, så den kan scannes. |
| **Wayfinding** (§16) | Faner med `aria-current`, springmenu på For skoler, "← Tilbage" på konkurrencesiden og "Spring til indhold". |
| **Delight som resultat** (§16.8) | Planten, der vokser, og fejringen ved et nyt stadie hænger sammen med selve formålet. Det er ikke pynt lagt ovenpå. |

## Rettet i denne runde

1. **Respons ved tryk (§1, §10).** Knapper, faner og springlinks giver nu efter med det samme på pointer-down (`:active` → `scale(.97)` på 100 ms). `touch-action: manipulation` fjerner trykforsinkelsen på mobil. Ved reduceret bevægelse bruges en lille lysændring i stedet for skalering.
2. **Rumlig sammenhæng i pitchen (§7).** Før gled hvert trin ind fra højre, også når man gik tilbage. Nu kommer det næste trin fra højre, og "Forrige" kommer fra venstre.
3. **Toasts forsvinder ad samme vej, som de kom (§7).** De glider ind nedefra og forsvandt før brat. Nu glider de også ud nedad, og ved reduceret bevægelse forsvinder de med det samme.
4. **Ingen brat lysændring ved temaskift (§14).** Skiftet mellem lys og mørk krydstones kort via View Transitions, hvor browseren understøtter det. Ved reduceret bevægelse og i ældre browsere skiftes der med det samme som før.
5. **Dæmp for at fokusere (§12).** Bagtæppet bag dialoger var 80 % næsten sort. Nu er det lidt lettere med en let blur, så man kan se, hvor man kom fra. Med `prefers-reduced-transparency` bliver det solidt.
6. **Højere kontrast efter ønske (§14).** Med `prefers-contrast: more` bliver kanter og hjælpetekst tydeligere i begge temaer.
7. **Respekt for brugerens tekststørrelse (§15).** Brødteksten var låst til `16px`. Nu er den `100 %`, så en større tekststørrelse i browseren slår igennem. Overskrifter har fået tættere linjeafstand (1,25 i stedet for 1,5).
8. **Swipe i pitchen, der følger fingeren 1:1 (§2, §3, §5, §6, §9, §10)** *(tidligere forslag 1)*. Pointer Events med `setPointerCapture` får trinnet til at følge fingeren eller musen efter en dødzone på 10 px. Ved første og sidste trin giver det elastisk modstand (Apples rubber-band-formel). Ved slip regnes fingerens hastighed over de sidste 100 ms om til et kastepunkt (projektion med `0,998`). Ligger det mere end halvvejs ude (højst 280 px), skiftes trin, ellers fjedrer trinnet tilbage. Bevægelsen er en kritisk dæmpet fjeder (damping 1, response 0,35 s), der starter med fingerens hastighed. Ved trinskift glider det gamle trin ud, og det nye fortsætter fra den modsatte side med samme fart. Trinnet kan gribes igen midt i bevægelsen uden at hoppe. Lodrette træk ruller trinnet som før, og ved reduceret bevægelse skifter et stryg blot trin. Knapper i trinnet starter ikke et træk.
9. **Fortryd ved Godkend og Afvis (§16.2)** *(tidligere forslag 2)*. Beskeden efter en godkendelse eller afvisning – også "Godkend alle" og "Afvis alle ældre" – har en Fortryd-knap i 8 sekunder. I lærerområdet virker Ctrl/Cmd + Z også. Kun den seneste handling kan fortrydes, så man ikke ruller flere tilbage på én gang. Er demoen nulstillet i mellemtiden, eller er data ændret i en anden fane, rører Fortryd ikke ved noget. Når læreren låser, forsvinder muligheden.
10. **Beskeder oven på modale dialoger (§13, §16)** *(tidligere forslag 3)*. Er en modal dialog åben (fx fejringen), flyttes beskedområdet ind i dialogen, så beskeden kan ses og "Fortryd" kan klikkes. Fortryd lukker også fejringen. Når dialogen lukker, flyttes området tilbage.

## Forslag til næste runde (prioriteret)

Forslag 1–3 fra første gennemgang er lavet (se punkt 8–10 ovenfor). Numrene herunder er bevaret.

| # | Forslag | Princip | Indsats | Hvorfor |
|---|---|---|---|---|
| 4 | **Validering i feltet frem for ved indsendelse.** Ugemålet (5–75 i spring af 5) og antal elever i konkurrencen valideres i dag først ved indsendelse via toast. Vis hjælpetekst og fejl ved feltet, mens man skriver. | §16 Feedback | Lille | "Validate inline, not on submit." |
| 5 | **Fremdriftsbjælker animeret med `transform: scaleX()` frem for `width`.** | §11 | Lille | `width` udløser layout i hver frame. `transform` køres af compositoren. Det betyder mest på langsomme skole-Chromebooks. |
| 6 | **Dialoger, der "kommer fra" knappen.** Del og Pitch kunne vokse frem fra knappen i headeren (`transform-origin` ved knappen) og forsvinde samme vej tilbage. | §7 | Lille | Så er det tydeligt, hvad der åbnede dialogen. Det er valgfrit, og i dag åbner dialogerne uden animation, hvilket også er i orden. |
| 7 | **Fejringens "pop" (cubic-bézier med overshoot 1,25).** Skillen siger, at overshoot kun hører til, når en bevægelse med momentum gik forud. Her er det et bevidst valg af glæde ved, at planten vokser. Behold det, men overvej en blødere kurve, hvis det føles for legende for lærerne. | §4 | Meget lille | Vurderingssag. Lades uændret indtil videre. |
| 8 | **Konkurrencesiden mangler en aktiv fane.** På `#konkurrence` er ingen fane markeret. Overvej en fjerde fane, når konkurrencen bliver rigtig (`CONTEST.isExample: false`). | §16 Wayfinding | Lille | "Hvor er jeg?" skal altid kunne besvares. Det er bevidst udskudt, mens konkurrencen er et eksempel. |

## Bevidst fravalgt

- **Gennemsigtigt demo-banner (§12 materialer).** Banneret skal kunne ses tydeligt, så ingen forveksler demo-data med rigtige resultater. Klarhed vejer tungere end materialeeffekten, så det forbliver solidt.
- **Lyd og vibration (§13).** Det er en klasseværelsesapp, der ofte kører på en fælles skærm. Lyd ville forstyrre, og vibration giver kun mening på telefoner. Det tilføjer ikke nok til at være det værd ("utility").
- **Spring-bibliotek (Motion/Framer Motion).** Appen skal være én fil uden eksterne biblioteker. Forslag 1 kan laves med en lille spring-funktion i ren JavaScript (`requestAnimationFrame`).
