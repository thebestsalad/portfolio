import { supabase } from './supabase'

// ---------------- SEED (fallback when Supabase not configured) ----------------
export const SEED = {
  settings: {
    profile: {
      name: 'Cesar K. Diab',
      headline: 'Cybersecurity & Digital Forensics',
      tagline: 'DFIR, malware analysis, and network security. Evidence-first, report-driven.',
      bio: 'CS undergraduate at UTSA (Cybersecurity concentration, Digital Forensics minor, May 2027). Hands-on with memory forensics, malware triage, packet analysis, and blue-team operations. Currently researching AI forensic evidence admissibility under proposed FRE 707.',
      location: 'San Antonio, Texas',
      email: 'cesarkdiab@gmail.com',
      avatar_url: '/headshot.jpg',
      resume_url: '',
      socials: {
        linkedin: 'https://www.linkedin.com/in/cesar-diab',
        github: 'https://github.com/thebestsalad',
        htb: 'HTB-EB1BCAD53B'
      }
    },
    about: {
      body: 'I work at the intersection of cybersecurity and digital forensics: acquiring evidence, reconstructing incidents, and writing reports that hold up to scrutiny. Coursework and lab work span memory forensics with Volatility, malware reverse engineering, libpcap tooling in C, and hardening competitions. I also build and run production web infrastructure.',
      skills: {
        Security: ['Network Security', 'Web App Security', 'Threat Modeling', 'Incident Response', 'OSINT'],
        'Digital Forensics': ['Volatility', 'Autopsy/Sleuth Kit', 'FTK Imager', 'Wireshark', 'Chain of Custody'],
        'Malware Analysis': ['Static/Dynamic Triage', 'ConfuserEx2 Deobfuscation', 'YARA (familiar)', 'Sandboxing'],
        Programming: ['Python', 'C', 'Java', 'JavaScript/TypeScript', 'SQL'],
        'Systems & Tools': ['Kali/Debian', 'Bash', 'tcpdump', 'Git', 'Docker', 'Burp Suite', 'Metasploit']
      },
      languages: [
        { name: 'English', level: 'Native' },
        { name: 'Arabic', level: 'Native' },
        { name: 'French', level: 'Intermediate' }
      ],
      education: {
        school: 'The University of Texas at San Antonio',
        degree: 'B.S. Computer Science — Cybersecurity concentration, Digital Forensics minor',
        grad: 'May 2027',
        gpa: '3.97'
      }
    }
  },
  categories: [
    { id: 'seed-cat-1', name: 'Digital Forensics', sort: 1 },
    { id: 'seed-cat-2', name: 'Offensive Security', sort: 2 },
    { id: 'seed-cat-3', name: 'Tooling & Crypto', sort: 3 }
  ],
  labs: [
    {
      id: 'seed-1',
      category: 'Digital Forensics',
      slug: 'dfir-windows-memory-triage',
      title: 'DFIR Case Study: Windows Memory Triage',
      summary: 'Acquired live RAM, parsed memory artifacts, and extracted credential and session traces to reconstruct user activity.',
      description: '## Objective\nDemonstrate volatile evidence handling and a rapid triage playbook for small IR teams.\n\n## Method\n- Captured volatile memory and validated integrity (SHA-256)\n- Enumerated processes, network sockets, and credential material\n- Outlined an incident timeline and recommended containment steps',
      cover_url: '',
      tags: ['DFIR', 'Memory', 'Volatility'],
      links: { repo: '', writeup: '' },
      files: [],
      published: true,
      featured: true,
      lab_date: '2025-01-12'
    },
    {
      id: 'seed-2',
      category: 'Tooling & Crypto',
      slug: 'crypto-xor-csv-decryptor',
      title: 'Crypto Cracker: XOR CSV Decryptor',
      summary: 'Python tooling that scores key sizes via normalized Hamming distance and recovers repeating-key XOR on CSV datasets.',
      description: '## Objective\nRecover plaintext from repeating-key XOR ciphertext and document safe handling of sensitive data.\n\n## Method\n- Implemented key-length scoring with normalized Hamming distance\n- Recovered the keystream and decrypted multiple samples\n- Benchmarked against known tools and added rule-based post-processing',
      cover_url: '',
      tags: ['Crypto', 'XOR', 'Python'],
      links: { repo: '', writeup: '' },
      files: [],
      published: true,
      featured: true,
      lab_date: '2024-12-08'
    },
    {
      id: 'seed-3',
      category: 'Offensive Security',
      slug: 'htb-blue-eternalblue',
      title: 'HTB: Blue (EternalBlue)',
      summary: 'Enumerated SMB, confirmed MS17-010, reproduced the exploit in a controlled lab, and documented artifacts.',
      description: '## Scope\nWindows target assessment via SMB enumeration, vulnerability confirmation, safe exploit reproduction, and artifact capture.\n\n## Notes\nLessons learned documented for detection and containment.',
      cover_url: '',
      tags: ['HTB', 'Windows', 'Exploitation'],
      links: { repo: '', writeup: '' },
      files: [],
      published: true,
      featured: false,
      lab_date: '2025-02-02'
    }
  ],
  experience: [
    {
      id: 'seed-e1',
      org: 'UTSA Department of Computer Science',
      role: 'Student Grader',
      dates: 'Sep 2025 – Present',
      bullets: [
        'Evaluate student assignments for accuracy and rubric alignment',
        'Collaborate with faculty to clarify grading criteria and expectations',
        'Maintain precise records to ensure timely score submissions'
      ],
      description: '',
      files: [],
      sort: 1
    },
    {
      id: 'seed-e2',
      org: 'University of Texas at San Antonio',
      role: 'Data Research Analyst',
      dates: 'Apr 2025 – Jul 2025',
      bullets: [
        'Analyzed faculty output, citations, and funding data for strategy',
        'Built scripts and visuals for H-index and funding trend analysis',
        'Tracked DoD/DOE proposals using Excel and Python'
      ],
      sort: 2
    },
    {
      id: 'seed-e3',
      org: 'UTSA Academic Support Programs',
      role: 'Peer Educator (Floor & Athletic Tutor)',
      dates: 'Aug 2024 – Jul 2025',
      bullets: [
        'Tutored 20+ students in Calculus and Programming with strong feedback',
        'Explained complex concepts and study tactics for higher performance',
        'Earned repeat requests from student-athletes for clarity beyond class'
      ],
      sort: 3
    }
  ],
  certifications: [
    {
      id: 'seed-c1',
      title: 'CompTIA Security+ (SY0-701)',
      issuer: 'CompTIA',
      status: 'In progress',
      issued: '',
      description: 'Core security certification covering threat types, architecture, operations, and governance. Studying with Professor Messer materials.',
      credential_url: '',
      image_url: '',
      files: [],
      sort: 1
    },
    {
      id: 'seed-c2',
      title: 'Microsoft Office Specialist',
      issuer: 'Microsoft',
      status: 'Issued',
      issued: '2023',
      description: '',
      credential_url: '',
      image_url: '',
      files: [],
      sort: 2
    }
  ],
  recommendations: [
    {
      id: 'seed-r1',
      author: 'Add your first recommendation',
      role: 'From the admin console',
      org: '',
      body: 'Recommendation notes from professors, supervisors, and collaborators appear here once added.',
      file_url: '',
      files: [],
      published: true,
      sort: 1
    }
  ]
}

