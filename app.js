
/* =========================================================
   GroKlassen – begyndervenlig prototype
   Du kan ændre lærerens PIN-kode i indstillingerne nedenfor.
   Bemærk: localStorage og en PIN i browserkode er ikke sikker
   adgangskontrol. Brug en server/backend til en rigtig løsning.
   ========================================================= */
const CONFIG = {
  teacherPin: "1234",        // Skift denne PIN-kode, hvis du vil
  dailyPointCap: 15,         // Maks. point pr. klasse pr. dag (godkendte + ventende)
  cooldownSeconds: 10,       // Pause mellem indsendelser pr. klasse
  defaultWeeklyGoal: 30,     // Startværdi for klassens ugemål (point)
  storageKey: "groklassen-v2",       // Nuværende datastruktur
  legacyStorageKey: "groklassen-v1", // Gammel datastruktur – flyttes automatisk over
  demoStorageKey: "groklassen-demo"  // Demo-data gemmes for sig, så de aldrig blandes med rigtige data
};
const CLASS_NAMES = ["7.A", "7.B", "8.A"];

/* ---------- HOLDETS EGNE DATA – udfyld før pitchen (det ENESTE sted, I skal rette) ----------
   Skriv jeres rigtige data mellem anførselstegnene. Et tomt felt ("") skjuler linjen, hvor feltet bruges –
   undtagen ideaOrigin, teamName, contact, pitchAsk og publicUrl, der viser en standardtekst (TEAM_FALLBACK nedenfor).
   Opfind aldrig tal, citater, brugere, skoler eller sponsorer – tal i appen er tydeligt markerede forudsætninger.
   Ingen persondata: brug fx en fælles hold-mail, ikke private navne, telefonnumre eller mails. */
const TEAM_DATA = {
  ideaOrigin:         "", // Hvordan I fik idéen – 1 sætning. Vises: For skoler → toppen af siden.
  targetGrades:       "", // Klassetrin, I har valideret, fx "4.–9. klasse". Vises: Business Model Canvas og A4.
  sponsor:            "", // Navnet på en sponsor, der HAR sagt ja. Vises: Konkurrence og nyhedsbrevet. Tomt = "Eksempel-sponsor" med mærket EKSEMPEL.
  pitchAsk:           "", // Jeres opfordring på sidste slide, fx "Hjælp os med at åbne døren til de første kommuner". Vises: pitch trin 6 og A4-oversigten.
  teamName:           "", // Holdets navn og evt. skole, fx "Hold 3, X Gymnasium". Vises: A4-oversigten.
  contact:            "", // Fælles kontakt til holdet, fx en hold-mail (ingen private oplysninger). Vises: A4-oversigten.
  publicUrl: "https://sixtenkristensen123.github.io/GroDinklasse/" // Den udgivne adresse. QR-koden peger herhen med ?demo=1.
};

/* Standardtekster til de felter, der altid vises. Alle andre tomme felter skjuler deres linje. */
const TEAM_FALLBACK = {
  ideaOrigin: "GroKlassen er udviklet af et gymnasiehold til Business Mind Programme 2026.",
  pitchAsk:   "Hjælp os med at åbne døren til de første skoler og kommuner.",
  teamName:   "Et gymnasiehold i Business Mind Programme 2026",
  contact:    "Spørg holdet – vi står klar efter pitchen.",
  publicUrl:  "https://sixtenkristensen123.github.io/GroDinklasse/"
};

/* ---------- Økonomi: scenarier for de to beregnere (kr. pr. år, ekskl. moms) ----------
   Alle tal er FORUDSÆTNINGER – ikke rigtige kunder, aftaler eller tilbud. "expected" (forventet) er standard
   og bruges også i pitchen, på A4-oversigten og i README.
   Kommuner: deals = kommuneaftaler · price = pris pr. aftale · schoolsPer = skoler pr. aftale · singles = enkeltskoler
   med skolelicens · singlePrice = pris pr. skolelicens · pupils = elever pr. skole · variable = variable omkostninger
   pr. skole · salary = løn (0 kr. = frivilligt arbejde i prototypefasen). */
const MUNI_SCENARIOS = {
  careful:    {label:"Forsigtig",   deals:1, price:10000, schoolsPer:10, singles:5,  singlePrice:1000, pupils:300, variable:200, hosting:4000, support:6000,  dev:20000, salary:0},
  expected:   {label:"Forventet",   deals:2, price:12000, schoolsPer:10, singles:10, singlePrice:1500, pupils:300, variable:150, hosting:4000, support:6000,  dev:20000, salary:0},
  optimistic: {label:"Optimistisk", deals:4, price:12000, schoolsPer:10, singles:20, singlePrice:1500, pupils:300, variable:150, hosting:6000, support:10000, dev:20000, salary:0}
};
/* Sponsorater i nyhedsbrevet: supporter/partner/main = antal sponsorer pr. niveau (Støtter, Partner, Hovedsponsor)
   og deres priser · issues = nyhedsbreve pr. år · recipients = modtagere pr. nyhedsbrev · production = produktion pr.
   nyhedsbrev · sales = salg og administration pr. sponsor · distribution = udsendelse pr. år.
   Ingen sponsor har sagt ja – sponsoraterne er et regneeksempel. */
const SPONSOR_SCENARIOS = {
  careful:    {label:"Forsigtig",   supporter:2, partner:0, main:0, supporterPrice:5000, partnerPrice:15000, mainPrice:40000, issues:10, recipients:1000, production:1000, sales:1000, distribution:1000},
  expected:   {label:"Forventet",   supporter:2, partner:1, main:0, supporterPrice:5000, partnerPrice:15000, mainPrice:40000, issues:10, recipients:2000, production:1000, sales:1000, distribution:1000},
  optimistic: {label:"Optimistisk", supporter:3, partner:2, main:1, supporterPrice:5000, partnerPrice:15000, mainPrice:40000, issues:10, recipients:5000, production:1500, sales:1000, distribution:2000}
};

/* ---------- SPONSORNIVEAUER OG NYHEDSBREV – ret her ----------
   Alle priser er HYPOTESER. Sponsorens navn står i TEAM_DATA.sponsor. Er feltet tomt, viser nyhedsbrevet
   "[Jeres sponsor]" og mærkatet "Eksempel · fiktiv sponsor". Skriv aldrig en virksomhed, før den har sagt ja –
   og brug aldrig en af virksomhederne fra "Sponsorer vi vil kontakte" bare fordi den står på listen.
   Regler: nyhedsbrevet er til voksne (lærere, ledelse og forældre), ingen tilbud, rabatkoder eller produktreklame,
   læreren kan slå sponsorafsnittet fra, og sponsoren kan ikke ændre indhold eller tal. */
const SPONSOR_LEVELS = {
  main:      {label:"Hovedsponsor", price:40000, exposure:"“I samarbejde med” øverst i nyhedsbrevet og den store annonceboks"},
  partner:   {label:"Partner",      price:15000, exposure:"Annonceboksen i nyhedsbrevet – på skift med andre partnere"},
  supporter: {label:"Støtter",      price:5000,  exposure:"Navnet i “Tak til”-linjen nederst i nyhedsbrevet"}
};
const NEWSLETTER = {
  sponsorText: "" // Sponsorens korte tekst til annonceboksen – sagligt om eget grønt arbejde, ingen tilbud eller rabatkoder.
                  // Holdet godkender teksten. Tomt = en eksempeltekst.
};
// Saglige tips til nyhedsbrevet – ét pr. udfordring. Månedens tip handler om en udfordring, klasserne kan gøre mere af.
const GREEN_TIPS = {
  cycle:      "Aftal en fast cykel- eller gåmakker til skole. Det er lettere at holde fast i vanen sammen – også når det regner.",
  sort:       "Hæng en lille seddel ved affaldsspandene med, hvad der hører til hvor. Så bliver det nemmere for alle at sortere rigtigt.",
  shower:     "Sæt en sang på under badet, og stop, når den slutter. 2 minutter kortere sparer ca. 15 liter vand.",
  lunch:      "Brug en madkasse og en drikkedunk, der kan genbruges. Så undgår madpakken engangsplast.",
  lights:     "Gør det til en fast opgave i klassen at slukke lyset, når I går til frikvarter.",
  repair:     "Prøv at reparere noget, før det bliver smidt ud – fx sy en knap i eller lap en cykelslange.",
  plantlunch: "Prøv en plantebaseret frokost én dag om ugen, fx med bønnepostej, hummus eller falafel.",
  swap:       "Hold en byttedag i klassen med tøj, bøger eller spil, som ingen bruger længere.",
  screens:    "Sluk skærme og projektor helt, når skoledagen er slut. Standby bruger også strøm."
};
// Idéer til en klasseaktivitet i nyhedsbrevet – én pr. måned på skift.
const CLASS_ACTIVITIES = [
  "Affaldsdetektiver: Vej klassens restaffald en dag, sortér det sammen, og vej igen ugen efter.",
  "Lys-patrulje: To elever har ansvaret for lys og skærme i en uge – derefter skifter det.",
  "Byttebord: Saml tøj, bøger og spil, som ingen bruger, og byt dem i et frikvarter.",
  "Cykeldag: Tæl, hvor mange der cykler eller går en bestemt dag – og prøv at slå tallet ugen efter.",
  "Madpakke-tjek: Hvor mange madpakker er uden engangsplast? Sæt et fælles mål for næste uge.",
  "Reparationsværksted: Tag en ting med, der kan repareres, og hjælp hinanden med at fikse den."
];
// FN's verdensmål, som GroKlassen bidrager til. Farver efter FN's verdensmål; ikonerne er egne (ikke FN's officielle).
// ink = tekstfarve med mindst 4,5:1 i kontrast mod baggrunden.
const SDG_GOALS = [
  {no:"4.7",  color:"#C5192D", ink:"#ffffff", icon:"book",  title:"Uddannelse for bæredygtig udvikling", text:"Grøn dannelse i klassens hverdag."},
  {no:"12.5", color:"#BF8B2E", ink:"#1a1a1a", icon:"cycle", title:"Mindre affald", text:"Sortering, genbrug og madpakke uden engangsplast."},
  {no:"12.8", color:"#BF8B2E", ink:"#1a1a1a", icon:"cycle", title:"Viden om bæredygtig livsstil", text:"Åbne beregninger i \"Sådan har vi regnet\"."},
  {no:"13.3", color:"#3F7E44", ink:"#ffffff", icon:"globe", title:"Klimabevidsthed", text:"Klassen ser effekten af sine handlinger."}
];
const SDG_ICONS = {
  book:  '<path d="M4 5.5c2.5-1 5.5-1 8 .5 2.5-1.5 5.5-1.5 8-.5V19c-2.5-1-5.5-1-8 .5-2.5-1.5-5.5-1.5-8-.5z"/><path d="M12 6v13.5"/>',
  cycle: '<path d="M20 12a8 8 0 0 1-13.7 5.6"/><path d="M4 12a8 8 0 0 1 13.7-5.6"/><path d="M17.7 2.5v4h-4"/><path d="M6.3 21.5v-4h4"/>',
  globe: '<circle cx="11" cy="13" r="8"/><path d="M3 13h16M11 5c2.6 2.4 2.6 13.6 0 16M11 5c-2.6 2.4-2.6 13.6 0 16"/><path d="M15.5 2.5c3.7 0 5.5 1.8 5.5 5.5-3.7 0-5.5-1.8-5.5-5.5z"/>'
};
function sdgTiles(compact = false) {
  return `<div class="sdg-grid${compact ? " compact" : ""}">${SDG_GOALS.map(g => `<div class="sdg-tile" style="background:${g.color};color:${g.ink}"><svg class="sdg-ico" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${SDG_ICONS[g.icon]}</svg><div class="sdg-num">${g.no}</div><div class="sdg-title">${safeText(g.title)}</div>${compact ? "" : `<p>${safeText(g.text)}</p>`}</div>`).join("")}</div>`;
}

/* ---------- KLASSEKONKURRENCE – ret her ----------
   Konkurrencen er et FIKTIVT EKSEMPEL, indtil I har en rigtig aftale med en sponsor.
   Skriv aldrig, at en virksomhed er sponsor, før den har sagt ja – sæt så isExample til false. */
const CONTEST = {
  isExample: true,                 // true = vis "Eksempel · fiktiv konkurrence" overalt (og ingen pop-up)
  name: "Grøn Klasse-Cup",
  prize: "en klassetur til en forlystelsespark",
  start: null,                     // Fx "2026-11-30". null = starter mandag i denne uge (praktisk til demo)
  weeks: 4,                        // Konkurrencens længde i uger
  prizeIdeas: [
    {id:"park",   title:"Klassetur til en forlystelsespark", note:"Sjovt og motiverende – kræver en sponsor eller et budget."},
    {id:"nature", title:"Klassetur til et naturcenter eller science center", note:"Passer godt til bæredygtighed og natur/teknologi."},
    {id:"trees",  title:"Frugttræer eller en skolehave til klassen", note:"En præmie, der selv vokser – ligesom klassens plante."},
    {id:"bikes",  title:"Cykelværksted-dag, hvor klassens cykler bliver tjekket", note:"Belønner den grønneste transport."},
    {id:"party",  title:"Klimavenlig klassefest med plantebaseret mad", note:"Billig præmie, som skolen måske selv kan give."}
  ]
};

/* ---------- Udfordringer ----------
   co2 (kg) og water (liter) er VEJLEDENDE skøn for én handling – ikke målinger.
   method = antagelse og udregning, check = hvad holdet skal faktatjekke, sources = kilder (set 25.10.2026).
   Vi har valgt forsigtige (lave) tal for at undgå greenwashing. Point belønner indsats og vaner – ikke kun CO₂. */
const CHALLENGES = [
  {id:"cycle", title:"Cykel eller gå i skole", description:"Cykl eller gå i stedet for at blive kørt i bil.", points:3, co2:0.4, water:0, icon:"🚲", confidence:"middel",
   method:"Antagelse: én elev cykler eller går i stedet for at blive kørt 2 km hver vej (4 km). En gennemsnitlig dansk bil (hvor ca. hver femte er en elbil) sættes forsigtigt til ca. 0,10 kg CO₂ pr. km: 4 km × 0,10 kg = ca. 0,4 kg.",
   waterMethod:"0 L – ingen direkte vandbesparelse.",
   check:"Er 0,10 kg CO₂ pr. km rimeligt for den danske bilpark? Er 2 km hver vej realistisk for jeres skole? Handlingen tæller kun, hvis turen ellers var sket i bil.",
   sources:[{label:"Danmarks Statistik: elbilers andel af personbilerne", url:"https://www.dst.dk/da/Statistik/udgivelser/NytHtml?cid=51885"},
            {label:"EEA: CO₂ fra nye personbiler i EU", url:"https://www.eea.europa.eu/en/analysis/indicators/co2-performance-of-new-passenger"},
            {label:"Energistyrelsen: standardfaktorer for brændsler", url:"https://ens.dk/media/1031/download"}]},
  {id:"sort", title:"Sortér affald korrekt", description:"Sortér papir, plast, metal eller madaffald i klassen.", points:2, co2:0.05, water:0, icon:"♻️", confidence:"lav",
   method:"Antagelse: klassen sorterer ca. 50 g plast fra restaffaldet. Genanvendelse sparer ca. 1,8 kg CO₂ pr. kg plast, men ca. 30 % af den sorterede plast bliver alligevel brændt: 0,05 kg × 1,8 × 0,7 ≈ 0,06 – rundet ned til ca. 0,05 kg.",
   waterMethod:"0 L (kun vand fra vandhanen tælles med).",
   check:"Vej den plast, klassen sorterer på en dag. Find en kilde med metode for de 1,8 kg pr. kg (AffaldPlus oplyser ikke metoden). Papir, pap og madaffald er ikke regnet med.",
   sources:[{label:"AffaldPlus: CO₂-reduktion ved genanvendelse", url:"https://affaldplus.dk/co2-reduktion"},
            {label:"Samvirke: andel af sorteret plast, der ikke genanvendes (rundspørge)", url:"https://samvirke.dk/artikler/mere-end-30-procent-af-den-sorterede-plastik-bliver-ikke-genanvendt"}]},
  {id:"shower", title:"Tag et kort bad", description:"Gør badet 2 minutter kortere derhjemme.", points:3, co2:0.02, water:15, icon:"🚿", confidence:"middel",
   method:"Antagelse: badet er 2 minutter kortere med en sparebruser på ca. 7,5 L/min = 15 L mindre vand. At varme 15 L fra ca. 10 til 38 °C kræver ca. 0,5 kWh fjernvarme × ca. 0,04 kg CO₂/kWh ≈ 0,02 kg.",
   waterMethod:"15 L: 2 min × ca. 7,5 L/min (sparebrusere bruger 6–10 L/min).",
   check:"Faktoren 0,04 kg/kWh gælder fjernvarme i hovedstadsområdet – jeres egen varmeforsyning kan ligge højere (fx gasfyr). Badet tages hjemme og kan ikke kontrolleres.",
   sources:[{label:"Energistyrelsen: kortere bad og sparebrusere", url:"https://ens.dk/presse/hver-uge-bruger-vi-34-minutter-under-bruseren-spar-penge-ved-forkorte-badet"},
            {label:"VEKS: miljødeklaration for fjernvarme 2024", url:"https://www.veks.dk/-/media/veks/files/publications/miljoedeklaration.pdf"},
            {label:"Energistyrelsen: nøgletal om energiforsyning", url:"https://ens.dk/analyser-og-statistik/noegletal-om-energiforbrug-og-forsyning"}]},
  {id:"lunch", title:"Madpakke uden engangsplast", description:"Brug madkasse og genanvendelig drikkedunk i stedet for poser og film.", points:3, co2:0.02, water:0, icon:"🍎", confidence:"lav",
   method:"Antagelse: madkasse og drikkedunk erstatter ca. 10 g engangsplast (fx en frysepose og lidt film). Det koster ca. 1,9 kg CO₂ at lave 1 kg af den slags plast: 0,01 kg × 1,9 ≈ 0,02 kg.",
   waterMethod:"0 L – madkasse og dunk skal vaskes op, så der spares ikke vand.",
   check:"Tallet 1,9 kg CO₂ pr. kg plast (LDPE) er kun set i søgeresultater – bekræft det. Vej en typisk frysepose. Madkassen giver kun en gevinst, hvis den bruges mange gange.",
   sources:[{label:"PlasticsEurope: miljøprofil for polyethylen (ikke verificeret)", url:"https://www.pedagogie.ac-aix-marseille.fr/upload/docs/application/pdf/2015-11/4-_eco-profile_pe_2014-04.pdf"}]},
  {id:"lights", title:"Sluk lyset", description:"Sluk lyset, når klasselokalet står tomt.", points:2, co2:0.01, water:0, icon:"💡", confidence:"middel",
   method:"Antagelse: lyset slukkes i 30 minutter i et tomt klasselokale på 60 m² med LED-lys (ca. 7 W/m² = 0,42 kW). Det sparer ca. 0,21 kWh × 0,06 kg CO₂/kWh (dansk strøm 2025) ≈ 0,01 kg.",
   waterMethod:"0 L – ingen direkte vandbesparelse.",
   check:"Mål jeres eget lokale og tæl lampernes watt. Har lokalet bevægelsessensor, er besparelsen næsten 0. Dansk strøm er så grøn, at lys sparer få gram – det er en ærlig pointe.",
   sources:[{label:"Dansk Center for Lys: Lys og energi", url:"https://centerforlys.dk/wp-content/uploads/2022/12/5_Lys_og_energi.pdf"},
            {label:"Green Power Denmark: strømmens CO₂-udledning 2025", url:"https://greenpowerdenmark.dk/nyheder/vores-stroem-er-groennere-nogensinde"}]},
  {id:"repair", title:"Reparér frem for at smide ud", description:"Giv en ting længere levetid med en lille reparation, fx sy et hul.", points:4, co2:0.5, water:0, icon:"🧵", confidence:"lav",
   method:"Antagelse: en lille reparation (fx et hul i en t-shirt) gør, at en del af et nyt køb undgås. En ny bomulds-t-shirt koster ca. 5,2 kg CO₂ at fremstille, og vi regner forsigtigt med 10 % af det: ca. 0,5 kg.",
   waterMethod:"0 L – det skjulte vand i bomuld bruges mest i udlandet og lægges ikke sammen med vand fra hanen.",
   check:"De 10 % er vores egen forsigtige antagelse. Besparelsen afhænger helt af, om tingen ellers var blevet erstattet – en sok giver mindre, en jakke meget mere.",
   sources:[{label:"Impact CO2 (ADEME): bomulds-t-shirt", url:"https://impactco2.fr/outils/habillement/tshirtencoton"},
            {label:"WRAP: reparation og brugtkøb erstatter nye køb", url:"https://www.wrap.ngo/media-centre/press-releases/fast-fashion-could-be-left-peg-preloved-and-repair-displace-new-sales"}]},
  {id:"plantlunch", title:"Plantebaseret frokost", description:"Spis en frokost uden kød og ost, fx med bønnepostej, linser eller grøntsager.", points:3, co2:0.1, water:0, icon:"🥗", confidence:"middel",
   method:"Antagelse: 50 g kødpålæg (skinke, ca. 4,3 kg CO₂/kg) i madpakken erstattes af 50 g bønnepostej (ca. 2,1 kg CO₂/kg): 0,05 kg × (4,3 − 2,1) ≈ 0,1 kg.",
   waterMethod:"0 L – kød har et stort skjult vandaftryk, men vi har ikke et verificeret tal pr. måltid.",
   check:"De 50 g er en antagelse. Erstattes en varm ret med oksekød, er besparelsen meget større – overvej to niveauer. Ost som erstatning sparer næsten intet.",
   sources:[{label:"Den Store Klimadatabase: skinke i skiver", url:"https://thebigclimatedatabase.com/activity/Ra00046-DK/"},
            {label:"Den Store Klimadatabase: vegansk bønnepostej", url:"https://thebigclimatedatabase.com/activity/Ra00450-DK/"}]},
  {id:"swap", title:"Byt eller køb brugt", description:"Byt, lån eller køb brugt i stedet for at købe noget nyt.", points:4, co2:0.5, water:0, icon:"🔄", confidence:"lav",
   method:"Antagelse: en brugt eller byttet ting erstatter en del af et nyt køb. En ny bomulds-t-shirt koster ca. 5,2 kg CO₂, men ikke alle brugtkøb erstatter et nyt køb, og mange ting er mindre. Vi regner forsigtigt med 10 %: ca. 0,5 kg.",
   waterMethod:"0 L – skjult vand i ny bomuld lægges ikke sammen med vand fra hanen.",
   check:"Andelen på 10 % er en forsigtig antagelse. Find kildebelagte tal for de ting, I oftest bytter (tøj, bøger, elektronik). Merforbrug kan gøre besparelsen 0.",
   sources:[{label:"Impact CO2 (ADEME): bomulds-t-shirt", url:"https://impactco2.fr/outils/habillement/tshirtencoton"},
            {label:"WRAP: 3 ud af 5 brugtkøb erstatter et nyt køb", url:"https://www.wrap.ngo/media-centre/press-releases/fast-fashion-could-be-left-peg-preloved-and-repair-displace-new-sales"}]},
  {id:"screens", title:"Sluk skærme og opladere", description:"Sluk projektor, skærme og opladere, når timen er slut.", points:1, co2:0.007, water:0, icon:"🔌", confidence:"lav",
   method:"Antagelse: en projektor eller interaktiv skærm (ca. 150 W) slukkes 30 minutter tidligere (0,075 kWh), og 5 pc'er eller opladere tages ud af standby natten over (ca. 0,04 kWh). I alt ca. 0,12 kWh × 0,06 kg CO₂/kWh ≈ 0,007 kg (ca. 7 g).",
   waterMethod:"0 L – ingen direkte vandbesparelse.",
   check:"Find watt-tallet på jeres egen skærm (mærkepladen eller manualen). Moderne opladere bruger næsten intet uden belastning. Pointet er vanen – ikke CO₂-tallet.",
   sources:[{label:"Europa-Kommissionen: EU-krav til standby", url:"https://energy-efficient-products.ec.europa.eu/product-list/standby-networked-standby-and-mode_en"},
            {label:"Green Power Denmark: strømmens CO₂-udledning 2025", url:"https://greenpowerdenmark.dk/nyheder/vores-stroem-er-groennere-nogensinde"}]}
];
const PLANT_STAGES = [
  {name:"Frø", threshold:0, description:"Alt begynder med et lille frø."},
  {name:"Spire", threshold:20, description:"De første grønne vaner spirer frem."},
  {name:"Lille plante", threshold:50, description:"Jeres fælles indsats bliver synlig."},
  {name:"Ungt træ", threshold:100, description:"Klassen er ved at skabe stærke vaner."},
  {name:"Stort træ", threshold:180, description:"Jeres grønne fællesskab står stærkt."}
];

