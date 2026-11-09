# Pitch-manuskript – GroKlassen

Business Mind Programme, 10. november 2026 · **4 minutters pitch + 4 minutters spørgsmål** for tre dommere.
Dommerne bedømmer forretningsmodellen ud fra Business Model Canvas (værditilbud, kundeperspektiv, aktivitetsperspektiv og økonomi), præsentationen og bæredygtighed.

> **Vigtigt:** Holdet har valgt at bygge på tydeligt markerede **forudsætninger** frem for interviews og tests. Sig det ærligt, og opfind aldrig samtaler, citater, eksperter, brugere, skoler eller sponsorer.

## Før pitchen – tjekliste

- [ ] Udfyld `TEAM_DATA` øverst i `app.js`: `teamName`, `contact` og evt. `pitchAsk`. Har I en sponsor, der **har sagt ja**, så skriv navnet i `sponsor`.
- [ ] Åbn `index.html?pitch=1`, og gå alle 6 trin igennem: alt, der står, skal I kunne stå inde for.
- [ ] Upload alle filerne til GitHub (`index.html`, `app.js`, `app.css`, `sw.js` m.fl.), og vent på, at GitHub Pages er opdateret.
- [ ] **Scan QR-koden** på sidste trin og bag "Del" med to telefoner. Den skal åbne en DEMO-mærket demo.
- [ ] Print A4-oversigten (For skoler → "Print A4-oversigt") i 3–4 eksemplarer – én til hver dommer.
- [ ] Øv med stopur: ca. 40 sekunder pr. trin – trin 2 med live-demo må gerne tage lidt længere.
- [ ] Reserve: åbn `index.html` direkte som fil (virker uden internet), og hav A4-PDF'en klar.

**Adresse til pitchen:** `…/GroDinklasse/?demo=1&pitch=1`. `F` = fuld skærm, piletaster = næste/forrige, `Esc` = luk. Hvert trin har et **talepapir**, der kan foldes ud.

## De 6 trin (ca. 4 minutter)

### 1 · Problemet – *BMC: Værditilbud* (ca. 30 sek.)
- Temaugen om klima – og ugen efter, hvor meget er glemt. "Bæredygtige vaner forsvinder, når ingen kan se dem."
- Læreren har brug for et let værktøj – ikke endnu et tungt system.

### 2 · Løsningen – *BMC: Værditilbud* (ca. 60 sek. inkl. demo)
- Eleven registrerer → læreren godkender → planten vokser. Ét fælles klassemål, lærergodkendelse, åbne CO₂-beregninger og ingen persondata.
- **Live-demo (20–30 sek.):** klik "Prøv live-demoen" → fanen Lærer (PIN `1234`) → "Godkend" på en ældre indsendelse. Demo-klassen 7.A står på 178 point, så planten vokser til "Stort træ" med en fejring. Fortryd kan bruges, hvis I trykker forkert. Åbn pitchen igen med "▶ Pitch", og klik på trin **3**.

### 3 · Kunden og vejen til kunden – *BMC: Kundeperspektiv* (ca. 30 sek.)
- Eleven bruger den, læreren driver den, skolen køber en licens – eller kommunen en aftale.
- Lærer → klasse → skoleledelse → kommune. "Kommunerne er vores vej til mange skoler på én gang."
- Hver måned når vi de voksne med GroKlassen-nyhedsbrevet, som vi sender i samarbejde med sponsorer.

### 4 · Forretningen – *BMC: Økonomi* (ca. 45 sek.)
- To indtægtsben, regnet hver for sig (forventet scenarie, forudsætninger, ekskl. moms):
  - **Licenser:** skolelicens ca. 1.500 kr./år, kommuneaftale ca. 12.000 kr./år for op til 10 skoler (ca. 4 kr. pr. elev pr. år). Break-even ved **2 kommuneaftaler + 10 skolelicenser**, resultat +4.500 kr.
  - **Sponsorater i nyhedsbrevet:** 5.000–40.000 kr./år. Break-even ved **2 sponsorer**, resultat +11.000 kr. (ca. 1,25 kr. pr. modtager pr. nyhedsbrev).
- Samlet: **+15.500 kr. om året**. Ingen sponsor har sagt ja.

