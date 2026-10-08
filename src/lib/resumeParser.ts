import { ResumeData, SkillCategory, ProjectItem, EducationItem, CustomSection } from '@/types/resume';

export function parseRawResumeText(rawText: string): ResumeData {
  if (!rawText || rawText.trim().length === 0) {
    return createEmptyResumeData();
  }

  // 1. Clean and normalize lines
  const rawLines = rawText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => {
      if (!l) return false;
      // Filter out PDF internal artifacts
      if (l.startsWith('%PDF') || l.startsWith('%%') || l.startsWith('<<') || l.startsWith('>>')) return false;
      if (/^\/[A-Za-z0-9]+/.test(l) && !l.includes('http')) return false;
      if (l.includes('endobj') || l.includes('endstream') || l.includes('xref') || l.includes('trailer')) return false;
      if (/^page \d+( of \d+)?$/i.test(l)) return false;
      return true;
    });

  if (rawLines.length === 0) return createEmptyResumeData();

  // 2. Identify sections
  interface ParsedSection {
    type: 'header' | 'summary' | 'skills' | 'projects' | 'education' | 'languages' | 'custom';
    header: string;
    lines: string[];
  }

  const sections: ParsedSection[] = [];
  let currentSec: ParsedSection = { type: 'header', header: '', lines: [] };
  sections.push(currentSec);

  for (const line of rawLines) {
    const cleanHeader = line.replace(/^[•\-\*#\d\.\:\s]+/, '').trim();
    const upper = cleanHeader.toUpperCase();

    // Summary Section
    if (
      (upper.startsWith('PROFESSIONAL SUMMARY') ||
        upper.startsWith('EXECUTIVE SUMMARY') ||
        upper.startsWith('CAREER OBJECTIVE') ||
        upper.startsWith('OBJECTIVE') ||
        upper.startsWith('ABOUT ME') ||
        upper.startsWith('PROFILE') ||
        upper.startsWith('PERSONAL PROFILE') ||
        upper === 'SUMMARY') &&
      cleanHeader.length < 50
    ) {
      currentSec = { type: 'summary', header: cleanHeader, lines: [] };
      sections.push(currentSec);
    }
    // Skills Section
    else if (
      (upper.startsWith('TECHNICAL SKILLS') ||
        upper.startsWith('SKILLS & EXPERTISE') ||
        upper.startsWith('CORE COMPETENCIES') ||
        upper.startsWith('AREAS OF EXPERTISE') ||
        upper.startsWith('TECHNOLOGIES') ||
        upper.startsWith('TOOLS & TECHNOLOGIES') ||
        upper.startsWith('KEY SKILLS') ||
        upper.startsWith('SKILL SET') ||
        upper === 'SKILLS') &&
      cleanHeader.length < 50
    ) {
      currentSec = { type: 'skills', header: cleanHeader, lines: [] };
      sections.push(currentSec);
    }
    // Projects & Experience Section
    else if (
      (upper.startsWith('WORK EXPERIENCE') ||
        upper.startsWith('PROFESSIONAL EXPERIENCE') ||
        upper.startsWith('EMPLOYMENT HISTORY') ||
        upper.startsWith('WORK HISTORY') ||
        upper.startsWith('FEATURED PROJECTS') ||
        upper.startsWith('PROJECTS & EXPERIENCE') ||
        upper.startsWith('MY PROJECTS') ||
        upper.startsWith('SELECTED PROJECTS') ||
        upper.startsWith('ACADEMIC PROJECTS') ||
        upper.startsWith('PERSONAL PROJECTS') ||
        upper === 'PROJECTS' ||
        upper === 'EXPERIENCE') &&
      cleanHeader.length < 50
    ) {
      currentSec = { type: 'projects', header: cleanHeader, lines: [] };
      sections.push(currentSec);
    }
    // Education Section
    else if (
      (upper.startsWith('EDUCATION') ||
        upper.startsWith('ACADEMIC BACKGROUND') ||
        upper.startsWith('ACADEMIC QUALIFICATIONS') ||
        upper.startsWith('EDUCATIONAL QUALIFICATIONS') ||
        upper.startsWith('QUALIFICATIONS') ||
        upper.startsWith('EDUCATION & TRAINING')) &&
      cleanHeader.length < 50
    ) {
      currentSec = { type: 'education', header: cleanHeader, lines: [] };
      sections.push(currentSec);
    }
    // Languages Section
    else if (
      (upper.startsWith('LANGUAGES & ADDITIONAL') ||
        upper.startsWith('LANGUAGES & SKILLS') ||
        upper.startsWith('LANGUAGE PROFICIENCY') ||
        upper.startsWith('LANGUAGES') ||
        upper === 'LANGUAGE') &&
      cleanHeader.length < 50
    ) {
      currentSec = { type: 'languages', header: cleanHeader, lines: [] };
      sections.push(currentSec);
    }
    // Generic Custom Sections (Certificates, Awards, Publications, Volunteering, etc.)
    else if (
      sections.length > 1 &&
      (upper.startsWith('CERTIFICAT') ||
        upper.startsWith('AWARDS') ||
        upper.startsWith('ACHIEVEMENTS') ||
        upper.startsWith('PUBLICATIONS') ||
        upper.startsWith('VOLUNTEER') ||
        upper.startsWith('INTERESTS') ||
        upper.startsWith('ACTIVITIES') ||
        upper.startsWith('REFERENCES') ||
        upper.startsWith('HONORS')) &&
      cleanHeader.length < 50
    ) {
      currentSec = { type: 'custom', header: cleanHeader, lines: [] };
      sections.push(currentSec);
    } else {
      currentSec.lines.push(line);
    }
  }

  // Initialize clean result object
  const result: ResumeData = {
    fullName: '',
    title: '',
    contact: {
      location: '',
      phone: '',
      email: '',
      portfolioLabel: 'Portfolio:',
      portfolio: '',
      portfolioUrl: '',
      linkedinLabel: 'LinkedIn:',
      linkedin: '',
      linkedinUrl: '',
      githubLabel: 'GitHub:',
      github: '',
      githubUrl: '',
    },
    summaryTitle: 'PROFESSIONAL SUMMARY',
    summary: '',
    skillsTitle: 'TECHNICAL SKILLS',
    skills: [],
    projectsTitle: 'FEATURED PROJECTS & EXPERIENCE',
    projects: [],
    educationTitle: 'EDUCATION',
    education: [],
    languagesTitle: 'LANGUAGES & ADDITIONAL EXPERTISE',
    languagesLabel: 'Languages:',
    languages: '',
    additionalCompetenciesLabel: 'Additional Competencies:',
    additionalCompetencies: '',
    customSections: [],
    theme: {
      layoutStyle: 'classic',
      primaryColor: '#0056b3',
      fontFamily: 'Inter, sans-serif',
      fontSize: 'base',
      lineSpacing: 'normal',
    },
  };

  // 3. Parse Header Section (Name, Title, Contacts)
  const headerSec = sections.find((s) => s.type === 'header');
  if (headerSec && headerSec.lines.length > 0) {
    const hLines = [...headerSec.lines];

    // Candidate Name: look for first clean non-email/phone/url line
    let nameFound = false;
    for (let i = 0; i < hLines.length; i++) {
      const line = hLines[i];
      if (
        !nameFound &&
        line.length > 1 &&
        line.length < 60 &&
        !line.includes('@') &&
        !line.includes('http') &&
        !line.includes('www.') &&
        !/\d{7,}/.test(line) &&
        !/^(resume|cv|curriculum vitae)$/i.test(line)
      ) {
        result.fullName = line.replace(/^(resume|cv|curriculum vitae)\s*[-:]?\s*/i, '').trim();
        nameFound = true;
        hLines.splice(i, 1);
        break;
      }
    }

    // Professional Title: line directly following name (if not contact info)
    if (hLines.length > 0) {
      const firstLine = hLines[0];
      if (
        firstLine.length < 80 &&
        !firstLine.includes('@') &&
        !firstLine.includes('+') &&
        !firstLine.includes('http') &&
        !firstLine.includes('www.') &&
        !/\d{6,}/.test(firstLine) &&
        !firstLine.toLowerCase().includes('github.com') &&
        !firstLine.toLowerCase().includes('linkedin.com')
      ) {
        result.title = firstLine;
        hLines.shift();
      }
    }

    // Parse Contact information from remaining header lines or entire text
    const fullHeaderStr = hLines.join(' | ');
    parseContactInfo(fullHeaderStr, result);
  }

  // Fallback contact search in whole document if missing
  if (!result.contact.email || !result.contact.phone) {
    const allText = rawLines.slice(0, 15).join(' | ');
    parseContactInfo(allText, result);
  }

  // 4. Parse Summary Section
  const summarySec = sections.find((s) => s.type === 'summary');
  if (summarySec && summarySec.lines.length > 0) {
    result.summaryTitle = summarySec.header || 'PROFESSIONAL SUMMARY';
    result.summary = summarySec.lines.join(' ');
  }

  // 5. Parse Skills Section
  const skillsSec = sections.find((s) => s.type === 'skills');
  if (skillsSec && skillsSec.lines.length > 0) {
    result.skillsTitle = skillsSec.header || 'TECHNICAL SKILLS';
    const parsedSkills: SkillCategory[] = [];

    for (const sl of skillsSec.lines) {
      if (sl.includes(':')) {
        const colonIdx = sl.indexOf(':');
        const cat = sl.slice(0, colonIdx).replace(/^[•\-\*]\s*/, '').trim();
        const val = sl.slice(colonIdx + 1).trim();
        if (cat && val) {
          parsedSkills.push({
            id: `sk-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            categoryName: cat,
            skillsText: val,
          });
        }
      } else if (sl.includes('—') || sl.includes('–')) {
        const parts = sl.split(/[—–]/);
        if (parts.length >= 2) {
          parsedSkills.push({
            id: `sk-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            categoryName: parts[0].replace(/^[•\-\*]\s*/, '').trim(),
            skillsText: parts.slice(1).join(', ').trim(),
          });
        }
      } else {
        const cleanVal = sl.replace(/^[•\-\*]\s*/, '').trim();
        if (cleanVal.length > 2) {
          parsedSkills.push({
            id: `sk-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            categoryName: 'Core Skills',
            skillsText: cleanVal,
          });
        }
      }
    }

    if (parsedSkills.length > 0) {
      result.skills = parsedSkills;
    }
  }

  // 6. Parse Projects & Experience Section
  const projSec = sections.find((s) => s.type === 'projects');
  if (projSec && projSec.lines.length > 0) {
    result.projectsTitle = projSec.header || 'FEATURED PROJECTS & EXPERIENCE';
    const parsedProjects: ProjectItem[] = [];
    let curProj: ProjectItem | null = null;

    for (const pl of projSec.lines) {
      const isTechStack =
        pl.toLowerCase().startsWith('tech stack:') ||
        pl.toLowerCase().startsWith('technologies:') ||
        pl.toLowerCase().startsWith('tools:');

      const isBullet =
        pl.startsWith('•') ||
        pl.startsWith('') ||
        pl.startsWith('- ') ||
        pl.startsWith('* ') ||
        pl.startsWith('– ') ||
        /^\d+[\.\)]\s/.test(pl);

      const isLinkOnly =
        /^(live demo|client github|server github|github|demo|portfolio|source code|preview):/i.test(pl);

      // Check if line is Project Title / Header
      const isTitleLine =
        !isBullet &&
        !isTechStack &&
        !isLinkOnly &&
        (pl.includes('—') ||
          pl.includes('–') ||
          pl.includes(' - ') ||
          pl.includes('|') ||
          pl.toLowerCase().includes('live demo') ||
          pl.toLowerCase().includes('github') ||
          pl.length < 75);

      if (isTitleLine && (!curProj || curProj.bullets.length > 0 || isTechStack)) {
        // Strip links from title line
        const cleanTitleLine = pl
          .replace(/[•*]?\s*(Live Demo|Client GitHub|Server GitHub|GitHub Profile|Portfolio|Demo|GitHub).*$/i, '')
          .trim();

        let pTitle = cleanTitleLine;
        let pSubtitle = '';

        if (cleanTitleLine.includes('—')) {
          const parts = cleanTitleLine.split('—');
          pTitle = parts[0]?.trim() || '';
          pSubtitle = parts.slice(1).join('—').trim();
        } else if (cleanTitleLine.includes('–')) {
          const parts = cleanTitleLine.split('–');
          pTitle = parts[0]?.trim() || '';
          pSubtitle = parts.slice(1).join('–').trim();
        } else if (cleanTitleLine.includes(' - ')) {
          const parts = cleanTitleLine.split(' - ');
          pTitle = parts[0]?.trim() || '';
          pSubtitle = parts.slice(1).join(' - ').trim();
        } else if (cleanTitleLine.includes('|')) {
          const parts = cleanTitleLine.split('|');
          pTitle = parts[0]?.trim() || '';
          pSubtitle = parts.slice(1).join(' | ').trim();
        }

        // Parse any inline links present in the original line
        const links = extractInlineLinks(pl);

        curProj = {
          id: `proj-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          title: pTitle || 'Project Title',
          subtitle: pSubtitle || '',
          liveDemoLabel: links.liveDemo ? 'Live Demo' : 'Live Demo',
          liveDemoUrl: links.liveDemo || 'https://demo.vercel.app',
          clientGithubLabel: links.clientGithub ? 'Client GitHub' : 'Client GitHub',
          clientGithubUrl: links.clientGithub || (links.genericGithub ? links.genericGithub : 'https://github.com'),
          serverGithubLabel: 'Server GitHub',
          serverGithubUrl: links.serverGithub || 'https://github.com',
          techStackLabel: 'Tech Stack:',
          techStackText: '',
          bullets: [],
        };
        parsedProjects.push(curProj);
      } else if (isTechStack && curProj) {
        curProj.techStackText = pl.replace(/^(tech stack|technologies|tools):?\s*/i, '').trim();
      } else if (isLinkOnly && curProj) {
        const links = extractInlineLinks(pl);
        if (links.liveDemo) curProj.liveDemoUrl = links.liveDemo;
        if (links.clientGithub) curProj.clientGithubUrl = links.clientGithub;
        if (links.serverGithub) curProj.serverGithubUrl = links.serverGithub;
      } else if (curProj) {
        const cleanBullet = pl.replace(/^[•\-\*\–\d\.\)]\s*/, '').trim();
        if (cleanBullet.length > 3) {
          curProj.bullets.push(cleanBullet);
        }
      }
    }

    if (parsedProjects.length > 0) {
      result.projects = parsedProjects;
    }
  }

  // 7. Parse Education Section
  const eduSec = sections.find((s) => s.type === 'education');
  if (eduSec && eduSec.lines.length > 0) {
    result.educationTitle = eduSec.header || 'EDUCATION';
    const parsedEdu: EducationItem[] = [];

    for (let i = 0; i < eduSec.lines.length; i++) {
      const line = eduSec.lines[i];
      if (!line) continue;

      let degree = line;
      let institution = 'Institute / University Name';
      let statusOrDate = 'Ongoing';

      if (line.includes('|')) {
        const parts = line.split('|').map((p) => p.trim());
        degree = parts[0] || degree;
        institution = parts[1] || institution;
        if (parts[2]) statusOrDate = parts[2];
      } else if (line.includes('—') || line.includes('–')) {
        const parts = line.split(/[—–]/).map((p) => p.trim());
        degree = parts[0] || degree;
        if (parts[1]) institution = parts[1];
      }

      // Check next line for Institution / Date if single line
      if (institution === 'Institute / University Name' && i + 1 < eduSec.lines.length) {
        const nextLine = eduSec.lines[i + 1];
        if (
          nextLine.toLowerCase().includes('university') ||
          nextLine.toLowerCase().includes('college') ||
          nextLine.toLowerCase().includes('school') ||
          nextLine.toLowerCase().includes('institute') ||
          nextLine.toLowerCase().includes('polytechnic') ||
          /\d{4}/.test(nextLine)
        ) {
          if (nextLine.includes('|')) {
            const parts = nextLine.split('|').map((p) => p.trim());
            institution = parts[0] || nextLine;
            statusOrDate = parts[1] || statusOrDate;
          } else {
            institution = nextLine;
          }
          i++; // consumed next line
        }
      }

      parsedEdu.push({
        id: `edu-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        degree: degree.trim(),
        institution: institution.trim(),
        statusOrDate: statusOrDate.trim(),
      });
    }

    if (parsedEdu.length > 0) {
      result.education = parsedEdu;
    }
  }

  // 8. Parse Languages Section
  const langSec = sections.find((s) => s.type === 'languages');
  if (langSec && langSec.lines.length > 0) {
    result.languagesTitle = langSec.header || 'LANGUAGES & ADDITIONAL EXPERTISE';
    const langLines: string[] = [];
    const compLines: string[] = [];

    for (const ll of langSec.lines) {
      if (ll.toLowerCase().includes('languages:') || ll.toLowerCase().startsWith('language:')) {
        langLines.push(ll.replace(/^languages?:?\s*/i, '').trim());
      } else if (
        ll.toLowerCase().includes('competencies:') ||
        ll.toLowerCase().includes('other skills:') ||
        ll.toLowerCase().includes('expertise:')
      ) {
        compLines.push(ll.replace(/^.*(competencies|other skills|expertise):?\s*/i, '').trim());
      } else {
        langLines.push(ll);
      }
    }

    if (langLines.length > 0) {
      result.languages = langLines.join(', ');
    }
    if (compLines.length > 0) {
      result.additionalCompetencies = compLines.join(', ');
    }
  }

  // 9. Parse Custom Sections (Certificates, Awards, Volunteering, etc.)
  const customSecs = sections.filter((s) => s.type === 'custom');
  if (customSecs.length > 0) {
    const parsedCustoms: CustomSection[] = [];
    for (const cs of customSecs) {
      if (cs.lines.length > 0) {
        parsedCustoms.push({
          id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          sectionTitle: cs.header || 'ADDITIONAL INFORMATION',
          content: cs.lines.join('\n'),
          bullets: cs.lines.filter((l) => l.startsWith('•') || l.startsWith('- ')),
        });
      }
    }
    if (parsedCustoms.length > 0) {
      result.customSections = parsedCustoms;
    }
  }

  // Final sanity defaults if empty
  if (!result.fullName) result.fullName = 'YOUR FULL NAME';
  if (!result.title) result.title = 'PROFESSIONAL TITLE';
  if (result.skills.length === 0) {
    result.skills = [
      {
        id: `sk-1`,
        categoryName: 'Skills',
        skillsText: 'Add your skills here...',
      },
    ];
  }
  if (result.projects.length === 0) {
    result.projects = [
      {
        id: `proj-1`,
        title: 'Project Title',
        subtitle: 'Key Subtitle',
        liveDemoLabel: 'Live Demo',
        liveDemoUrl: 'https://demo.vercel.app',
        clientGithubLabel: 'Client GitHub',
        clientGithubUrl: 'https://github.com',
        serverGithubLabel: 'Server GitHub',
        serverGithubUrl: 'https://github.com',
        techStackLabel: 'Tech Stack:',
        techStackText: 'Tech stack details...',
        bullets: ['Add project description and key accomplishments here...'],
      },
    ];
  }
  if (result.education.length === 0) {
    result.education = [
      {
        id: `edu-1`,
        degree: 'Degree / Certificate',
        institution: 'Institution Name',
        statusOrDate: 'Year',
      },
    ];
  }

  return result;
}

// Helper: Extract contact info from line/string
function parseContactInfo(text: string, result: ResumeData) {
  if (!text) return;

  // Email regex
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch && !result.contact.email) {
    result.contact.email = emailMatch[0].trim();
  }

  // Phone regex (support international and local formatted numbers)
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,6}/);
  if (phoneMatch && phoneMatch[0].length >= 8 && !result.contact.phone) {
    result.contact.phone = phoneMatch[0].trim();
  }

  // Split text by delimiters to inspect URLs and Location
  const segments = text.split(/[|•,\t\n]/).map((s) => s.trim());

  for (const seg of segments) {
    const sLower = seg.toLowerCase();

    // LinkedIn
    if (sLower.includes('linkedin.com') || sLower.startsWith('linkedin:')) {
      const clean = seg.replace(/^linkedin:?\s*/i, '').trim();
      result.contact.linkedin = clean.replace(/^https?:\/\/(www\.)?/i, '');
      result.contact.linkedinUrl = clean.startsWith('http') ? clean : `https://${clean}`;
    }
    // GitHub
    else if (sLower.includes('github.com') || sLower.startsWith('github:')) {
      const clean = seg.replace(/^github:?\s*/i, '').trim();
      result.contact.github = clean.replace(/^https?:\/\/(www\.)?/i, '');
      result.contact.githubUrl = clean.startsWith('http') ? clean : `https://${clean}`;
    }
    // Portfolio / Live Domain
    else if (
      sLower.includes('portfolio') ||
      sLower.includes('.vercel.app') ||
      sLower.includes('.netlify.app') ||
      sLower.includes('.dev') ||
      sLower.includes('.app') ||
      sLower.includes('.io')
    ) {
      const clean = seg.replace(/^portfolio:?\s*/i, '').trim();
      result.contact.portfolio = clean.replace(/^https?:\/\/(www\.)?/i, '');
      result.contact.portfolioUrl = clean.startsWith('http') ? clean : `https://${clean}`;
    }
    // Location check
    else if (
      !result.contact.location &&
      seg.length > 2 &&
      seg.length < 50 &&
      !seg.includes('@') &&
      !/\d{6,}/.test(seg) &&
      (sLower.includes('bangladesh') ||
        sLower.includes('dhaka') ||
        sLower.includes('sylhet') ||
        sLower.includes('chittagong') ||
        sLower.includes('usa') ||
        sLower.includes('canada') ||
        sLower.includes('india') ||
        sLower.includes('uk') ||
        sLower.includes('germany') ||
        seg.includes(','))
    ) {
      result.contact.location = seg;
    }
  }
}

// Helper: Extract inline URLs for projects
function extractInlineLinks(line: string) {
  const links: {
    liveDemo?: string;
    clientGithub?: string;
    serverGithub?: string;
    genericGithub?: string;
  } = {};

  const urlMatches = line.match(/https?:\/\/[^\s\)\],|]+/g);
  if (urlMatches) {
    for (const u of urlMatches) {
      const uLower = u.toLowerCase();
      if (uLower.includes('github.com')) {
        if (uLower.includes('client')) {
          links.clientGithub = u;
        } else if (uLower.includes('server') || uLower.includes('api') || uLower.includes('backend')) {
          links.serverGithub = u;
        } else {
          links.genericGithub = u;
        }
      } else {
        links.liveDemo = u;
      }
    }
  }

  return links;
}

function createEmptyResumeData(): ResumeData {
  return {
    fullName: 'YOUR FULL NAME',
    title: 'PROFESSIONAL TITLE',
    contact: {
      location: 'City, Country',
      phone: '+1 234 567 890',
      email: 'your.email@example.com',
      portfolioLabel: 'Portfolio:',
      portfolio: 'yourportfolio.com',
      portfolioUrl: 'https://yourportfolio.com',
      linkedinLabel: 'LinkedIn:',
      linkedin: 'linkedin.com/in/username',
      linkedinUrl: 'https://linkedin.com/in/username',
      githubLabel: 'GitHub:',
      github: 'github.com/username',
      githubUrl: 'https://github.com/username',
    },
    summaryTitle: 'PROFESSIONAL SUMMARY',
    summary: 'Enter your summary here...',
    skillsTitle: 'TECHNICAL SKILLS',
    skills: [
      {
        id: 'sk-1',
        categoryName: 'Technical Skills',
        skillsText: 'Skill 1, Skill 2, Skill 3',
      },
    ],
    projectsTitle: 'FEATURED PROJECTS & EXPERIENCE',
    projects: [],
    educationTitle: 'EDUCATION',
    education: [],
    languagesTitle: 'LANGUAGES & ADDITIONAL EXPERTISE',
    languagesLabel: 'Languages:',
    languages: 'English',
    additionalCompetenciesLabel: 'Additional Competencies:',
    additionalCompetencies: '',
    customSections: [],
    theme: {
      layoutStyle: 'classic',
      primaryColor: '#0056b3',
      fontFamily: 'Inter, sans-serif',
      fontSize: 'base',
      lineSpacing: 'normal',
    },
  };
}