let state = loadState();
let activeClass = state.activeClass;
let cooldownTimer = null;
let teacherUnlocked = readTeacherSession();
// Demo-data ligger i deres egen "kasse". Er demo aktiv, arbejder appen i den i stedet for i de rigtige data.
let demoState = loadDemoState();

/* ---------- Data og lagring ----------
   Datastruktur version 2 (gemmes under "groklassen-v2"):
   {
     version: 2,
     theme: "light" | "dark" | null      (null = følg enhedens indstilling)
     onboardingDone: true/false,
     activeClass: "7.A",
     classes: {
       "7.A": { approved:[...], pending:[...], rejected:[...], lastSubmission:0, weeklyGoal:30 }
     }
   }
   Der gemmes ALDRIG navne eller andre persondata – kun klassens fælles handlinger. */
function emptyClass() {
  return {approved:[], pending:[], rejected:[], lastSubmission:0, weeklyGoal:CONFIG.defaultWeeklyGoal};
}
function defaultState() {
  const classes = {};
  CLASS_NAMES.forEach(name => { classes[name] = emptyClass(); });
  return {version:2, theme:null, onboardingDone:false, contestPopupSeen:false, activeClass:CLASS_NAMES[0], classes, contest:{}};
}
// Tjekker at en gemt indsendelse ser fornuftig ud. Ødelagte rækker springes over i stedet for at crashe appen.
function cleanItem(item) {
  if (!item || typeof item !== "object") return null;
  if (typeof item.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(item.date)) return null;
  const points = Number(item.points);
  if (!Number.isFinite(points) || points <= 0 || points > CONFIG.dailyPointCap) return null;
  // Kendte udfordringer får titel og point fra listen i koden – så gemte data ikke kan snyde med dem.
  const known = CHALLENGES.find(c => c.id === item.challengeId);
  return {
    id: String(item.id || `${item.date}-${item.challengeId}-${Math.random().toString(36).slice(2,8)}`),
    challengeId: String(item.challengeId || ""),
    title: known ? known.title : String(item.title || "Ukendt udfordring"),
    date: item.date,
    points: known ? known.points : points,
    co2: Number(item.co2) || 0,
    water: Number(item.water) || 0,
    submittedAt: Number(item.submittedAt) || 0,
    approvedAt: item.approvedAt ? Number(item.approvedAt) : undefined,
    rejectedAt: item.rejectedAt ? Number(item.rejectedAt) : undefined
  };
}
function cleanList(list) { return Array.isArray(list) ? list.map(cleanItem).filter(Boolean) : []; }
// Laver gemte data (v1 eller v2) om til en gyldig v2-struktur.
function normalizeState(parsed) {
  const fresh = defaultState();
  if (!parsed || typeof parsed !== "object") return fresh;
  if (parsed.classes && typeof parsed.classes === "object") {
    for (const name of CLASS_NAMES) {
      const saved = parsed.classes[name];
      if (!saved) continue;
      fresh.classes[name] = {
        approved: cleanList(saved.approved),
        pending: cleanList(saved.pending),
        rejected: cleanList(saved.rejected),
        // Et tidspunkt i fremtiden (fx efter urjustering) ignoreres.
        lastSubmission: Number(saved.lastSubmission) > Date.now() + 60000 ? 0 : (Number(saved.lastSubmission) || 0),
        weeklyGoal: Math.min(75, Math.max(5, Number(saved.weeklyGoal) || CONFIG.defaultWeeklyGoal))
      };
    }
  }
  fresh.theme = parsed.theme === "dark" || parsed.theme === "light" ? parsed.theme : null;
  fresh.onboardingDone = parsed.onboardingDone === true;
  fresh.activeClass = CLASS_NAMES.includes(parsed.activeClass) ? parsed.activeClass : CLASS_NAMES[0];
  fresh.contestPopupSeen = parsed.contestPopupSeen === true;
  // Tilmeldinger til konkurrencen – kun klassens navn, holdnavn, antal elever og præmie-afstemning.
  if (parsed.contest && typeof parsed.contest === "object") {
    CLASS_NAMES.forEach(name => {
      const s = parsed.contest[name];
      if (!s || s.signedUp !== true) return;
      fresh.contest[name] = {
        signedUp: true,
        team: String(s.team || "").slice(0, 40),
        students: Math.min(40, Math.max(1, Math.round(Number(s.students) || 1))),
        vote: CONTEST.prizeIdeas.some(p => p.id === s.vote) ? s.vote : CONTEST.prizeIdeas[0].id,
        signedAt: Number(s.signedAt) || 0
      };
    });
  }
  return fresh;
}
function loadState() {
  try {
    const raw = localStorage.getItem(CONFIG.storageKey);
    if (raw) return normalizeState(JSON.parse(raw));
    // Migrering: findes der data fra den gamle version (groklassen-v1), flyttes de over,
    // så klassens point ikke går tabt. Den gamle nøgle bliver liggende som backup.
    const legacy = localStorage.getItem(CONFIG.legacyStorageKey);
    if (legacy) {
      const migrated = normalizeState(JSON.parse(legacy));
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(migrated));
      console.info("GroKlassen: data flyttet fra groklassen-v1 til groklassen-v2.");
      return migrated;
    }
  } catch (error) {
    console.warn("Kunne ikke indlæse gemte data:", error);
  }
  return defaultState();
}
function saveState() {
  try {
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(state));
    if (demoState) localStorage.setItem(CONFIG.demoStorageKey, JSON.stringify(demoState));
  } catch (error) {
    console.warn("Kunne ikke gemme data i browseren:", error);
    showToast("Browseren kunne ikke gemme ændringer. Kontrollér browserens lagerindstillinger.", true);
  }
}
function loadDemoState() {
  try {
    const raw = localStorage.getItem(CONFIG.demoStorageKey);
    if (raw) return normalizeState(JSON.parse(raw));
  } catch (error) {
    console.warn("Kunne ikke indlæse demo-data:", error);
  }
  return null;
}
// Henter data for en klasse – fra demo-kassen, hvis demo er aktiv, ellers fra de rigtige data.
function classData(name = activeClass) { return (demoState || state).classes[name]; }

/* ---------- Datoer ----------
   Datoer gemmes som tekst "ÅÅÅÅ-MM-DD" i lokal tid, så "i dag" følger skolens ur. */
function pad(n) { return String(n).padStart(2, "0"); }
function dateKey(d) { return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }
function todayKey() { return dateKey(new Date()); }
function parseDateKey(key) { const [y,m,d] = key.split("-").map(Number); return new Date(y, m-1, d); }
// Antal hele dage mellem en dato og i dag (Math.round tager højde for sommertid).
function daysAgo(key) { return Math.round((parseDateKey(todayKey()) - parseDateKey(key)) / 86400000); }
function ageLabel(key) {
  const n = daysAgo(key);
  if (n <= 0) return "I dag";
  if (n === 1) return "I går";
  return `${n} dage siden`;
}
function formatDate(key) { return parseDateKey(key).toLocaleDateString("da-DK", {weekday:"short", day:"numeric", month:"short"}); }
function formatTime(ms) { return ms ? new Date(ms).toLocaleTimeString("da-DK", {hour:"2-digit", minute:"2-digit"}) : ""; }
function addDays(key, days) { const d = parseDateKey(key); d.setDate(d.getDate() + days); return dateKey(d); }
// Mandagen i den uge, datoen ligger i (danske uger starter mandag).
function mondayOf(key) { const d = parseDateKey(key); return addDays(key, -((d.getDay() + 6) % 7)); }
// Ugenummer som i den danske kalender (ISO 8601).
function weekNumber(key) {
  const d = parseDateKey(key);
  // Find torsdagen i samme uge – den afgør, hvilket år ugen hører til. Uge 1 er ugen med 4. januar.
  const thursday = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const jan4 = new Date(thursday.getFullYear(), 0, 4);
  return 1 + Math.round(((thursday - jan4) / 86400000 - 3 + ((jan4.getDay() + 6) % 7)) / 7);
}
// Godkendte point i den uge, der starter med mandagen "monday".
// Datoer som "2026-10-19" kan sammenlignes som tekst, fordi de står i rækkefølgen år-måned-dag.
function weekPoints(data, monday) {
  const nextMonday = addDays(monday, 7);
  return data.approved.filter(item => item.date >= monday && item.date < nextMonday).reduce((sum,item) => sum + item.points, 0);
}
function formatNumber(value, decimals = 0) { return Number(value).toLocaleString("da-DK", {maximumFractionDigits:decimals}); }
// Små CO₂-mængder vises i gram (fx "ca. 400 g"), større i kg med én decimal.
function formatCo2(kg) { return kg < 1 ? `${formatNumber(Math.round(kg * 1000))} g` : `${formatNumber(kg, 1)} kg`; }

/* ---------- Beregninger ---------- */
// Summen af godkendte point på en bestemt dato (fx "2026-10-24").
// Bruges både for i dag og for ældre indsendelser, så loftet altid tjekkes mod den rigtige dag.
function approvedOnDate(data, date) {
  return data.approved.filter(item => item.date === date).reduce((sum,item) => sum + item.points, 0);
}
function pendingOnDate(data, date) {
  return data.pending.filter(item => item.date === date).reduce((sum,item) => sum + item.points, 0);
}
function approvedToday(data) { return approvedOnDate(data, todayKey()); }
function pendingToday(data) { return pendingOnDate(data, todayKey()); }
// Hvor mange sekunder af cooldown der er tilbage for en klasse (0 = klar).
function cooldownLeft(data) {
  const left = Math.ceil((CONFIG.cooldownSeconds*1000 - (Date.now() - data.lastSubmission)) / 1000);
  // Begræns til højst cooldown-tiden – så et ur, der er stillet tilbage, ikke kan låse klassen i timevis.
  return Math.max(0, Math.min(CONFIG.cooldownSeconds, left));
}
function totalApproved(data) {
  return data.approved.reduce((sum,item) => ({
    points:sum.points + item.points, co2:sum.co2 + estimateFor(item).co2, water:sum.water + estimateFor(item).water
  }), {points:0,co2:0,water:0});
}
function getStage(points) {
  let stage = 0;
  PLANT_STAGES.forEach((item,index) => { if (points >= item.threshold) stage = index; });
  return stage;
}
function challengeById(id) { return CHALLENGES.find(item => item.id === id); }

/* ---------- Små hjælpefunktioner til brugerfladen ---------- */
// Gør tekst sikker at sætte ind i HTML (forhindrer at tekst bliver tolket som kode).
function safeText(value) {
  return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
// Viser en kort besked (toast) nederst på skærmen. Den forsvinder selv efter nogle sekunder.
// Beskeden ligger i sit eget område, så statuslinjen ikke kan overskrive den.
// action = {label, run} giver en knap i beskeden (bruges til "Fortryd").
function showToast(message, error = false, action = null) {
  const region = toastRegion();
  const toast = document.createElement("div");
  toast.className = "toast" + (error ? " error" : "");
  toast.innerHTML = `<span>${safeText(message)}</span>${action ? `<button type="button" class="toast-action" title="${safeText(action.title || "")}">${safeText(action.label)}</button>` : ""}<button type="button" class="toast-close" aria-label="Luk besked">×</button>`;
  toast.querySelector(".toast-close").addEventListener("click", () => hideToast(toast));
  if (action) toast.querySelector(".toast-action").addEventListener("click", () => { hideToast(toast); action.run(); });
  region.appendChild(toast);
  // Vis højst tre beskeder ad gangen.
  while (region.children.length > 3) region.firstElementChild.remove();
  setTimeout(() => hideToast(toast), action ? 8000 : error ? 7000 : 4500);
  return toast;
}
// Modale dialoger ligger i browserens øverste lag, og alt uden for dem kan ikke klikkes.
// Er en dialog åben (fx fejringen), flyttes beskedområdet derfor ind i den – og tilbage, når den lukker.
function toastRegion() {
  const region = document.getElementById("toastRegion");
  const host = [...document.querySelectorAll("dialog[open]")].pop() || document.body;
  if (region.parentElement !== host) host.appendChild(region);
  return region;
}
function hideToast(toast) {
  if (!toast.isConnected) return;
  if (prefersReducedMotion()) { toast.remove(); return; }
  toast.classList.add("leaving");
  toast.addEventListener("animationend", () => toast.remove(), {once: true});
  setTimeout(() => toast.remove(), 400); // Sikkerhed, hvis animationen ikke kører (fx i en skjult fane)
}
// Viser en bekræftelsesdialog og svarer med true (OK) eller false (Annullér).
function confirmDialog(title, text, okText = "OK") {
  const dialog = document.getElementById("confirmDialog");
  document.getElementById("confirmTitle").textContent = title;
  document.getElementById("confirmText").textContent = text;
  document.getElementById("confirmOk").textContent = okText;
  return new Promise(resolve => {
    const finish = answer => { dialog.close(); cleanup(); resolve(answer); };
    const ok = () => finish(true);
    const cancel = () => finish(false);
    const onClose = () => { cleanup(); resolve(false); };
    function cleanup() {
      document.getElementById("confirmOk").removeEventListener("click", ok);
      document.getElementById("confirmCancel").removeEventListener("click", cancel);
      dialog.removeEventListener("close", onClose);
    }
    document.getElementById("confirmOk").addEventListener("click", ok);
    document.getElementById("confirmCancel").addEventListener("click", cancel);
    dialog.addEventListener("close", onClose); // Escape-tasten lukker også dialogen
    dialog.showModal();
    document.getElementById("confirmCancel").focus();
  });
}

/* ---------- Planten ---------- */
function treeName(name = activeClass) { return `${name}'s træ`; }
function plantSvg(points) {
  // Planten ændrer udseende alt efter klassens samlede godkendte point.
  const stage = getStage(points);
  const common = 'stroke="#2e6b45" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"';
  let plant = '';
  if (stage === 0) {
    plant = '<ellipse cx="100" cy="143" rx="18" ry="25" fill="#9a7045" stroke="#6d4d2e" stroke-width="3" transform="rotate(-25 100 143)"/><path d="M91 137 Q101 143 108 151" fill="none" stroke="#6d4d2e" stroke-width="3"/>';
  } else if (stage === 1) {
    plant = `<path d="M100 155 Q99 125 106 95" fill="none" ${common}/><path d="M104 119 Q69 116 69 89 Q99 88 104 119Z" fill="#83c96b" stroke="#2e6b45" stroke-width="3"/><path d="M105 102 Q124 95 129 73 Q105 76 105 102Z" fill="#5cab57" stroke="#2e6b45" stroke-width="3"/>`;
  } else if (stage === 2) {
    plant = `<path d="M100 158 Q97 119 101 77" fill="none" ${common}/><path d="M100 125 Q61 125 54 95 Q88 88 100 125Z" fill="#83c96b" stroke="#2e6b45" stroke-width="3"/><path d="M100 106 Q129 104 143 75 Q112 69 100 106Z" fill="#5cab57" stroke="#2e6b45" stroke-width="3"/><path d="M100 90 Q76 80 82 55 Q107 61 100 90Z" fill="#a2d978" stroke="#2e6b45" stroke-width="3"/>`;
  } else if (stage === 3) {
    plant = `<path d="M100 159 L100 78" fill="none" stroke="#805a37" stroke-width="10" stroke-linecap="round"/><path d="M99 111 L69 86 M100 98 L127 72" fill="none" stroke="#805a37" stroke-width="6" stroke-linecap="round"/><circle cx="72" cy="75" r="27" fill="#83c96b" stroke="#2e6b45" stroke-width="3"/><circle cx="112" cy="61" r="31" fill="#65b85c" stroke="#2e6b45" stroke-width="3"/><circle cx="132" cy="91" r="24" fill="#9bd774" stroke="#2e6b45" stroke-width="3"/>`;
  } else {
    plant = `<path d="M100 160 L100 77" fill="none" stroke="#805a37" stroke-width="12" stroke-linecap="round"/><path d="M99 116 L61 83 M101 103 L137 68" fill="none" stroke="#805a37" stroke-width="7" stroke-linecap="round"/><circle cx="61" cy="74" r="32" fill="#83c96b" stroke="#2e6b45" stroke-width="3"/><circle cx="100" cy="53" r="38" fill="#5cab57" stroke="#2e6b45" stroke-width="3"/><circle cx="137" cy="75" r="31" fill="#a2d978" stroke="#2e6b45" stroke-width="3"/><circle cx="94" cy="86" r="31" fill="#72c363" stroke="#2e6b45" stroke-width="3"/>`;
  }
  return `<svg viewBox="0 0 200 220" role="img" aria-label="${safeText(treeName())} · ${PLANT_STAGES[stage].name}"><path d="M22 164 Q100 151 178 164" fill="none" stroke="#a3c58e" stroke-width="3" stroke-linecap="round"/><path d="M100 156 Q85 167 74 156 M100 156 Q113 168 126 156" fill="none" stroke="#a3c58e" stroke-width="3" stroke-linecap="round"/>${plant}<g class="tree-badge"><rect x="24" y="180" width="152" height="30" rx="9"/><text x="100" y="200" text-anchor="middle">${safeText(treeName())}</text></g></svg>`;
}
function renderPlant(total) {
  document.querySelectorAll("[data-tree-title]").forEach(el => el.textContent = treeName());
  document.getElementById("plantTitle").textContent = treeName();
  const stageIndex = getStage(total);
  const stage = PLANT_STAGES[stageIndex];
  const next = PLANT_STAGES[stageIndex + 1];
  document.getElementById("plantGraphic").innerHTML = plantSvg(total);
  document.getElementById("heroPlant").innerHTML = plantSvg(total);
  document.getElementById("plantStage").textContent = stage.name;
  document.getElementById("plantDescription").textContent = stage.description;
  let progress = 100;
  if (!next) {
    document.getElementById("progressText").textContent = "Maksimalt plantestadie nået – flot arbejde!";
  } else {
    progress = Math.max(0, Math.min(100, ((total-stage.threshold)/(next.threshold-stage.threshold))*100));
    document.getElementById("progressText").textContent = `${total} point i alt · ${Math.max(0,next.threshold-total)} point til ${next.name.toLowerCase()}`;
  }
  document.getElementById("progressFill").style.width = progress + "%";
  document.getElementById("progressTrack").setAttribute("aria-valuenow", String(Math.round(progress)));
}

/* ---------- Udfordringer ---------- */
// Bygger udfordringskortene én gang. Knapperne opdateres derefter "på stedet" af
// updateChallengeStates(), så tastaturfokus ikke forsvinder hvert sekund under cooldown.
function renderChallenges() {
  const container = document.getElementById("challengeList");
  if (!container.children.length) {
    CHALLENGES.forEach(challenge => {
      const card = document.createElement("div");
      card.className = "challenge";
      card.innerHTML = `<div><h3><span aria-hidden="true">${challenge.icon}</span> ${safeText(challenge.title)}</h3><p>${safeText(challenge.description)}</p><div class="tags"><span class="tag">${challenge.points} point</span><span class="tag">CO₂: ca. ${formatCo2(challenge.co2)}*</span><span class="tag">Vand: ${challenge.water ? "ca. " + challenge.water + " L" : "0 L"}*</span><button class="linklike" type="button" data-method="${challenge.id}" aria-label="Se beregning for ${safeText(challenge.title)}">*Se beregning</button></div></div><div class="challenge-action"><button class="btn primary" type="button" data-challenge="${challenge.id}" aria-describedby="status-${challenge.id}">Registrér handling</button><div class="status" id="status-${challenge.id}"></div></div>`;
      card.querySelector("[data-challenge]").addEventListener("click", () => submitChallenge(challenge.id));
      card.querySelector("[data-method]").addEventListener("click", () => openMethod(challenge.id));
      container.appendChild(card);
    });
  }
  updateChallengeStates();
}
// Opdaterer knappernes tekst og status (brugt i dag, pointloft, cooldown) uden at bygge kortene om.
// Status for en udfordring i dag: "approved", "pending", "rejected" eller "" (ikke brugt).
function todayStatus(data, challengeId, today) {
  if (data.approved.some(x => x.date === today && x.challengeId === challengeId)) return "approved";
  if (data.pending.some(x => x.date === today && x.challengeId === challengeId)) return "pending";
  if (data.rejected.some(x => x.date === today && x.challengeId === challengeId)) return "rejected";
  return "";
}
function updateChallengeStates() {
  const data = classData();
  const today = todayKey();
  const approvedPoints = approvedToday(data);
  const pendingPoints = pendingToday(data);
  const remaining = Math.max(0, CONFIG.dailyPointCap - approvedPoints - pendingPoints);
  const waitSeconds = cooldownLeft(data);
  const labels = {approved:"Godkendt i dag", pending:"Afventer lærer", rejected:"Afvist i dag"};
  CHALLENGES.forEach(challenge => {
    const button = document.querySelector(`[data-challenge="${challenge.id}"]`);
    const status = document.getElementById(`status-${challenge.id}`);
    const used = todayStatus(data, challenge.id, today);
    const overCap = remaining < challenge.points;
    let reason = "Klar til indsendelse";
    if (used === "approved") reason = "Godkendt og talt med i dag";
    else if (used === "pending") reason = "Sendt i dag – venter på læreren";
    else if (used === "rejected") reason = "Afvist af læreren i dag – prøv igen i morgen";
    else if (overCap) reason = `Dagens pointloft: ${remaining} point tilbage`;
    else if (waitSeconds > 0) reason = `Vent ${waitSeconds} sek. før næste registrering`;
    // aria-disabled i stedet for disabled: knappen beholder fokus, og skærmlæsere kan læse årsagen.
    button.setAttribute("aria-disabled", String(!!used || overCap || waitSeconds > 0));
    const text = used ? labels[used] : "Registrér handling";
    if (button.textContent !== text) button.textContent = text;
    // Knappens navn for skærmlæsere indeholder også udfordringens titel, så de 9 knapper kan skelnes.
    button.setAttribute("aria-label", `${text}: ${challenge.title}`);
    if (status.textContent !== reason) status.textContent = reason;
  });
  // Statuslinjen har sit eget element og overskriver derfor ikke feedbackbeskeder.
  document.getElementById("dailyStatus").textContent = `Klasse ${activeClass}: ${approvedPoints + pendingPoints} af ${CONFIG.dailyPointCap} point brugt i dag (${approvedPoints} godkendt, ${pendingPoints} afventer).`;
}
function submitChallenge(id) {
  const data = classData();
  const challenge = challengeById(id);
  if (!challenge) return;
  const today = todayKey();
  // Fusk-regel 1: én registrering pr. udfordring pr. dag pr. klasse (også hvis den blev afvist).
  if (todayStatus(data, id, today)) {
    showToast("Denne udfordring er allerede registreret i dag.", true); render(); return;
  }
  // Fusk-regel 2: dagligt pointloft (godkendte + ventende point tæller med).
  if (approvedToday(data) + pendingToday(data) + challenge.points > CONFIG.dailyPointCap) {
    showToast(`Denne handling vil overskride klassens daglige pointloft på ${CONFIG.dailyPointCap} point.`, true); render(); return;
  }
  // Fusk-regel 4: cooldown mellem indsendelser.
  if (cooldownLeft(data) > 0) {
    showToast(`Vent ${cooldownLeft(data)} sekunder, før I sender igen.`, true); render(); return;
  }
  // Fusk-regel 3: indsendelsen lægges i kø og tæller først, når læreren godkender.
  data.pending.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
    challengeId:id, title:challenge.title, date:today, points:challenge.points,
    co2:challenge.co2, water:challenge.water, submittedAt:Date.now()
  });
  data.lastSubmission = Date.now();
  saveState();
  showToast("Forespørgslen er sendt og afventer lærerens godkendelse.");
  render();
  startCooldownRefresh();
}
// Opdaterer nedtællingen hvert sekund, så længe den valgte klasse har cooldown.
// Kaldes efter indsendelse, ved klasseskift OG når siden indlæses (fx efter genindlæsning).
function startCooldownRefresh() {
  if (cooldownTimer) clearInterval(cooldownTimer);
  cooldownTimer = null;
  if (cooldownLeft(classData()) <= 0) return;
  cooldownTimer = setInterval(() => {
    updateChallengeStates();
    if (cooldownLeft(classData()) <= 0) {
      clearInterval(cooldownTimer); cooldownTimer = null;
    }
  }, 1000);
}

