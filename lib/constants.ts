/* ============================================
   M8LA Portfolio — constants.ts
   Dati statici: skills, esperienze, progetti, contatti
   ============================================ */

// --- Tipi ---
export interface Skill {
  name: string;
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface Project {
  title: string;
  description: string;
  stack: string;
  year: number;
  liveUrl?: string;
  githubUrl?: string;
  tags: string[];
  featured: boolean;
}

export interface ContactLink {
  label: string;
  value: string;
  url: string;
  icon: "email" | "linkedin" | "github" | "instagram";
}

// --- Bio ---
export const BIO = `Sono Mario Mottola, studente di 17 anni appassionato di sviluppo web e tecnologia.
Mi piace progettare e realizzare soluzioni software funzionali, curate nei dettagli e orientate all'efficienza.
Sono una persona curiosa, determinata e interessata anche al mondo dell'intelligenza artificiale.
Programmo spesso con la musica in sottofondo, che fa parte del mio processo creativo.`;

// --- Skills ---
export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Frontend",
    skills: [
      { name: "Next.js" },
      { name: "React" },
      { name: "TypeScript" },
      { name: "Tailwind CSS" },
      { name: "Framer Motion" },
      { name: "HTML / CSS / JS" },
    ],
  },
  {
    title: "Backend / DB",
    skills: [
      { name: "Node.js" },
      { name: "Prisma" },
      { name: "SQL" },
      { name: "REST API" },
    ],
  },
  {
    title: "Tools & Other",
    skills: [
      { name: "Git / GitHub" },
      { name: "Arduino" },
      { name: "Python (base)" },
      { name: "NFC / IoT" },
      { name: "Progettazione 3D" },
    ],
  },
];

// --- Experience ---
export const EXPERIENCES: Experience[] = [
  {
    role: "Stagista",
    company: "Trim Informatica",
    period: "Estate 2025",
    description:
        "Prima esperienza lavorativa in ambito IT, contatto con ambienti professionali e processi aziendali.",
  },
  {
    role: "Web Developer / IT",
    company: "G&B & LCS",
    period: "Inverno 2025",
    description:
        "Sviluppo di software e strumenti interni per ottimizzare i processi aziendali. Collaborazione con LCS per la piattaforma estudentsleague.com.",
  },
  {
    role: "Stagista (retribuito)",
    company: "G&B",
    period: "Estate 2026",
    description:
      "Stage retribuito in contesto professionale. Continuazione del lavoro su tool interni e sviluppo web.",
  },
  {
    role: "Studente",
    company: "ITIS CASTELLI",
    period: "2022 - Presente",
    description: "Studente di informatica presso ITIS Castelli, approfondendo sviluppo software, reti e sistemi.",
  }
];

// --- Projects ---
export const PROJECTS: Project[] = [
  {
    title: "Lega Calcio Studenti (LCS)",
    description:
      "Piattaforma per la gestione di un torneo di calcio tra licei italiani. Valorizza lo sport nel contesto scolastico, con opportunità formative per gli studenti.",
    stack: "Next.js, TypeScript",
    year: 2025,
    liveUrl: "https://estudentsleague.com",
    githubUrl: "https://github.com/molecup/frontend-lcs",
    tags: ["Freelance", "Web", "Sport"],
    featured: true,
  },
  {
    title: "SchoolFanta",
    description:
      "App di fantacalcio dedicata agli studenti delle scuole superiori. In sviluppo attivo.",
    stack: "Next.js, TypeScript",
    year: 2026,
    liveUrl: "https://schoolfanta.app",
    githubUrl: "https://github.com/m8lamario/schoolfanta",
    tags: ["In sviluppo", "Web App", "Sport"],
    featured: true,
  },
  {
    title: "AirSense",
    description:
      "Dashboard IoT per monitoraggio ambientale con Arduino. I dati vengono inviati via socket Python e visualizzati in tempo reale su web.",
    stack: "Arduino, Python, Web Dashboard",
    year: 2026,
    liveUrl: "https://air-sense-zeta.vercel.app",
    githubUrl: "https://github.com/m8lamario/AirSense",
    tags: ["IoT", "Arduino", "Scolastico"],
    featured: true,
  },
  {
    title: "S400-Call",
    description:
      "Software per linee di assemblaggio industriale. Permette agli operatori di richiedere materiale e aggiorna automaticamente le scorte e il magazzino.",
    stack: "HTML, CSS, JavaScript, SQL",
    year: 2026,
    tags: ["Industriale", "Desktop", "Interno"],
    featured: false,
  },
  {
    title: "Sentinella Utensili",
    description:
      "Web app per monitoraggio dell'usura di utensili su macchine CNC. Acquisisce dati via rete, calcola l'usura in tempo reale e segnala le sostituzioni.",
    stack: "Next.js",
    year: 2026,
    tags: ["Industriale", "CNC", "Real-time"],
    featured: false,
  },
  {
    title: "Tracciamento Cassette NFC",
    description:
      "Sistema per tracciare cassette con pezzi tramite tag NFC. Include progettazione e stampa 3D di contenitori in policarbonato per ambienti industriali (fino a ~90°C).",
    stack: "Next.js, NFC, progettazione 3D",
    year: 2026,
    githubUrl: "https://github.com/m8lamario/TracciamentoCassette",
    tags: ["NFC", "IoT", "3D", "Industriale"],
    featured: false,
  },
];

// --- Contact ---
export const CONTACT_LINKS: ContactLink[] = [
  {
    label: "Email",
    value: "mario.m8la@gmail.com",
    url: "mailto:mario.m8la@gmail.com",
    icon: "email",
  },
  {
    label: "LinkedIn",
    value: "Mario Mottola",
    url: "https://www.linkedin.com/in/mario-mottola-250218306/",
    icon: "linkedin",
  },
  {
    label: "GitHub",
    value: "m8lamario",
    url: "https://github.com/m8lamario/",
    icon: "github",
  },
  {
    label: "Instagram",
    value: "@mariom8la",
    url: "https://instagram.com/mariom8la",
    icon: "instagram",
  },
];

// --- Hero ---
export const HERO_ROLES = [
  "Full-stack Developer",
  "Builder di soluzioni reali",
  "Next.js & TypeScript",
  "Appassionato di tecnologia",
  "Studente ITIS Castelli",
];
