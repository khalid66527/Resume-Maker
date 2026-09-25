import { ResumeData } from '@/types/resume';

export const khalidResumeData: ResumeData = {
  fullName: 'MD. KHALID HASAN',
  title: 'FRONTEND & MERN STACK DEVELOPER',
  contact: {
    location: 'Dhaka, Bangladesh',
    phone: '+880 1568666527',
    email: 'khalidhasan678954321@gmail.com',
    portfolio: 'devkhalid-chi.vercel.app',
    portfolioUrl: 'https://devkhalid-chi.vercel.app',
    linkedin: 'linkedin.com/in/khalid2004',
    linkedinUrl: 'https://linkedin.com/in/khalid2004',
    github: 'github.com/khalid66527',
    githubUrl: 'https://github.com/khalid66527',
  },
  summaryTitle: 'PROFESSIONAL SUMMARY',
  summary:
    "I'm a Frontend & MERN Stack Developer with hands-on experience in React, Next.js, Node.js, Express.js and MongoDB. Passionate about building responsive, high-performance web applications and seamless RESTful API integrations. Adept at leveraging modern AI tools to boost development efficiency, optimize workflows, and deliver scalable solutions.",
  skillsTitle: 'TECHNICAL SKILLS',
  skills: [
    {
      id: 'sk-1',
      categoryName: 'Frontend Skills',
      skillsText: 'JavaScript (ES6+), React.js, Next.js, HTML5, CSS3, Tailwind CSS',
    },
    {
      id: 'sk-2',
      categoryName: 'Backend & Database',
      skillsText: 'Node.js, Express.js, MongoDB, REST APIs, JWT Authentication, Firebase, Batter Auth',
    },
    {
      id: 'sk-3',
      categoryName: 'Tools & Workflows',
      skillsText: 'Git, GitHub, VS Code, Vercel, Netlify, Antigravity IDE',
    },
    {
      id: 'sk-4',
      categoryName: 'Interpersonal Skills',
      skillsText: 'Teamwork, Problem-Solving',
    },
  ],
  projectsTitle: 'FEATURED PROJECTS & EXPERIENCE',
  projects: [
    {
      id: 'proj-1',
      title: 'ArtHall',
      subtitle: 'Full-Stack Artwork Gallery Platform',
      liveDemoUrl: 'https://arthall-demo.vercel.app',
      clientGithubUrl: 'https://github.com/khalid66527/arthall-client',
      serverGithubUrl: 'https://github.com/khalid66527/arthall-server',
      techStackText: 'React, Node.js, Express.js, MongoDB, Tailwind CSS, Vercel',
      bullets: [
        'Built an interactive full-stack art gallery platform allowing artists to manage and present creative collections.',
        'Implemented secure authentication with JWT and RBAC, enhancing user access management and security.',
        'Optimized frontend assets and state workflows, decreasing load time by 30% and delivering a fluid responsive UI.',
      ],
    },
    {
      id: 'proj-2',
      title: 'E-Commerce Website',
      subtitle: 'Modern Online Shopping Platform',
      liveDemoUrl: 'https://ecommerce-khalid.vercel.app',
      clientGithubUrl: 'https://github.com/khalid66527/ecommerce-client',
      serverGithubUrl: 'https://github.com/khalid66527/ecommerce-server',
      techStackText: 'React, Next.js, TypeScript, Express.js, MongoDB, Tailwind CSS',
      bullets: [
        'Developed a full-stack e-commerce platform featuring dynamic product listings, category-based filtering, and a seamless shopping cart experience for users.',
        'Implemented server-side rendering (SSR) with Next.js to enhance performance, faster page loading, and improved SEO visibility.',
        'Built scalable RESTful APIs to manage products, user authentication, cart operations, and order processing efficiently, ensuring smooth end-to-end shopping workflows.',
      ],
    },
    {
      id: 'proj-3',
      title: 'Modular Web Interfaces & Portfolio Projects',
      subtitle: '',
      liveDemoUrl: 'https://devkhalid-chi.vercel.app',
      clientGithubUrl: 'https://github.com/khalid66527',
      techStackText: 'JavaScript (ES6+), React, Next.js, Node.js, Express.js, MongoDB',
      bullets: [
        'Developed pixel-perfect, highly responsive frontend layouts focusing on cross-browser compatibility and clean code standards.',
        'Applied TypeScript strictly for type safety, reducing client-side runtime errors and enabling scalable UI components.',
      ],
    },
  ],
  educationTitle: 'EDUCATION',
  education: [
    {
      id: 'edu-1',
      degree: 'Diploma in Engineering — Computer Science & Technology (CST)',
      institution: 'Moulvibazar Polytechnic Institute',
      statusOrDate: 'Ongoing (8th Semester)',
    },
  ],
  languagesTitle: 'LANGUAGES & ADDITIONAL EXPERTISE',
  languages: 'English (Fluent), Bangla (Native)',
  additionalCompetencies: 'MS Office (Word, Excel, PowerPoint)',
  customSections: [],
  theme: {
    layoutStyle: 'classic',
    primaryColor: '#0056b3',
    fontFamily: 'Inter, sans-serif',
    fontSize: 'base',
    lineSpacing: 'normal',
  },
};

export const emptyResumeData: ResumeData = {
  fullName: 'YOUR NAME',
  title: 'PROFESSIONAL TITLE / ROLE',
  contact: {
    location: 'City, Country',
    phone: '+1 234 567 890',
    email: 'your.email@example.com',
    portfolio: 'yourportfolio.com',
    portfolioUrl: 'https://yourportfolio.com',
    linkedin: 'linkedin.com/in/username',
    linkedinUrl: 'https://linkedin.com/in/username',
    github: 'github.com/username',
    githubUrl: 'https://github.com/username',
  },
  summaryTitle: 'PROFESSIONAL SUMMARY',
  summary: 'Write a brief 2-3 sentence overview highlighting your core strengths, experience, and value...',
  skillsTitle: 'TECHNICAL SKILLS',
  skills: [
    {
      id: 'sk-1',
      categoryName: 'Technical Skills',
      skillsText: 'Skill 1, Skill 2, Skill 3, Skill 4',
    },
  ],
  projectsTitle: 'FEATURED PROJECTS & EXPERIENCE',
  projects: [
    {
      id: 'proj-1',
      title: 'Project Name',
      subtitle: 'Key Subtitle or Focus',
      liveDemoUrl: 'https://example.com',
      clientGithubUrl: 'https://github.com',
      techStackText: 'React, Node.js, Tailwind CSS',
      bullets: ['Key contribution or achievement in this project...'],
    },
  ],
  educationTitle: 'EDUCATION',
  education: [
    {
      id: 'edu-1',
      degree: 'Degree Name in Major',
      institution: 'University / Institute Name',
      statusOrDate: '2020 - 2024',
    },
  ],
  languagesTitle: 'LANGUAGES & ADDITIONAL EXPERTISE',
  languages: 'English (Fluent)',
  additionalCompetencies: 'Communication, Problem Solving',
  customSections: [],
  theme: {
    layoutStyle: 'classic',
    primaryColor: '#0056b3',
    fontFamily: 'Inter, sans-serif',
    fontSize: 'base',
    lineSpacing: 'normal',
  },
};