/* ---------- "Sådan har vi regnet" ---------- */
function renderMethods() {
  const levels = {høj:"Pålidelighed: høj", middel:"Pålidelighed: middel", lav:"Pålidelighed: lav"};
  document.getElementById("methodList").innerHTML = CHALLENGES.map(c => `
    <article class="method" id="method-${c.id}" tabindex="-1" aria-labelledby="method-title-${c.id}">
      <h3 id="method-title-${c.id}"><span aria-hidden="true">${c.icon}</span> ${safeText(c.title)} <span class="tag">ca. ${formatCo2(c.co2)} CO₂</span><span class="tag">${c.water} L vand</span><span class="conf">${levels[c.confidence] || ""}</span></h3>
      <p><strong>Antagelse og udregning:</strong> ${safeText(c.method)}</p>
      <p><strong>Vand:</strong> ${safeText(c.waterMethod)}</p>
      <p class="check"><strong>Usikkerhed:</strong> ${safeText(c.check)}</p>
      <p class="small">Kilder (set 25.10.2026): ${c.sources.map(s => `<a href="${safeText(s.url)}" target="_blank" rel="noopener">${safeText(s.label)}</a>`).join(" · ")}</p>
    </article>`).join("");
}
// Åbner "Sådan har vi regnet" og hopper til den valgte udfordring.
function openMethod(id) {
  if (location.hash && location.hash !== "#klassen") location.hash = "klassen";
  const details = document.getElementById("methodDetails");
  details.open = true;
  const target = document.getElementById(`method-${id}`);
  target.scrollIntoView({behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start"});
  target.focus({preventScroll:true});
}

/* ---------- Elevernes oversigt over ventende ---------- */
function renderPending() {
  const data = classData();
  document.getElementById("pendingBadge").textContent = data.pending.length;
  const list = document.getElementById("pendingList");
  list.innerHTML = "";
  if (!data.pending.length) {
    list.innerHTML = '<div class="empty">Ingen forespørgsler afventer lige nu.</div>';
    return;
  }
  data.pending.slice().sort((a,b)=>a.submittedAt-b.submittedAt).forEach(item=>{
    const el = document.createElement("div");
    el.className = "pending-item";
    const old = daysAgo(item.date) > 0;
    el.innerHTML = `<strong>${safeText(item.title)}</strong><p>${item.points} point · ${safeText(formatDate(item.date))}</p><span class="tag ${old ? "old" : ""}">Afventer · ${safeText(ageLabel(item.date))}</span>`;
    list.appendChild(el);
  });
}
// Klasseligaen sammenligner KUN klasser – aldrig enkelte elever (social bæredygtighed).
// Den rangerer efter denne uges point og starter forfra hver mandag, så alle klasser kan vinde.
function renderLeague() {
  const monday = mondayOf(todayKey());
  const entries = CLASS_NAMES.map(name => ({
    name,
    week: weekPoints(classData(name), monday),
    total: totalApproved(classData(name)).points
  })).sort((a,b) => b.week - a.week || b.total - a.total);
  const list = document.getElementById("leagueList");
  list.innerHTML = "";
  entries.forEach((entry,index)=>{
    const el = document.createElement("div");
    el.className = "league-row" + (entry.name === activeClass ? " current" : "");
    el.innerHTML = `<div class="rank">${index+1}</div><div><strong>${safeText(entry.name)}</strong><div class="small">${entry.name === activeClass ? "Jeres klasse · " : ""}${entry.total} point i alt</div></div><div class="points">${entry.week} pt.</div>`;
    list.appendChild(el);
  });
  const note = demoState ? " Tallene er demo-data." : " Kun data fra denne browser.";
  document.getElementById("leagueNote").textContent = "Klasser dyster mod klasser – aldrig elev mod elev. Ligaen starter forfra hver mandag, så alle klasser kan vinde." + note;
}

/* ---------- Klassens ugemål ---------- */
function renderGoal() {
  const data = classData();
  const today = todayKey();
  const points = weekPoints(data, mondayOf(today));
  const goal = data.weeklyGoal;
  const pct = Math.min(100, Math.round(points / goal * 100));
  document.getElementById("goalWeek").textContent = `Uge ${weekNumber(today)}`;
  document.getElementById("goalNumbers").textContent = `${points} / ${goal}`;
  document.getElementById("goalFill").style.width = pct + "%";
  document.getElementById("goalTrack").setAttribute("aria-valuenow", String(pct));
  const text = document.getElementById("goalText");
  text.textContent = points >= goal ? "Ugemålet er nået – flot klaret! 🎉" : `${goal - points} point mangler for at nå ugemålet.`;
  text.classList.toggle("goal-done", points >= goal);
  const input = document.getElementById("goalInput");
  if (document.activeElement !== input) input.value = goal;
}
function setWeeklyGoal(value) {
  const goal = Math.round(Number(value) / 5) * 5;
  if (!Number.isFinite(goal) || goal < 5 || goal > 75) {
    showToast("Ugemålet skal være mellem 5 og 75 point (i spring af 5). Højst 15 point om dagen i 5 skoledage = 75.", true);
    return;
  }
  classData().weeklyGoal = goal;
  saveState();
  render();
  showToast(`Klasse ${activeClass} har nu et ugemål på ${goal} point.`);
}

/* ---------- Graf: point pr. uge (inline SVG – ingen eksterne biblioteker) ---------- */
function weeklySeries(data, weeks = 8) {
  const thisMonday = mondayOf(todayKey());
  const series = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const monday = addDays(thisMonday, -7 * i);
    series.push({monday, week: weekNumber(monday), points: weekPoints(data, monday)});
  }
  return series;
}
// Tegnes både i lærerområdet (med tabel og tastaturfokus på søjlerne) og som en lille graf på klassens side.
function renderWeekChart(boxId = "weekChart", tableId = "weekTable", H = 230) {
  const data = classData();
  const series = weeklySeries(data);
  const goal = data.weeklyGoal;
  const focusable = !!tableId;
  // Mål og marginer for grafen. Bredden følger boksen, så teksten er lige stor på mobil og computer.
  const box = document.getElementById(boxId);
  const W = chartWidth(box), left = 34, right = 62, top = 16, bottom = 30;
  const plotW = W - left - right, plotH = H - top - bottom;
  const maxValue = Math.max(goal, ...series.map(s => s.points), 10);
  const yMax = Math.ceil(maxValue / 10) * 10;
  const y = v => top + plotH - (v / yMax) * plotH;
  const slot = plotW / series.length;
  const barW = Math.min(24, slot * 0.6);
  let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Søjlediagram over godkendte point pr. uge. ${series.map(s => `Uge ${s.week}: ${s.points} point`).join(", ")}. Ugemål: ${goal} point.">`;
  // Vandrette hjælpelinjer (tynde og diskrete)
  for (let v = 0; v <= yMax; v += yMax / 4) {
    svg += `<line x1="${left}" x2="${W - right}" y1="${y(v)}" y2="${y(v)}" stroke="var(--viz-grid)" stroke-width="1"/>`;
    svg += `<text x="${left - 6}" y="${y(v) + 4}" text-anchor="end">${v}</text>`;
  }
  series.forEach((s, i) => {
    const cx = left + slot * i + slot / 2;
    const h = Math.max(0, y(0) - y(s.points));
    const x = cx - barW / 2;
    const r = Math.min(4, h);
    // Søjle med 4px runde hjørner i toppen og flad bund
    const path = h > 0 ? `M${x},${y(0)} V${y(s.points) + r} Q${x},${y(s.points)} ${x + r},${y(s.points)} H${x + barW - r} Q${x + barW},${y(s.points)} ${x + barW},${y(s.points) + r} V${y(0)} Z` : "";
    // Usynligt, større område gør det let at holde musen over eller tabbe til søjlen
    svg += `<rect class="bar-hit" x="${cx - slot / 2 + 1}" y="${top}" width="${slot - 2}" height="${plotH}"${focusable ? ' tabindex="0"' : ""} data-tip="Uge ${s.week}|${s.points} point" aria-label="Uge ${s.week}: ${s.points} point"/>`;
    svg += `<path class="bar" d="${path}"/>`;
    const isCurrent = i === series.length - 1;
    svg += `<text x="${cx}" y="${H - 10}" text-anchor="middle" class="${isCurrent ? "label-strong" : ""}">${isCurrent ? (W < 420 ? "Nu" : "Denne uge") : (W < 420 ? "" : "u.") + s.week}</text>`;
    if (isCurrent || s.points === Math.max(...series.map(t => t.points))) {
      svg += `<text x="${cx}" y="${y(s.points) - 6}" text-anchor="middle" class="label-strong">${s.points}</text>`;
    }
  });
  // Ugemålet som en vandret referencelinje med etiket
  svg += `<line x1="${left}" x2="${W - right}" y1="${y(goal)}" y2="${y(goal)}" stroke="var(--text)" stroke-width="2" opacity=".55"/>`;
  svg += `<text x="${W - right + 6}" y="${y(goal) + 4}" class="label-strong">Mål ${goal}</text>`;
  svg += `<line x1="${left}" x2="${W - right}" y1="${y(0)}" y2="${y(0)}" stroke="var(--viz-axis)" stroke-width="1"/>`;
  svg += `</svg><div class="viz-tip" hidden></div>`;
  box.innerHTML = svg;
  attachTooltips(box);
  if (!tableId) return;
  // Tabelvisning – samme tal uden graf (til skærmlæsere og til dem, der foretrækker tal)
  document.getElementById(tableId).innerHTML = `<table class="data-table"><thead><tr><th>Uge</th><th>Starter</th><th class="num">Godkendte point</th><th class="num">Ugemål nået?</th></tr></thead><tbody>${
    series.map(s => `<tr><td>Uge ${s.week}</td><td>${safeText(formatDate(s.monday))}</td><td class="num">${s.points}</td><td class="num">${s.points >= goal ? "Ja" : "Nej"}</td></tr>`).join("")
  }</tbody></table>`;
}
// Grafens bredde i pixels = boksens bredde (640 hvis boksen er skjult lige nu).
function chartWidth(box) { return Math.max(300, Math.round(box.clientWidth || 640)); }
// Viser en lille boks med værdien, når man holder musen over eller tabber til en søjle.
function attachTooltips(box) {
  const tip = box.querySelector(".viz-tip");
  const show = target => {
    const [title, value] = target.dataset.tip.split("|");
    tip.innerHTML = "";
    const strong = document.createElement("strong");
    strong.textContent = value;
    tip.append(strong, document.createTextNode(title));
    const boxRect = box.getBoundingClientRect();
    const rect = target.getBoundingClientRect();
    tip.style.left = `${rect.left - boxRect.left + rect.width / 2}px`;
    tip.style.top = `${Math.max(40, rect.top - boxRect.top + rect.height * 0.35)}px`;
    tip.hidden = false;
  };
  box.querySelectorAll("[data-tip]").forEach(el => {
    el.addEventListener("pointerenter", () => show(el));
    el.addEventListener("focus", () => show(el));
    el.addEventListener("pointerleave", () => { tip.hidden = true; });
    el.addEventListener("blur", () => { tip.hidden = true; });
  });
}

/* ---------- Eksport som CSV (regneark) ---------- */
// Bruger semikolon og decimalkomma, så filen åbner pænt i dansk Excel.
function csvCell(value) {
  const text = String(value ?? "");
  return /[;"\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}
function exportCsv() {
  const data = classData();
  const rows = [["Klasse","Dato","Uge","Udfordring","Point","Status","Anslået CO2 (kg)","Anslået vand (L)","Datakilde"]];
  const add = (item, status) => {
    const est = estimateFor(item);
    rows.push([activeClass, item.date, weekNumber(item.date), item.title, item.points, status,
      formatNumber(est.co2, 2), formatNumber(est.water, 0), demoState ? "Demo (opdigtet)" : "Klassens egne data"]);
  };
  data.approved.forEach(item => add(item, "Godkendt"));
  data.pending.forEach(item => add(item, "Afventer"));
  data.rejected.forEach(item => add(item, "Afvist"));
  rows.splice(1, rows.length - 1, ...rows.slice(1).sort((a,b) => a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0));
  const csv = "﻿" + rows.map(row => row.map(csvCell).join(";")).join("\r\n"); // ﻿ = så Excel læser æ, ø og å rigtigt
  const blob = new Blob([csv], {type:"text/csv;charset=utf-8"});
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${demoState ? "DEMO-" : ""}groklassen-${activeClass.replace(/\W/g, "")}-${todayKey()}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  showToast(`CSV med ${rows.length - 1} rækker er downloadet.`);
}
// CO₂ og vand beregnes ud fra udfordringens aktuelle estimat (så alle tal bruger samme metode).
function estimateFor(item) {
  const challenge = challengeById(item.challengeId);
  return challenge ? {co2: challenge.co2, water: challenge.water} : {co2: item.co2 || 0, water: item.water || 0};
}

/* ---------- QR-kode (uden biblioteker) ----------
   En lille QR-generator efter standarden (ISO/IEC 18004): byte-tilstand, fejlkorrektion M, version 1–10
   (op til ca. 200 tegn). makeQr(tekst) giver en matrix af true/false, qrSvg(tekst) giver en SVG. */
const QR_ECC_PER_BLOCK = [0, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26]; // Fejlkorrektion M, version 1–10
const QR_BLOCKS        = [0, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5];
function qrRawModules(ver) {
  let n = (16 * ver + 128) * ver + 64;
  if (ver >= 2) { const align = Math.floor(ver / 7) + 2; n -= (25 * align - 10) * align - 55; if (ver >= 7) n -= 36; }
  return n;
}
function qrDataCodewords(ver) { return Math.floor(qrRawModules(ver) / 8) - QR_ECC_PER_BLOCK[ver] * QR_BLOCKS[ver]; }
// Multiplikation i Galois-feltet GF(256), som Reed-Solomon-fejlkorrektionen regner i.
function qrMul(x, y) {
  let z = 0;
  for (let i = 7; i >= 0; i--) { z = (z << 1) ^ ((z >>> 7) * 0x11d); z ^= ((y >>> i) & 1) * x; }
  return z;
}
function qrEcc(data, degree) {
  const divisor = new Array(degree).fill(0); divisor[degree - 1] = 1;
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < degree; j++) { divisor[j] = qrMul(divisor[j], root); if (j + 1 < degree) divisor[j] ^= divisor[j + 1]; }
    root = qrMul(root, 2);
  }
  const rest = new Array(degree).fill(0);
  data.forEach(b => {
    const factor = b ^ rest.shift(); rest.push(0);
    divisor.forEach((coef, i) => { rest[i] ^= qrMul(coef, factor); });
  });
  return rest;
}
function makeQr(text) {
  const bytes = [...new TextEncoder().encode(text)];
  let ver = 1;
  while (ver <= 10 && 4 + (ver < 10 ? 8 : 16) + bytes.length * 8 > qrDataCodewords(ver) * 8) ver++;
  if (ver > 10) throw new Error("Teksten er for lang til QR-koden");
  // 1) Data som bits: tilstand (0100 = byte), længde, selve bytes, afslutning og fyld.
  const bits = [];
  const put = (value, len) => { for (let i = len - 1; i >= 0; i--) bits.push((value >>> i) & 1); };
  put(4, 4); put(bytes.length, ver < 10 ? 8 : 16); bytes.forEach(b => put(b, 8));
  const capacity = qrDataCodewords(ver) * 8;
  put(0, Math.min(4, capacity - bits.length));
  put(0, (8 - bits.length % 8) % 8);
  for (let pad = 0xec; bits.length < capacity; pad ^= 0xec ^ 0x11) put(pad, 8);
  const data = [];
  for (let i = 0; i < bits.length; i += 8) data.push(parseInt(bits.slice(i, i + 8).join(""), 2));
  // 2) Del i blokke, tilføj fejlkorrektion, og flet blokkene sammen.
  const blocks = QR_BLOCKS[ver], eccLen = QR_ECC_PER_BLOCK[ver], raw = Math.floor(qrRawModules(ver) / 8);
  const shortBlocks = blocks - raw % blocks, shortLen = Math.floor(raw / blocks);
  const parts = [];
  for (let i = 0, k = 0; i < blocks; i++) {
    const chunk = data.slice(k, k + shortLen - eccLen + (i < shortBlocks ? 0 : 1));
    k += chunk.length;
    const ecc = qrEcc(chunk, eccLen);
    if (i < shortBlocks) chunk.push(0);
    parts.push(chunk.concat(ecc));
  }
  const codewords = [];
  for (let i = 0; i < parts[0].length; i++) parts.forEach((part, j) => { if (i !== shortLen - eccLen || j >= shortBlocks) codewords.push(part[i]); });
  // 3) Tegn de faste mønstre (findere, timing, alignment, version) og reservér formatfelterne.
  const size = ver * 4 + 17;
  const grid = Array.from({length: size}, () => new Array(size).fill(false));
  const fixed = Array.from({length: size}, () => new Array(size).fill(false));
  const set = (x, y, dark) => { grid[y][x] = dark; fixed[y][x] = true; };
  for (let i = 0; i < size; i++) { set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0); }
  [[3, 3], [size - 4, 3], [3, size - 4]].forEach(([cx, cy]) => {
    for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
      const x = cx + dx, y = cy + dy, d = Math.max(Math.abs(dx), Math.abs(dy));
      if (x >= 0 && x < size && y >= 0 && y < size) set(x, y, d !== 2 && d !== 4);
    }
  });
  const align = [];
  if (ver > 1) {
    const count = Math.floor(ver / 7) + 2, step = Math.ceil((ver * 4 + 4) / (count * 2 - 2)) * 2;
    align.push(6);
    for (let pos = size - 7; align.length < count; pos -= step) align.splice(1, 0, pos);
  }
  align.forEach((ax, i) => align.forEach((ay, j) => {
    if ((i === 0 && j === 0) || (i === 0 && j === align.length - 1) || (i === align.length - 1 && j === 0)) return;
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) set(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
  }));
  const drawFormat = mask => {
    const value = (0 << 3) | mask; // 0 = fejlkorrektion M
    let rem = value;
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    const f = ((value << 10) | rem) ^ 0x5412;
    const bit = i => ((f >>> i) & 1) === 1;
    for (let i = 0; i <= 5; i++) set(8, i, bit(i));
    set(8, 7, bit(6)); set(8, 8, bit(7)); set(7, 8, bit(8));
    for (let i = 9; i < 15; i++) set(14 - i, 8, bit(i));
    for (let i = 0; i < 8; i++) set(size - 1 - i, 8, bit(i));
    for (let i = 8; i < 15; i++) set(8, size - 15 + i, bit(i));
    set(8, size - 8, true);
  };
  drawFormat(0);
  if (ver >= 7) {
    let rem = ver;
    for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
    const v = (ver << 12) | rem;
    for (let i = 0; i < 18; i++) { const dark = ((v >>> i) & 1) === 1, a = size - 11 + i % 3, b = Math.floor(i / 3); set(a, b, dark); set(b, a, dark); }
  }
  // 4) Placér data i zigzag nedefra og op, to kolonner ad gangen.
  let n = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++) for (let j = 0; j < 2; j++) {
      const x = right - j, y = ((right + 1) & 2) === 0 ? size - 1 - vert : vert;
      if (!fixed[y][x] && n < codewords.length * 8) { grid[y][x] = ((codewords[n >>> 3] >>> (7 - (n & 7))) & 1) === 1; n++; }
    }
  }
  // 5) Prøv alle 8 masker, og vælg den, der giver færrest forvirrende mønstre (strafpoint efter standarden).
  const masks = [
    (x, y) => (x + y) % 2 === 0, (x, y) => y % 2 === 0, (x, y) => x % 3 === 0, (x, y) => (x + y) % 3 === 0,
    (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0, (x, y) => x * y % 2 + x * y % 3 === 0,
    (x, y) => (x * y % 2 + x * y % 3) % 2 === 0, (x, y) => ((x + y) % 2 + x * y % 3) % 2 === 0
  ];
  const applyMask = m => { for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (!fixed[y][x] && masks[m](x, y)) grid[y][x] = !grid[y][x]; };
  const penalty = () => {
    let score = 0, dark = 0;
    const line = get => {
      let run = 1;
      for (let i = 1; i <= size; i++) {
        if (i < size && get(i) === get(i - 1)) run++;
        else { if (run >= 5) score += run - 2; run = 1; }
      }
      for (let i = 0; i + 11 <= size; i++) {
        const s = Array.from({length: 11}, (_, k) => get(i + k) ? 1 : 0).join("");
        if (s === "10111010000" || s === "00001011101") score += 40;
      }
    };
    for (let k = 0; k < size; k++) { line(i => grid[k][i]); line(i => grid[i][k]); }
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      if (grid[y][x]) dark++;
      if (x < size - 1 && y < size - 1 && grid[y][x] === grid[y][x + 1] && grid[y][x] === grid[y + 1][x] && grid[y][x] === grid[y + 1][x + 1]) score += 3;
    }
    return score + Math.floor(Math.abs(dark * 20 - size * size * 10) / (size * size)) * 10;
  };
  let best = 0, bestScore = Infinity;
  for (let m = 0; m < 8; m++) {
    applyMask(m); drawFormat(m);
    const score = penalty();
    if (score < bestScore) { best = m; bestScore = score; }
    applyMask(m);
  }
  applyMask(best); drawFormat(best);
  return grid;
}
// QR-koden som SVG: sort på hvidt med en hvid kant (4 moduler), så den kan scannes i både lys og mørk tilstand.
function qrSvg(text, label) {
  const grid = makeQr(text), size = grid.length, total = size + 8;
  let path = "";
  grid.forEach((row, y) => row.forEach((dark, x) => { if (dark) path += `M${x + 4} ${y + 4}h1v1h-1z`; }));
  return `<svg class="qr" viewBox="0 0 ${total} ${total}" role="img" aria-label="${safeText(label || "QR-kode")}" shape-rendering="crispEdges"><rect width="${total}" height="${total}" fill="#fff"/><path d="${path}" fill="#000"/></svg>`;
}

