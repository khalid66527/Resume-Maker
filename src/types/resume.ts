export interface ContactInfo {
  location: string;
  phone: string;
  email: string;
  portfolio: string;
  portfolioUrl?: string;
  linkedin: string;
  linkedinUrl?: string;
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
  liveDemoUrl?: string;
  clientGithubUrl?: string;
  serverGithubUrl?: string;
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
  languages: string;
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
