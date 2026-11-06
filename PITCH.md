# Pitch-manuskript – GroKlassen

Business Mind Programme, 10. eller 26. november 2026 · **4 minutters pitch + 4 minutters spørgsmål** for tre dommere.
Dommerne bedømmer forretningsmodellen ud fra Business Model Canvas (værditilbud, kundeperspektiv, aktivitetsperspektiv og økonomi), præsentationen og bæredygtighed.

> **Vigtigt:** Sig kun det, I faktisk har undersøgt. Står der en reservetekst i appen (fx "Vi er i gang med at interviewe lærere"), så sig det samme højt. Opfind aldrig interviews, citater, brugertal, pilotresultater, sponsorer eller aftaler – dommerne spørger ind til dem.

## Før pitchdagen – tjekliste

- [ ] Udfyld `TEAM_DATA` øverst i `app.js` (se tjeklisten i [README](README.md#tjekliste-over-alle-felter)). `interviewFinding` vises på trin 1, `interviewsTeachers` på trin 3 og `willingnessToPay` på trin 4. Tomme felter skjules.
- [ ] Åbn `index.html?pitch=1`, og gå alle 6 trin igennem: alt, der står, skal I kunne stå inde for.
- [ ] Faktatjek CO₂-tallene, referencepriserne og reglerne for sponsorering i folkeskolen og markedsføringslovens regler om børn.
- [ ] Upload alle filerne til GitHub (`index.html`, `app.js`, `app.css`, `manifest.json`, `sw.js` og mappen `icons/`), og vent på, at GitHub Pages er opdateret.
- [ ] **Scan QR-koden** på sidste trin og bag "Del" med to forskellige telefoner. Den skal åbne den udgivne side med en DEMO-mærket demo.
- [ ] Print A4-oversigten (For skoler → "Print A4-oversigt") i 3–4 eksemplarer – én til hver dommer.
- [ ] Print evt. også et eksempel på månedens nyhedsbrev (Lærer → Månedens nyhedsbrev), hvis I vil vise sponsoridéen.
- [ ] Øv med stopur. 6 trin på 4 minutter er ca. 40 sekunder pr. trin – trin 2 med live-demo må gerne tage lidt længere.
- [ ] Hav en reserve: åbn `index.html` direkte som fil på computeren (virker uden internet) og hav A4-PDF'en klar.

**Adresse til pitchen:** `…/GroDinklasse/?demo=1&pitch=1` – starter en frisk demo og åbner præsentationen. `F` = fuld skærm, piletaster = næste/forrige, `Esc` = luk. Hvert trin har et **talepapir**, der kan foldes ud nederst.

## De 6 trin (ca. 4 minutter)

Hvert trin viser øverst, hvilket perspektiv det dækker (samme farver som på "For skoler").

### 1 · Problemet – *BMC: Værditilbud* (ca. 30 sek.)
- Start med et genkendeligt billede: temaugen om klima – og ugen efter, hvor meget er glemt.
- "Bæredygtige vaner forsvinder, når ingen kan se dem."
- Har I interviewet lærere, så sig det vigtigste fund (`interviewFinding`).

### 2 · Løsningen – *BMC: Værditilbud* (ca. 60 sek. inkl. demo)
- Tre trin: eleven registrerer → læreren godkender → planten vokser.
- Det, der gør os anderledes: ét fælles klassemål (ingen elevranglister), lærergodkendelse, åbne CO₂-beregninger og ingen persondata.
- **Live-demo (20–30 sek.):** klik "Prøv live-demoen" → gå til fanen Lærer (PIN `1234`) → klik "Godkend" på en af de ældre indsendelser. Demo-klassen 7.A står på 178 point, så planten vokser til "Stort træ" med en fejring. Kommer I til at trykke forkert, kan I klikke **Fortryd** i beskeden nederst (eller trykke Ctrl/Cmd + Z). Åbn pitchen igen med "▶ Pitch" (den starter på trin 1), og klik på trinknappen **3** for at fortsætte.

### 3 · Kunden og vejen til kunden – *BMC: Kundeperspektiv* (ca. 30 sek.)
- Eleven bruger den, læreren driver den, skolen køber en årlig licens.
- Vejen: lærer → pilotklasse → skoleledelse → kommune. "Kommunerne er vores vej til mange skoler på én gang."

### 4 · Forretningen – *BMC: Økonomi* (ca. 45 sek.)
- Gratis prøve → skolelicens (ca. 1.500 kr./år) → kommuneaftale (fra ca. 12.000 kr./år for op til 10 skoler) – plus sponsoraftaler.
- Tallene kommer fra økonomiberegneren (mærket "Scenarie"). Forventet: ca. 64.500 kr. om året og **break-even ved 5 skoler + 1 kommuneaftale + 1 sponsoraftale** – uden sponsorer 15 skoler.

### 5 · Bæredygtighed – *bedømmes også* (ca. 35 sek.)
- Miljø (vaner inden for transport, mad, affald og energi), socialt (ét fælles mål, ingen elev udstilles) og økonomi (licensen finansierer driften).
- At cykle sparer ca. 400 g CO₂, at slukke lyset ca. 10 g – tallene er forsigtige skøn med åben beregning.
- Verdensmål 4.7 · 12.5 · 12.8 · 13.3.

### 6 · Næste skridt og invitation – *BMC: Aktivitetsperspektiv* (ca. 30 sek.)
- Pilot med 3 klasser i 4 uger: gentagen brug, lærerens tidsforbrug og elevernes oplevelse. Derefter test af prisen og version 2 med lærerlogin og database i EU.
- Slut med jeres opfordring (`pitchAsk`), og peg på QR-koden: "Scan og prøv demoen selv."
- Ræk A4-oversigten til dommerne.

## De 4 minutters spørgsmål – forbered jer på

| Spørgsmål | Svar-retning (brug jeres egne, rigtige data) |
|---|---|
| **"Hvem er jeres sponsorer?"** | **Ingen endnu.** Vi har ikke kontaktet nogen, og ingen har sagt ja. Under For skoler står en liste over *mulige* sponsorer – landsdækkende virksomheder, hvis bæredygtighedsarbejde passer til udfordringerne – mærket "IKKE KONTAKTET". Sponsoraftalen i beregneren er et regneeksempel. |
| **"Har I talt med Coop, Ørsted eller de andre?"** | Nej. Listen viser, hvem vi vil undersøge – ikke aftaler. Mange af dem støtter via fonde (fx Salling Fondene eller VELUX FONDENE), så det kan også være en vej. |
| **"Hvad hvis skolerne ikke vil betale?"** | Så holder modellen ikke – det er derfor, vi vil teste betalingsviljen i pilotforsøget. Sponsorer kan supplere, men de er usikre og kan ikke alene bære driften. Vis det live: sæt "Sponsoraftaler" til 0 – så er break-even 15 skoler + 1 kommuneaftale. |
| **"Er det ikke reklame til børn?"** | Nej. Sponsorer ses kun i nyhedsbrevet til de voksne (lærere, skoleledelse og forældre) – aldrig i elevernes udfordringer. Ingen tilbud, rabatkoder eller produktreklame. Sponsoren kan ikke ændre indhold eller tal, får ingen data, og læreren kan slå sponsorafsnittet fra. (Faktatjek reglerne for sponsorering i folkeskolen og markedsføringsloven før pitchen.) |
| **"Hvem betaler for jeres tid?"** | I prototypefasen arbejder vi frivilligt – derfor er løn 0 kr. i beregneren. Vis det live: skriv fx 150.000 kr. i "Løn til drift og udvikling". Så stiger break-even i det forventede scenarie til 116 skoler (med 1 kommune- og 1 sponsoraftale). Derfor er kommuneaftaler vigtige: én aftale dækker op til 10 skoler. |
| **"Er priserne realistiske?"** | De er hypoteser. Vis de tre scenarier (forsigtig 38 skoler, forventet 5 skoler + 1 kommuneaftale + 1 sponsoraftale, optimistisk 0 skoler med 3 kommuneaftaler + 3 sponsoraftaler) og tallet uden sponsorer. Referencepriser: Grøn Skole/Grønt Flag, Klimakampen og fagportaler. Næste skridt er at teste 1.000, 1.500 eller 3.000 kr. med skoleledere. |
| **"Hvad med konkurrenterne?"** | Alternativerne er papirskemaer, temauger, kampagner og andre apps (fx Klimakampen eller Grønt Flag). GroKlassen kører hele skoleåret, med lærergodkendelse og kun data på klasseniveau – og kan supplere et grønt skoleprogram, ikke erstatte det. Vi påstår ikke, at vi er de eneste. |
| **"Hvordan undgår I snyd?"** | Én gang pr. udfordring pr. dag, højst 15 point om dagen, 10 sekunders pause, og læreren godkender alt. Ærligt: i prototypen ligger data i browseren, så en rigtig konkurrence kræver en server. |
| **"Hvad med GDPR?"** | Ingen elevnavne og ingen persondata – alt er på klasseniveau. Nyhedsbrevet indsamler ingen e-mails: læreren printer det eller kopierer det til Aula. En senere tilmelding eller lærerlogin kræver samtykke, en databehandleraftale og en GDPR-vurdering. |
| **"Er CO₂-tallene rigtige?"** | Det er forsigtige skøn med åben udregning og kilder ("Sådan har vi regnet"), og usikkerhederne står ved hvert tal. De bliver faktatjekket af `factChecker`. |
| **"Har I talt med kunder?"** | Svar kun med det, I har gjort (`interviewsTeachers`, `feedbackUsed` – vises under Næste skridt). Har I ikke, så sig, hvornår og hvordan I gør det. |
| **"Er konkurrencen rigtig?"** | Nej, den er et fiktivt eksempel og mærket sådan i appen. Der er ingen sponsor endnu. |

## Hvis noget går galt

- **Ingen internet:** åbn `index.html` direkte fra computeren – alt virker uden internet (installation som app kræver HTTPS). Tilføj `?demo=1&pitch=1` i adresselinjen.
- **Demoen er rodet efter øvning:** klik "Nulstil demo" i det gule banner.
- **Pitch på tablet eller telefon:** stryg til venstre/højre – trinnet følger fingeren, og et lille kast er nok til at skifte trin.
- **Projektoren viser forkert størrelse:** pitchen tilpasser sig skærmen. Brug `F` for fuld skærm, eller luk og åbn igen med "▶ Pitch".
- **Den gamle version vises efter upload:** appen viser "En ny version er klar" – klik "Opdatér". Ellers: genindlæs siden to gange.
