import React, { useEffect, useRef, useState } from "react";

/*
  Cesar Diab • Cybersecurity & Digital Forensics Portfolio (v2.8)
  ----------------------------------------------------------------
  • Removed light/dark toggle button; site now follows **system theme** automatically
  • Added `useSystemTheme()` to live-update on OS theme changes
  • Testimonials: static block cards
  • Header: draggable horizontal nav with hidden scrollbar
  • Contact: full-width, FormSubmit to email
  • Project subpages via hash routing: #/project/<slug>

  Notes:
  - Tailwind config should include:  darkMode: 'class'
  - Host on GitHub Pages by building Vite and pushing /dist to gh-pages
*/

// ------------------- CONFIG -------------------
const CONFIG = {
  name: "Cesar K. Diab",
  headline: "Your next Cyber Analyst",
  bio:
    "Motivated CS student focused on cybersecurity and digital forensics with hands-on DFIR, crypto, and network analysis.",
  location: "San Antonio, Texas",
  email: "cesarkdiab@gmail.com",
  phone: "", // optional; set e.g. "210-xxx-xxxx" or leave empty to hide
  domain: "cesarkdiab.com",
  socials: {
    linkedin: "https://www.linkedin.com/in/cesar-diab",
    github: "https://github.com/thebestsalad",
    htbId: "HTB-EB1BCAD53B",
  },
  resumePdf: "#", // TODO: replace with public resume URL
  avatar:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=640&q=60&auto=format&fit=crop",
  color: {
    primary: "from-blue-500 to-slate-600",
    ring: "focus-visible:ring-blue-500",
    chip: "bg-blue-500/10 text-blue-400",
  },
  form: {
    action: "https://formsubmit.co/cesarkdiab@gmail.com", // FormSubmit posts directly to email
  },
};

const htbLink = `https://app.hackthebox.com/profile/search?query=${encodeURIComponent(
  CONFIG.socials.htbId || ""
)}`;

// ------------------- DATA -------------------
const LANGUAGES = [
  { name: "English", level: "Native" },
  { name: "Arabic", level: "Native" },
  { name: "French", level: "Intermediate" },
];

const SKILLS = {
  Security: [
    "Network Security",
    "Web App Security",
    "Threat Modeling",
    "SOC/Triage",
    "Incident Response",
    "OSINT",
  ],
  "Digital Forensics": [
    "Autopsy/Sleuth Kit",
    "Volatility",
    "FTK Imager",
    "Magnet Axiom (familiar)",
    "Wireshark",
    "Chain of Custody",
  ],
  "Crypto/Cracking": ["John the Ripper", "hashcat", "xortool", "wordlists/rules"],
  "Linux/Systems": ["Debian/Kali", "Bash", "tcpdump", "iptables", "systemd"],
  Programming: ["Python", "C", "Java", "JavaScript/TypeScript", "SQL"],
  "Tools & Platforms": ["Git", "Docker", "Burp Suite", "Metasploit", "ELK/Splunk (basic)", "Excel"],
  Certifications: ["Microsoft Office Specialist", "Security+ (in progress)", "(add more)"],
};

const EXPERIENCE = [
  {
    org: "UTSA Department of Computer Science",
    role: "Student Grader",
    dates: "Sep 2025 – Present",
    bullets: [
      "Evaluate student assignments for accuracy and rubric alignment",
      "Collaborate with faculty to clarify grading criteria and expectations",
      "Maintain precise records to ensure timely score submissions",
    ],
  },
  {
    org: "University of Texas at San Antonio",
    role: "Data Research Analyst",
    dates: "Apr 2025 – Jul 2025",
    bullets: [
      "Analyzed faculty output, citations, and funding data for strategy",
      "Built scripts and visuals for H-index and funding trend analysis",
      "Tracked DoD/DOE proposals using Excel and Python",
    ],
  },
  {
    org: "UTSA Academic Support Programs",
    role: "Peer Educator (Floor & Athletic Tutor)",
    dates: "Aug 2024 – Jul 2025",
    bullets: [
      "Tutored 20+ students in Calculus & Programming with strong feedback",
      "Explained complex concepts and study tactics for higher performance",
      "Earned repeat requests from student-athletes for clarity beyond class",
    ],
  },
];

