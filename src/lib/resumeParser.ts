import { ResumeData } from '@/types/resume';
import { khalidResumeData } from './khalidResumeData';

export function parseRawResumeText(rawText: string): ResumeData {
  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return khalidResumeData;

  const result: ResumeData = {
    ...khalidResumeData,
    fullName: lines[0] || 'YOUR NAME',
    title: lines[1] || 'PROFESSIONAL TITLE',
    summary: '',
    skills: [],
    projects: [],
    education: [],
    languages: 'English (Fluent), Bangla (Native)',
    additionalCompetencies: '',
  };

  let currentSection = '';
  let summaryLines: string[] = [];

  for (let i = 2; i < lines.length; i++) {
    const line = lines[i];
    const upper = line.toUpperCase();

    // Check contact info line
    if (line.includes('@') || line.includes('+880') || line.includes('phone') || line.includes('Dhaka') || line.includes('linkedin.com')) {
      const parts = line.split(/[|•]/).map((p) => p.trim());
      parts.forEach((p) => {
        if (p.includes('@')) result.contact.email = p;
        else if (p.includes('+') || /\d{10,}/.test(p)) result.contact.phone = p;
        else if (p.toLowerCase().includes('linkedin')) {
          result.contact.linkedin = p.replace(/^linkedin:\s*/i, '');
          result.contact.linkedinUrl = 'https://' + result.contact.linkedin.replace(/^https?:\/\//, '');
        } else if (p.toLowerCase().includes('portfolio') || p.includes('.vercel.app')) {
          result.contact.portfolio = p.replace(/^portfolio:\s*/i, '');
          result.contact.portfolioUrl = 'https://' + result.contact.portfolio.replace(/^https?:\/\//, '');
        } else if (p.toLowerCase().includes('github')) {
          result.contact.github = p.replace(/^github:\s*/i, '');
          result.contact.githubUrl = 'https://' + result.contact.github.replace(/^https?:\/\//, '');
        } else {
          result.contact.location = p;
        }
      });
      continue;
    }

    if (upper.includes('SUMMARY') || upper.includes('PROFESSIONAL SUMMARY') || upper.includes('OBJECTIVE')) {
      currentSection = 'summary';
      continue;
    } else if (upper.includes('TECHNICAL SKILLS') || upper.includes('SKILLS')) {
      currentSection = 'skills';
      continue;
    } else if (upper.includes('PROJECTS') || upper.includes('EXPERIENCE')) {
      currentSection = 'projects';
      continue;
    } else if (upper.includes('EDUCATION')) {
      currentSection = 'education';
      continue;
    } else if (upper.includes('LANGUAGES')) {
      currentSection = 'languages';
      continue;
    }

    // Append to current section
    if (currentSection === 'summary') {
      summaryLines.push(line);
    } else if (currentSection === 'skills') {
      if (line.includes(':')) {
        const [cat, val] = line.split(':');
        result.skills.push({
          id: `sk-${Date.now()}-${Math.random()}`,
          categoryName: cat.trim(),
          skillsText: val.trim(),
        });
      }
    } else if (currentSection === 'projects') {
      if (line.includes('—') || line.includes('-') || line.includes('Project') || line.includes('Platform')) {
        const titleParts = line.split(/[—|-]/);
        result.projects.push({
          id: `proj-${Date.now()}-${Math.random()}`,
          title: titleParts[0]?.trim() || line,
          subtitle: titleParts[1]?.replace(/[|•].*$/, '')?.trim() || '',
          techStackText: 'React, Node.js, Express.js, MongoDB',
          bullets: [],
        });
      } else if (line.startsWith('•') || line.startsWith('') || line.startsWith('-') || line.startsWith('*')) {
        const bullet = line.replace(/^[•\-*]\s*/, '');
        if (result.projects.length > 0) {
          result.projects[result.projects.length - 1].bullets.push(bullet);
        }
      } else if (line.toLowerCase().startsWith('tech stack')) {
        if (result.projects.length > 0) {
          result.projects[result.projects.length - 1].techStackText = line.replace(/^tech stack:?\s*/i, '');
        }
      }
    } else if (currentSection === 'education') {
      result.education.push({
        id: `edu-${Date.now()}`,
        degree: line,
        institution: lines[i + 1] ? lines[++i] : '',
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
    result.skills = khalidResumeData.skills;
  }
  if (result.projects.length === 0) {
    result.projects = khalidResumeData.projects;
  }

  return result;
}