/* ---------- Holdets data (TEAM_DATA) ---------- */
function teamFilled(key) { return String(TEAM_DATA[key] || "").trim() !== ""; }
// Holdets tekst som HTML: det udfyldte felt (med tekst før/efter), ellers standardteksten – eller "" (skjul linjen).
function teamHtml(key, before = "", after = "") {
  if (teamFilled(key)) return safeText(before + String(TEAM_DATA[key]).trim() + after);
  return safeText(TEAM_FALLBACK[key] || "");
}
// Indsætter holdets data i alle elementer med data-team="..." (og evt. data-before/data-after).
// Er feltet tomt, skjules linjen: det nærmeste element med data-team-line (ellers selve elementet).
function applyTeamData(root = document) {
  root.querySelectorAll("[data-team]").forEach(el => {
    const html = teamHtml(el.dataset.team, el.dataset.before || "", el.dataset.after || "");
    el.innerHTML = html;
    (el.closest("[data-team-line]") || el).hidden = !html;
  });
}
// Adressen, som QR-koden og "Del" peger på.
function publicUrl() {
  if (teamFilled("publicUrl")) return String(TEAM_DATA.publicUrl).trim();
  return /^https?:$/.test(location.protocol) ? location.origin + location.pathname : TEAM_FALLBACK.publicUrl;
}
function demoUrl() {
  const url = new URL(publicUrl());
  url.searchParams.set("demo", "1");
  return url.href;
}

/* ---------- Økonomi: to beregnere (kommuner og sponsorater) ----------
   Hver beregner har egne felter, KPI'er, forklaring, graf og tabel. Tekst, KPI, tabel og graf bruger samme formler. */
const MUNI_FIELDS = {deals:"muniDeals", price:"muniPrice", schoolsPer:"muniSchoolsPer", singles:"muniSingles", singlePrice:"muniSinglePrice", pupils:"muniPupils",
  variable:"muniVariable", hosting:"muniHosting", support:"muniSupport", dev:"muniDev", salary:"muniSalary"};
const SPONSOR_FIELDS = {supporter:"spSupporter", partner:"spPartner", main:"spMain", supporterPrice:"spSupporterPrice", partnerPrice:"spPartnerPrice", mainPrice:"spMainPrice",
  issues:"spIssues", recipients:"spRecipients", production:"spProduction", sales:"spSales", distribution:"spDistribution"};
function formatKr(value) { return `${value < 0 ? "−" : ""}${formatNumber(Math.abs(Math.round(value)))} kr.`; }
function signedKr(value) { return (value >= 0 ? "+" : "") + formatKr(value); }
function plural(n, one, many) { return `${formatNumber(n)} ${n === 1 ? one : many}`; }
function readFields(fields) {
  const values = {};
  Object.entries(fields).forEach(([key, id]) => { const n = Number(document.getElementById(id).value); values[key] = Number.isFinite(n) && n >= 0 ? n : 0; });
  return values;
}
function setFields(fields, values) { Object.entries(fields).forEach(([key, id]) => { document.getElementById(id).value = values[key]; }); }
function matchScenario(scenarios, fields, v) { return Object.keys(scenarios).find(key => Object.keys(fields).every(f => scenarios[key][f] === v[f])) || null; }
// Kommuner og skoler: break-even = det mindste antal kommuneaftaler, hvor indtægten dækker omkostningerne (med de valgte enkeltskoler).
//   indtægt(d)      = d × pris pr. aftale + enkeltskoler × pris pr. skolelicens
//   omkostninger(d) = faste omkostninger + (d × skoler pr. aftale + enkeltskoler) × variable omkostninger pr. skole
function calcMuni(v) {
  const fixed = v.hosting + v.support + v.dev + v.salary;
  const dealMargin = v.price - v.schoolsPer * v.variable;
  const rest = fixed - v.singles * (v.singlePrice - v.variable);
  const revenueAt = d => d * v.price + v.singles * v.singlePrice;
  const costsAt = d => fixed + (d * v.schoolsPer + v.singles) * v.variable;
  const breakEven = rest <= 0 ? 0 : dealMargin > 0 ? Math.ceil(rest / dealMargin) : null;
  const revenue = revenueAt(v.deals), costs = costsAt(v.deals);
  const pupils = v.schoolsPer * v.pupils;
  return {fixed, dealMargin, rest, revenueAt, costsAt, revenue, costs, result: revenue - costs, breakEven, x: v.deals, perPupil: pupils > 0 ? v.price / pupils : null};
}
// Sponsorater: break-even = det mindste antal sponsorer (ved scenariets gennemsnitspris), der dækker nyhedsbrevets omkostninger.
//   indtægt(n)      = n × gennemsnitspris pr. sponsor
//   omkostninger(n) = nyhedsbreve × produktion + udsendelse + n × salg og administration
function calcSponsor(v) {
  const count = v.supporter + v.partner + v.main;
  const revenue = v.supporter * v.supporterPrice + v.partner * v.partnerPrice + v.main * v.mainPrice;
  const fixed = v.issues * v.production + v.distribution;
  const avg = count ? revenue / count : v.partnerPrice;
  const margin = avg - v.sales;
  const revenueAt = n => n * avg, costsAt = n => fixed + n * v.sales;
  const breakEven = fixed <= 0 ? 0 : margin > 0 ? Math.ceil(fixed / margin) : null;
  const costs = costsAt(count);
  return {count, avg, fixed, margin, revenueAt, costsAt, revenue, costs, result: revenue - costs, breakEven, x: count,
    perRecipient: v.recipients > 0 && v.issues > 0 ? revenue / (v.recipients * v.issues) : null};
}
function muniBreakEvenText(v, e) {
  if (e.breakEven === null) return "–";
  return plural(e.breakEven, "kommuneaftale", "kommuneaftaler") + (v.singles ? ` + ${plural(v.singles, "skolelicens", "skolelicenser")}` : "");
}
function sponsorBreakEvenText(e) { return e.breakEven === null ? "–" : plural(e.breakEven, "sponsor", "sponsorer"); }
// Tallene fra de to "forventet"-scenarier – bruges i pitchen og på A4, så tallene er ens overalt.
function expectedEconomy() {
  const mv = MUNI_SCENARIOS.expected, sv = SPONSOR_SCENARIOS.expected;
  const m = calcMuni(mv), sp = calcSponsor(sv);
  return {mv, sv, m, sp, total: m.result + sp.result};
}
function setKpi(id, text, negative) { const el = document.getElementById(id); el.textContent = text; if (negative !== undefined) el.classList.toggle("negative", negative); }
function renderMuni() {
  const v = readFields(MUNI_FIELDS), e = calcMuni(v);
  setKpi("muniRevenue", formatKr(e.revenue)); setKpi("muniCosts", formatKr(e.costs)); setKpi("muniResult", signedKr(e.result), e.result < 0);
  setKpi("muniBreakEven", e.breakEven === null ? "–" : plural(e.breakEven, "kommuneaftale", "kommuneaftaler"));
  document.getElementById("muniBreakEvenLabel").textContent = v.singles ? `Break-even (med ${plural(v.singles, "skolelicens", "skolelicenser")})` : "Break-even";
  setKpi("muniPerPupil", e.perPupil === null ? "–" : `${formatNumber(e.perPupil, 2)} kr.`);
  const salary = v.salary ? ` (heraf ${formatKr(v.salary)} i løn)` : " (ingen løn – frivilligt arbejde i prototypefasen)";
  document.getElementById("muniExplain").textContent = `Faste omkostninger: ${formatKr(e.fixed)} om året${salary}. ` +
    (e.breakEven === null ? "En kommuneaftale skal koste mere end de variable omkostninger for dens skoler – ellers nås break-even aldrig."
      : e.breakEven === 0 ? "Skolelicenserne dækker allerede de faste omkostninger – break-even ved 0 kommuneaftaler."
      : `Hver kommuneaftale bidrager med ${formatKr(e.dealMargin)} efter variable omkostninger, så der skal ${muniBreakEvenText(v, e)} til. En aftale svarer til ca. ${e.perPupil === null ? "–" : formatNumber(e.perPupil, 2)} kr. pr. elev pr. år (${formatNumber(v.pupils)} elever pr. skole).`);
  renderScenarioButtons("muni", MUNI_SCENARIOS, MUNI_FIELDS, v);
  renderEconChart({box: "muniChart", table: "muniTable", one: "kommuneaftale", many: "kommuneaftaler", head: "Kommuneaftaler", selected: v.deals, e});
  return e;
}
function renderSponsor() {
  const v = readFields(SPONSOR_FIELDS), e = calcSponsor(v);
  setKpi("spRevenue", formatKr(e.revenue)); setKpi("spCosts", formatKr(e.costs)); setKpi("spResult", signedKr(e.result), e.result < 0);
  setKpi("spBreakEven", sponsorBreakEvenText(e));
  setKpi("spPerRecipient", e.perRecipient === null ? "–" : `${formatNumber(e.perRecipient, 2)} kr.`);
  document.getElementById("spExplain").textContent = `Nyhedsbrevet koster ${formatKr(e.fixed)} om året (${plural(v.issues, "nyhedsbrev", "nyhedsbreve")} × ${formatKr(v.production)} + ${formatKr(v.distribution)} til udsendelse) plus ${formatKr(v.sales)} i salg og administration pr. sponsor. ` +
    (e.breakEven === null ? "Gennemsnitsprisen pr. sponsor skal være højere end salg og administration – ellers nås break-even aldrig."
      : `Ved en gennemsnitspris på ${formatKr(e.avg)} pr. sponsor skal der ${sponsorBreakEvenText(e)} til. Med ${formatNumber(v.recipients)} modtagere er prisen ca. ${e.perRecipient === null ? "–" : formatNumber(e.perRecipient, 2)} kr. pr. modtager pr. nyhedsbrev.`);
  renderScenarioButtons("sp", SPONSOR_SCENARIOS, SPONSOR_FIELDS, v);
  renderEconChart({box: "spChart", table: "spTable", one: "sponsor", many: "sponsorer", head: "Sponsorer", selected: e.count, e});
  return e;
}
function renderEconomy() {
  const m = renderMuni(), sp = renderSponsor();
  const total = m.result + sp.result;
  document.getElementById("econTotal").textContent = `Samlet: kommuner ${signedKr(m.result)} + sponsorater ${signedKr(sp.result)} = ${signedKr(total)} om året.`;
}
function renderScenarioButtons(prefix, scenarios, fields, v) {
  const active = matchScenario(scenarios, fields, v);
  document.querySelectorAll(`[data-${prefix}-scenario]`).forEach(btn => btn.setAttribute("aria-pressed", String(btn.dataset[`${prefix}Scenario`] === active)));
  document.getElementById(`${prefix}ScenarioNote`).textContent = active ? `Viser scenariet "${scenarios[active].label}" (forudsætninger).` : "Egne tal (forudsætninger).";
}
// Linjediagram: indtægt og omkostninger ved 0..N aftaler/sponsorer. Hvor linjerne krydser, er break-even.
function renderEconChart(c) {
  const e = c.e, CAP = 200;
  const maxX = Math.min(CAP, Math.max(5, Math.ceil(Math.max(c.selected, (e.breakEven || 0) * 1.6, 4))));
  const xStep = maxX <= 10 ? 1 : maxX <= 25 ? 5 : maxX <= 60 ? 10 : 25;
  const points = [];
  for (let n = 0; n <= maxX; n++) points.push({n, revenue: e.revenueAt(n), costs: e.costsAt(n)});
  const box = document.getElementById(c.box);
  const W = chartWidth(box), H = 230, left = 62, right = W < 420 ? 82 : 96, top = 20, bottom = 34;
  const plotW = W - left - right, plotH = H - top - bottom;
  const yMaxRaw = Math.max(...points.map(p => Math.max(p.revenue, p.costs)), 1);
  const step = Math.pow(10, Math.floor(Math.log10(yMaxRaw / 4)));
  const nice = [1, 2, 2.5, 5, 10].map(m => m * step).find(m => yMaxRaw / m <= 4) || step * 10;
  const yMax = Math.ceil(yMaxRaw / nice) * nice;
  const x = n => left + (n / maxX) * plotW, y = val => top + plotH - (val / yMax) * plotH;
  const line = key => points.map((p, i) => `${i ? "L" : "M"}${x(p.n).toFixed(1)},${y(p[key]).toFixed(1)}`).join(" ");
  const beText = e.breakEven === null ? "Ingen break-even med disse tal" : `Break-even: ${plural(e.breakEven, c.one, c.many)}`;
  let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Indtægt og omkostninger ved 0 til ${maxX} ${c.many}. ${beText}.">`;
  for (let val = 0; val <= yMax + 1; val += nice) svg += `<line x1="${left}" x2="${W - right}" y1="${y(val)}" y2="${y(val)}" stroke="var(--viz-grid)" stroke-width="1"/><text x="${left - 6}" y="${y(val) + 4}" text-anchor="end">${formatNumber(val)}</text>`;
  for (let n = 0; n <= maxX; n += xStep) svg += `<text x="${x(n)}" y="${H - 14}" text-anchor="middle">${n}</text>`;
  svg += `<text x="${left + plotW / 2}" y="${H}" text-anchor="middle">Antal ${c.many}</text>`;
  svg += `<path d="${line("costs")}" fill="none" stroke="var(--series-b)" stroke-width="2" stroke-linejoin="round"/><path d="${line("revenue")}" fill="none" stroke="var(--series-a)" stroke-width="2" stroke-linejoin="round"/>`;
  const last = points[points.length - 1];
  svg += `<text x="${W - right + 8}" y="${y(last.revenue) + 4}" class="label-strong">Indtægt</text><text x="${W - right + 8}" y="${y(last.costs) + (Math.abs(y(last.costs) - y(last.revenue)) < 14 ? 16 : 4)}" class="label-strong">Omkostninger</text>`;
  if (e.breakEven !== null && e.breakEven <= maxX) {
    const bx = x(e.breakEven), by = y(e.revenueAt(e.breakEven)), roomLeft = bx - left > 170;
    svg += `<circle cx="${bx}" cy="${by}" r="5" fill="var(--text)" stroke="var(--panel)" stroke-width="2"/><text class="label-strong be-label" x="${roomLeft ? bx - 8 : bx + 8}" y="${roomLeft ? by - 12 : by + 20}" text-anchor="${roomLeft ? "end" : "start"}">${beText}</text>`;
  } else svg += `<text class="label-strong be-label" x="${left + 8}" y="${top + 4}">${e.breakEven === null ? beText : `${beText} – uden for grafen`}</text>`;
  if (c.selected <= maxX) svg += `<line x1="${x(c.selected)}" x2="${x(c.selected)}" y1="${top}" y2="${y(0)}" stroke="var(--text)" stroke-width="1" opacity=".35"/>`;
  points.forEach(p => { const w = plotW / maxX; svg += `<rect class="bar-hit" x="${x(p.n) - w / 2}" y="${top}" width="${w}" height="${plotH}" data-tip="${p.n} ${p.n === 1 ? c.one : c.many}|Indtægt ${formatKr(p.revenue)} · Omkostninger ${formatKr(p.costs)}"${p.n % xStep === 0 ? ' tabindex="0"' : ""} aria-label="${p.n} ${p.n === 1 ? c.one : c.many}: indtægt ${formatKr(p.revenue)}, omkostninger ${formatKr(p.costs)}"/>`; });
  box.innerHTML = svg + `</svg><div class="viz-tip" hidden></div>`;
  attachTooltips(box);
  const rows = new Set([0, Math.min(c.selected, 100000)]);
  for (let n = 0; n <= maxX; n += xStep) rows.add(n);
  if (e.breakEven !== null) { rows.add(e.breakEven); if (e.breakEven > 0) rows.add(e.breakEven - 1); }
  document.getElementById(c.table).innerHTML = `<table class="data-table"><thead><tr><th class="num">${c.head}</th><th class="num">Indtægt</th><th class="num">Omkostninger</th><th class="num">Resultat</th></tr></thead><tbody>${
    [...rows].sort((a, b) => a - b).map(n => `<tr${n === e.breakEven ? ' class="be-row"' : ""}><td class="num">${formatNumber(n)}${n === e.breakEven ? " (break-even)" : ""}${n === c.selected ? " (valgt)" : ""}</td><td class="num">${formatKr(e.revenueAt(n))}</td><td class="num">${formatKr(e.costsAt(n))}</td><td class="num">${formatKr(e.revenueAt(n) - e.costsAt(n))}</td></tr>`).join("")}</tbody></table>`;
}
function initEconomy() {
  setFields(MUNI_FIELDS, MUNI_SCENARIOS.expected);
  setFields(SPONSOR_FIELDS, SPONSOR_SCENARIOS.expected);
  renderEconomy();
}