const EDUCATION = {
  school: "The University of Texas at San Antonio",
  degree: "B.S. in Computer Science (Cybersecurity concentration; Minor in Digital Forensics)",
  grad: "May 2027",
  gpa: "3.97",
  highlights: [
    "President's List of Academic Excellence",
    "Courses: Programming I/II, System Programming, Application Programming, Data Structures, Cybercrime Investigation Principles, Discrete Math, Calculus I/II, Computer Organization, Math Foundations for CS",
  ],
};

const AWARDS = [
  { title: "Ewing Halsell Endowed Foundation Scholarship", url: "#" },
  { title: "Dr. Craig Jordan Excellence in Student Success Endowed Award", url: "#" },
  { title: "Distinguished Science Judge, Harmony School of Science", url: "#" },
  { title: "DELF A2 (French Ministry of Education)", url: "#" },
];

const PROJECTS = [
  {
    slug: "dfir-windows-memory-triage",
    title: "DFIR Case Study: Windows Memory Triage",
    summary:
      "Acquired live RAM, parsed memory artifacts, and extracted credentials/session traces to reconstruct user activity.",
    impact: "Demonstrated volatile evidence handling and rapid triage playbook for small IR teams.",
    tech: ["Belkasoft Live RAM Capture", "Volatility", "Hex editor"],
    links: { repo: "#", doc: "#", demo: "#" },
    media: [
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=1200&q=60&auto=format&fit=crop",
    ],
    badges: ["DFIR", "Memory", "Forensics"],
    details: [
      "Captured volatile memory and validated integrity (SHA-256)",
      "Enumerated processes, network sockets, and credential material",
      "Outlined incident timeline and recommended containment steps",
    ],
  },
  {
    slug: "crypto-xor-csv-decryptor",
    title: "Crypto Cracker: XOR CSV Decryptor",
    summary:
      "Wrote Python tooling to guess key sizes via Hamming distance and recover repeating-key XOR on CSV datasets.",
    impact: "Recovered plaintext for triage; documented safe handling of sensitive data.",
    tech: ["Python", "NumPy", "matplotlib (analysis)", "xortool"],
    links: { repo: "#", doc: "#", demo: "#" },
    media: [
      "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=1200&q=60&auto=format&fit=crop",
    ],
    badges: ["Crypto", "XOR", "Python"],
    details: [
      "Implemented key-length scoring with normalized Hamming distance",
      "Recovered keystream and decrypted multiple samples",
      "Benchmarked against known tools; added rule-based post-processing",
    ],
  },
  {
    slug: "email-forensics-enron-recon",
    title: "Email Forensics: Enron Thread Reconstruction",
    summary:
      "Parsed PST archives to CSV, indexed metadata, and surfaced anomalous threads and entities.",
    impact: "Illustrated techniques used in corporate fraud investigations.",
    tech: ["Aid4Mail", "pandas", "entity extraction"],
    links: { repo: "#", doc: "#", demo: "#" },
    media: [
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=1200&q=60&auto=format&fit=crop",
    ],
    badges: ["DFIR", "Email", "Metadata"],
    details: [
      "Converted PST to CSV with consistent field normalization",
      "Built sender-domain and time-window anomaly views",
      "Wrote step-by-step evidentiary handling notes",
    ],
  },
];

const LABS = [
  {
    title: "HTB: Blue (Windows EternalBlue)",
    platform: "Hack The Box",
    summary:
      "Enumerated SMB, identified MS17-010, reproduced exploit in a controlled lab, and documented post-exploitation artifacts.",
    tags: ["HTB", "Windows", "Exploit"],
    link: "#",
  },
  {
    title: "THM: Memory Market (Volatility)",
    platform: "TryHackMe",
    summary: "Used Volatility to inspect running processes, dump creds, and answer DFIR questions.",
    tags: ["THM", "Volatility", "DFIR"],
    link: "#",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Cesar is meticulous and clear in his technical writing—students consistently benefited from his explanations.",
    author: "Faculty Member, UTSA",
  },
  {
    quote:
      "His data tools saved us hours each week and made research trends easy to present to leadership.",
    author: "Associate Dean's Office, UTSA",
  },
];

