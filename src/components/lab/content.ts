/* ============================================================
   CONTENT — all copy lives here, in `en` and `no`.
   Projects carry an id used by the 3D stations and the network.
   ============================================================ */

export type Lang = "en" | "no";
export type Note = { slug: string; title: string; date: string; level: "m" | "b"; href: string };
type Link = { k: "website" | "repo" | "pypi"; href: string; text: string };
type ProjectFacts = { cat: "safe" | "ventures" | "research"; years: string; y: number; featured: number; tags: string[]; links: Link[] };

const GH = 'https://github.com/yasinhessnawi1/';
const email = 'yasinhessnawi1@gmail.com';
const linkedin = 'https://www.linkedin.com/in/yasin-hessnawi-102a02326';
const github = 'https://github.com/yasinhessnawi1';

// shared, language-independent project facts
export const P = {
  physgate:    { cat: 'safe', years: '2026–now', y: 2026, featured: 3, tags: ['Python', 'pint', 'SymPy', 'Claude Code'], links: [] },
  openpersona: { cat: 'safe', years: '2025–now', y: 2025.5, featured: 4, tags: ['Python', 'FastAPI', 'Next.js', 'pgvector', 'LiveKit', 'MCP'], links: [{ k: 'website', href: 'https://app.openpersonasai.com', text: 'app.openpersonasai.com' }, { k: 'repo', href: 'https://github.com/yasinhessnawi1/Open-Personas-ai', text: 'Open-Personas-ai' }, { k: 'pypi', href: 'https://pypi.org/project/persona-core/', text: 'persona-core' }] },
  glive:       { cat: 'safe', years: '2025–now', y: 2025.4, featured: 7, tags: ['Go', 'Next.js', 'Docker'], links: [] },
  declassifai: { cat: 'ventures', years: '2025–now', y: 2025.2, featured: 1, tags: ['AI/ML', 'React', 'Python', 'Azure'], links: [{ k: 'website', href: 'https://declassifai.com', text: 'declassifai.com' }] },
  safemedia:   { cat: 'ventures', years: '2025–now', y: 2025.1, featured: 2, tags: ['Company', 'Secure processing'], links: [{ k: 'website', href: 'https://safemediai.com', text: 'safemediai.com' }] },
  rlcc:        { cat: 'research', years: '2026', y: 2026.1, featured: 5, tags: ['PyTorch', 'RL', 'Gumbel MCTS', 'Self-play'], links: [{ k: 'repo', href: GH + 'reinforcement-learning-on-chinese-checkers', text: 'reinforcement-learning-on-chinese-checkers' }] },
  tsetlin:     { cat: 'research', years: '2025–now', y: 2025.6, featured: 6, tags: ['Tsetlin machines', 'CUDA', 'Hex'], links: [{ k: 'repo', href: GH + 'tsetlin-hex', text: 'tsetlin-hex' }] },
  personarag:  { cat: 'research', years: '2026', y: 2026.05, featured: 8, tags: ['Gemma-2-9B', 'RAG', 'Interpretability'], links: [{ k: 'repo', href: GH + 'Persona-RAG', text: 'Persona-RAG' }] },
  mmimdb:      { cat: 'research', years: '', y: 2024, featured: 9, tags: ['PyTorch', 'Multimodal', 'MM-IMDb'], links: [] },
  deepernn:    { cat: 'research', years: '', y: 2024, featured: 10, tags: ['PyTorch', 'Transformers', 'MoE'], links: [] },
  uiarag:      { cat: 'research', years: '', y: 2024, featured: 11, tags: ['RAG', 'BM25', 'Reranking'], links: [] },
};

