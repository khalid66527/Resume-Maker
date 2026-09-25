import { ResumeData } from '@/types/resume';
import { khalidResumeData } from './khalidResumeData';

export function parseRawResumeText(rawText: string): ResumeData {
  // 1. Filter out raw PDF bytecode artifacts if any
  const lines = rawText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => {
      if (!l) return false;
      // Skip raw PDF internal stream lines
      if (l.startsWith('%PDF') || l.startsWith('%%') || l.startsWith('<<') || l.startsWith('>>')) return false;
      if (/^\/[A-Za-z0-9]+/.test(l) && !l.includes('http')) return false;
      if (l.includes('endobj') || l.includes('endstream') || l.includes('xref') || l.includes('trailer')) return false;
      return true;
    });

  if (lines.length === 0) return JSON.parse(JSON.stringify(khalidResumeData));

  const result: ResumeData = {
    fullName: lines[0] || 'YOUR NAME',
    title: lines[1] || 'PROFESSIONAL TITLE',
    contact: {
      location: 'Dhaka, Bangladesh',
      phone: '+880 1568666527',
      email: 'khalidhasan678954321@gmail.com',
      portfolioLabel: 'Portfolio:',
      portfolio: 'Portfolio',
      portfolioUrl: 'https://khalidhasan.vercel.app',
      linkedinLabel: 'LinkedIn:',
      linkedin: 'linkedin.com/in/khalid66527',
      linkedinUrl: 'https://linkedin.com/in/khalid66527',
      githubLabel: 'GitHub:',
      github: 'github.com/khalid66527',
      githubUrl: 'https://github.com/khalid66527',
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
    languages: 'English (Fluent), Bangla (Native)',
    additionalCompetenciesLabel: 'Additional Competencies:',
    additionalCompetencies: '',
    customSections: [],
    theme: { ...khalidResumeData.theme },
  };

  let currentSection = '';
  let summaryLines: string[] = [];

  for (let i = 2; i < lines.length; i++) {
    const line = lines[i];
    const upper = line.toUpperCase();

    // Check contact info line
    if (
      line.includes('@') ||
      line.includes('+880') ||
      line.toLowerCase().includes('phone') ||
      line.toLowerCase().includes('dhaka') ||
      line.toLowerCase().includes('linkedin') ||
      line.toLowerCase().includes('github') ||
      line.toLowerCase().includes('portfolio')
    ) {
      const parts = line.split(/[|•,\t]/).map((p) => p.trim()).filter(Boolean);
      parts.forEach((p) => {
        if (p.includes('@')) {
          result.contact.email = p.replace(/^email:\s*/i, '');
        } else if (p.includes('+') || /\d{10,}/.test(p)) {
          result.contact.phone = p.replace(/^phone:\s*/i, '');
        } else if (p.toLowerCase().includes('linkedin')) {
          result.contact.linkedin = p.replace(/^linkedin:\s*/i, '');
          result.contact.linkedinUrl = 'https://' + result.contact.linkedin.replace(/^https?:\/\//, '');
        } else if (p.toLowerCase().includes('portfolio') || p.includes('.vercel.app')) {
          result.contact.portfolio = p.replace(/^portfolio:\s*/i, '');
          result.contact.portfolioUrl = 'https://' + result.contact.portfolio.replace(/^https?:\/\//, '');
        } else if (p.toLowerCase().includes('github')) {
          result.contact.github = p.replace(/^github:\s*/i, '');
          result.contact.githubUrl = 'https://' + result.contact.github.replace(/^https?:\/\//, '');
        } else if (p.toLowerCase().includes('bangladesh') || p.toLowerCase().includes('dhaka')) {
          result.contact.location = p;
        }
      });
      continue;
    }

    // Section triggers
    if (upper.includes('SUMMARY') || upper.includes('ABOUT ME') || upper.includes('OBJECTIVE')) {
      currentSection = 'summary';
      result.summaryTitle = line;
      continue;
    } else if (upper.includes('TECHNICAL SKILLS') || upper.includes('SKILLS') || upper === 'SKILL') {
      currentSection = 'skills';
      result.skillsTitle = line;
      continue;
    } else if (upper.includes('PROJECT') || upper.includes('PROJECTS') || upper.includes('EXPERIENCE')) {
      currentSection = 'projects';
      result.projectsTitle = line;
      continue;
    } else if (upper.includes('EDUCATION')) {
      currentSection = 'education';
      result.educationTitle = line;
      continue;
    } else if (upper.includes('LANGUAGE') || upper.includes('LANGUAGES')) {
      currentSection = 'languages';
      result.languagesTitle = line;
      continue;
    }

    // Append into active section
    if (currentSection === 'summary') {
      summaryLines.push(line);
    } else if (currentSection === 'skills') {
      if (line.includes(':')) {
        const [cat, val] = line.split(':');
        result.skills.push({
          id: `sk-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          categoryName: cat.trim(),
          skillsText: val.trim(),
        });
      } else if (line.length > 2) {
        result.skills.push({
          id: `sk-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          categoryName: 'Core Skills',
          skillsText: line,
        });
      }
    } else if (currentSection === 'projects') {
      if (line.includes('http') || line.includes('.vercel.app')) {
        // Project with link (e.g. ArtHall: https://ArtHall-client.vercel.app)
        const parts = line.split(/[:\s]+https?:\/\//);
        const title = parts[0]?.replace(/^[-•*]\s*/, '').trim() || 'Project';
        const url = 'https://' + (parts[1] || '').trim();
        result.projects.push({
          id: `proj-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          title: title,
          subtitle: 'Full Stack Project',
          liveDemoLabel: 'Live Demo',
          liveDemoUrl: url,
          clientGithubLabel: 'Client GitHub',
          clientGithubUrl: 'https://github.com/khalid66527',
          serverGithubLabel: 'Server GitHub',
          serverGithubUrl: 'https://github.com/khalid66527',
          techStackLabel: 'Tech Stack:',
          techStackText: 'React, Node.js, Express.js, MongoDB',
          bullets: ['Interactive user interfaces and responsive web application components.'],
        });
      } else if (line.includes('—') || line.includes('-') || line.includes('Project')) {
        const titleParts = line.split(/[—|-]/);
        result.projects.push({
          id: `proj-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          title: titleParts[0]?.trim() || line,
          subtitle: titleParts[1]?.replace(/[|•].*$/, '')?.trim() || 'Web Application',
          liveDemoLabel: 'Live Demo',
          liveDemoUrl: 'https://demo.vercel.app',
          clientGithubLabel: 'Client GitHub',
          clientGithubUrl: 'https://github.com',
          serverGithubLabel: 'Server GitHub',
          serverGithubUrl: 'https://github.com',
          techStackLabel: 'Tech Stack:',
          techStackText: 'React, Node.js, Express.js, MongoDB',
          bullets: [],
        });
      } else if (line.startsWith('•') || line.startsWith('') || line.startsWith('-') || line.startsWith('*')) {
        const bullet = line.replace(/^[•\-*]\s*/, '');
        if (result.projects.length > 0) {
          result.projects[result.projects.length - 1].bullets.push(bullet);
        }
      }
    } else if (currentSection === 'education') {
      result.education.push({
        id: `edu-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        degree: line,
        institution: lines[i + 1] && !lines[i + 1].toUpperCase().includes('EDUCATION') ? lines[++i] : 'Institute',
        statusOrDate: 'Completed / Ongoing',
      });
    } else if (currentSection === 'languages') {
      result.languages = line;
    }
  }

  if (summaryLines.length > 0) {
    result.summary = summaryLines.join(' ');
  }

  if (result.skills.length === 0) {
    result.skills = JSON.parse(JSON.stringify(khalidResumeData.skills));
  }
  if (result.projects.length === 0) {
    result.projects = JSON.parse(JSON.stringify(khalidResumeData.projects));
  }
  if (result.education.length === 0) {
    result.education = JSON.parse(JSON.stringify(khalidResumeData.education));
  }

  return result;
}