// ------------------- UTILITIES -------------------
function useHashRoute() {
  // Keep current window.location.hash in state and update on hashchange.
  const [hash, setHash] = useState(typeof window !== "undefined" ? window.location.hash : "");
  useEffect(() => {
    const onHash = () => setHash(window.location.hash || "");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return hash || "";
}

// Follow OS theme and live update on changes
function useSystemTheme() {
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      document.documentElement.classList.toggle("dark", mq.matches);
    };
    apply();
    if (mq.addEventListener) mq.addEventListener("change", apply);
    else if (mq.addListener) mq.addListener(apply);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", apply);
      else if (mq.removeListener) mq.removeListener(apply);
    };
  }, []);
}

// Allow horizontal drag-to-scroll for overflow containers
function useDragScroll() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    const onDown = (e) => {
      isDown = true;
      startX = (e.touches ? e.touches[0].pageX : e.pageX) - el.offsetLeft;
      scrollLeft = el.scrollLeft;
      el.classList.add("cursor-grabbing");
    };
    const onMove = (e) => {
      if (!isDown) return;
      const x = (e.touches ? e.touches[0].pageX : e.pageX) - el.offsetLeft;
      const walk = (x - startX) * 1; // sensitivity
      el.scrollLeft = scrollLeft - walk;
    };
    const onUp = () => {
      isDown = false;
      el.classList.remove("cursor-grabbing");
    };
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        el.scrollLeft += e.deltaY; // vertical wheel -> horizontal scroll
        e.preventDefault();
      }
    };
    el.addEventListener("mousedown", onDown);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onUp);
    el.addEventListener("mouseup", onUp);
    el.addEventListener("touchstart", onDown, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: true });
    el.addEventListener("touchend", onUp, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("mousedown", onDown);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onUp);
      el.removeEventListener("mouseup", onUp);
      el.removeEventListener("touchstart", onDown);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onUp);
      el.removeEventListener("wheel", onWheel);
    };
  }, []);
  return ref;
}

// ------------------- SMOKE TESTS (console only) -------------------
function runSmokeTests() {
  const results = [];
  const hasEducation = typeof EDUCATION === "object" && !!EDUCATION.school && Array.isArray(EDUCATION.highlights);
  results.push({ name: "EDUCATION defined", pass: hasEducation });

  const projSlugs = new Set();
  const slugsUnique = PROJECTS.every((p) => (projSlugs.has(p.slug) ? false : (projSlugs.add(p.slug), true)));
  results.push({ name: "Project slugs unique", pass: slugsUnique });

  const socialsOk = typeof CONFIG.socials.linkedin === "string" && typeof CONFIG.socials.github === "string";
  results.push({ name: "Social links present", pass: socialsOk });

  const awardsOk = Array.isArray(AWARDS) && AWARDS.every((a) => typeof a.title === "string" && typeof a.url === "string");
  results.push({ name: "Awards clickable", pass: awardsOk });

  const skillsOk = Object.keys(SKILLS).length > 0;
  results.push({ name: "Skills groups present", pass: skillsOk });

  const routeHookOk = typeof useHashRoute === "function";
  results.push({ name: "useHashRoute defined", pass: routeHookOk });

  const formOk = CONFIG.form && typeof CONFIG.form.action === "string" && CONFIG.form.action.length > 0;
  results.push({ name: "Contact form configured", pass: formOk });

  const testimonialsOk = TESTIMONIALS.length >= 1;
  results.push({ name: "Testimonials exist", pass: testimonialsOk });

  console.groupCollapsed("Cesar Portfolio • Smoke tests");
  results.forEach((r) => console.log(`${r.pass ? "✅" : "❌"} ${r.name}`));
  console.groupEnd();

  if (typeof window !== "undefined") window.__CESAR_TESTS__ = results;
}

// ------------------- GLOBAL STYLES -------------------
function GlobalStyles() {
  return (
    <style>{`
      /* Hide scrollbar across browsers */
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      .no-scrollbar::-webkit-scrollbar { display: none; }
    `}</style>
  );
}

