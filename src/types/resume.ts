export interface ContactInfo {
  location: string;
  phone: string;
  email: string;
  portfolioLabel?: string; // e.g. "Portfolio:"
  portfolio: string;
  portfolioUrl?: string;
  linkedinLabel?: string; // e.g. "LinkedIn:"
  linkedin: string;
  linkedinUrl?: string;
  githubLabel?: string; // e.g. "GitHub:"
  github?: string;
  githubUrl?: string;
}

export interface SkillCategory {
  id: string;
  categoryName: string;
  skillsText: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle?: string;
  liveDemoLabel?: string;
  liveDemoUrl?: string;
  clientGithubLabel?: string;
  clientGithubUrl?: string;
  serverGithubLabel?: string;
  serverGithubUrl?: string;
  techStackLabel?: string; // e.g. "Tech Stack:"
  techStackText: string;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  statusOrDate: string;
}

export interface CustomSection {
  id: string;
  sectionTitle: string;
  content: string;
  bullets?: string[];
}

export interface ResumeData {
  fullName: string;
  title: string;
  contact: ContactInfo;
  summaryTitle?: string;
  summary: string;
  skillsTitle?: string;
  skills: SkillCategory[];
  projectsTitle?: string;
  projects: ProjectItem[];
  educationTitle?: string;
  education: EducationItem[];
  languagesTitle?: string;
  languagesLabel?: string; // e.g. "Languages:"
  languages: string;
  additionalCompetenciesLabel?: string; // e.g. "Additional Competencies:"
  additionalCompetencies: string;
  customSections: CustomSection[];
  theme: {
    layoutStyle: 'classic' | 'modern' | 'executive' | 'minimal' | 'developer';
    primaryColor: string;
    fontFamily: string;
    fontSize: 'sm' | 'base' | 'lg';
    lineSpacing: 'tight' | 'normal' | 'relaxed';
  };
}
