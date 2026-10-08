import { ResumeData, SkillCategory, ProjectItem, EducationItem } from '@/types/resume';
import { khalidResumeData, emptyResumeData } from './khalidResumeData';

export function parseRawResumeText(rawText: string): ResumeData {
  if (!rawText || rawText.trim().length === 0) {
    return JSON.parse(JSON.stringify(khalidResumeData));
  }

  // 1. Clean and normalize lines
  const rawLines = rawText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => {
      if (!l) return false;
      if (l.startsWith('%PDF') || l.startsWith('%%') || l.startsWith('<<') || l.startsWith('>>')) return false;
      if (/^\/[A-Za-z0-9]+/.test(l) && !l.includes('http')) return false;
      if (l.includes('endobj') || l.includes('endstream') || l.includes('xref') || l.includes('trailer')) return false;
      return true;
    });

  if (rawLines.length === 0) return JSON.parse(JSON.stringify(khalidResumeData));

  // 2. Identify sections
  const sections: { type: string; header: string; lines: string[] }[] = [];
  let currentSec = { type: 'header', header: '', lines: [] as string[] };
  sections.push(currentSec);

  for (const line of rawLines) {
    const upper = line.toUpperCase();
    if (
      upper.includes('PROFESSIONAL SUMMARY') ||
      upper.includes('CAREER OBJECTIVE') ||
      upper.includes('ABOUT ME') ||
      upper === 'SUMMARY'
    ) {
      currentSec = { type: 'summary', header: line, lines: [] };
      sections.push(currentSec);
    } else if (
      upper.includes('TECHNICAL SKILLS') ||
      upper.includes('SKILLS & EXPERTISE') ||
      upper === 'SKILLS'
    ) {
      currentSec = { type: 'skills', header: line, lines: [] };
      sections.push(currentSec);
    } else if (
      upper.includes('FEATURED PROJECTS') ||
      upper.includes('PROJECTS & EXPERIENCE') ||
      upper.includes('MY PROJECTS') ||
      upper === 'PROJECTS' ||
      upper.includes('EXPERIENCE')
    ) {
      currentSec = { type: 'projects', header: line, lines: [] };
      sections.push(currentSec);
    } else if (upper.includes('EDUCATION') || upper.includes('ACADEMIC BACKGROUND')) {
      currentSec = { type: 'education', header: line, lines: [] };
      sections.push(currentSec);
    } else if (
      upper.includes('LANGUAGES & ADDITIONAL EXPERTISE') ||
      upper.includes('LANGUAGES & SKILLS') ||
      upper.includes('LANGUAGES') ||
      upper === 'LANGUAGE'
    ) {
      currentSec = { type: 'languages', header: line, lines: [] };
      sections.push(currentSec);
    } else {
      currentSec.lines.push(line);
    }
  }

  // Base Data Template
  const result: ResumeData = JSON.parse(JSON.stringify(khalidResumeData));

  // Parse Header Section (Name, Title, Contact)
  const headerSec = sections.find((s) => s.type === 'header');
  if (headerSec && headerSec.lines.length > 0) {
    const hLines = headerSec.lines;
    // Line 1 is Full Name
    if (hLines[0] && hLines[0].length < 60) {
      result.fullName = hLines[0].replace(/^(resume|cv|curriculum vitae)\s*/i, '').trim();
    }
    // Line 2 is Title
    if (hLines[1] && hLines[1].length < 80 && !hLines[1].includes('@') && !hLines[1].includes('+')) {
      result.title = hLines[1];
    }

    for (const hl of hLines) {
      // Email, Phone, Location
      if (hl.includes('@') || hl.includes('+') || /\d{8,}/.test(hl)) {
        const parts = hl.split(/[|•,\t]/).map((p) => p.trim());
        for (const p of parts) {
          if (p.includes('@')) {
            result.contact.email = p;
          } else if (p.includes('+') || /\d{8,}/.test(p)) {
            result.contact.phone = p;
          } else if (
            p.toLowerCase().includes('dhaka') ||
            p.toLowerCase().includes('bangladesh') ||
            p.toLowerCase().includes('sylhet') ||
            p.toLowerCase().includes('chittagong')
          ) {
            result.contact.location = p;
          }
        }
      }

      // Portfolio, LinkedIn, GitHub
      if (
        hl.toLowerCase().includes('linkedin') ||
        hl.toLowerCase().includes('portfolio') ||
        hl.toLowerCase().includes('github') ||
        hl.includes('.vercel.app') ||
        hl.includes('linkedin.com') ||
        hl.includes('github.com')
      ) {
        const parts = hl.split(/[|•]/).map((p) => p.trim());
        for (const p of parts) {
          if (p.toLowerCase().includes('linkedin') || p.includes('linkedin.com')) {
            const clean = p.replace(/^linkedin:?\s*/i, '').trim();
            result.contact.linkedin = clean;
            result.contact.linkedinUrl = clean.startsWith('http') ? clean : `https://${clean}`;
          } else if (p.toLowerCase().includes('portfolio') || p.includes('.vercel.app')) {
            const clean = p.replace(/^portfolio:?\s*/i, '').trim();
            result.contact.portfolio = clean;
            result.contact.portfolioUrl = clean.startsWith('http') ? clean : `https://${clean}`;
          } else if (p.toLowerCase().includes('github') || p.includes('github.com')) {
            const clean = p.replace(/^github:?\s*/i, '').trim();
            result.contact.github = clean;
            result.contact.githubUrl = clean.startsWith('http') ? clean : `https://${clean}`;
          }
        }
      }
    }
  }

  // Parse Summary Section
  const summarySec = sections.find((s) => s.type === 'summary');
  if (summarySec && summarySec.lines.length > 0) {
    result.summaryTitle = summarySec.header || 'PROFESSIONAL SUMMARY';
    result.summary = summarySec.lines.join(' ');
  }

  // Parse Skills Section
  const skillsSec = sections.find((s) => s.type === 'skills');
  if (skillsSec && skillsSec.lines.length > 0) {
    result.skillsTitle = skillsSec.header || 'TECHNICAL SKILLS';
    const parsedSkills: SkillCategory[] = [];
    for (const sl of skillsSec.lines) {
      if (sl.includes(':')) {
        const colonIdx = sl.indexOf(':');
        const cat = sl.slice(0, colonIdx).trim();
        const val = sl.slice(colonIdx + 1).trim();
        if (cat && val) {
          parsedSkills.push({
            id: `sk-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            categoryName: cat,
            skillsText: val,
          });
        }
      }
    }
    if (parsedSkills.length > 0) {
      result.skills = parsedSkills;
    }
  }

  // Parse Projects Section
  const projSec = sections.find((s) => s.type === 'projects');
  if (projSec && projSec.lines.length > 0) {
    result.projectsTitle = projSec.header || 'FEATURED PROJECTS & EXPERIENCE';
    const parsedProjects: ProjectItem[] = [];
    let curProj: ProjectItem | null = null;

    for (const pl of projSec.lines) {
      const isTechStack = pl.toLowerCase().startsWith('tech stack:');
      const isBullet =
        pl.startsWith('•') ||
        pl.startsWith('') ||
        pl.startsWith('- ') ||
        pl.startsWith('* ') ||
        pl.startsWith('Built') ||
        pl.startsWith('Developed') ||
        pl.startsWith('Implemented') ||
        pl.startsWith('Optimized') ||
        pl.startsWith('Applied') ||
        pl.startsWith('Created') ||
        pl.startsWith('Designed');

      // Check if line is Project Title (split ONLY on em-dash '—', en-dash '–', or space-dash-space ' - ')
      const isTitleLine =
        !isBullet &&
        !isTechStack &&
        (pl.includes('—') || pl.includes('–') || pl.includes(' - ') || pl.toLowerCase().includes('live demo') || pl.toLowerCase().includes('github') || pl.length < 65);

      if (isTitleLine && (!curProj || curProj.bullets.length > 0 || isTechStack === false)) {
        // Strip links from title line
        let cleanTitleLine = pl.replace(/[•*]?\s*(Live Demo|Client GitHub|Server GitHub|GitHub Profile|Portfolio).*$/i, '').trim();

        // Split ONLY on em-dash '—' or space-dash-space ' - ' so 'Full-Stack' and 'E-Commerce' never get broken
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
        }

        curProj = {
          id: `proj-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          title: pTitle || 'Project Title',
          subtitle: pSubtitle || '',
          liveDemoLabel: pl.toLowerCase().includes('portfolio') ? 'Portfolio' : 'Live Demo',
          liveDemoUrl: 'https://demo.vercel.app',
          clientGithubLabel: pl.toLowerCase().includes('github profile') ? 'GitHub Profile' : 'Client GitHub',
          clientGithubUrl: 'https://github.com/khalid66527',
          serverGithubLabel: 'Server GitHub',
          serverGithubUrl: 'https://github.com/khalid66527',
          techStackLabel: 'Tech Stack:',
          techStackText: '',
          bullets: [],
        };
        parsedProjects.push(curProj);
      } else if (isTechStack && curProj) {
        curProj.techStackText = pl.replace(/^tech stack:?\s*/i, '').trim();
      } else if (curProj) {
        const cleanBullet = pl.replace(/^[•\-\*]\s*/, '').trim();
        if (cleanBullet.length > 5) {
          curProj.bullets.push(cleanBullet);
        }
      }
    }

    if (parsedProjects.length > 0) {
      result.projects = parsedProjects;
    }
  }

  // Parse Education Section
  const eduSec = sections.find((s) => s.type === 'education');
  if (eduSec && eduSec.lines.length > 0) {
    result.educationTitle = eduSec.header || 'EDUCATION';
    const parsedEdu: EducationItem[] = [];
    for (let i = 0; i < eduSec.lines.length; i++) {
      const l = eduSec.lines[i];
      if (
        l.includes('—') ||
        l.toLowerCase().includes('diploma') ||
        l.toLowerCase().includes('engineering') ||
        l.toLowerCase().includes('bachelor') ||
        l.toLowerCase().includes('bsc') ||
        l.toLowerCase().includes('hsc') ||
        l.toLowerCase().includes('ssc') ||
        l.toLowerCase().includes('certificate')
      ) {
        const nextLine = eduSec.lines[i + 1] || '';
        const statusMatch = nextLine.match(/(Ongoing.*|\d{4}.*)/i);
        parsedEdu.push({
          id: `edu-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          degree: l,
          institution: nextLine.replace(/\|.*$/, '').trim() || 'Institute Name',
          statusOrDate: statusMatch ? statusMatch[0].trim() : 'Ongoing',
        });
        i++;
      }
    }
    if (parsedEdu.length > 0) {
      result.education = parsedEdu;
    }
  }

  // Parse Languages Section
  const langSec = sections.find((s) => s.type === 'languages');
  if (langSec && langSec.lines.length > 0) {
    result.languagesTitle = langSec.header || 'LANGUAGES & ADDITIONAL EXPERTISE';
    for (const ll of langSec.lines) {
      if (ll.toLowerCase().includes('languages:') || ll.toLowerCase().startsWith('language:')) {
        result.languages = ll.replace(/^languages?:?\s*/i, '').trim();
      } else if (ll.toLowerCase().includes('competencies:') || ll.toLowerCase().includes('additional competencies:')) {
        result.additionalCompetencies = ll.replace(/^.*competencies:?\s*/i, '').trim();
      }
    }
  }

  return result;
}