// ------------------- PRIMITIVES -------------------
function Section({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-24 py-14 sm:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {title}
        </h2>
        <div className="mt-6">{children}</div>
      </div>
    </section>
  );
}

const Chip = ({ children }) => (
  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs ${CONFIG.color.chip} ring-1 ring-inset ring-white/10`}>{children}</span>
);

const Card = ({ children }) => (
  <div className="rounded-2xl border border-slate-200/60 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 backdrop-blur p-5 shadow-sm">
    {children}
  </div>
);

// ------------------- APP LAYOUT -------------------
function Header() {
  const links = [
    { href: "#about", label: "About" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
    { href: "#experience", label: "Experience" },
    { href: "#education", label: "Education" },
    { href: "#labs", label: "Labs/CTF" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#contact", label: "Contact" },
  ];

  // Scrollable / draggable nav with hidden scrollbar
  const navRef = useDragScroll();

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/70 dark:bg-slate-950/70 border-b border-slate-200/60 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3">
        <a href="#home" className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap">
          {CONFIG.name}
        </a>
        <nav
          ref={navRef}
          className="no-scrollbar flex-1 flex items-center gap-4 overflow-x-auto whitespace-nowrap cursor-grab"
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 rounded-full text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/70"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={CONFIG.resumePdf}
            target="_blank"
            rel="noreferrer"
            className={`hidden sm:inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-white bg-gradient-to-r ${CONFIG.color.primary} shadow hover:opacity-95 ${CONFIG.color.ring}`}
            aria-label="Download Resume"
          >
            Resume
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="pt-16 sm:pt-24">
      <div className="max-w-6xl mx-auto px-4 grid sm:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/60 dark:border-slate-700 px-3 py-1 text-xs text-slate-600 dark:text-slate-300">
            <span>🛡️</span> Cybersecurity & Digital Forensics
          </div>
          <h1 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {CONFIG.headline}
          </h1>
          <p className="mt-4 text-slate-600 dark:text-slate-300 max-w-prose">
            {CONFIG.bio}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#projects"
              className={`inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r ${CONFIG.color.primary} shadow ${CONFIG.color.ring}`}
            >
              View Projects
            </a>
            <a
              href={`mailto:${CONFIG.email}?subject=Interest%20from%20${encodeURIComponent(CONFIG.domain)}`}
              className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium border border-slate-300/70 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-100/60 dark:hover:bg-slate-800/60"
            >
              Contact Me
            </a>
          </div>
          <div className="mt-6 flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <span>📍 {CONFIG.location}</span>
            <a href={CONFIG.socials.linkedin} target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a>
            <a href={CONFIG.socials.github} target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>
            {CONFIG.socials.htbId && (
              <a href={htbLink} target="_blank" rel="noreferrer" className="hover:underline">Hack The Box</a>
            )}
          </div>
        </div>
        <div className="flex justify-center sm:justify-end">
          <img
            src={CONFIG.avatar}
            alt="Headshot placeholder"
            className="size-56 sm:size-72 rounded-full object-cover border-4 border-white shadow-lg dark:border-slate-800"
          />
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <Section id="about" title="About">
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">Who I am</h3>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
            I’m a CS student specializing in cybersecurity and digital forensics. I enjoy breaking down complex systems, documenting clearly, and building tools that make investigations faster and more reliable.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {LANGUAGES.map((l) => (
              <Chip key={l.name}>{l.name} • {l.level}</Chip>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">Focus Areas</h3>
          <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1">
            <li>DFIR playbooks and memory/email forensics</li>
            <li>Network analysis and log triage (ELK/Splunk basics)</li>
            <li>Secure scripting and light automation for analysts</li>
          </ul>
        </Card>
        <Card>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">Availability</h3>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Open to internships, research roles, and part-time security analyst work. Based in {CONFIG.location}.</p>
          <a href={`mailto:${CONFIG.email}?subject=Opportunity%20for%20Cesar`} className={`mt-3 inline-flex w-max items-center rounded-full px-4 py-2 text-sm font-medium text-white bg-gradient-to-r ${CONFIG.color.primary} shadow ${CONFIG.color.ring}`}>
            Hire Me
          </a>
        </Card>
      </div>
    </Section>
  );
}

function Skills() {
  return (
    <Section id="skills" title="Skills">
      <div className="grid md:grid-cols-2 gap-6">
        {Object.entries(SKILLS).map(([group, items]) => (
          <Card key={group}>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">{group}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {items.map((s) => (
                <Chip key={s}>{s}</Chip>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function Projects() {
  return (
    <Section id="projects" title="Projects (Case Studies)">
      <div className="grid md:grid-cols-2 gap-6">
        {PROJECTS.map((p) => (
          <a key={p.slug} href={`#/project/${p.slug}`} className="group">
            <Card>
              <div className="aspect-video w-full overflow-hidden rounded-xl bg-slate-200/50 dark:bg-slate-800/50">
                {p.media?.[0] && (
                  <img src={p.media[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" />
                )}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">{p.title}</h3>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{p.summary}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {p.badges.map((b) => (
                  <Chip key={b}>{b}</Chip>
                ))}
              </div>
            </Card>
          </a>
        ))}
      </div>
    </Section>
  );
}