const courses: [string, string, string, string, 'm' | 'b'][] = [
  ['advanced-deep-learning', 'Advanced Deep Learning', 'Avansert dyp læring', '2026-06-20', 'm'],
  ['applied-algorithms', 'Applied Algorithms', 'Anvendte algoritmer', '2026-06-15', 'm'],
  ['reinforcement-learning', 'Reinforcement Learning', 'Forsterkende læring', '2026-06-10', 'm'],
  ['intelligent-data-management', 'Intelligent Data Management', 'Intelligent databehandling', '2026-06-05', 'm'],
  ['ai-mathematics', 'AI Mathematics', 'KI-matematikk', '2025-08-01', 'm'],
  ['intro-ml', 'Introduction to Machine Learning', 'Introduksjon til maskinlæring', '2025-08-01', 'm'],
  ['research-methods', 'Research Methods', 'Forskningsmetoder', '2025-08-01', 'm'],
  ['tsetlin-machine', 'Learning Systems (Tsetlin Machine)', 'Lærende systemer (Tsetlin-maskin)', '2025-08-01', 'm'],
  ['hacking', 'Ethical Hacking and Penetration Testing', 'Etisk hacking og penetrasjonstesting', '2024-09-13', 'b'],
  ['iac', 'Infrastructure as Code (IaC)', 'Infrastruktur som kode (IaC)', '2024-09-13', 'b'],
  ['mobil', 'Mobile Development', 'Mobilutvikling', '2024-09-13', 'b'],
  ['web', 'Web Development', 'Webutvikling', '2024-09-13', 'b'],
  ['cloud', 'Cloud Technologies and Services', 'Skyteknologier og -tjenester', '2024-06-01', 'b'],
  ['cv', 'Computer Vision and Machine Learning', 'Datasyn og maskinlæring', '2024-06-01', 'b'],
  ['db', 'Data modeling and database systems', 'Datamodellering og databasesystemer', '2024-06-01', 'b'],
  ['algmet', 'Algorithms and Data Structures', 'Algoritmer og datastrukturer', '2024-01-01', 'b'],
  ['cyber', 'Cybersecurity', 'Cybersikkerhet', '2024-01-01', 'b'],
  ['os', 'Operating Systems, Virtualization and Security', 'Operativsystemer, virtualisering og sikkerhet', '2024-01-01', 'b'],
  ['prog2', 'Second programming course', 'Andre programmeringskurs', '2023-06-01', 'b'],
  ['sys', 'System Development', 'Systemutvikling', '2023-06-01', 'b'],
  ['prog1', 'First Programming Course', 'Første programmeringskurs', '2023-01-01', 'b'],
];
const notes = (l: Lang): Note[] => courses.map(([slug, en, no, date, lvl]) => ({ slug, title: l === 'no' ? no : en, date, level: lvl, href: l === 'no' ? `/no/blog/${slug}` : `/blog/${slug}` }));