/* ---------- Præsentationstilstand (pitch) ----------
   6 trin: Problem → Løsning/demo → Kunder → Forretningsmodel → Bæredygtighed → Vision og opfordring.
   Teksterne er korte stikord – selve fortællingen står i PITCH.md. */
let pitchIndex = 0;
// Laver en kæde af trin med pile imellem. Hvert trin holdes samlet på én linje.
function flow(items, extraClass = "") {
  return `<div class="pitch-flow ${extraClass}">${items.map((text, i) => `<span class="step">${text}${i < items.length - 1 ? ' <span class="arrow" aria-hidden="true">→</span>' : ""}</span>`).join("")}</div>`;
}
// Hvert trin viser, hvilket perspektiv dommerne kan bedømme det på (samme farver som på "For skoler").
const PERSPECTIVES = {vp:"Værditilbud", cs:"Kundeperspektiv", ka:"Aktivitetsperspektiv", ec:"Økonomi", sus:"Bæredygtighed"};
function kicker(n, title, persp) {
  return `<div class="pitch-kicker persp-${persp}"><i></i>${n} · ${title}<span class="persp-chip">${persp === "sus" ? "Bedømmes også" : "BMC"}: ${PERSPECTIVES[persp]}</span></div>`;
}
// Højst 3 korte punkter pr. trin, så 4 minutter kan holdes. Talepapiret kan åbnes på hvert pitchtrin.
const pitchSpeech = text => `<details class="pitch-speaker"><summary>Talepapir til dette trin</summary><p>${text}</p></details>`;
const PITCH_SLIDES = [
  () => `${kicker(1, "Problemet", "vp")}
    <h2 id="pitchSlideTitle" tabindex="-1">En temauge kan starte en vane. Hvad holder den i live?</h2>
    <ul class="pitch-points"><li>Bæredygtige vaner forsvinder, når ingen kan se dem.</li><li>Gode intentioner mangler fælles opfølgning i hverdagen.</li><li>Læreren har brug for et let værktøj – ikke endnu et tungt system.</li></ul>
    ${pitchSpeech('Forestil jer en klasse, der har haft en temauge om klima. Mandag er alle motiverede. Ugen efter er meget af det glemt. Bæredygtige vaner forsvinder, når ingen kan se dem. Læreren har brug for et let værktøj, der holder opfølgningen i gang – ikke endnu et tungt system. Det er det, GroKlassen gør.')} `,
  () => {const total=totalApproved(classData()).points;return `${kicker(2, "Løsningen", "vp")}
    <h2 id="pitchSlideTitle" tabindex="-1">En handling. En godkendelse. Et fælles fremskridt.</h2>
    <div class="pitch-split"><div>${flow(["Eleven registrerer", "Læreren godkender", "Planten vokser"])}
    <ul class="pitch-points"><li>Ét fælles klassemål – ingen elevranglister.</li><li>Lærergodkendelse og åbne CO₂-beregninger.</li><li>Ingen persondata – kun klassen.</li></ul>
    <button class="btn primary" type="button" id="pitchDemoBtn">Prøv live-demoen</button></div>
    <div class="pitch-plant"><h3>${safeText(treeName())}</h3>${plantSvg(total)}<p class="pitch-note">${safeText(activeClass)} · ${total} godkendte point${demoState ? ' · demo med eksempeldata' : ' · lokale klassedata'}</p></div></div>
    ${pitchSpeech('Eleven vælger en grøn handling, for eksempel at cykle i stedet for at blive kørt. Læreren godkender, og først derefter får klassen point, og planten vokser. Det, der gør os anderledes, er fællesskabet: hele klassen arbejder mod ét mål, og ingen elev bliver rangeret. Læreren godkender alt, beregningerne er åbne, og vi gemmer ingen persondata. Lad os vise det i demoen med eksempeldata.')} `;},
  () => `${kicker(3, "Kunden og vejen til kunden", "cs")}
    <h2 id="pitchSlideTitle" tabindex="-1">Eleven bruger den. Læreren driver den. Skolen køber den.</h2>
    <div class="pitch-cols"><div class="pitch-col"><div class="big">Eleven</div><p>En enkel handling og et synligt bidrag.</p></div><div class="pitch-col"><div class="big">Læreren</div><p>Godkendelser, overblik og ugerapport.</p></div><div class="pitch-col"><div class="big">Skolen</div><p>En årlig licens – eller en kommuneaftale.</p></div></div>
    ${flow(["Lærer", "Klasse", "Skoleledelse", "Kommune"], "compact")}
    <p class="pitch-note">Kommunerne er vores vej til mange skoler på én gang. Hver måned sender GroKlassen et nyhedsbrev til lærere og forældre – i samarbejde med sponsorer.</p>
    ${pitchSpeech('Vi skelner mellem brugeren og kunden. Eleven skal have lyst til at bidrage, læreren skal kunne bruge det i en travl hverdag, og skoleledelsen køber en årlig licens. Vejen ind går gennem lærerne: vi starter i enkelte klasser, går videre til skoleledelsen og derefter til kommunen. Kommunerne er vores vej til mange skoler på én gang. Og hver måned når vi de voksne – lærere, skoleledelse og forældre – med GroKlassen-nyhedsbrevet, som vi sender i samarbejde med sponsorer.')} `,
  () => {const x=expectedEconomy();return `${kicker(4, "Forretningen", "ec")}
    <h2 id="pitchSlideTitle" tabindex="-1">To indtægtsben: licenser og sponsorater.</h2>
    ${flow(["Prøve: gratis", `Skolelicens: ${formatKr(x.mv.singlePrice)}/år`, `Kommuneaftale: ${formatKr(x.mv.price)}/år`, `Sponsorat: ${formatKr(SPONSOR_LEVELS.supporter.price)}–${formatKr(SPONSOR_LEVELS.main.price)}/år`], "compact")}
    <div class="pitch-cols"><div class="pitch-col"><div class="big">${muniBreakEvenText(x.mv, x.m)}</div><p>Break-even for licenser – ca. ${formatNumber(x.m.perPupil, 2)} kr. pr. elev pr. år.</p></div><div class="pitch-col"><div class="big">${sponsorBreakEvenText(x.sp)}</div><p>Break-even for sponsorater i nyhedsbrevet.</p></div><div class="pitch-col"><div class="big">${signedKr(x.total)}</div><p>Samlet resultat pr. år i scenariet.</p></div></div>
    <p class="pitch-note"><span class="hyp">SCENARIE · FORVENTET · EKSKL. MOMS</span> Tallene kommer fra de to økonomiberegnere. Ingen sponsor har sagt ja.</p>
    ${pitchSpeech('Vi har to indtægtsben, som vi regner hver for sig. Det første er licenser: en skole betaler ca. 1.500 kroner om året, og en kommuneaftale for op til 10 skoler koster ca. 12.000 kroner – det er omkring 4 kroner pr. elev om året. Med 10 skoler går vi i nul ved 2 kommuneaftaler. Det andet er sponsorater i vores nyhedsbrev til de voksne: her går vi i nul ved 2 sponsorer. Sponsorer har aldrig indflydelse på elevernes indhold. Alle tal er forudsætninger fra vores beregnere.')} `;},
  () => `${kicker(5, "Bæredygtighed", "sus")}
    <h2 id="pitchSlideTitle" tabindex="-1">Grønne vaner, et stærkt fællesskab og en model, der kan bære sig selv.</h2>
    <div class="pitch-cols"><div class="pitch-col"><div class="big">Miljø</div><p>Vaner inden for transport, mad, affald og energi.</p></div><div class="pitch-col"><div class="big">Socialt</div><p>Ét fælles mål – ingen elev bliver udstillet.</p></div><div class="pitch-col"><div class="big">Økonomi</div><p>Licensen finansierer drift og udvikling.</p></div></div>
    ${sdgTiles(true)}
    <p class="pitch-note">Tallene er forsigtige skøn med åben beregning. Farver efter FN's verdensmål; ikonerne er egne.</p>
    ${pitchSpeech('Bæredygtighed handler hos os om tre ting. Miljø: klassen bygger vaner inden for transport, mad, affald og energi – at cykle i skole sparer for eksempel omkring 400 gram CO₂. Socialt: hele klassen arbejder sammen, og ingen elev bliver målt eller udstillet. Økonomi: en lille, let app, hvor licensen betaler driften. Tallene er forsigtige skøn med åben beregning, så alle kan regne efter. Vi bidrager til verdensmålene 4.7, 12.5, 12.8 og 13.3.')} `,
  () => `${kicker(6, "Vision og opfordring", "ka")}
    <h2 id="pitchSlideTitle" tabindex="-1">Grønne vaner, der kan ses – i hele kommuner.</h2>
    <div class="pitch-split pitch-end"><div><ul class="pitch-points"><li>Om 1 år: 10 skoler og 2 kommuneaftaler (forventet scenarie).</li><li>Om 3 år: GroKlassen i flere kommuner – med lærerlogin og database i EU.</li><li>Hver måned: et nyhedsbrev til lærere og forældre i samarbejde med sponsorer.</li></ul>
    <p class="pitch-ask">${teamHtml("pitchAsk")}</p><p class="pitch-note">GroKlassen. Små handlinger. Stor forskel.</p></div>
    <figure class="pitch-qr"><div class="qr-box">${qrSvg(demoUrl(),"QR-kode til GroKlassens demo")}</div><figcaption>Scan og prøv produktet</figcaption></figure></div>
    ${pitchSpeech(`Vores vision er, at grønne vaner kan ses i hele kommuner. Om et år vil vi have 10 skoler og 2 kommuneaftaler – det er vores forventede scenarie. Om tre år vil vi være i flere kommuner, med lærerlogin og en database i EU. Og hver måned når vi lærere og forældre med et nyhedsbrev i samarbejde med sponsorer. ${teamHtml("pitchAsk")} Scan QR-koden, og prøv demoen selv.`)} `
];
function renderPitch(moveFocus, animate = true) {
  const slide = document.getElementById("pitchSlide");
  slide.innerHTML = PITCH_SLIDES[pitchIndex]();
  // Genstart den lille glide-animation (ikke når swipe selv styrer bevægelsen, eller når tallene blot opdateres)
  slide.style.animation = "none";
  if (animate) { void slide.offsetWidth; slide.style.animation = ""; }
  document.getElementById("pitchCount").textContent = `${pitchIndex + 1} / ${PITCH_SLIDES.length}`;
  document.getElementById("pitchPrev").disabled = pitchIndex === 0;
  document.getElementById("pitchNext").disabled = pitchIndex === PITCH_SLIDES.length - 1;
  document.querySelectorAll("#pitchDots button").forEach((dot, i) => {
    if (i === pitchIndex) dot.setAttribute("aria-current", "step"); else dot.removeAttribute("aria-current");
  });
  const demoBtn = document.getElementById("pitchDemoBtn");
  if (demoBtn) demoBtn.addEventListener("click", () => {
    closePitch();
    if (!demoState) startDemo(false);
    location.hash = "klassen";
  });
  // Flyt fokus til overskriften, så skærmlæsere læser det nye trin op
  if (moveFocus) document.getElementById("pitchSlideTitle").focus({preventScroll:true});
}
function goPitch(index) {
  stopSwipeAnimation(true);
  const next = Math.max(0, Math.min(PITCH_SLIDES.length - 1, index));
  document.getElementById("pitchSlide").classList.toggle("back", next < pitchIndex);
  pitchIndex = next;
  renderPitch(true);
}
function openPitch() {
  const dialog = document.getElementById("pitch");
  document.getElementById("pitchDots").innerHTML = PITCH_SLIDES.map((_, i) => `<button type="button" aria-label="Trin ${i + 1}">${i + 1}</button>`).join("");
  pitchIndex = 0;
  stopSwipeAnimation(true);
  document.getElementById("pitchSlide").classList.remove("back");
  if (!dialog.open) dialog.showModal();
  renderPitch(true);
}
function closePitch() {
  const dialog = document.getElementById("pitch");
  if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {});
  if (dialog.open) dialog.close();
}
/* ---------- Swipe i pitchen ----------
   Trinnet følger fingeren (eller musen) 1:1 og giver elastisk modstand ved første og sidste trin.
   Ved slip bruges fingerens hastighed: hvor ville trinnet ende, hvis det fik lov at glide videre?
   Ligger det punkt mere end halvvejs ude (højst 280 px – ellers er det tungt på en stor skærm), skiftes trin;
   ellers fjedrer trinnet tilbage.
   Bevægelsen er en kritisk dæmpet fjeder (ingen overshoot), der starter med fingerens hastighed,
   og trinnet kan gribes igen midt i bevægelsen. Ved "reduceret bevægelse" skiftes der blot trin. */
const pitchStage = document.getElementById("pitchStage");
const pitchSlideEl = document.getElementById("pitchSlide");
let swipe = null;      // Igangværende træk: {id, startX, startY, startOffset, axis, samples}
let swipeOffset = 0;   // Trinnets nuværende vandrette forskydning i px – det, man ser på skærmen
let swipeRaf = 0;
function setSwipeOffset(x) {
  swipeOffset = x;
  const width = pitchStage.clientWidth || 1;
  pitchSlideEl.style.transform = x ? `translateX(${x.toFixed(1)}px)` : "";
  pitchSlideEl.style.opacity = x ? String(Math.max(0, 1 - Math.abs(x) / width * 1.6)) : "";
}
function stopSwipeAnimation(reset) {
  cancelAnimationFrame(swipeRaf);
  swipeRaf = 0;
  if (reset) { swipe = null; pitchStage.classList.remove("dragging"); setSwipeOffset(0); }
}
// Elastisk modstand: jo længere ud over kanten, jo mindre følger trinnet med.
function rubberband(overshoot, dimension, constant = 0.55) {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}
// Hvor langt et kast med hastigheden v (px/s) ville glide – samme formel som Apples rulle-deceleration.
function projectFlick(v, rate = 0.998) { return (v / 1000) * rate / (1 - rate); }
// Kritisk dæmpet fjeder (damping 1, response 0,35 s) fra den nuværende position og med den givne hastighed.
// until(x) kan stoppe fjederen undervejs (bruges, når trinnet skiftes halvvejs ude).
function springTo(target, velocity, onDone, until) {
  cancelAnimationFrame(swipeRaf);
  const response = 0.35, stiffness = Math.pow(2 * Math.PI / response, 2), damping = 4 * Math.PI / response;
  let x = swipeOffset, v = velocity, last = performance.now();
  const step = now => {
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000)), n = Math.max(1, Math.ceil(dt / 0.004));
    last = now;
    for (let i = 0; i < n; i++) { v += (-stiffness * (x - target) - damping * v) * (dt / n); x += v * (dt / n); }
    if (until && until(x)) { setSwipeOffset(x); swipeRaf = 0; onDone(x, v); return; }
    if (Math.abs(x - target) < 0.5 && Math.abs(v) < 10) { setSwipeOffset(target); swipeRaf = 0; if (onDone) onDone(target, 0); return; }
    setSwipeOffset(x);
    swipeRaf = requestAnimationFrame(step);
  };
  swipeRaf = requestAnimationFrame(step);
}
// Skift trin med et kast: det gamle trin glider ud til halvvejs, og det nye fortsætter fra den modsatte side
// med samme hastighed – som om trinnene lå ved siden af hinanden.
function swipeToSlide(dir, velocity) {
  const width = pitchStage.clientWidth || 1;
  springTo(-dir * width, velocity, (x, v) => {
    pitchIndex += dir;
    pitchSlideEl.classList.toggle("back", dir < 0);
    renderPitch(true, false);
    setSwipeOffset(x + dir * width);
    springTo(0, v);
  }, x => Math.abs(x) >= width / 2);
}
function startSwipe(event) {
  if (event.button !== 0 || event.target.closest("button, a, input, select, textarea, summary")) return;
  cancelAnimationFrame(swipeRaf); // Grib trinnet midt i en bevægelse – det fortsætter fra, hvor det er
  swipeRaf = 0;
  swipe = {id: event.pointerId, startX: event.clientX, startY: event.clientY, startOffset: swipeOffset, axis: null, samples: [{x: event.clientX, t: event.timeStamp}]};
  if (swipeOffset) lockSwipe(event); // Var trinnet i bevægelse, er retningen allerede vandret
}
function lockSwipe(event) {
  swipe.axis = "x";
  swipe.startX = event.clientX; // Start fra den nuværende position, så trinnet ikke hopper
  pitchStage.setPointerCapture(event.pointerId);
  pitchStage.classList.add("dragging");
  pitchSlideEl.style.animation = "none";
}
function moveSwipe(event) {
  if (!swipe || event.pointerId !== swipe.id) return;
  if (!swipe.axis) {
    const dx = event.clientX - swipe.startX, dy = event.clientY - swipe.startY;
    if (Math.hypot(dx, dy) < 10) return;                            // Lille dødzone, før retningen afgøres
    if (Math.abs(dy) >= Math.abs(dx)) { swipe = null; return; }     // Lodret træk = rul i trinnet
    lockSwipe(event);
  }
  swipe.samples.push({x: event.clientX, t: event.timeStamp});
  swipe.samples = swipe.samples.filter(s => event.timeStamp - s.t <= 100);
  if (prefersReducedMotion()) return;                                // Ved reduceret bevægelse flytter trinnet sig ikke
  const width = pitchStage.clientWidth || 1;
  let x = swipe.startOffset + (event.clientX - swipe.startX);
  if (x > 0 && pitchIndex === 0) x = rubberband(x, width);
  if (x < 0 && pitchIndex === PITCH_SLIDES.length - 1) x = -rubberband(-x, width);
  setSwipeOffset(x);
}
function endSwipe(event, cancelled) {
  if (!swipe || event.pointerId !== swipe.id) return;
  const s = swipe;
  swipe = null;
  pitchStage.classList.remove("dragging");
  if (!s.axis) {
    // Et lynhurtigt stryg kan nå frem uden bevægelser imellem (browseren slår dem sammen) – kig på selve slippet.
    const dx = event.clientX - s.startX, dy = event.clientY - s.startY;
    if (cancelled || Math.hypot(dx, dy) < 10 || Math.abs(dy) >= Math.abs(dx)) return; // Et tryk – ikke et træk
    s.axis = "x";
  }
  if (prefersReducedMotion()) {
    const dx = event.clientX - s.startX;
    if (!cancelled && Math.abs(dx) > 40) goPitch(pitchIndex + (dx < 0 ? 1 : -1));
    return;
  }
  let velocity = 0;
  if (!cancelled) {
    s.samples.push({x: event.clientX, t: event.timeStamp});
    const recent = s.samples.filter(p => event.timeStamp - p.t <= 100), first = recent[0], last = recent[recent.length - 1];
    if (first && last.t > first.t) velocity = (last.x - first.x) / (last.t - first.t) * 1000;
  }
  const width = pitchStage.clientWidth || 1;
  const projected = swipeOffset + projectFlick(velocity), threshold = Math.min(width / 2, 280);
  const dir = cancelled ? 0 : projected < -threshold ? 1 : projected > threshold ? -1 : 0;
  if (dir && pitchIndex + dir >= 0 && pitchIndex + dir < PITCH_SLIDES.length) swipeToSlide(dir, velocity);
  else springTo(0, velocity);
}
function toggleFullscreen() {
  if (!document.fullscreenEnabled) return;
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  else document.documentElement.requestFullscreen().catch(() => {});
}

/* ---------- Del (QR-kode og link) ---------- */
function openShare() {
  const url = demoUrl();
  document.getElementById("shareQr").innerHTML = qrSvg(url, `QR-kode til ${url}`);
  document.getElementById("shareUrl").value = url;
  document.getElementById("shareNative").hidden = !navigator.share;
  document.getElementById("shareStatus").textContent = "";
  document.getElementById("shareDialog").showModal();
  document.getElementById("shareCopy").focus();
}
async function copyShareLink() {
  const input = document.getElementById("shareUrl");
  const status = document.getElementById("shareStatus");
  let ok = false;
  try { await navigator.clipboard.writeText(input.value); ok = true; }
  catch (e) { input.select(); try { ok = document.execCommand("copy"); } catch (err) { ok = false; } }
  // Beskeden står i dialogen (en toast ville ligge bag dialogen).
  status.textContent = ok ? "Linket er kopieret." : "Markér linket, og kopiér det selv (Ctrl/Cmd + C).";
}

/* ---------- A4-oversigt til dommerne ----------
   Én side, som holdet kan efterlade hos dommerne. Tallene kommer fra beregneren og TEAM_DATA. */