// ---------------- FETCHERS ----------------
async function safeQuery(fn, fallback) {
  if (!supabase) return fallback
  try {
    const { data, error } = await fn()
    if (error) throw error
    return data && (Array.isArray(data) ? data.length : true) ? data : fallback
  } catch (e) {
    console.warn('[data] falling back to seed:', e.message)
    return fallback
  }
}

export async function getSettings() {
  if (!supabase) return SEED.settings
  try {
    const { data, error } = await supabase.from('site_settings').select('key,value')
    if (error) throw error
    if (!data?.length) return SEED.settings
    const out = { ...SEED.settings }
    for (const row of data) out[row.key] = { ...out[row.key], ...row.value }
    return out
  } catch (e) {
    console.warn('[data] settings fallback:', e.message)
    return SEED.settings
  }
}

export const getLabs = () =>
  safeQuery(
    () => supabase.from('labs').select('*').eq('published', true).order('lab_date', { ascending: false }),
    SEED.labs
  )

export const getCategories = () =>
  safeQuery(() => supabase.from('lab_categories').select('*').order('sort'), SEED.categories)

export const getLab = async (slug) => {
  const labs = await getLabs()
  return labs.find((l) => l.slug === slug) || null
}

export const getExperience = () =>
  safeQuery(() => supabase.from('experience').select('*').order('sort'), SEED.experience)

export const getCertifications = () =>
  safeQuery(() => supabase.from('certifications').select('*').order('sort'), SEED.certifications)

export const getRecommendations = () =>
  safeQuery(
    () => supabase.from('recommendations').select('*').eq('published', true).order('sort'),
    SEED.recommendations
  )

// ---------------- UTIL ----------------
export async function sha256Hex(text) {
  try {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
  } catch {
    return ''
  }
}

export function caseNumber(item, idx) {
  const d = item.lab_date ? new Date(item.lab_date) : new Date()
  const yr = Number.isNaN(d.getTime()) ? new Date().getFullYear() : d.getFullYear()
  return `CASE-${yr}-${String(idx + 1).padStart(3, '0')}`
}
