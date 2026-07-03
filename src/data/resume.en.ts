import type { ResumeData } from "./resume-types";

export const RESUME_EN: ResumeData = {
  name: "Yasin Hessnawi",
  initials: "YH",
  role: "AI · Software Engineer · Founder",
  location: "Norway",
  avatar: "/me.JPG",
  intro:
    "Software engineer and AI Master's student at the University of Agder. I like building things that are useful and hold up in the real world, from fullstack apps to ML research, and I'm co-founding Safe Media AI, where I lead Declassifai.",
  about:
    "I'm passionate about programming and building digital solutions that hold up in the real world. My work spans fullstack development, cloud & DevOps, infrastructure as code, cybersecurity, and AI/ML research. I co-founded Safe Media AI AS and lead Declassifai, an app that detects and redacts sensitive data in PDFs. Having worked as a teaching assistant, I care about clear communication and goal-oriented teamwork as much as the code itself.",
  aboutCards: [
    { icon: "sparkles", label: "Currently", value: "Master's in AI + building Safe Media AI" },
    { icon: "shield", label: "Focus", value: "Interpretable ML · document security" },
    { icon: "code", label: "Also", value: "Fullstack · Cloud · DevOps · IaC" },
  ],
  stats: [
    { value: "4", suffix: "+", label: "Years building" },
    { value: "20", suffix: "+", label: "University courses" },
    { value: "12", suffix: "+", label: "Projects shipped" },
    { value: "1", label: "Company co-founded" },
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
      title: "Co-Founder",
      period: "Aug 2025 – Now",
      description:
        "• Co-founded an AI company specializing in document-security solutions • Leading development & deployment of Declassifai • Own strategic direction and product development",
    },
    {
      company: "NTNU",
      logo: "/ntnu.svg",
      title: "University Teaching Assistant",
      period: "Aug – Dec 2024",
      description:
        "• Prepared and ran student labs • Helped students grasp lecture content • Corrected and graded academic work • Prepared students for exams",
    },
    {
      company: "NTNU",
      logo: "/ntnu.svg",
      title: "Student Assistant",
      period: "Jan – Jun 2024",
      description:
        "• Aided students in understanding the material • Supported class projects • Supplied exam practice • Assessed knowledge levels and closed gaps",
    },
    {
      company: "NTNU · LAOS",
      logo: "/ntnu.svg",
      title: "Teaching Assistant Certificate",
      period: "2024",
      description:
        "• Trained to create safe, communicative learning environments • Conflict-resolution principles • Assessing understanding and guiding effectively",
    },
  ],
  education: [
    {
      school: "University of Agder",
      degree: "M.Sc. Artificial Intelligence",
      period: "2025 – 2027",
      logo: "https://www.uia.no/om-uia/designmanual/logoer/uia-horisontal-uten-navn-positiv.png",
    },
    {
      school: "NTNU",
      degree: "B.Sc. Computer Science · Grade A thesis · Eureka Prize",
      period: "2022 – 2025",
      logo: "/ntnu.svg",
    },
    {
      school: "Sandnessjøen VGS",
      degree: "Vitnemål, QF level 4",
      period: "2019 – 2022",
      logo: "/vgs.png",
    },
  ],
  featured: [
    {
      title: "Declassifai",
      dates: "2025 – Now",
      image: "/dashboard_en.png",
      description:
        "A web app that detects and redacts sensitive information in PDFs: AI-powered automatic detection, customizable redaction modes, and manual highlighting across document formats.",
      tags: ["AI/ML", "React", "Python", "PDF"],
      links: [{ type: "Website", href: "https://declassifai.com", icon: "globe" }],
    },
    {
      title: "Safe Media AI AS",
      dates: "2025 – Now",
      image: "/og-image.png",
      description:
        "Co-founded a company building AI-powered document-security products, the studio behind Declassifai and further secure-processing tools.",
      tags: ["Founder", "AI/ML", "Product"],
      links: [{ type: "Website", href: "https://safemediai.com", icon: "globe" }],
    },
  ],
  research: [
    {
      title: "Graph Tsetlin Machine · Hex",
      dates: "2025 – Now",
      description:
        "Modular, high-performance Graph Tsetlin Machines for Hex winner prediction with interpretable, clause-based logical learning. 99–100% accuracy on 10×10 end-games; CUDA-accelerated.",
      tags: ["Python", "CUDA", "GNN", "Tsetlin Machines"],
      links: [{ type: "Repo", href: "https://github.com/yasinhessnawi1/tsetlin-hex", icon: "github" }],
    },
    {
      title: "Multimodal Genre Classification",
      dates: "2025 – Now",
      description:
        "Multi-label movie-genre prediction from plot text + posters (MM-IMDb). LSTM+Attention, DistilBERT, ResNet, and fusion strategies, reaching 59.8% F1-macro with Attention Fusion.",
      tags: ["PyTorch", "NLP", "Computer Vision", "BERT"],
      links: [{ type: "Repo", href: "https://github.com/yasinhessnawi1/ml-project", icon: "github" }],
    },
    {
      title: "Persona-RAG",
      dates: "2026",
      description:
        "A research project on persona-conditioned retrieval: does grounding RAG in a structured persona representation give more identity-consistent answers than prompt-only or fine-tuning? Runs Gemma-2-9B and Llama-3.1-8B locally in 4-bit, with a Hydra-configured, reproducibility-gated harness.",
      tags: ["Python", "RAG", "LLMs", "Hugging Face", "Hydra"],
      links: [{ type: "Repo", href: "https://github.com/yasinhessnawi1/Persona-RAG", icon: "github" }],
    },
    {
      title: "Deeper Neural Networks",
      dates: "2026",
      description:
        "Implementations from advanced deep learning: self-attention and transformer chatbots, shallow-vs-deep and loss-function studies, CNNs, embeddings with mixture-of-experts, and small agentic research systems, each with reproducible experiments and reports.",
      tags: ["PyTorch", "Transformers", "CNNs", "Embeddings", "MoE"],
      links: [{ type: "Repo", href: "https://github.com/yasinhessnawi1/Deeper-Neural-Networks", icon: "github" }],
    },
    {
      title: "RL on Chinese Checkers",
      dates: "2026",
      description:
        "Reinforcement-learning agents for Chinese Checkers, built on the course's client/server game framework. Tackles a large branching factor and long horizons through careful reward and state-representation design.",
      tags: ["Python", "Reinforcement Learning", "Game AI"],
      links: [{ type: "Repo", href: "https://github.com/yasinhessnawi1/reinforcement-learning-on-chinese-checkers", icon: "github" }],
    },
    {
      title: "UiA RAG Chatbot",
      dates: "2026",
      description:
        "A retrieval-augmented chatbot over the UiA-IKT course corpus. Hybrid BM25 + dense retrieval with optional cross-encoder reranking, evaluated against a hand-written QA set, across an ingest → index → query → evaluate pipeline.",
      tags: ["Python", "RAG", "BM25", "Dense Retrieval", "Reranking"],
      links: [{ type: "Repo", href: "https://github.com/yasinhessnawi1/uia-rag-chatbot", icon: "github" }],
    },
    {
      title: "CyberSight DW",
      dates: "2026",
      description:
        "A multi-backend data warehouse for cybersecurity threat intelligence. Streams the CICIDS-2017 dataset (~2.8M records) through Kafka into PostgreSQL (star schema), MongoDB (documents), and Neo4j (attack graph) at once, with a Streamlit analytics dashboard and a FastAPI ops service.",
      tags: ["Python", "Kafka", "PostgreSQL", "Neo4j", "Streamlit"],
      links: [{ type: "Repo", href: "https://github.com/yasinhessnawi1/CyberSight_DW", icon: "github" }],
    },
  ],
  personal: [
    {
      title: "GLive · GitHub to Live",
      dates: "2025 – Now",
      image: "/glive-og.png",
      description:
        "Clone and run any GitHub project with one command: AI-powered setup, dependency management, security scanning, and a PWA dashboard.",
      tags: ["Go", "Next.js", "AI/ML", "Docker"],
      links: [{ type: "Repo", href: "https://github.com/yasinhessnawi1/glive", icon: "github" }],
    },
    {
      title: "STrack · Subscription Tracker",
      dates: "2025 – Now",
      image: "/strack-og.png",
      description:
        "A SaaS that tames recurring expenses. Paste a link or type a service, and AI parses pricing and billing from 100+ services. Multi-currency, analytics, renewal alerts.",
      tags: ["Next.js", "TypeScript", "Gemini", "Firebase"],
      links: [{ type: "Repo", href: "https://github.com/yasinhessnawi1/strack", icon: "github" }],
    },
    {
      title: "1.2.Watch",
      dates: "2024",
      image: "/1.2.watch.png",
      description:
        "“When to Watch” lets you track movies, series and anime in one place. Know when the next episode airs and where to stream it, with smart recommendations.",
      tags: ["Kotlin", "Android", "XML"],
      links: [{ type: "Repo", href: "https://github.com/yasinhessnawi1/1-2-watch", icon: "github" }],
    },
  ],
  skills: {
    Languages: ["Python", "Java", "Go/Golang", "JavaScript", "TypeScript", "Kotlin", "C", "C++", "SQL"],
    "AI / ML": ["PyTorch", "Deep Learning", "Neural Networks", "NLP", "Computer Vision", "Tsetlin Machines", "Scikit-learn"],
    "Web & Mobile": ["React", "Next.js", "Node.js", "HTML5", "CSS3", "Android", "JavaFX"],
    "Cloud & DevOps": ["Azure", "AWS", "Docker", "Terraform", "Nginx", "Linux", "Firebase", "Git"],
    Data: ["PostgreSQL", "MongoDB", "MariaDB", "NoSQL"],
  },
};