function buildA4() {
  const x = expectedEconomy();
  const url = demoUrl();
  return `
    <header class="a4-head"><div class="a4-tree">${plantSvg(totalApproved(classData()).points)}</div><img class="a4-logo" src="${document.getElementById("brandLogo").src}" alt="GroKlassen"><div><h1>GroKlassen · ${safeText(treeName())}</h1><p>Små handlinger. Stor forskel. En app, der gør skoleklassers grønne vaner synlige – uden persondata.</p></div></header>
    <div class="a4-grid">
      <section class="a4-box a4-vp"><h2>Værditilbud</h2>
        <p><strong>Problem:</strong> Bæredygtige vaner forsvinder, når ingen kan se dem.</p>
        <p><strong>Løsning:</strong> Klassen registrerer små grønne handlinger, læreren godkender, og en fælles plante vokser.</p>
        <p><strong>Det nye:</strong> Fællesskab frem for individuelle ranglister, lærergodkendelse, åbne CO₂-beregninger og ingen persondata.</p></section>
      <section class="a4-box a4-cs"><h2>Kunder</h2>
        <ul><li><strong>Elever</strong> – brugere, ét fælles mål</li><li><strong>Lærere</strong> – godkender og får ugerapport</li><li><strong>Skoler og kommuner</strong> – betaler en licens</li></ul>
        ${teamFilled("targetGrades") ? `<p class="a4-small">Målgruppe: ${teamHtml("targetGrades")}</p>` : ""}</section>
      <section class="a4-box a4-ec"><h2>Prisskitse <span class="a4-hyp">forudsætning</span></h2>
        <ul><li>Prøve: 0 kr. – 1 klasse i 3 måneder</li><li>Skolelicens: ca. ${formatKr(x.mv.singlePrice)} pr. skole pr. år</li><li>Kommuneaftale: ca. ${formatKr(x.mv.price)} pr. år for op til ${x.mv.schoolsPer} skoler</li><li>Sponsorat i nyhedsbrevet: ${Object.values(SPONSOR_LEVELS).reverse().map(l => `${l.label.toLowerCase()} ca. ${formatKr(l.price)}`).join(" · ")} pr. år</li></ul>
        <p class="a4-small">Ekskl. moms. Ingen sponsor har sagt ja.</p></section>
      <section class="a4-box a4-ec"><h2>Økonomi <span class="a4-hyp">forventet scenarie</span></h2>
        <p><strong>Licenser:</strong> break-even ved ${muniBreakEvenText(x.mv, x.m)} · resultat ${signedKr(x.m.result)} · ca. ${formatNumber(x.m.perPupil, 2)} kr. pr. elev pr. år</p>
        <p><strong>Sponsorater:</strong> break-even ved ${sponsorBreakEvenText(x.sp)} · resultat ${signedKr(x.sp.result)} · ca. ${formatNumber(x.sp.perRecipient, 2)} kr. pr. modtager pr. nyhedsbrev</p>
        <p class="a4-big">Samlet: ${signedKr(x.total)} pr. år</p>
        <p class="a4-small">Faste omkostninger ${formatKr(x.m.fixed)} pr. år (ingen løn – frivilligt arbejde i prototypefasen).</p></section>
      <section class="a4-box a4-sus"><h2>FN's verdensmål</h2>${sdgTiles(true)}<p class="a4-small">Farver efter FN's verdensmål. Ikoner er egne.</p></section>
      <section class="a4-box a4-qr"><div class="a4-qrcode">${qrSvg(url, "QR-kode til demoen")}</div><p><strong>Scan og prøv demoen</strong></p><p class="a4-small a4-url">${safeText(url)}</p></section>
    </div>
    <footer class="a4-foot">
      <p class="a4-ask">${teamHtml("pitchAsk")}</p>
      <p>${teamHtml("teamName")} · Kontakt: ${teamHtml("contact")}</p>
      <p class="a4-small">Prototype. Priser og tal er forudsætninger (forventet scenarie). Ingen persondata – alt er på klasseniveau.</p>
    </footer>`;
}
function printA4() {
  document.getElementById("a4Sheet").innerHTML = buildA4();
  document.body.classList.remove("printing-report", "printing-newsletter");
  document.body.classList.add("printing-a4");
  window.print();
}

/* ---------- Ugerapport ---------- */
function buildReport() {
  const data = classData();
  const today = todayKey();
  const monday = mondayOf(today);
  const sunday = addDays(monday, 6);
  const weekItems = data.approved.filter(item => item.date >= monday && item.date <= sunday);
  const points = weekItems.reduce((sum, item) => sum + item.points, 0);
  const lastWeek = weekPoints(data, addDays(monday, -7));
  const totals = totalApproved(data);
  const byChallenge = CHALLENGES.map(c => {
    const items = weekItems.filter(item => item.challengeId === c.id);
    return {c, count: items.length, points: items.reduce((s, i) => s + i.points, 0)};
  }).filter(row => row.count > 0).sort((a,b) => b.points - a.points);
  const co2 = weekItems.reduce((s, i) => s + estimateFor(i).co2, 0);
  const water = weekItems.reduce((s, i) => s + estimateFor(i).water, 0);
  const stage = PLANT_STAGES[getStage(totals.points)];
  const series = weeklySeries(data);
  return `
    ${demoState ? '<p><span class="demo-chip">DEMO</span> Rapporten bygger på opdigtede eksempeldata.</p>' : ""}
    <h2 id="reportTitle">Ugerapport · Klasse ${safeText(activeClass)} · Uge ${weekNumber(today)}</h2>
    <p class="small">${safeText(formatDate(monday))} – ${safeText(formatDate(sunday))} · Udskrevet ${safeText(formatDate(today))}</p>
    <div class="kpis">
      <div class="kpi"><div class="number">${points} / ${data.weeklyGoal}</div><div class="label">Point denne uge / ugemål</div></div>
      <div class="kpi"><div class="number">${weekItems.length}</div><div class="label">Godkendte handlinger</div></div>
      <div class="kpi"><div class="number">${points - lastWeek >= 0 ? "+" : ""}${points - lastWeek}</div><div class="label">Point i forhold til sidste uge</div></div>
      <div class="kpi"><div class="number">${safeText(stage.name)}</div><div class="label">Plantestadie (${totals.points} point i alt)</div></div>
    </div>
    <h3>Ugens handlinger</h3>
    ${byChallenge.length ? `<table class="data-table"><thead><tr><th>Udfordring</th><th class="num">Antal</th><th class="num">Point</th><th class="num">CO₂ (ca. kg)</th><th class="num">Vand (ca. L)</th></tr></thead><tbody>${
      byChallenge.map(r => `<tr><td>${r.c.icon} ${safeText(r.c.title)}</td><td class="num">${r.count}</td><td class="num">${r.points}</td><td class="num">${formatNumber(r.count * r.c.co2, 2)}</td><td class="num">${formatNumber(r.count * r.c.water)}</td></tr>`).join("")
    }<tr><th>I alt</th><th class="num">${weekItems.length}</th><th class="num">${points}</th><th class="num">${formatNumber(co2, 1)}</th><th class="num">${formatNumber(water)}</th></tr></tbody></table>` : '<p class="muted">Ingen godkendte handlinger endnu i denne uge.</p>'}
    <h3 style="margin-top:14px">Udvikling de seneste 8 uger</h3>
    <table class="data-table"><thead><tr>${series.map(s => `<th class="num">u.${s.week}</th>`).join("")}</tr></thead><tbody><tr>${series.map(s => `<td class="num">${s.points}</td>`).join("")}</tr></tbody></table>
    <h3 style="margin-top:14px">Forslag til klassesamtale (5 min.)</h3>
    <ol>
      <li>Hvilken grøn handling var nemmest at gøre til en vane – og hvorfor?</li>
      <li>Hvad kan vi gøre mere af i næste uge? Er vores ugemål realistisk?</li>
      <li>Hvordan kan alle i klassen være med – også dem, der ikke kan cykle eller købe brugt?</li>
    </ol>
    <p class="report-note">CO₂- og vandtal er vejledende estimater (se "Sådan har vi regnet" i appen) – ikke målinger. Rapporten indeholder ingen persondata, kun klassens samlede handlinger. Lavet med GroKlassen (prototype).</p>`;
}
function openReport() {
  document.getElementById("reportContent").innerHTML = buildReport();
  document.getElementById("reportDialog").showModal();
  document.getElementById("reportPrint").focus();
}

/* ---------- GroKlassen-nyhedsbrevet (i samarbejde med sponsorer) ----------
   Sendes af GroKlassen til voksne: lærere, skoleledelse og forældre. Samlede tal på tværs af alle klasser – kun
   klasseniveau, ingen elevnavne og ingen e-mails i prototypen. Sponsoren står i en tydeligt mærket annonceboks
   og vises aldrig i elevernes udfordringer. */
function monthKey(dateKey) { return dateKey.slice(0, 7); }
function monthLabel(key) { const [y, m] = key.split("-").map(Number); return new Date(y, m - 1, 1).toLocaleDateString("da-DK", {month:"long", year:"numeric"}); }
function recentMonths(count = 6) {
  const [y, m] = todayKey().split("-").map(Number);
  return Array.from({length: count}, (_, i) => dateKey(new Date(y, m - 1 - i, 1)).slice(0, 7));
}
function sponsorInfo() {
  const example = !teamFilled("sponsor");
  return {example, name: example ? "Eksempel-sponsor" : String(TEAM_DATA.sponsor).trim()};
}
function newsletterModel(store, month, opts = {}) {
  const perClass = CLASS_NAMES.map(name => (store.classes[name] || emptyClass()).approved.filter(item => monthKey(item.date) === month));
  const items = perClass.flat();
  const counts = CHALLENGES.map(c => ({c, count: items.filter(i => i.challengeId === c.id).length}));
  const tipChallenge = counts.slice().sort((a, b) => a.count - b.count)[0].c;
  const monthIndex = Number(month.slice(5, 7)) - 1;
  return {
    month, monthText: monthLabel(month), demo: !!opts.demo, sponsor: sponsorInfo(),
    kpis: [
      {value: formatNumber(items.reduce((s, i) => s + i.points, 0)), label: "godkendte point i alt"},
      {value: formatNumber(items.length), label: "grønne handlinger"},
      {value: `${perClass.filter(list => list.length).length} af ${CLASS_NAMES.length}`, label: "klasser var med"},
      {value: `ca. ${formatCo2(items.reduce((s, i) => s + estimateFor(i).co2, 0))}`, label: "CO₂ sparet – vejledende skøn"}
    ],
    top: counts.filter(r => r.count).sort((a, b) => b.count - a.count).slice(0, 3).map(r => ({icon: r.c.icon, title: r.c.title, count: r.count})),
    tip: {icon: tipChallenge.icon, challenge: tipChallenge.title, text: GREEN_TIPS[tipChallenge.id]},
    activity: CLASS_ACTIVITIES[monthIndex % CLASS_ACTIVITIES.length],
    adText: String(NEWSLETTER.sponsorText || "").trim() || "Her fortæller sponsoren kort om sit eget grønne arbejde – sagligt og uden tilbud, rabatkoder eller reklame til børn."
  };
}
function newsletterHtml(m) {
  const tag = m.sponsor.example ? ' <span class="hyp">EKSEMPEL</span>' : "";
  return `<article class="newsletter" aria-label="GroKlassen-nyhedsbrevet, ${safeText(m.monthText)}">
    <div class="nl-head">
      <img class="nl-logo" src="${document.getElementById("brandLogo").src}" alt="GroKlassen">
      <div><p class="nl-kicker">GroKlassen-nyhedsbrevet · ${safeText(m.monthText)}</p><h3 class="nl-title">Grønne vaner i alle klasser</h3>
      <p class="nl-sponsor">I samarbejde med <strong>${safeText(m.sponsor.name)}</strong>${tag}</p></div>
    </div>
    ${m.demo ? '<p class="small"><span class="demo-chip">DEMO</span> Demo med eksempeldata.</p>' : ""}
    <div class="nl-tip"><h4>Månedens grønne tip</h4><p>${m.tip.icon} <strong>${safeText(m.tip.challenge)}:</strong> ${safeText(m.tip.text)}</p></div>
    <h4>Klassernes tal i ${safeText(m.monthText.split(" ")[0])}</h4>
    <div class="nl-kpis">${m.kpis.map(k => `<div class="nl-kpi"><div class="nl-num">${safeText(k.value)}</div><div class="nl-label">${safeText(k.label)}</div></div>`).join("")}</div>
    ${m.top.length ? `<p class="small nl-topline">Mest populært: ${m.top.map(t => `${t.icon} ${safeText(t.title)} (${t.count})`).join(" · ")}</p>` : ""}
    <h4>Idé til en klasseaktivitet</h4>
    <p class="nl-activity">${safeText(m.activity)}</p>
    <aside class="nl-ad" aria-label="Annonce"><p class="nl-ad-label">Annonce · i samarbejde med ${safeText(m.sponsor.name)}${tag}</p><p>${safeText(m.adText)}</p></aside>
    <div class="nl-signup no-print"><button class="btn small-btn" type="button" disabled>Tilmeld</button><span class="small">Tilmelding åbner, når GroKlassen får login (kræver GDPR-samtykke).</span></div>
    <div class="nl-foot"><p>Sendt af GroKlassen til lærere, skoleledelse og forældre. Kun tal på klasseniveau – ingen elevnavne. CO₂ er vejledende skøn. Sponsorer har ingen indflydelse på indhold eller tal og vises aldrig i elevernes udfordringer.</p></div>
  </article>`;
}
// Lærerområdet: "Se månedens nyhedsbrev" viser samme forhåndsvisning med tallene fra denne enhed (eller demoen).
function renderNewsletter() {
  const month = document.getElementById("nlMonth").value || monthKey(todayKey());
  document.getElementById("newsletterContent").innerHTML = newsletterHtml(newsletterModel(demoState || state, month, {demo: !!demoState}));
}
function openNewsletter() {
  const select = document.getElementById("nlMonth");
  const keep = select.value;
  select.innerHTML = recentMonths().map(k => `<option value="${k}">${safeText(monthLabel(k))}</option>`).join("");
  if (keep && [...select.options].some(o => o.value === keep)) select.value = keep;
  renderNewsletter();
  const dialog = document.getElementById("newsletterDialog");
  dialog.showModal();
  dialog.scrollTop = 0;
  document.getElementById("newsletterDialogTitle").focus({preventScroll: true});
}
function printNewsletter() {
  document.body.classList.remove("printing-a4", "printing-report");
  document.body.classList.add("printing-newsletter");
  window.print();
}
// Eksemplet under "For skoler": demo-data for sidste måned, så der er en hel måned at vise.
let newsletterDemo = null;
function renderNewsletterPreview() {
  const box = document.getElementById("newsletterPreview");
  if (!box) return;
  if (!newsletterDemo) newsletterDemo = buildDemoState();
  box.innerHTML = newsletterHtml(newsletterModel(newsletterDemo, recentMonths(2)[1], {demo: true}));
}
function renderSdg() { document.getElementById("sdgGrid").innerHTML = sdgTiles(false); }
function renderSponsorTiers() {
  const box = document.getElementById("sponsorTiers");
  if (!box) return;
  box.innerHTML = ["supporter", "partner", "main"].map(key => {
    const l = SPONSOR_LEVELS[key];
    return `<div class="tier${key === "partner" ? " featured" : ""}"><div class="tier-name">${key === "main" ? "🌳" : key === "partner" ? "🌿" : "🌱"} ${safeText(l.label)}</div><div class="tier-price">ca. ${formatKr(l.price)}</div><div class="small">pr. år</div><ul><li>${safeText(l.exposure)}</li><li>Ingen data om elever og ingen indflydelse på indhold</li></ul></div>`;
  }).join("");
}

/* ---------- Demo-data ----------
   Demo-data er opdigtede eksempler, der viser, hvordan appen ser ud efter nogle ugers brug.
   De laves med et fast "frø", så de bliver ens hver gang – det gør det let at øve pitchen. */