### 5 · Bæredygtighed – *bedømmes også* (ca. 35 sek.)
- Miljø (vaner inden for transport, mad, affald og energi), socialt (ét fælles mål, ingen elev udstilles) og økonomi (licensen finansierer driften).
- At cykle sparer ca. 400 g CO₂, at slukke lyset ca. 10 g – forsigtige skøn med åben beregning.
- FN's verdensmål 4.7 · 12.5 · 12.8 · 13.3 (fliserne på trinnet).

### 6 · Vision og opfordring – *BMC: Aktivitetsperspektiv* (ca. 30 sek.)
- Om 1 år: 10 skoler og 2 kommuneaftaler (forventet scenarie). Om 3 år: flere kommuner, med lærerlogin og database i EU. Hver måned: nyhedsbrevet med sponsorer.
- Slut med jeres opfordring (`pitchAsk`), og peg på QR-koden: "Scan og prøv demoen selv." Ræk A4-oversigten til dommerne.

## De 4 minutters spørgsmål – forbered jer på

| Spørgsmål | Svar-retning |
|---|---|
| **"Hvem har I talt med?"** | Ærligt: vi har ikke lavet interviews. Vi har valgt at bygge modellen på forudsætninger, som vi viser åbent: priser sat i forhold til lignende løsninger (Grøn Skole/Grønt Flag ca. 3.600 kr./år, Klimakampen 500 kr. pr. klasse, fagportaler ca. 1.300 kr. pr. klasse), 300 elever pr. skole og 10 skoler pr. kommuneaftale. Alle tal kan ændres live i beregnerne. |
| **"Hvordan har I testet?"** | Vi har testet selve appen grundigt (automatiske browsertests af hele flowet, fusk-reglerne og tilgængelighed), men ikke med rigtige klasser. Forretningen bygger på forudsætninger og tre scenarier – forsigtig, forventet og optimistisk – så I kan se, hvad der sker, hvis vi tager fejl. |
| **"Hvem er jeres sponsorer?"** | Ingen endnu. Listen under For skoler viser virksomheder, vi vil kontakte – mærket "IKKE KONTAKTET". Sponsoraterne i beregneren er et regneeksempel. |
| **"Er det ikke reklame til børn?"** | Nej. Nyhedsbrevet sendes til voksne, sponsoren står i en mærket annonceboks og vises aldrig i elevernes udfordringer. Ingen tilbud eller rabatkoder, og sponsoren kan ikke ændre indhold eller tal. |
| **"Hvad hvis kommunerne ikke vil betale?"** | Vis det forsigtige scenarie: 4 kommuneaftaler for at gå i nul. Enkeltskoler kan købe licens direkte, og sponsoraterne er et separat ben. |
| **"Hvem betaler for jeres tid?"** | Vi arbejder frivilligt nu – derfor er løn 0 kr. Skriv 150.000 kr. i løn i kommune-beregneren: så kræver det 16 kommuneaftaler. Derfor er kommuneaftaler vigtige. |
| **"Hvad med konkurrenterne?"** | Papirskemaer, temauger, kampagner og andre apps. GroKlassen kører hele året, med lærergodkendelse og kun data på klasseniveau – og kan supplere et grønt skoleprogram. |
| **"Hvordan undgår I snyd?"** | Én gang pr. udfordring pr. dag, højst 15 point om dagen, 10 sekunders pause, og læreren godkender alt. En rigtig konkurrence kræver en server. |
| **"Hvad med GDPR?"** | Ingen elevnavne og ingen persondata. Nyhedsbrevet har ingen tilmelding endnu – den kræver login, samtykke og en GDPR-vurdering. |
| **"Er CO₂-tallene rigtige?"** | Forsigtige skøn med åben udregning og kilder ("Sådan har vi regnet"), og usikkerheden står ved hvert tal. |
| **"Er konkurrencen rigtig?"** | Nej, den er et fiktivt eksempel og mærket sådan. |

## Hvis noget går galt

- **Ingen internet:** åbn `index.html` direkte fra computeren, og tilføj `?demo=1&pitch=1`.
- **Demoen er rodet:** klik "Nulstil demo" i det gule banner.
- **Den gamle version vises efter upload:** klik "Opdatér", når appen siger, at en ny version er klar – eller genindlæs to gange.