function ProjectDetail({ project, onBack }) {
  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-700 dark:text-slate-200">
        <div className="text-center">
          <p>Project not found.</p>
          <a href="#home" className="text-blue-600 dark:text-blue-400 hover:underline">Return home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 dark:bg-slate-950/70 border-b border-slate-200/60 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={onBack} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">← Back</button>
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{CONFIG.name}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">Project</span>
        </div>
      </header>

      <section className="py-10 sm:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{project.title}</h1>
          <p className="mt-3 text-slate-700 dark:text-slate-300 max-w-prose">{project.summary}</p>

          <div className="mt-6 grid md:grid-cols-2 gap-6">
            {project.media?.map((m, i) => (
              <img key={i} src={m} alt="screenshot" className="w-full rounded-xl border border-slate-200/60 dark:border-slate-700" />
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.badges.map((b) => (
              <Chip key={b}>{b}</Chip>
            ))}
          </div>

          <h2 className="mt-8 text-xl font-semibold text-slate-900 dark:text-slate-100">Highlights</h2>
          <ul className="mt-2 list-disc pl-5 text-slate-700 dark:text-slate-300 space-y-1">
            {project.details.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            {project.links.repo && (
              <a href={project.links.repo} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Code</a>
            )}
            {project.links.doc && (
              <a href={project.links.doc} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Docs</a>
            )}
            {project.links.demo && (
              <a href={project.links.demo} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Demo</a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function Experience() {
  return (
    <Section id="experience" title="Experience">
      <div className="space-y-4">
        {EXPERIENCE.map((e) => (
          <Card key={e.org + e.role}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">{e.role}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">{e.org}</p>
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">{e.dates}</div>
            </div>
            <ul className="mt-3 list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1">
              {e.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function Education() {
  return (
    <Section id="education" title="Education & Awards">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">{EDUCATION.school}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{EDUCATION.degree}</p>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Graduation: {EDUCATION.grad} • GPA {EDUCATION.gpa}</p>
          <ul className="mt-3 list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1">
            {EDUCATION.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </Card>
        <Card>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">Honors & Awards</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {AWARDS.map((a) => (
              <a key={a.title} href={a.url} download className="hover:opacity-90">
                <Chip>{a.title}</Chip>
              </a>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">(Click an award to view/download.)</p>
        </Card>
      </div>
    </Section>
  );
}

function Labs() {
  return (
    <Section id="labs" title="Labs, CTFs & Write-ups">
      <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
        Hack The Box ID: <a href={htbLink} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">{CONFIG.socials.htbId}</a>
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        {LABS.map((l) => (
          <Card key={l.title}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">{l.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{l.platform}</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {l.tags.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>
            </div>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{l.summary}</p>
            {l.link && (
              <a href={l.link} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm text-blue-600 dark:text-blue-400 hover:underline">Write-up</a>
            )}
          </Card>
        ))}
      </div>
    </Section>
  );
}

// ------------------- Testimonials: static block cards -------------------
function TestimonialsBlocks() {
  return (
    <Section id="testimonials" title="Testimonials">
      <div className="grid md:grid-cols-2 gap-6">
        {TESTIMONIALS.map((t) => (
          <Card key={t.author + t.quote.slice(0, 8)}>
            <p className="text-slate-800 dark:text-slate-100 italic leading-snug">
              “{t.quote}”
            </p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 text-right">— {t.author}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function Contact() {
  const [form, setForm] = React.useState({ name: "", email: "", message: "", honey: "" });
  const [status, setStatus] = React.useState({ ok: false, msg: "" });
  const [sending, setSending] = React.useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    if (form.honey) return; // bot
    setSending(true);
    setStatus({ ok: false, msg: "" });
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${CONFIG.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          _subject: "New message from cesarkdiab.com",
          _template: "table",
          _captcha: "false",
        }),
      });
      if (!res.ok) throw new Error("Network");
      setStatus({ ok: true, msg: "Message sent. Thanks!" });
      setForm({ name: "", email: "", message: "", honey: "" });
    } catch (err) {
      setStatus({ ok: false, msg: "Could not send. Please email me directly." });
    } finally {
      setSending(false);
    }
  }

  return (
    <Section id="contact" title="Contact">
      <div className="w-full">
        <Card>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">Let’s talk</h3>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
            Email me at <a href={`mailto:${CONFIG.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">{CONFIG.email}</a>
            {CONFIG.phone ? <> or call <span className="whitespace-nowrap">{CONFIG.phone}</span></> : null}. Or use the form below:
          </p>

          {/* AJAX form (no page redirect) */}
          <form onSubmit={onSubmit} className="mt-4 space-y-3">
            {/* honeypot for spam */}
            <input type="text" name="honey" value={form.honey} onChange={onChange} className="hidden" tabIndex={-1} autoComplete="off" />

            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400">Your Name</label>
              <input
                name="name"
                required
                value={form.name}
                onChange={onChange}
                className="mt-1 w-full rounded-xl border border-slate-300/70 dark:border-slate-700 bg-white/90 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/70"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400">Email</label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={onChange}
                className="mt-1 w-full rounded-xl border border-slate-300/70 dark:border-slate-700 bg-white/90 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/70"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400">Message</label>
              <textarea
                name="message"
                rows={4}
                required
                value={form.message}
                onChange={onChange}
                className="mt-1 w-full rounded-xl border border-slate-300/70 dark:border-slate-700 bg-white/90 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/70"
                placeholder="How can I help?"
              />
            </div>
            <button disabled={sending} className={`inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r ${CONFIG.color.primary} shadow ${CONFIG.color.ring} disabled:opacity-60`}>
              {sending ? "Sending…" : "Send message"}
            </button>
          </form>

          {/* tiny toast/in-place status */}
          {status.msg && (
            <div className={`mt-3 text-xs ${status.ok ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
              {status.msg}
            </div>
          )}

          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">First submission triggers a quick FormSubmit verification email to activate delivery.</p>
        </Card>
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="py-10">
      <div className="max-w-6xl mx-auto px-4 text-sm text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} {CONFIG.name} • {CONFIG.domain}</p>
        <div className="flex items-center gap-4">
          <a href="#home" className="hover:underline">Back to top</a>
        </div>
      </div>
    </footer>
  );
}

// ------------------- MAIN APP -------------------
export default function App() {
  const route = useHashRoute();
  useSystemTheme();

  useEffect(() => {
    runSmokeTests();
  }, []);

  // Hash routing for project details
  const projectMatch = route.match(/^#\/project\/(.+)$/);
  if (projectMatch) {
    const slug = projectMatch[1];
    const project = PROJECTS.find((p) => p.slug === slug);
    return (
      <>
        <GlobalStyles />
        <ProjectDetail
          project={project}
          onBack={() => (window.location.hash = "#home")}
        />
      </>
    );
  }

  return (
    <div className="scroll-smooth min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
      <GlobalStyles />
      <Header />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <Labs />
        <TestimonialsBlocks />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

