import type { ResumeData } from "./resume-types";

export const RESUME_NO: ResumeData = {
  name: "Yasin Hessnawi",
  initials: "YH",
  role: "KI · Programvareutvikler · Gründer",
  location: "Gjøvik, Norge",
  avatar: "/me.JPG",
  intro:
    "Uteksaminert i programvareutvikling fra NTNU i 2025 — karakter A på bacheloroppgaven og Eureka-prisen — tar nå en master i kunstig intelligens og er medgründer av Safe Media AI.",
  about:
    "Jeg brenner for programmering og for å bygge digitale løsninger som tåler møtet med virkeligheten. Arbeidet mitt spenner over fullstack-utvikling, sky og DevOps, infrastruktur som kode, cybersikkerhet og KI/ML-forskning. Jeg var med å grunnlegge Safe Media AI AS og leder Declassifai — en app som oppdager og sladder sensitiv informasjon i PDF-er. Som tidligere læringsassistent bryr jeg meg like mye om tydelig kommunikasjon og målrettet lagarbeid som om selve koden.",
  aboutCards: [
    { icon: "sparkles", label: "Akkurat nå", value: "Master i KI + bygger Safe Media AI" },
    { icon: "shield", label: "Fokus", value: "Tolkbar ML · dokumentsikkerhet" },
    { icon: "code", label: "Dessuten", value: "Fullstack · Sky · DevOps · IaC" },
  ],
  stats: [
    { value: "A", label: "Bacheloroppgave" },
    { value: "Eureka", label: "NTNU-pris" },
    { value: "12", suffix: "+", label: "Prosjekter levert" },
    { value: "1", label: "Selskap grunnlagt" },
  ],
  contact: {
    email: "yasinhessnawi1@gmail.com",
    tel: "+47 949 72 907",
    github: "https://github.com/yasinhessnawi1",
    linkedin: "https://www.linkedin.com/in/yasin-hessnawi-102a02326",
    site: "https://yasinhessnawi.online",
  },
  work: [
    {
      company: "Safe Media AI AS",
      logo: "https://safemediai.com/favicon.ico",
      title: "Medgründer",
      period: "aug. 2025 — nå",
      description:
        "• Var med å grunnlegge et KI-selskap spesialisert på dokumentsikkerhet • Leder utviklingen og lanseringen av Declassifai • Ansvarlig for strategisk retning og produktutvikling",
    },
    {
      company: "NTNU Gjøvik",
      logo: "/ntnu.svg",
      title: "Læringsassistent",
      period: "aug. — des. 2024",
      description:
        "• Forberedte og gjennomførte labøvinger for studenter • Hjalp studenter med å forstå forelesningsstoffet • Rettet og vurderte studentarbeid • Forberedte studenter til eksamen",
    },
    {
      company: "NTNU Gjøvik",
      logo: "/ntnu.svg",
      title: "Studentassistent",
      period: "jan. — jun. 2024",
      description:
        "• Hjalp studenter med å forstå pensum • Støttet studenter i prosjektarbeid • Ga øvingsoppgaver til eksamen • Vurderte kunnskapsnivå og tettet hull",
    },
    {
      company: "NTNU — LAOS",
      logo: "/ntnu.svg",
      title: "Kursbevis for læringsassistenter",
      period: "2024",
      description:
        "• Opplæring i å skape trygge, kommunikative læringsmiljøer • Prinsipper for konflikthåndtering • Å vurdere forståelse og veilede effektivt",
    },
  ],
  education: [
    {
      school: "Universitetet i Agder",
      degree: "Master i kunstig intelligens",
      period: "2025 — 2027",
      logo: "https://www.uia.no/om-uia/designmanual/logoer/uia-horisontal-uten-navn-positiv.png",
    },
    {
      school: "NTNU",
      degree: "Bachelor i datateknologi — A på bacheloroppgaven · Eureka-prisen",
      period: "2022 — 2025",
      logo: "/ntnu.svg",
    },
    {
      school: "Sandnessjøen VGS",
      degree: "Vitnemål, NKR nivå 4",
      period: "2019 — 2022",
      logo: "/vgs.png",
    },
  ],
  featured: [
    {
      title: "Declassifai",
      dates: "2025 — nå",
      image: "/dashboard_en.png",
      description:
        "En webapp som oppdager og sladder sensitiv informasjon i PDF-er — KI-drevet automatisk deteksjon, tilpassbare sladdemoduser og manuell merking på tvers av dokumentformater.",
      tags: ["AI/ML", "React", "Python", "PDF"],
      links: [{ type: "Nettside", href: "https://declassifai.com", icon: "globe" }],
    },
    {
      title: "Safe Media AI AS",
      dates: "2025 — nå",
      image: "/og-image.png",
      description:
        "Var med å grunnlegge et selskap som bygger KI-drevne produkter for dokumentsikkerhet — studioet bak Declassifai og flere verktøy for sikker dokumentbehandling.",
      tags: ["Gründer", "AI/ML", "Produkt"],
      links: [{ type: "Nettside", href: "https://safemediai.com", icon: "globe" }],
    },
  ],
  research: [
    {
      title: "Graph Tsetlin Machine — Hex",
      dates: "2025 — nå",
      description:
        "Modulære, høytytende Graph Tsetlin Machines som forutsier vinneren i Hex, med tolkbar, klausulbasert logisk læring. 99–100 % treffsikkerhet på 10×10-sluttspill; CUDA-akselerert.",
      tags: ["Python", "CUDA", "GNN", "Tsetlin Machines"],
      links: [{ type: "Repo", href: "https://github.com/yasinhessnawi1/tsetlin-hex", icon: "github" }],
    },
    {
      title: "Multimodal sjangerklassifisering",
      dates: "2025 — nå",
      description:
        "Multi-label sjangerprediksjon for film fra handlingssammendrag og plakater (MM-IMDb). LSTM+Attention, DistilBERT, ResNet og fusjonsstrategier — 59,8 % F1-macro med Attention Fusion.",
      tags: ["PyTorch", "NLP", "Computer Vision", "BERT"],
      links: [{ type: "Repo", href: "https://github.com/yasinhessnawi1/ml-project", icon: "github" }],
    },
  ],
  personal: [
    {
      title: "GLive — GitHub to Live",
      dates: "2025 — nå",
      image: "/glive-og.png",
      description:
        "Klon og kjør et hvilket som helst GitHub-prosjekt med én kommando — KI-drevet oppsett, avhengighetshåndtering, sikkerhetsskanning og et PWA-dashbord.",
      tags: ["Go", "Next.js", "AI/ML", "Docker"],
      links: [{ type: "Repo", href: "https://github.com/yasinhessnawi1/glive", icon: "github" }],
    },
    {
      title: "STrack — abonnementssporing",
      dates: "2025 — nå",
      image: "/strack-og.png",
      description:
        "En SaaS som temmer faste utgifter. Lim inn en lenke eller skriv navnet på en tjeneste — KI tolker priser og fakturering fra 100+ tjenester. Flervaluta, analyse og fornyelsesvarsler.",
      tags: ["Next.js", "TypeScript", "Gemini", "Firebase"],
      links: [{ type: "Repo", href: "https://github.com/yasinhessnawi1/strack", icon: "github" }],
    },
    {
      title: "1.2.Watch",
      dates: "2024",
      image: "/1.2.watch.png",
      description:
        "«When to Watch» — hold oversikt over filmer, serier og anime på ett sted. Se når neste episode sendes og hvor den kan strømmes, med smarte anbefalinger.",
      tags: ["Kotlin", "Android", "XML"],
      links: [{ type: "Repo", href: "https://github.com/yasinhessnawi1/1-2-watch", icon: "github" }],
    },
    {
      title: "ElectroMart",
      dates: "2024",
      // no image on purpose (spec §9): the 1.7MB electromart.png stays off the page;
      // the ProjectCard placeholder tile renders instead
      description:
        "Fullstack netthandel for elektronikk — React-frontend, Go/Gin REST-API og MariaDB. Kategorier, produktvisninger, handlekurv og kasse.",
      tags: ["Go", "React", "MariaDB", "Gin"],
      links: [
        { type: "Backend", href: "https://github.com/yasinhessnawi1/elektromart-server", icon: "github" },
        { type: "Frontend", href: "https://github.com/yasinhessnawi1/ElectroMart", icon: "github" },
      ],
    },
  ],
  skills: {
    Språk: ["Python", "Java", "Go/Golang", "JavaScript", "TypeScript", "Kotlin", "C", "C++", "SQL"],
    "KI / ML": ["PyTorch", "Deep Learning", "Neural Networks", "NLP", "Computer Vision", "Tsetlin Machines", "Scikit-learn"],
    "Web og mobil": ["React", "Next.js", "Node.js", "HTML5", "CSS3", "Android", "JavaFX"],
    "Sky og DevOps": ["Azure", "AWS", "Docker", "Terraform", "Nginx", "Linux", "Firebase", "Git"],
    Data: ["PostgreSQL", "MongoDB", "MariaDB", "NoSQL"],
  },
};