const toolkit = (l: Lang): [string, string[]][] => [
  [l === 'no' ? 'Språk' : 'Languages', ['Python', 'Go', 'TypeScript/JavaScript', 'Java', 'Kotlin', 'C/C++', 'SQL']],
  [l === 'no' ? 'KI/ML' : 'AI/ML', ['PyTorch', 'NLP', l === 'no' ? 'Datasyn' : 'Computer vision', 'RL', l === 'no' ? 'Tsetlin-maskiner' : 'Tsetlin machines', 'RAG', l === 'no' ? 'LLM-agenter' : 'LLM agents', 'MCP']],
  ['Web', ['React', 'Next.js', 'FastAPI', 'Node']],
  [l === 'no' ? 'Sky' : 'Cloud', ['Azure', 'AWS', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions']],
  ['Data', ['PostgreSQL', 'pgvector', 'MongoDB', 'Neo4j', 'Kafka']],
];

const en = {
  meta: { title: "Yasin Hessnawi · AI engineer · The Gate", description: "Yasin Hessnawi, AI engineer and M.Sc. AI student in Norway. An explorable 3D lab of AI agents and the gates, sandboxes and checks that keep them honest." },
  ui: {
    brand: 'Yasin Hessnawi · Norway', open: 'Open to opportunities from summer 2027',
    nav: { projects: 'Projects', me: 'Me', notes: 'Notes', contact: 'Contact' },
    hint: 'Drag to look around · scroll to come closer · click anything that glows', viewList: 'View as list', view3d: 'Open the 3D lab',
    sound: 'Sound', soundOn: 'Sound on', soundOff: 'Sound off', langLabel: 'Language',
    loader: ['Initialising weights…', 'Waking the agents…', 'Calibrating the gate…'], tooLong: 'Taking too long',
    skip: 'Skip intro', title: "Welcome to Yasin's lab", subtitle: 'Agents at work. Everything passes the gate.',
    close: 'Close', back: 'Back', toast: 'Blocked by hook. 755 attempts, 0 escapes.', yours: 'your attempts',
    filters: { all: 'All', safe: 'Safe agents', ventures: 'Ventures', research: 'Research & learning systems' },
    sort: { label: 'Sort', featured: 'Featured', newest: 'Newest', az: 'A–Z' },
    links: { repo: 'Repo', website: 'Website', pypi: 'PyPI' }, featured: 'Featured', smaller: 'Smaller builds',
    allProjects: 'All projects', shelf: 'Shelf', openProject: 'Open project', count: (n: number) => `${n} projects`,
    checks: ['Units', 'Magnitudes', 'Equilibrium', 'Power balance', 'Conservation', 'Thermal budget', 'Change propagation'],
    check: 'Check',
    status: ['755 bypass attempts · 0 protected writes', '2nd of 24 · Chinese Checkers tournament', '91%+ PII detection', 'Eureka Prize 2025'],
    sheet: [['Hi, I\'m ', 'Yasin'], ['Name: ', 'Yasin Hessnawi'], ['Detected: ', '91%+'], ['Stored: ', '0 bytes']],
    footer: 'Designed and built in Norway', scan: { title: 'PII SCAN · LIVE', name: 'NAME', number: 'NUMBER', detect: 'detection accuracy', stored: 'bytes stored', e2e: 'End-to-end encrypted · Azure Norway East' }, terminal: { status: 'CHANNEL OPEN', send: 'Send a signal' }, rework: { title: 'REWORK', sub: 'failed a check · back to an agent' }, results: 'Results so far · Oct 2026',
    ships: 'What ships today', landscape: 'Best in landscape · drag, tap, explore', more: 'Read more', swipe: 'Swipe', sections: ['Projects', 'About', 'Notes', 'Contact'],
    replay: { title: 'Replay · my best tournament game', sub: 'Round 4, game 2 of the IKT460 tournament (22 May 2026). Six teams, 283 moves, decoded move by move from the tournament server log. My team, group 99, played yellow and brought all 10 pins home.', play: 'Play', pause: 'Pause', restart: 'Restart', move: 'Move', speed: 'Speed', mine: 'my team', score: 'Score', pins: 'Pins home', winner: 'Winner', live: 'LIVE REPLAY · R4G2', home: 'pins home', source: 'Source: games_round_4 server log' }, noWebgl: 'Showing the list version of the lab.',
  },
  stations: {
    gate: 'The gate · physgate', dome: 'Sandbox dome · physgate', agent: 'Agent · drag me to the wall', redaction: 'Redaction scanner · Declassifai', persona: 'Persona stage · Open Personas',
    game: 'Game table · RL for Chinese Checkers', hex: 'Hex panel · Graph Tsetlin Machine', shelf_safe: 'Shelf · Safe agents',
    shelf_ventures: 'Shelf · Ventures', shelf_research: 'Shelf · Research & learning', whiteboard: 'Whiteboard · About me',
    logbook: 'Log map · Notes', mailbox: 'Signal terminal · Contact', status: 'Status display', card: 'Passed the gate',
  },
  hero: 'I build intelligent things, and the gates that keep them honest.',
  bio: 'Software engineer and AI master\'s student at the University of Agder, graduating June 2027. I build AI agents and the checks around them, co-founded Safe Media AI, where I lead Declassifai, and right now I build LLM agent features at Green Norway.',
  about: {
    title: 'About me', now: 'Now', before: 'Before', education: 'Education', languagesT: 'Languages', toolkitT: 'Toolkit', resume: 'Download résumé',
    nowItems: [
      { role: 'AI Developer Intern', org: 'Green Norway, Kristiansand', when: '08/2026–now', text: 'Extending Lumi, the LLM agent in the GreenSight energy platform, so it fetches and processes user data through tools without the model ever seeing the values. Building AI automation of the development workflow in GitHub Actions: code review, fixing blocking issues, resolving merge conflicts, auto-merge. Migrating integrations to Azure Functions with 500+ automated tests.' },
      { role: 'Co-founder and CEO', org: 'Safe Media AI AS (Declassifai)', when: '01/2025–now', text: '' },
    ],
    beforeItems: [{ role: 'Teaching Assistant and Student Assistant', org: 'NTNU Gjøvik', when: '2024', text: 'With the LAOS teaching assistant certificate.' }],
    eduItems: [
      { role: 'M.Sc. in Technology (Sivilingeniør), Artificial Intelligence', org: 'University of Agder', when: '2025–2027', text: '' },
      { role: 'B.Eng. Data Engineering, Programming and Cybersecurity', org: 'NTNU', when: '2022–2025', text: 'Grade A thesis and the Eureka Prize.' },
    ],
    stats: [['M.Sc. AI', '@ UiA'], ['4+', 'years building'], ['21', 'university courses'], ['12+', 'projects shipped'], ['1', 'company co-founded']],
    languages: ['Arabic (native)', 'Norwegian (C1)', 'English (C1)'],
    toolkit: toolkit('en'), sdd: 'Spec-driven development with Claude Code.',
  },
  notesT: { title: 'Notes from the coursework', sub: 'Short write-ups of what I learned in 21 university courses, from the first programming course to Tsetlin machines.', masters: "Master's", bachelor: 'Bachelor', all: 'All', english: '', read: 'Read' },
  contact: { title: "Let's build something.", body: 'Questions, collaborations, PhD or job opportunities: write to me and I\'ll reply when I can.', email: 'Email', copy: 'Copy', copied: 'Copied', name: 'Name', namePh: 'Your name', emailPh: 'you@domain.com', message: 'Message', messagePh: 'Say hello…', send: 'Send message', sent: 'Your mail app should open with the message ready. Thanks, I\'ll reply as soon as I can.', sentApi: 'Message sent. Thanks, I\'ll reply as soon as I can.', vName: 'Enter your name', vEmail: 'Enter a valid email address', vMsg: 'Write a message', elsewhere: 'Elsewhere' },
  projects: {
    physgate: { title: 'physgate', meta: 'UiA specialisation project · SFI CELECT Work Package 4', hook: 'An agent harness for hardware–software co-design.', body: 'A deterministic orchestrator dispatches domain agents with paired reviewers. The core contribution is a physics gate of seven deterministic checks that stops physically invalid designs. Rules are enforced by hooks and an OS sandbox, not by prompts: in 755 bypass attempts, none wrote to a protected path. The learned escalation backends were tested in pre-registered experiments and rejected.', results: ['Physics gate on a sealed test set: caught 20 of 40 planted errors and failed none of 40 correct designs.', 'AI reviewers after calibration: accept 29 of 40 correct designs, up from 0 in the first test.', 'Reported as failed: one general reviewer beat the paired specialists (34 of 40 errors caught, 38 of 40 correct designs accepted, against 29 and 29).', 'Crash recovery: 10 of 10 clean restarts in each of 3 conditions.'] },
    openpersona: { title: 'Open Personas', meta: 'Open core · MIT engine', hook: 'An open-source agentic AI platform.', highlights: ['Four typed, versioned memory stores per persona: identity, self facts, worldview and episodic. Nothing is overwritten, and every write is audited.', 'One knowledge graph per user, shared by all personas, drawn as a memory map you can correct or forget from.', 'Schedules, initiative and event triggers, each behind approvals and spend caps.', 'Realtime voice over LiveKit that shares one memory with chat.', 'Telegram, Discord, Slack and email connectors, and 60 hand-written starter personas.'], body: 'AI assistants with typed, versioned memory, a user-scoped knowledge graph, autonomy behind consent gates, real-time voice, MCP tool use across 300+ servers, ten model providers, and a turn-time safety gate.' },
    glive: { title: 'GLive', meta: '', hook: 'GitHub to Live.', body: 'Clone and run any GitHub project with one command: AI-powered setup, dependency management, security scanning and a PWA dashboard.' },
    declassifai: { title: 'Declassifai', meta: '', hook: 'An AI platform that finds and redacts personal data in documents and images, with 91%+ detection accuracy.', body: 'It uses end-to-end encrypted processing with no data storage, was piloted with Mattilsynet (the Norwegian Food Safety Authority), and runs on Azure Norway East. Awards and funding: NTNU Eureka Prize 2025 and an Innovasjon Norge commercialisation grant 2026.' },
    safemedia: { title: 'Safe Media AI AS', meta: '', hook: 'Co-founded the company behind Declassifai and further secure-processing tools.', body: 'I have been co-founder and CEO since January 2025.' },
    rlcc: { title: 'RL agent for Chinese Checkers', meta: 'IKT460', hook: '2nd of 24 teams in the course tournament, with the highest average pin completion (9.5 of 10).', body: 'A residual network warm-started on heuristic and search-labelled positions, improved by self-play, playing through Gumbel Monte Carlo tree search.' },
    tsetlin: { title: 'Graph Tsetlin Machine · Hex', meta: '', hook: 'Interpretable, clause-based winner prediction for Hex, CUDA-accelerated.', body: '' },
    personarag: { title: 'Persona-RAG', meta: 'Independent research', hook: 'Persona-vector extraction replicated on Gemma-2-9B, then shown not to transfer to multi-turn drift detection.', body: 'Typed-memory retrieval was evaluated on a 360-transcript probe suite.' },
    mmimdb: { title: 'Multimodal Genre Classification', meta: 'MM-IMDb', hook: 'Text and poster fusion reaching 59.8% F1-macro.', body: '' },
    deepernn: { title: 'Deeper Neural Networks', meta: '', hook: 'Transformers, CNNs, mixture-of-experts and small agentic research systems.', body: '' },
    uiarag: { title: 'UiA RAG Chatbot', meta: '', hook: 'Hybrid BM25 plus dense retrieval with reranking.', body: '' },
  },
  smaller: [['STrack', 'AI subscription tracker'], ['CyberSight DW', 'Threat-intelligence data warehouse with Kafka, PostgreSQL and Neo4j'], ['1.2.Watch', 'Android'], ['Youvies', '']],
};

const no: typeof en = {
  meta: { title: 'Yasin Hessnawi · KI-ingeniør · Porten', description: 'Yasin Hessnawi, KI-ingeniør og masterstudent i kunstig intelligens i Norge. Et utforskbart 3D-laboratorium av KI-agenter og portene, sandkassene og kontrollene som holder dem ærlige.' },
  ui: {
    brand: 'Yasin Hessnawi · Norge', open: 'Åpen for muligheter fra sommeren 2027',
    nav: { projects: 'Prosjekter', me: 'Meg', notes: 'Notater', contact: 'Kontakt' },
    hint: 'Dra for å se deg rundt · scroll for å komme nærmere · klikk på alt som lyser', viewList: 'Vis som liste', view3d: 'Åpne 3D-laben',
    sound: 'Lyd', soundOn: 'Lyd på', soundOff: 'Lyd av', langLabel: 'Språk',
    loader: ['Initialiserer vekter…', 'Vekker agentene…', 'Kalibrerer porten…'], tooLong: 'Dette tar for lang tid',
    skip: 'Hopp over intro', title: 'Velkommen til Yasins lab', subtitle: 'Agenter i arbeid. Alt passerer porten.',
    close: 'Lukk', back: 'Tilbake', toast: 'Blokkert av hook. 755 forsøk, 0 utbrudd.', yours: 'dine forsøk',
    filters: { all: 'Alle', safe: 'Trygge agenter', ventures: 'Satsinger', research: 'Forskning og lærende systemer' },
    sort: { label: 'Sorter', featured: 'Utvalgt', newest: 'Nyeste', az: 'A–Å' },
    links: { repo: 'Repo', website: 'Nettside', pypi: 'PyPI' }, featured: 'Utvalgt', smaller: 'Mindre bygg',
    allProjects: 'Alle prosjekter', shelf: 'Hylle', openProject: 'Åpne prosjekt', count: (n: number) => `${n} prosjekter`,
    checks: ['Enheter', 'Størrelsesordener', 'Likevekt', 'Effektbalanse', 'Bevaring', 'Termisk budsjett', 'Endringsforplantning'],
    check: 'Kontroll',
    status: ['755 omgåelsesforsøk · 0 beskyttede skrivinger', '2. av 24 · kinasjakk-turnering', '91 %+ PII-deteksjon', 'Eureka-prisen 2025'],
    sheet: [['Hei, jeg er ', 'Yasin'], ['Navn: ', 'Yasin Hessnawi'], ['Funnet: ', '91 %+'], ['Lagret: ', '0 byte']],
    footer: 'Designet og bygget i Norge', scan: { title: 'PII-SKANN · LIVE', name: 'NAVN', number: 'NUMMER', detect: 'treffsikkerhet', stored: 'byte lagret', e2e: 'Ende-til-ende-kryptert · Azure Norway East' }, terminal: { status: 'KANAL ÅPEN', send: 'Send et signal' }, rework: { title: 'OMARBEID', sub: 'feilet en kontroll · tilbake til en agent' }, results: 'Resultater så langt · okt. 2026',
    ships: 'Dette er levert i dag', landscape: 'Best i liggende format · dra, trykk, utforsk', more: 'Les mer', swipe: 'Sveip', sections: ['Prosjekter', 'Om meg', 'Notater', 'Kontakt'],
    replay: { title: 'Reprise · mitt beste turneringsparti', sub: 'Runde 4, parti 2 i IKT460-turneringen (22. mai 2026). Seks lag, 283 trekk, dekodet trekk for trekk fra turneringsserverens logg. Laget mitt, group 99, spilte gult og fikk alle 10 brikkene i mål.', play: 'Spill av', pause: 'Pause', restart: 'Start på nytt', move: 'Trekk', speed: 'Fart', mine: 'mitt lag', score: 'Poeng', pins: 'I mål', winner: 'Vinner', live: 'REPRISE · R4G2', home: 'i mål', source: 'Kilde: serverlogg games_round_4' }, noWebgl: 'Viser listeversjonen av laben.',
  },
  stations: {
    gate: 'Porten · physgate', dome: 'Sandkassekuppel · physgate', agent: 'Agent · dra meg mot veggen', redaction: 'Sladdeskanneren · Declassifai', persona: 'Personascenen · Open Personas',
    game: 'Spillbordet · RL for kinasjakk', hex: 'Hex-panelet · Graph Tsetlin Machine', shelf_safe: 'Hylle · Trygge agenter',
    shelf_ventures: 'Hylle · Satsinger', shelf_research: 'Hylle · Forskning og læring', whiteboard: 'Tavla · Om meg',
    logbook: 'Loggkartet · Notater', mailbox: 'Signalterminalen · Kontakt', status: 'Statusskjerm', card: 'Passerte porten',
  },
  hero: 'Jeg bygger intelligente ting, og portene som holder dem ærlige.',
  bio: 'Programvareutvikler og masterstudent i KI ved Universitetet i Agder, ferdig i juni 2027. Jeg bygger KI-agenter og kontrollene rundt dem, var med på å grunnlegge Safe Media AI, der jeg leder Declassifai, og akkurat nå bygger jeg LLM-agentfunksjoner hos Green Norway.',
  about: {
    title: 'Om meg', now: 'Nå', before: 'Tidligere', education: 'Utdanning', languagesT: 'Språk', toolkitT: 'Verktøykasse', resume: 'Last ned CV',
    nowItems: [
      { role: 'KI-utvikler (internship)', org: 'Green Norway, Kristiansand', when: '08/2026–nå', text: 'Utvider Lumi, LLM-agenten i energiplattformen GreenSight, slik at den henter og behandler brukerdata via verktøy uten at modellen noen gang ser verdiene. Bygger KI-automatisering av utviklingsflyten i GitHub Actions: kodegjennomgang, retting av blokkerende feil, løsing av merge-konflikter og auto-merge. Migrerer integrasjoner til Azure Functions med over 500 automatiserte tester.' },
      { role: 'Medgründer og daglig leder', org: 'Safe Media AI AS (Declassifai)', when: '01/2025–nå', text: '' },
    ],
    beforeItems: [{ role: 'Læringsassistent og studentassistent', org: 'NTNU Gjøvik', when: '2024', text: 'Med LAOS-sertifikat for læringsassistenter.' }],
    eduItems: [
      { role: 'Sivilingeniør (M.Sc.), kunstig intelligens', org: 'Universitetet i Agder', when: '2025–2027', text: '' },
      { role: 'Bachelor i ingeniørfag, data – programmering og cybersikkerhet', org: 'NTNU', when: '2022–2025', text: 'Bacheloroppgave med karakter A og Eureka-prisen.' },
    ],
    stats: [['M.Sc. KI', '@ UiA'], ['4+', 'år med bygging'], ['21', 'universitetsemner'], ['12+', 'prosjekter levert'], ['1', 'selskap grunnlagt']],
    languages: ['Arabisk (morsmål)', 'Norsk (C1)', 'Engelsk (C1)'],
    toolkit: toolkit('no'), sdd: 'Spesifikasjonsdrevet utvikling med Claude Code.',
  },
  notesT: { title: 'Notater fra studiene', sub: 'Korte oppsummeringer av det jeg lærte i 21 universitetsemner, fra første programmeringskurs til Tsetlin-maskiner.', masters: 'Master', bachelor: 'Bachelor', all: 'Alle', english: 'Innleggene er på engelsk.', read: 'Les' },
  contact: { title: 'La oss bygge noe.', body: 'Spørsmål, samarbeid, ph.d.- eller jobbmuligheter: skriv til meg, så svarer jeg når jeg kan.', email: 'E-post', copy: 'Kopier', copied: 'Kopiert', name: 'Navn', namePh: 'Navnet ditt', emailPh: 'deg@domene.no', message: 'Melding', messagePh: 'Si hei…', send: 'Send melding', sent: 'E-postappen din skal åpne seg med meldingen klar. Takk, jeg svarer så snart jeg kan.', sentApi: 'Meldingen er sendt. Takk, jeg svarer så snart jeg kan.', vName: 'Skriv inn navnet ditt', vEmail: 'Skriv inn en gyldig e-postadresse', vMsg: 'Skriv en melding', elsewhere: 'Andre steder' },
  projects: {
    physgate: { title: 'physgate', meta: 'UiA-fordypningsprosjekt · SFI CELECT arbeidspakke 4', hook: 'En agent-harness for samdesign av maskinvare og programvare.', body: 'En deterministisk orkestrator sender ut domeneagenter med parede kontrollører. Hovedbidraget er en fysikkport med sju deterministiske kontroller som stopper fysisk ugyldige design. Reglene håndheves av hooks og en OS-sandkasse, ikke av prompter: i 755 forsøk på å omgå dem skrev ingen til en beskyttet sti. De lærte eskaleringsbackendene ble testet i forhåndsregistrerte eksperimenter og forkastet.', results: ['Fysikkporten på et forseglet testsett: fanget 20 av 40 innplantede feil og avviste ingen av 40 korrekte design.', 'KI-kontrollørene etter kalibrering: godtar 29 av 40 korrekte design, opp fra 0 i den første testen.', 'Rapportert som feilet: én generell kontrollør slo de parede spesialistene (34 av 40 feil fanget, 38 av 40 korrekte design godtatt, mot 29 og 29).', 'Krasjgjenoppretting: 10 av 10 rene omstarter i hver av 3 betingelser.'] },
    openpersona: { title: 'Open Personas', meta: 'Åpen kjerne · MIT-motor', hook: 'En agentisk KI-plattform med åpen kildekode.', highlights: ['Fire typede, versjonerte minnelagre per persona: identitet, selvfakta, verdensbilde og episodisk. Ingenting overskrives, og hver skriving logges.', 'Én kunnskapsgraf per bruker, delt av alle personaene, tegnet som et minnekart du kan rette i eller glemme fra.', 'Tidsplaner, initiativ og hendelsesutløsere, hver bak godkjenninger og kostnadstak.', 'Sanntidsstemme over LiveKit som deler ett minne med chatten.', 'Koblinger til Telegram, Discord, Slack og e-post, og 60 håndskrevne startpersonaer.'], body: 'KI-assistenter med typet, versjonert minne, en brukerspesifikk kunnskapsgraf, autonomi bak samtykkeporter, sanntidsstemme, MCP-verktøybruk på tvers av 300+ servere, ti modelleverandører og en sikkerhetsport for hver tur.' },
    glive: { title: 'GLive', meta: '', hook: 'Fra GitHub til live.', body: 'Klon og kjør et hvilket som helst GitHub-prosjekt med én kommando: KI-drevet oppsett, avhengighetshåndtering, sikkerhetsskanning og et PWA-dashbord.' },
    declassifai: { title: 'Declassifai', meta: '', hook: 'En KI-plattform som finner og sladder personopplysninger i dokumenter og bilder, med over 91 % treffsikkerhet.', body: 'Den bruker ende-til-ende-kryptert behandling uten datalagring, ble pilotert med Mattilsynet og kjører på Azure Norway East. Priser og finansiering: NTNU Eureka-prisen 2025 og et kommersialiseringstilskudd fra Innovasjon Norge 2026.' },
    safemedia: { title: 'Safe Media AI AS', meta: '', hook: 'Var med på å grunnlegge selskapet bak Declassifai og flere verktøy for sikker behandling.', body: 'Jeg har vært medgründer og daglig leder siden januar 2025.' },
    rlcc: { title: 'RL-agent for kinasjakk', meta: 'IKT460', hook: '2. plass av 24 lag i emnets turnering, med høyest gjennomsnittlig antall brikker i mål (9,5 av 10).', body: 'Et residualnettverk forhåndstrent på heuristisk og søkemerkede posisjoner, forbedret gjennom selvspill, som spiller via Gumbel Monte Carlo-tresøk.' },
    tsetlin: { title: 'Graph Tsetlin Machine · Hex', meta: '', hook: 'Tolkbar, klausulbasert vinnerprediksjon for Hex, CUDA-akselerert.', body: '' },
    personarag: { title: 'Persona-RAG', meta: 'Uavhengig forskning', hook: 'Uttrekk av persona-vektorer replikert på Gemma-2-9B, og deretter vist at det ikke overføres til deteksjon av drift i samtaler med flere turer.', body: 'Typet minnehenting ble evaluert på en testsamling med 360 transkripsjoner.' },
    mmimdb: { title: 'Multimodal sjangerklassifisering', meta: 'MM-IMDb', hook: 'Fusjon av tekst og plakat som når 59,8 % F1-makro.', body: '' },
    deepernn: { title: 'Dypere nevrale nettverk', meta: '', hook: 'Transformere, CNN-er, mixture-of-experts og små agentiske forskningssystemer.', body: '' },
    uiarag: { title: 'UiA RAG-chatbot', meta: '', hook: 'Hybrid BM25 pluss tett gjenfinning med reranking.', body: '' },
  },
  smaller: [['STrack', 'KI-abonnementssporer'], ['CyberSight DW', 'Datavarehus for trusseletterretning med Kafka, PostgreSQL og Neo4j'], ['1.2.Watch', 'Android'], ['Youvies', '']],
};

export type ProjectId = keyof typeof P;
export type Copy = typeof en & { notes: Note[] };

export const CONTENT = {
  en: { ...en, notes: notes("en") } as Copy,
  no: { ...no, notes: notes("no") } as Copy,
  P: P as Record<ProjectId, ProjectFacts>,
  order: Object.keys(P) as ProjectId[],
  email,
  linkedin,
  github,
  cv: (l: Lang) => `/api/resume?lang=${l}`,
  // not in the design export: the site's own portrait, cropped from /me.JPG
  portrait: { src: "/me-portrait.jpg", alt: "Yasin Hessnawi" },
};
export type Content = typeof CONTENT;