function seededRandom(seed) {
  // Lille tilfældighedsgenerator (mulberry32): samme frø giver samme talrække.
  return function () {
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const DEMO_PROFILES = {
  // target = samlede godkendte point. 7.A står 2 point fra "Stort træ" (180), så første godkendelse i en demo får planten til at vokse.
  // shape = hvor meget hver af de seneste 6 hele uger vægter (vanerne bliver stærkere over tid).
  // rate = hvor hurtigt klassen samler point i den igangværende uge (i forhold til ugemålet).
  "7.A": {seed: 11, target: 178, goal: 30, rate: 0.8, shape: [0.55, 0.75, 0.95, 1.1, 1.25, 1.4]},
  "7.B": {seed: 22, target: 141, goal: 25, rate: 1.1, shape: [0.7, 0.8, 0.9, 1.0, 1.05, 1.1]},
  "8.A": {seed: 33, target: 96, goal: 20, rate: 0.9, shape: [0.5, 0.7, 0.9, 1.0, 1.1, 1.2]}
};
function buildDemoState() {
  const demo = defaultState();
  const today = todayKey();
  const thisMonday = mondayOf(today);
  const isSchoolDay = d => { const w = parseDateKey(d).getDay(); return w >= 1 && w <= 5; };
  const time = (date, hour, minute) => { const t = parseDateKey(date); t.setHours(hour, minute); return t.getTime(); };
  const makeItem = (challenge, date, rand) => ({
    id: `demo-${date}-${challenge.id}`, challengeId: challenge.id, title: challenge.title, date,
    points: challenge.points, co2: challenge.co2, water: challenge.water,
    submittedAt: time(date, 8 + Math.floor(rand() * 6), Math.floor(rand() * 60))
  });
  // Vælg tilfældige, forskellige udfordringer, der giver præcis "amount" point (eller så tæt på som muligt).
  const pickForDay = (amount, rand) => {
    let best = [];
    for (let attempt = 0; attempt < 40; attempt++) {
      const picks = [];
      let sum = 0;
      CHALLENGES.slice().sort(() => rand() - 0.5).forEach(c => { if (sum + c.points <= amount) { picks.push(c); sum += c.points; } });
      if (sum === amount) return picks;
      if (sum > best.reduce((s, c) => s + c.points, 0)) best = picks;
    }
    return best;
  };
  // Alle skoledage (man–fre) fra 6 uger tilbage til og med i går
  const schoolDays = [];
  for (let d = addDays(thisMonday, -42); d < today; d = addDays(d, 1)) if (isSchoolDay(d)) schoolDays.push(d);
  CLASS_NAMES.forEach(name => {
    const profile = DEMO_PROFILES[name];
    const rand = seededRandom(profile.seed);
    const data = demo.classes[name];
    data.weeklyGoal = profile.goal;
    // 1) Den igangværende uge: klassen er godt på vej, men har ikke nået ugemålet endnu.
    const daysThisWeek = schoolDays.filter(d => d >= thisMonday);
    const currentWeek = Math.min(profile.goal - 2, Math.round(daysThisWeek.length * profile.goal / 5 * profile.rate));
    // 2) Resten af pointene fordeles på de 6 hele uger efter profilens "shape".
    const shapeSum = profile.shape.reduce((s, v) => s + v, 0);
    const weekTotals = profile.shape.map(v => Math.round((profile.target - currentWeek) * v / shapeSum));
    const plan = [...weekTotals, currentWeek];
    plan.forEach((weekTotal, w) => {
      const monday = addDays(thisMonday, -7 * (6 - w));
      const days = schoolDays.filter(d => d >= monday && d < addDays(monday, 7));
      let left = weekTotal;
      days.forEach((date, i) => {
        const share = i === days.length - 1 ? left : Math.round(left / (days.length - i) * (0.7 + rand() * 0.6));
        const picks = pickForDay(Math.min(CONFIG.dailyPointCap, Math.max(0, share)), rand);
        picks.forEach(c => data.approved.push(makeItem(c, date, rand)));
        left -= picks.reduce((s, c) => s + c.points, 0);
      });
    });
    // 3) Finjustér, så klassen ender præcis på profilens antal point (ændrer kun de ældste dage).
    data.approved.sort((a,b) => a.date < b.date ? -1 : 1);
    while (totalApproved(data).points > profile.target) data.approved.shift();
    for (let i = 0; i < schoolDays.length && schoolDays[i] < thisMonday && totalApproved(data).points < profile.target; i++) {
      const date = schoolDays[i];
      CHALLENGES.forEach(challenge => {
        const missing = profile.target - totalApproved(data).points;
        const used = data.approved.some(x => x.date === date && x.challengeId === challenge.id);
        if (!used && challenge.points <= missing && approvedOnDate(data, date) + challenge.points <= CONFIG.dailyPointCap) {
          data.approved.push(makeItem(challenge, date, rand));
        }
      });
    }
    data.approved.forEach(item => { item.approvedAt = item.submittedAt + 3600000; });
  });
  // 3) Et par ventende indsendelser fra tidligere dage (viser "ældre indsendelser" i lærerområdet)
  const a = demo.classes["7.A"];
  const lastDays = schoolDays.slice(-2);
  // Hver af de to seneste skoledage får én ventende indsendelse (første udfordring, der overholder reglerne).
  // Alle har mindst 2 point, så den første godkendelse altid får 7.A over 180 point (nyt plantestadie).
  lastDays.forEach((date, i) => {
    const challenge = ["sort", "lights", "shower", "lunch", "cycle"].map(challengeById).find(c =>
      !a.approved.some(x => x.date === date && x.challengeId === c.id) &&
      !a.pending.some(x => x.challengeId === c.id) &&
      approvedOnDate(a, date) + pendingOnDate(a, date) + c.points <= CONFIG.dailyPointCap);
    if (challenge) a.pending.push({...makeItem(challenge, date, seededRandom(5 + i)), id: `demo-pending-${i}`});
  });
  // 4) Én afvist indsendelse, så CSV og rapport viser alle tre statusser
  if (lastDays[0]) a.rejected.push({...makeItem(challengeById("repair"), lastDays[0], seededRandom(7)), id: "demo-rejected", rejectedAt: Date.now()});
  demo.contest["7.B"] = {signedUp:true, team:"De Grønne Lyn", students:24, vote:"park", signedAt:Date.now()};
  demo.contest["8.A"] = {signedUp:true, team:"Team Træstamme", students:22, vote:"nature", signedAt:Date.now()};
  demo.activeClass = "7.A";
  return demo;
}
function startDemo(quiet) {
  demoState = buildDemoState();
  activeClass = "7.A";
  state.activeClass = activeClass;
  saveState();
  render();
  startCooldownRefresh();
  if (!quiet) showToast("Demo-data er indlæst. Klassens egne data er gemt og urørt.");
}
function exitDemo() {
  demoState = null;
  try { localStorage.removeItem(CONFIG.demoStorageKey); } catch (e) {}
  // Fjern ?demo=1 fra adressen, så en genindlæsning ikke starter demoen igen.
  try {
    const url = new URL(location.href);
    if (url.searchParams.has("demo")) { url.searchParams.delete("demo"); history.replaceState(null, "", url.href); }
  } catch (e) {}
  render();
  startCooldownRefresh();
  showToast("Demo er afsluttet. Nu vises klassens egne data igen.");
}
function renderDemoControls() {
  const active = !!demoState;
  document.getElementById("demoBanner").hidden = !active;
  document.getElementById("heroDemoBtn").textContent = active ? "Nulstil demo" : "Prøv med demo-data";
  document.getElementById("demoLoadBtn").hidden = active;
  document.getElementById("demoResetBtn2").hidden = !active;
  document.getElementById("demoExitBtn2").hidden = !active;
  document.getElementById("resetClassBtn").hidden = active;
  document.getElementById("demoToolText").textContent = active
    ? "Demo er aktiv. 'Nulstil demo' gendanner udgangspunktet med det samme. 'Afslut demo' viser klassens egne data igen."
    : "Indlæs eksempeldata for flere uger, så graf og plante ser levende ud. Klassens egne data bliver ikke rørt.";
}

/* ---------- Lærerområde ---------- */
// Lærerens "lås op" huskes kun i denne fane (sessionStorage) og forsvinder, når fanen lukkes.
function readTeacherSession() {
  try { return sessionStorage.getItem("groklassen-laerer") === "1"; } catch (e) { return false; }
}
function setTeacherUnlocked(value) {
  teacherUnlocked = value;
  if (!value && lastUndo) { hideToast(lastUndo.toast); lastUndo = null; } // Når læreren låser, kan intet fortrydes
  try { value ? sessionStorage.setItem("groklassen-laerer", "1") : sessionStorage.removeItem("groklassen-laerer"); } catch (e) {}
  renderTeacher();
}
function pendingRowHtml(item) {
  const challenge = challengeById(item.challengeId);
  const icon = challenge ? challenge.icon + " " : "";
  const old = daysAgo(item.date) > 0;
  const when = `${formatDate(item.date)}${item.submittedAt ? " kl. " + formatTime(item.submittedAt) : ""}`;
  return `<div class="pending-row">
    <div><strong>${icon}${safeText(item.title)}</strong><div class="small">${item.points} point · indsendt ${safeText(when)}</div></div>
    <span class="tag ${old ? "old" : ""}">${safeText(ageLabel(item.date))}</span>
    <div class="row-actions">
      <button class="btn primary small-btn" type="button" data-action="approve" data-id="${safeText(item.id)}" aria-label="Godkend ${safeText(item.title)} (${safeText(ageLabel(item.date).toLowerCase())})">Godkend</button>
      <button class="btn small-btn" type="button" data-action="reject" data-id="${safeText(item.id)}" aria-label="Afvis ${safeText(item.title)} (${safeText(ageLabel(item.date).toLowerCase())})">Afvis</button>
    </div>
  </div>`;
}
function renderTeacher() {
  document.getElementById("teacherLock").hidden = teacherUnlocked;
  document.getElementById("teacherDashboard").hidden = !teacherUnlocked;
  if (!teacherUnlocked) return;
  const data = classData();
  const today = todayKey();
  const sorted = data.pending.slice().sort((a,b)=>a.submittedAt-b.submittedAt);
  const todays = sorted.filter(item => item.date === today);
  const older = sorted.filter(item => item.date !== today);
  document.getElementById("kpiPending").textContent = data.pending.length;
  document.getElementById("kpiOld").textContent = older.length;
  document.getElementById("kpiToday").textContent = `${approvedToday(data)}/${CONFIG.dailyPointCap}`;
  document.getElementById("kpiTotal").textContent = totalApproved(data).points;
  document.getElementById("pendingTodayList").innerHTML = todays.length ? todays.map(pendingRowHtml).join("") : '<div class="empty">Ingen indsendelser fra i dag afventer.</div>';
  document.getElementById("pendingOlderList").innerHTML = older.map(pendingRowHtml).join("");
  document.getElementById("olderBlock").hidden = !older.length;
  document.getElementById("approveTodayBtn").disabled = !todays.length;
  renderWeekChart();
}
// Godkender en eller flere indsendelser. Loftet tjekkes mod hver indsendelses EGEN dato.
function approveItems(ids) {
  const data = classData();
  const before = snapshotClass(data);
  const stageBefore = getStage(totalApproved(data).points);
  const thisMonday = mondayOf(todayKey());
  const goalReachedBefore = weekPoints(data, thisMonday) >= data.weeklyGoal;
  const items = data.pending.filter(item => ids.includes(item.id)).sort((a,b)=>a.submittedAt-b.submittedAt);
  const done = [];
  const skipped = [];
  items.forEach(item => {
    const duplicate = data.approved.some(x => x.date === item.date && x.challengeId === item.challengeId);
    const overCap = approvedOnDate(data, item.date) + item.points > CONFIG.dailyPointCap;
    if (duplicate || overCap) { skipped.push(item); return; }
    data.pending = data.pending.filter(x => x.id !== item.id);
    data.approved.push({...item, approvedAt: Date.now()});
    done.push(item);
  });
  saveState();
  render();
  if (done.length === 1) offerUndo(before, `Godkendt: ${done[0].title} tæller nu med i klassens resultat.`);
  else if (done.length > 1) offerUndo(before, `${done.length} indsendelser er godkendt og tæller nu med.`);
  if (skipped.length) showToast(`${skipped.length} kunne ikke godkendes, fordi pointloftet for dagen ville blive overskredet (eller udfordringen allerede er godkendt den dag). Afvis dem i stedet.`, true);
  // Nåede planten et nyt stadie? Så fejrer vi det.
  const stageAfter = getStage(totalApproved(data).points);
  if (stageAfter > stageBefore) celebrate(stageAfter);
  else if (!goalReachedBefore && weekPoints(data, thisMonday) >= data.weeklyGoal) showToast(`Klasse ${activeClass} har nået ugemålet på ${data.weeklyGoal} point! 🎉`);
  return done.length;
}
function rejectItems(ids) {
  const data = classData();
  const before = snapshotClass(data);
  const items = data.pending.filter(item => ids.includes(item.id));
  data.pending = data.pending.filter(item => !ids.includes(item.id));
  items.forEach(item => data.rejected.push({...item, rejectedAt: Date.now()}));
  data.rejected = data.rejected.slice(-200); // Gem kun de seneste 200 afviste
  saveState();
  render();
  if (items.length === 1) offerUndo(before, `Forespørgslen "${items[0].title}" blev afvist.`);
  else if (items.length > 1) offerUndo(before, `${items.length} indsendelser blev afvist.`);
}
/* ---------- Fortryd (godkend og afvis) ----------
   En godkendelse eller afvisning kan fortrydes i 8 sekunder – med knappen i beskeden eller Ctrl/Cmd + Z.
   Kun den seneste handling kan fortrydes, så man aldrig kommer til at rulle flere handlinger tilbage på én gang. */
let lastUndo = null; // {store, name, before, toast}
function snapshotClass(data) { return {approved: data.approved.slice(), pending: data.pending.slice(), rejected: data.rejected.slice()}; }
function offerUndo(before, message) {
  if (lastUndo) hideToast(lastUndo.toast);
  const undo = {store: demoState || state, name: activeClass, before};
  undo.toast = showToast(message, false, {label: "Fortryd", title: "Fortryd (Ctrl+Z / Cmd+Z)", run: () => runUndo(undo)});
  lastUndo = undo;
  setTimeout(() => { if (lastUndo === undo) lastUndo = null; }, 8000);
}
function runUndo(undo = lastUndo) {
  if (!undo || undo !== lastUndo) return false;
  lastUndo = null;
  hideToast(undo.toast);
  const celebration = document.getElementById("celebration");
  if (celebration.open) celebration.close();
  // Er demoen nulstillet eller data ændret i en anden fane siden, rører vi ikke ved noget.
  if ((demoState || state) !== undo.store) { showToast("Handlingen kan ikke fortrydes længere.", true); return true; }
  Object.assign(undo.store.classes[undo.name], undo.before);
  saveState();
  render();
  showToast(`Fortrudt – klasse ${undo.name} er tilbage, som den var.`);
  return true;
}
// Efter godkend/afvis forsvinder rækken. Flyt fokus til næste knap, så tastaturbrugere ikke "falder ud".
function refocusQueue(listId, index) {
  const buttons = document.querySelectorAll(`#${listId} [data-action="approve"]`);
  const target = buttons[Math.min(index, buttons.length - 1)] || document.getElementById("queueTitle");
  target.focus();
}
function handleQueueClick(event) {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const listId = event.currentTarget.id;
  const index = [...event.currentTarget.querySelectorAll('[data-action="approve"]')].indexOf(button.closest(".pending-row").querySelector('[data-action="approve"]'));
  if (button.dataset.action === "approve") approveItems([button.dataset.id]);
  else rejectItems([button.dataset.id]);
  refocusQueue(listId, index);
}

/* ---------- Fejring af nyt plantestadie ---------- */
function prefersReducedMotion() {
  return window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function celebrate(stageIndex) {
  const dialog = document.getElementById("celebration");
  const stage = PLANT_STAGES[stageIndex];
  document.getElementById("celebrateTitle").textContent = treeName() + " er vokset!";
  document.getElementById("celebratePlant").innerHTML = plantSvg(stage.threshold);
  document.getElementById("celebrateText").textContent = `Klasse ${activeClass} har nået stadiet "${stage.name}". ${stage.description}`;
  // Faldende blade – kun hvis brugeren ikke har slået animationer fra.
  const leaves = document.getElementById("leaves");
  leaves.innerHTML = "";
  if (!prefersReducedMotion()) {
    for (let i = 0; i < 18; i++) {
      const leaf = document.createElement("span");
      leaf.textContent = ["🍃", "🌿", "🍀", "🌱"][i % 4];
      leaf.style.left = `${(i * 37) % 100}%`;
      leaf.style.animationDelay = `${(i % 6) * 0.18}s`;
      leaves.appendChild(leaf);
    }
  }
  // Planten i siden får også en lille vækst-animation.
  ["plantGraphic", "heroPlant"].forEach(id => {
    const el = document.getElementById(id);
    el.classList.remove("grow"); void el.offsetWidth; el.classList.add("grow");
  });
  if (!dialog.open) dialog.showModal();
  toastRegion(); // Så "Fortryd" kan ses og klikkes oven på fejringen
  document.getElementById("celebrateClose").focus();
}

/* ---------- Introduktion i 3 trin ---------- */
let onboardingStep = 0;
function renderOnboarding() {
  document.querySelectorAll("#onboarding .ob-step").forEach(step => { step.hidden = Number(step.dataset.step) !== onboardingStep; });
  document.querySelectorAll("#onboarding .ob-dots span").forEach((dot, i) => dot.classList.toggle("on", i === onboardingStep));
  document.getElementById("onboarding").setAttribute("aria-labelledby", `obTitle${onboardingStep}`);
  document.getElementById("obBack").hidden = onboardingStep === 0;
  document.getElementById("obNext").textContent = onboardingStep === 2 ? "Kom i gang" : "Næste";
  document.getElementById("obCount").textContent = `Trin ${onboardingStep + 1} af 3`;
  document.querySelectorAll("#obClasses .btn").forEach(btn => btn.setAttribute("aria-pressed", String(btn.dataset.class === activeClass)));
}
function openOnboarding() {
  onboardingStep = 0;
  document.getElementById("obClasses").innerHTML = CLASS_NAMES.map(name => `<button class="btn" type="button" data-class="${name}">${name}</button>`).join("");
  document.getElementById("obStages").innerHTML = PLANT_STAGES.map(stage => `<div>${plantSvg(stage.threshold)}${safeText(stage.name)}</div>`).join("");
  renderOnboarding();
  const dialog = document.getElementById("onboarding");
  if (!dialog.open) dialog.showModal();
  document.getElementById("obNext").focus();
}
function moveOnboarding(delta) {
  onboardingStep = Math.max(0, Math.min(2, onboardingStep + delta));
  renderOnboarding();
  document.getElementById(`obTitle${onboardingStep}`).focus();
}
function finishOnboarding() {
  state.onboardingDone = true;
  saveState();
  const dialog = document.getElementById("onboarding");
  if (dialog.open) dialog.close();
  setTimeout(maybeShowContestPopup, 300);
}

/* ---------- Klassekonkurrence ---------- */
function contestStore() { return (demoState || state).contest; }
// Konkurrencens første og sidste dag (som "ÅÅÅÅ-MM-DD").
function contestPeriod() {
  const start = CONTEST.start || mondayOf(todayKey());
  return {start, end: addDays(start, CONTEST.weeks * 7 - 1)};
}
// Godkendte point i konkurrenceperioden + antal forskellige udfordringer (bruges ved lige point).
function contestScore(name) {
  const {start, end} = contestPeriod();
  const items = classData(name).approved.filter(item => item.date >= start && item.date <= end);
  return {points: items.reduce((sum, item) => sum + item.points, 0), kinds: new Set(items.map(item => item.challengeId)).size};
}
function contestStandings() {
  return CLASS_NAMES.filter(name => contestStore()[name])
    .map(name => ({name, team: contestStore()[name].team, ...contestScore(name)}))
    .sort((a, b) => b.points - a.points || b.kinds - a.kinds);
}
function renderContest() {
  const {start, end} = contestPeriod();
  const today = todayKey();
  const periodText = `${formatDate(start)} til ${formatDate(end)}`;
  const values = {name: CONTEST.name, prize: CONTEST.prize, period: periodText};
  document.querySelectorAll("[data-contest]").forEach(el => {
    const value = values[el.dataset.contest] || "";
    el.textContent = value;
  });
  document.querySelectorAll(".contest-example").forEach(el => { el.hidden = !CONTEST.isExample; });
  // Klassens status på klassens side
  const entry = contestStore()[activeClass];
  const standings = contestStandings();
  const status = document.getElementById("contestStatus");
  const link = document.getElementById("contestSignupLink");
  const daysLeft = Math.round((parseDateKey(end) - parseDateKey(today)) / 86400000);
  const timeText = today < start ? `Starter ${formatDate(start)}.` : daysLeft < 0 ? "Konkurrencen er slut." : `${daysLeft + 1} dage tilbage.`;
  if (entry) {
    const place = standings.findIndex(s => s.name === activeClass) + 1;
    status.textContent = `Klasse ${activeClass}${entry.team ? ` ("${entry.team}")` : ""} er tilmeldt · nr. ${place} af ${standings.length} · ${contestScore(activeClass).points} point. ${timeText}`;
    link.textContent = "Se tilmelding";
  } else {
    status.textContent = `Klasse ${activeClass} er ikke tilmeldt endnu. ${timeText}`;
    link.textContent = "Tilmeld klassen";
  }
  // Stillingen – kun tilmeldte klasser
  const board = document.getElementById("contestBoard");
  board.innerHTML = standings.length ? "" : '<div class="empty">Ingen klasser er tilmeldt endnu. Bliv den første!</div>';
  standings.forEach((s, i) => {
    const row = document.createElement("div");
    row.className = "league-row" + (s.name === activeClass ? " current" : "");
    row.innerHTML = `<div class="rank">${i + 1}</div><div><strong>${safeText(s.name)}</strong><div class="small">${safeText(s.team || "Uden holdnavn")}${demoState ? " · demo" : ""}</div></div><div class="points">${s.points} pt.</div>`;
    board.appendChild(row);
  });
  // Tilmeldingssiden (præmievalgene bygges kun én gang, så et valg ikke nulstilles)
  const prizes = document.getElementById("contestPrizes");
  if (!prizes.children.length) prizes.innerHTML = CONTEST.prizeIdeas.map((p, i) =>
    `<label><input type="radio" name="contestPrize" value="${p.id}"${i === 0 ? " checked" : ""}><span>${safeText(p.title)}<span class="small">${safeText(p.note)}</span></span></label>`).join("");
  document.getElementById("contestIdeas").innerHTML = CONTEST.prizeIdeas.map(p => `<li><strong>${safeText(p.title)}</strong> – ${safeText(p.note)}</li>`).join("");
  renderContestForm();
}
// Viser enten formularen eller kvitteringen for den valgte klasse.
function renderContestForm() {
  const select = document.getElementById("contestClass");
  if (!select.value) select.value = activeClass;
  const entry = contestStore()[select.value];
  document.getElementById("contestForm").hidden = !!entry;
  document.getElementById("contestDone").hidden = !entry;
  if (entry) {
    const voted = CONTEST.prizeIdeas.find(p => p.id === entry.vote);
    document.getElementById("contestDoneText").textContent = `🎉 Klasse ${select.value}${entry.team ? ` ("${entry.team}")` : ""} er tilmeldt ${CONTEST.name}! Klassen stemte på: ${voted ? voted.title : "–"}. Stillingen kan ses på klassens side.`;
  }
}
function submitContest(event) {
  event.preventDefault();
  const name = document.getElementById("contestClass").value;
  const students = Number(document.getElementById("contestStudents").value);
  if (!document.getElementById("contestRules").checked) { showToast("Sæt kryds ved reglerne, før klassen tilmeldes.", true); return; }
  if (!Number.isInteger(students) || students < 1 || students > 40) { showToast("Skriv antal elever mellem 1 og 40.", true); return; }
  const vote = (document.querySelector('input[name="contestPrize"]:checked') || {}).value || CONTEST.prizeIdeas[0].id;
  contestStore()[name] = {signedUp: true, team: document.getElementById("contestTeam").value.trim().slice(0, 40), students, vote, signedAt: Date.now()};
  if (name !== activeClass) setActiveClass(name);
  saveState();
  render();
  showToast(`Klasse ${name} er tilmeldt ${CONTEST.name}!`);
  document.getElementById("contestFormTitle").focus();
}
async function cancelContest() {
  const name = document.getElementById("contestClass").value;
  const ok = await confirmDialog(`Afmeld klasse ${name}?`, "Klassen fjernes fra konkurrencen. Klassens point bliver ikke slettet.", "Afmeld");
  if (!ok) return;
  delete contestStore()[name];
  saveState();
  render();
  showToast(`Klasse ${name} er afmeldt konkurrencen.`);
  document.getElementById("contestFormTitle").focus();
}
// Pop-up'en vises kun én gang – og aldrig oven i introduktionen, demoen eller pitchen.
function maybeShowContestPopup() {
  const params = new URLSearchParams(location.search);
  // Så længe konkurrencen er et fiktivt eksempel, vises der ingen pop-up – den skal ikke tage fokus fra selve appen.
  if (CONTEST.isExample) return;
  if (state.contestPopupSeen || params.has("demo") || params.has("pitch")) return;
  if (document.querySelector("dialog[open]")) return;
  document.getElementById("contestPopup").showModal();
  document.getElementById("contestPopupGo").focus();
}
function closeContestPopup(goToSignup) {
  state.contestPopupSeen = true;
  saveState();
  const dialog = document.getElementById("contestPopup");
  if (dialog.open) dialog.close();
  if (goToSignup) location.hash = "konkurrence";
}

/* ---------- Visninger (faneblade) ----------
   Adressen efter # bestemmer, hvilken visning der vises: #klassen, #skoler eller #laerer.
   Et afsnit på en side kan nås med fx #skoler-priser. Det virker også, når filen åbnes direkte fra computeren. */
const VIEWS = ["klassen", "skoler", "laerer", "konkurrence"];
function showView(name, moveFocus) {
  VIEWS.forEach(view => { document.getElementById(`view-${view}`).hidden = view !== name; });
  document.querySelectorAll(".tabs a").forEach(link => {
    if (link.dataset.view === name) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  if (name === "laerer") renderTeacher();
  if (name === "skoler") renderEconomy();
  if (name === "konkurrence") { document.getElementById("contestClass").value = activeClass; renderContestForm(); }
  if (moveFocus) {
    const target = name === "laerer" && !teacherUnlocked ? document.getElementById("pinInput") : document.getElementById("main");
    target.focus({preventScroll:true});
    window.scrollTo(0, 0);
  }
}
function routeFromHash(moveFocus) {
  const hash = location.hash.slice(1);
  const name = hash.split("-")[0];
  if (VIEWS.includes(name)) {
    showView(name, moveFocus && hash === name);
    // Et afsnit, fx #skoler-priser: rul ned til det og flyt fokus dertil.
    const section = hash !== name ? document.getElementById(hash) : null;
    if (section) { section.scrollIntoView({behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start"}); section.focus({preventScroll:true}); }
  } else if (!location.hash) showView("klassen", false);
  // Andre #-adresser (fx #main fra "Spring til indhold") ændrer ikke visningen.
}

/* ---------- Samlet opdatering af skærmen ---------- */
function render() {
  const data = classData();
  const totals = totalApproved(data);
  document.getElementById("totalPoints").textContent = totals.points;
  document.getElementById("co2Total").textContent = formatCo2(totals.co2);
  document.getElementById("waterTotal").textContent = `${totals.water.toLocaleString("da-DK",{maximumFractionDigits:0})} L`;
  document.getElementById("pendingTotal").textContent = data.pending.length;
  document.getElementById("classSelect").value = activeClass;
  document.getElementById("teacherClassSelect").value = activeClass;
  renderPlant(totals.points);
  renderChallenges();
  renderPending();
  renderGoal();
  renderWeekChart("classChart", null, 170);
  renderLeague();
  renderDemoControls();
  renderContest();
  renderTeacher();
}
function setActiveClass(name) {
  if (!CLASS_NAMES.includes(name)) return;
  activeClass = name;
  state.activeClass = name;
  saveState();
  render();
  startCooldownRefresh();
}
function setTheme(theme, remember) {
  if (remember) { state.theme = theme; saveState(); }
  document.documentElement.dataset.theme = theme;
  // Ikon-knappen hedder altid "Mørk tilstand" (for skærmlæsere) og er "trykket ned", når mørk tilstand er slået til.
  document.getElementById("themeBtn").setAttribute("aria-pressed", String(theme === "dark"));
  document.querySelector('meta[name="theme-color"]').setAttribute("content", theme === "dark" ? "#101b16" : "#26734d");
}

/* ---------- Knapper og hændelser ---------- */
["classSelect", "teacherClassSelect"].forEach(id => {
  const select = document.getElementById(id);
  select.innerHTML = CLASS_NAMES.map(name => `<option value="${name}">${name}</option>`).join("");
  select.addEventListener("change", event => setActiveClass(event.target.value));
});
document.getElementById("themeBtn").addEventListener("click", () => {
  const change = () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark", true);
  if (document.startViewTransition && !prefersReducedMotion()) document.startViewTransition(change);
  else change();
});
document.getElementById("pinForm").addEventListener("submit", event => {
  event.preventDefault();
  const input = document.getElementById("pinInput");
  const error = document.getElementById("pinError");
  if (input.value !== CONFIG.teacherPin) {
    input.setAttribute("aria-invalid", "true");
    // Tøm feltet først, så skærmlæsere også læser beskeden op, hvis man taster forkert to gange.
    error.textContent = "";
    setTimeout(() => { error.textContent = "Forkert PIN-kode. Prøv igen."; }, 50);
    input.select();
    return;
  }
  input.value = "";
  input.removeAttribute("aria-invalid");
  error.textContent = "";
  setTeacherUnlocked(true);
  document.getElementById("dashTitle").setAttribute("tabindex", "-1");
  document.getElementById("dashTitle").focus();
  showToast("Lærerområdet er åbent.");
});
document.getElementById("lockBtn").addEventListener("click", () => {
  setTeacherUnlocked(false);
  document.getElementById("pinInput").focus();
  showToast("Lærerområdet er låst.");
});
document.getElementById("pendingTodayList").addEventListener("click", handleQueueClick);
// Ctrl/Cmd + Z fortryder seneste godkendelse eller afvisning (ikke mens man skriver i et felt).
document.addEventListener("keydown", event => {
  if (!lastUndo || !(event.ctrlKey || event.metaKey) || event.shiftKey || event.altKey || event.key.toLowerCase() !== "z") return;
  if (event.target.closest && event.target.closest("input, textarea, select, [contenteditable]")) return;
  event.preventDefault();
  runUndo();
});
// Beskedområdet flyttes tilbage til siden, når en dialog lukker.
document.querySelectorAll("dialog").forEach(dialog => dialog.addEventListener("close", () => {
  const region = document.getElementById("toastRegion");
  if (dialog.contains(region)) document.body.appendChild(region);
}));
document.getElementById("pendingOlderList").addEventListener("click", handleQueueClick);
document.getElementById("approveTodayBtn").addEventListener("click", () => {
  const ids = classData().pending.filter(item => item.date === todayKey()).map(item => item.id);
  approveItems(ids);
  document.getElementById("queueTitle").focus();
});
document.getElementById("approveOlderBtn").addEventListener("click", () => {
  const ids = classData().pending.filter(item => item.date !== todayKey()).map(item => item.id);
  approveItems(ids);
  document.getElementById("queueTitle").focus();
});
document.getElementById("rejectOlderBtn").addEventListener("click", async () => {
  const ids = classData().pending.filter(item => item.date !== todayKey()).map(item => item.id);
  const ok = await confirmDialog("Afvis alle ældre?", `${ids.length} indsendelser fra tidligere dage bliver afvist og tæller ikke med.`, "Afvis alle");
  if (ok) rejectItems(ids);
  document.getElementById("queueTitle").focus();
});
window.addEventListener("hashchange", () => routeFromHash(true));
let resizeTimer = null;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => { renderEconomy(); renderWeekChart("classChart", null, 170); if (teacherUnlocked) renderWeekChart(); }, 150);
});
// Hvis appen er åben i to faner (fx elev og lærer), opdateres den ene, når den anden gemmer.
window.addEventListener("storage", event => {
  if (event.key !== CONFIG.storageKey && event.key !== CONFIG.demoStorageKey) return;
  state = loadState();
  demoState = loadDemoState();
  activeClass = state.activeClass;
  render();
  startCooldownRefresh();
});
// Står siden åben hen over midnat (fx på klassens skærm), starter en ny dag automatisk.
let renderedDay = todayKey();
setInterval(() => {
  if (todayKey() !== renderedDay) { renderedDay = todayKey(); render(); }
}, 30000);
// Introduktion og fejring
document.getElementById("heroHowBtn").addEventListener("click", openOnboarding);
document.getElementById("obNext").addEventListener("click", () => onboardingStep === 2 ? finishOnboarding() : moveOnboarding(1));
document.getElementById("obBack").addEventListener("click", () => moveOnboarding(-1));
document.getElementById("obSkip").addEventListener("click", finishOnboarding);
document.getElementById("onboarding").addEventListener("close", () => { if (!state.onboardingDone) { state.onboardingDone = true; saveState(); } });
document.getElementById("obClasses").addEventListener("click", event => {
  const button = event.target.closest("[data-class]");
  if (!button) return;
  setActiveClass(button.dataset.class);
  renderOnboarding();
});
document.getElementById("celebrateClose").addEventListener("click", () => document.getElementById("celebration").close());
// Klassekonkurrence
document.getElementById("contestClass").innerHTML = CLASS_NAMES.map(name => `<option value="${name}">${name}</option>`).join("");
document.getElementById("contestClass").addEventListener("change", renderContestForm);
document.getElementById("contestForm").addEventListener("submit", submitContest);
document.getElementById("contestCancel").addEventListener("click", cancelContest);
document.getElementById("contestPopupGo").addEventListener("click", () => closeContestPopup(true));
document.getElementById("contestPopupLater").addEventListener("click", () => closeContestPopup(false));
document.getElementById("contestPopup").addEventListener("close", () => { if (!state.contestPopupSeen) { state.contestPopupSeen = true; saveState(); } });
// Del
document.getElementById("shareBtn").addEventListener("click", openShare);
document.getElementById("shareClose").addEventListener("click", () => document.getElementById("shareDialog").close());
document.getElementById("shareCopy").addEventListener("click", copyShareLink);
document.getElementById("shareNative").addEventListener("click", () => {
  navigator.share({title: "GroKlassen", text: "Prøv GroKlassen (demo med opdigtede eksempeldata)", url: demoUrl()}).catch(() => {});
});
// Præsentationstilstand
document.getElementById("pitchBtn").addEventListener("click", openPitch);
document.getElementById("pitchClose").addEventListener("click", closePitch);
document.getElementById("pitchPrev").addEventListener("click", () => goPitch(pitchIndex - 1));
document.getElementById("pitchNext").addEventListener("click", () => goPitch(pitchIndex + 1));
document.getElementById("pitchDots").addEventListener("click", event => {
  const dot = event.target.closest("button");
  if (dot) goPitch([...dot.parentElement.children].indexOf(dot));
});
document.getElementById("pitchFullscreen").addEventListener("click", toggleFullscreen);
document.getElementById("pitchFullscreen").hidden = !document.fullscreenEnabled;
document.getElementById("pitch").addEventListener("close", () => {
  stopSwipeAnimation(true);
  if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {});
});
// Piletaster: → og PageDown = næste, ← og PageUp = forrige, Home/End = første/sidste, F = fuld skærm. Esc lukker.
document.getElementById("pitch").addEventListener("keydown", event => {
  const onButton = event.target.closest && event.target.closest("button");
  if (event.key === "ArrowRight" || event.key === "PageDown" || (event.key === " " && !onButton)) { event.preventDefault(); goPitch(pitchIndex + 1); }
  else if (event.key === "ArrowLeft" || event.key === "PageUp") { event.preventDefault(); goPitch(pitchIndex - 1); }
  else if (event.key === "Home") { event.preventDefault(); goPitch(0); }
  else if (event.key === "End") { event.preventDefault(); goPitch(PITCH_SLIDES.length - 1); }
  else if ((event.key === "f" || event.key === "F") && !event.ctrlKey && !event.metaKey && !event.altKey) toggleFullscreen();
});
// Swipe (finger eller mus): stryg til venstre = næste, til højre = forrige. Hændelserne er sat op længere oppe.
pitchStage.addEventListener("pointerdown", startSwipe);
pitchStage.addEventListener("pointermove", moveSwipe);
pitchStage.addEventListener("pointerup", event => endSwipe(event, false));
pitchStage.addEventListener("pointercancel", event => endSwipe(event, true));
// Økonomiberegnerne (kommuner og sponsorater)
[[MUNI_FIELDS, "muni", MUNI_SCENARIOS, "kommuner"], [SPONSOR_FIELDS, "sp", SPONSOR_SCENARIOS, "sponsorater"]].forEach(([fields, prefix, scenarios, name]) => {
  Object.values(fields).forEach(id => document.getElementById(id).addEventListener("input", renderEconomy));
  document.querySelectorAll(`[data-${prefix}-scenario]`).forEach(btn => btn.addEventListener("click", () => {
    const key = btn.dataset[`${prefix}Scenario`];
    setFields(fields, scenarios[key]); renderEconomy();
    showToast(`Beregneren for ${name} viser scenariet "${scenarios[key].label}" (forudsætninger).`);
  }));
  document.getElementById(`${prefix}Form`).addEventListener("submit", event => event.preventDefault());
  document.getElementById(`${prefix}Reset`).addEventListener("click", () => { setFields(fields, scenarios.expected); renderEconomy(); showToast(`Beregneren for ${name} viser igen forudsætningerne.`); });
});
// Ugemål
document.getElementById("goalForm").addEventListener("submit", event => {
  event.preventDefault();
  setWeeklyGoal(document.getElementById("goalInput").value);
});
// Rapport og eksport
document.getElementById("csvBtn").addEventListener("click", exportCsv);
document.getElementById("reportBtn").addEventListener("click", openReport);
document.getElementById("reportClose").addEventListener("click", () => document.getElementById("reportDialog").close());
document.getElementById("reportPrint").addEventListener("click", () => {
  document.body.classList.remove("printing-a4", "printing-newsletter");
  document.body.classList.add("printing-report");
  window.print();
});
document.getElementById("a4Btn").addEventListener("click", printA4);
window.addEventListener("afterprint", () => document.body.classList.remove("printing-report", "printing-a4", "printing-newsletter"));
// Månedens nyhedsbrev (lærer) og eksemplet under "For skoler"
document.getElementById("newsletterBtn").addEventListener("click", openNewsletter);
document.getElementById("newsletterClose").addEventListener("click", () => document.getElementById("newsletterDialog").close());
document.getElementById("newsletterPrint").addEventListener("click", printNewsletter);
document.getElementById("nlMonth").addEventListener("change", renderNewsletter);
// Demo-data
document.getElementById("heroDemoBtn").addEventListener("click", () => startDemo(false));
document.getElementById("demoLoadBtn").addEventListener("click", () => startDemo(false));
["demoResetBtn", "demoResetBtn2"].forEach(id => document.getElementById(id).addEventListener("click", () => {
  startDemo(true);
  showToast("Demoen er nulstillet til udgangspunktet.");
}));
["demoExitBtn", "demoExitBtn2"].forEach(id => document.getElementById(id).addEventListener("click", exitDemo));
document.getElementById("resetClassBtn").addEventListener("click", async () => {
  const ok = await confirmDialog(`Nulstil klasse ${activeClass}?`, "Alle godkendte, ventende og afviste indsendelser for klassen slettes i denne browser. Ugemålet beholdes. Det kan ikke fortrydes.", "Slet klassens data");
  if (!ok) return;
  const goal = classData().weeklyGoal;
  state.classes[activeClass] = {...emptyClass(), weeklyGoal: goal};
  saveState();
  render();
  startCooldownRefresh();
  showToast(`Klasse ${activeClass} er nulstillet.`);
});

/* ---------- Start appen ---------- */
const urlParams = new URLSearchParams(location.search);
// Standard-PIN'en vises kun som hjælp, så længe den ikke er ændret (det er en demo-lås).
document.getElementById("pinInput").placeholder = CONFIG.teacherPin === "1234" ? "Demo-PIN: 1234" : "Indtast PIN";
setTheme(state.theme || (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"), false);
applyTeamData();
renderMethods();
// Pitch-tilstanden genbruger logoet fra toppen af siden.
document.querySelectorAll("[data-logo]").forEach(img => { img.src = document.getElementById("brandLogo").src; });
renderSponsorTiers();
renderSdg();
initEconomy();
renderNewsletterPreview();
// ?demo=1 i adressen starter altid en frisk demo (praktisk til pitchen).
if (urlParams.get("demo") === "1") startDemo(true);
render();
routeFromHash(false);
// Introduktionen vises automatisk første gang (men ikke i demo- eller pitch-tilstand).
const startView = location.hash.slice(1).split("-")[0];
if (!state.onboardingDone && !urlParams.has("demo") && !urlParams.has("pitch") && (!startView || startView === "klassen")) openOnboarding();
// ?pitch=1 i adressen åbner præsentationstilstanden med det samme.
if (urlParams.get("pitch") === "1") openPitch();
// Konkurrence-pop-up'en (kun én gang, og kun hvis intet andet er åbent).
if (state.onboardingDone) setTimeout(maybeShowContestPopup, 600);
// Hvis en cooldown stadig er aktiv efter genindlæsning, startes nedtællingen igen.
startCooldownRefresh();

const copy = document.querySelector('#view-klassen .hero > div');
copy.classList.add('hero-copy');
document.getElementById('heroTitle').innerHTML='Små handlinger.<br>Stor forskel.';
document.querySelector('.hero-lead').textContent='Gør noget grønt i dag. Registrér din handling, og se klassens plante vokse, når læreren har godkendt den.';
document.querySelector('.hero-points').innerHTML='<li><span class="gro-stepno">1</span> Vælg handling</li><li><span class="gro-stepno">2</span> Læreren godkender</li><li><span class="gro-stepno">3</span> Planten vokser</li>';
const register=document.createElement('button');register.type='button';register.className='btn primary';register.textContent='Registrér en handling →';
const actions=document.querySelector('.hero-actions');actions.prepend(register);
document.getElementById('heroHowBtn').classList.remove('primary');
register.addEventListener('click',()=>{const heading=document.getElementById('challengesTitle');heading.setAttribute('tabindex','-1');heading.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});heading.focus({preventScroll:true});});
const bar=document.createElement('div');bar.className='gro-classbar';bar.innerHTML='<p>Jeres fælles grønne hverdag</p><label>Din klasse</label>';
bar.querySelector('label').append(document.getElementById('classSelect'));
document.getElementById('view-klassen').prepend(bar);
const art=document.getElementById('heroPlant');const scene=document.createElement('div');scene.className='gro-scene';art.before(scene);scene.append(art);
const treeTitle=document.createElement("h2");treeTitle.className="gro-tree-title";treeTitle.dataset.treeTitle="";treeTitle.textContent=treeName();scene.prepend(treeTitle);art.removeAttribute("aria-hidden");
const plantStatus=document.createElement('div');plantStatus.className='gro-plant-status';scene.append(plantStatus);
['plantStage','progressTrack','progressText'].forEach(id=>plantStatus.append(document.getElementById(id)));
const aside=document.querySelector('#view-klassen .layout > aside');aside.prepend(document.querySelector('[aria-labelledby="pendingTitle"]'));
document.getElementById('challengesTitle').textContent='Hvad har du gjort i dag?';
document.querySelector('[aria-labelledby="challengesTitle"] .section-head .small').textContent='Vælg din grønne handling. Den tæller, når læreren godkender.';
document.querySelectorAll('#view-klassen > .hero, #view-klassen > .stats, #view-klassen > .layout').forEach(el=>el.classList.add('gro-reveal'));

// Installation, driftstatus og systemtema. Klassens data bliver i browseren.
const installButton=document.createElement('button');installButton.type='button';installButton.className='btn gro-install';installButton.textContent='Installér';installButton.setAttribute('aria-haspopup','dialog');document.querySelector('.header-actions').prepend(installButton);
const installGuide=document.createElement('dialog');installGuide.className='gro-app-guide';installGuide.setAttribute('aria-labelledby','groInstallTitle');installGuide.innerHTML=`<h2 id="groInstallTitle">GroKlassen som app</h2><p>Dit fælles grønne mål. Direkte fra hjemmeskærmen.</p><p id="installState" role="status"></p><button class="btn primary" type="button" id="nativeInstall" hidden>Installér GroKlassen</button><h3>iPhone og iPad</h3><ol><li>Åbn appen i Safari.</li><li>Tryk på Del.</li><li>Vælg “Føj til hjemmeskærm”.</li></ol><h3>Mac og Windows</h3><p>I Chrome og Edge kan du bruge browserens installationsikon, når det vises. På Mac kan Safari også føje siden til Dock.</p><h3>Udseende</h3><label for="appTheme">Farvetema</label><select class="input" id="appTheme"><option value="system">Følg enheden</option><option value="light">Lys</option><option value="dark">Mørk</option></select><div class="notice"><strong>Gemmes på denne enhed</strong><br>Klassedata deles ikke automatisk mellem enheder. Sletning af browserdata kan fjerne dem. Lærerens PIN er en demo-lås.</div><div class="gro-install-actions"><button class="btn" type="button" id="groInstallClose">Luk</button></div>`;
document.body.append(installGuide);installButton.addEventListener('click',()=>installGuide.showModal());document.getElementById('groInstallClose').addEventListener('click',()=>installGuide.close());
const appStatus=document.createElement('div');appStatus.className='app-status';appStatus.setAttribute('aria-live','polite');document.querySelector('.tabs').after(appStatus);
let offlineReady=false,pwaError='',pendingInstall=null,waitingWorker=null;
function updateAppStatus(){const standalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;installButton.textContent=standalone?'Appindstillinger':'Installér';appStatus.textContent=!navigator.onLine?(offlineReady?'Offline · handlinger gemmes på denne enhed':'Ingen forbindelse · offlineversion er ikke klar'):(pwaError?'Offlinefunktion er ikke klar · se Appindstillinger':'');document.getElementById('installState').textContent=pwaError||(standalone?'Appen er installeret på denne enhed.':offlineReady?'Klar til offlinebrug på denne enhed.':'Gør appen klar til offlinebrug…');document.getElementById('nativeInstall').hidden=!pendingInstall||standalone;}
addEventListener('beforeinstallprompt',event=>{event.preventDefault();pendingInstall=event;updateAppStatus()});document.getElementById('nativeInstall').addEventListener('click',async()=>{if(!pendingInstall)return;const prompt=pendingInstall;pendingInstall=null;try{await prompt.prompt();await prompt.userChoice}catch{showToast('Brug browserens installationsmenu.',true)}updateAppStatus()});addEventListener('appinstalled',()=>{pendingInstall=null;updateAppStatus()});addEventListener('online',updateAppStatus);addEventListener('offline',updateAppStatus);
const systemTheme=matchMedia('(prefers-color-scheme: dark)');document.getElementById('appTheme').value=state.theme||'system';document.getElementById('appTheme').addEventListener('change',event=>{const value=event.target.value;state.theme=value==='system'?null:value;saveState();setTheme(state.theme||(systemTheme.matches?'dark':'light'),false)});systemTheme.addEventListener('change',event=>{if(!state.theme)setTheme(event.matches?'dark':'light',false)});document.getElementById('themeBtn').addEventListener('click',()=>{document.getElementById('appTheme').value=state.theme||'system'});
let reloading=false;function offerUpdate(worker){waitingWorker=worker;const message=document.createElement('div');message.className='app-update';message.setAttribute('role','status');message.innerHTML='<span>En ny version er klar. Dine gemte klassedata bevares.</span><button class="btn primary" type="button">Opdatér</button><button class="btn" type="button">Senere</button>';message.querySelectorAll('button')[0].onclick=()=>{saveState();waitingWorker?.postMessage({type:'SKIP_WAITING'})};message.querySelectorAll('button')[1].onclick=()=>message.remove();document.querySelector('.app-update')?.remove();appStatus.after(message)}
async function registerApp(){if(location.protocol==='file:'){pwaError='Åbn appen via HTTPS for installation og offlinebrug.';updateAppStatus();return}if(!('serviceWorker'in navigator)||!isSecureContext){pwaError='Installation og offline kræver en sikker HTTPS-adresse.';updateAppStatus();return}try{const registration=await navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'});const ready=await navigator.serviceWorker.ready;const cache=await caches.match(new URL('./index.html',ready.scope));offlineReady=!!cache;if(registration.waiting)offerUpdate(registration.waiting);registration.addEventListener('updatefound',()=>{const worker=registration.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller)offerUpdate(worker)})});navigator.serviceWorker.addEventListener('controllerchange',()=>{if(waitingWorker&&!reloading){reloading=true;location.reload()}});updateAppStatus()}catch{pwaError='Offlineversionen kunne ikke gemmes. Prøv igen med forbindelse.';updateAppStatus()}}
updateAppStatus();registerApp();
