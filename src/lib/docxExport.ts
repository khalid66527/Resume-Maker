import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
} from 'docx';
import { ResumeData } from '@/types/resume';

// Safe text cleaner: removes forbidden docx control characters/newlines
function clean(val: any): string {
  if (val === null || val === undefined) return '';
  return String(val).replace(/[\r\n\t]/g, ' ').trim();
}

export async function generateDocxBlob(data: ResumeData): Promise<Blob> {
  const contact = data.contact || {
    location: '',
    phone: '',
    email: '',
    portfolio: '',
    linkedin: '',
    github: '',
  };

  const skills = data.skills || [];
  const projects = data.projects || [];
  const education = data.education || [];
  const customSections = data.customSections || [];

  // Build Document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children: [
          // 1. FULL NAME
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: clean(data.fullName) || 'MD. KHALID HASAN',
                bold: true,
                size: 34,
                color: '111827',
              }),
            ],
            spacing: { after: 50 },
          }),

          // 2. TITLE
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: clean(data.title) || 'FRONTEND & MERN STACK DEVELOPER',
                bold: true,
                size: 21,
                color: '0056B3',
              }),
            ],
            spacing: { after: 90 },
          }),

          // 3. CONTACT INFO (Row 1)
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: clean(contact.location), size: 18, color: '334155' }),
              ...(contact.location && contact.phone ? [new TextRun({ text: ' | ', size: 18, color: '94A3B8' })] : []),
              new TextRun({ text: clean(contact.phone), size: 18, color: '334155' }),
              ...(contact.phone && contact.email ? [new TextRun({ text: ' | ', size: 18, color: '94A3B8' })] : []),
              new TextRun({ text: clean(contact.email), size: 18, color: '334155' }),
            ],
            spacing: { after: 40 },
          }),

          // CONTACT INFO (Row 2)
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              ...(contact.portfolio
                ? [
                    new TextRun({ text: `${clean(contact.portfolioLabel) || 'Portfolio:'} `, bold: true, size: 18 }),
                    new TextRun({ text: clean(contact.portfolio), color: '0056B3', size: 18 }),
                  ]
                : []),
              ...(contact.portfolio && contact.linkedin
                ? [new TextRun({ text: ' | ', size: 18, color: '94A3B8' })]
                : []),
              ...(contact.linkedin
                ? [
                    new TextRun({ text: `${clean(contact.linkedinLabel) || 'LinkedIn:'} `, bold: true, size: 18 }),
                    new TextRun({ text: clean(contact.linkedin), color: '0056B3', size: 18 }),
                  ]
                : []),
              ...(contact.github
                ? [
                    new TextRun({ text: ' | ', size: 18, color: '94A3B8' }),
                    new TextRun({ text: `${clean(contact.githubLabel) || 'GitHub:'} `, bold: true, size: 18 }),
                    new TextRun({ text: clean(contact.github), color: '0056B3', size: 18 }),
                  ]
                : []),
            ],
            spacing: { after: 160 },
          }),

          // 4. PROFESSIONAL SUMMARY
          new Paragraph({
            children: [
              new TextRun({
                text: clean(data.summaryTitle) || 'PROFESSIONAL SUMMARY',
                bold: true,
                size: 21,
                color: '0F172A',
              }),
            ],
            border: {
              bottom: {
                color: 'CBD5E1',
                space: 4,
                style: BorderStyle.SINGLE,
                size: 6,
              },
            },
            spacing: { before: 120, after: 60 },
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: clean(data.summary) || '',
                size: 19,
                color: '334155',
              }),
            ],
            spacing: { after: 140 },
          }),

          // 5. TECHNICAL SKILLS
          new Paragraph({
            children: [
              new TextRun({
                text: clean(data.skillsTitle) || 'TECHNICAL SKILLS',
                bold: true,
                size: 21,
                color: '0F172A',
              }),
            ],
            border: {
              bottom: {
                color: 'CBD5E1',
                space: 4,
                style: BorderStyle.SINGLE,
                size: 6,
              },
            },
            spacing: { before: 120, after: 60 },
          }),
          ...skills.map(
            (sk) =>
              new Paragraph({
                children: [
                  new TextRun({ text: `${clean(sk.categoryName)}: `, bold: true, size: 19, color: '0F172A' }),
                  new TextRun({ text: clean(sk.skillsText), size: 19, color: '334155' }),
                ],
                spacing: { after: 35 },
              })
          ),

          // 6. FEATURED PROJECTS & EXPERIENCE
          new Paragraph({
            children: [
              new TextRun({
                text: clean(data.projectsTitle) || 'FEATURED PROJECTS & EXPERIENCE',
                bold: true,
                size: 21,
                color: '0F172A',
              }),
            ],
            border: {
              bottom: {
                color: 'CBD5E1',
                space: 4,
                style: BorderStyle.SINGLE,
                size: 6,
              },
            },
            spacing: { before: 140, after: 60 },
          }),
          ...projects.flatMap((proj) => {
            const linkRuns: TextRun[] = [];
            if (proj.liveDemoLabel) {
              linkRuns.push(new TextRun({ text: `• ${clean(proj.liveDemoLabel)}`, color: '0056B3', size: 17 }));
            }
            if (proj.clientGithubLabel) {
              if (linkRuns.length > 0) linkRuns.push(new TextRun({ text: ' | ', size: 17, color: '94A3B8' }));
              linkRuns.push(new TextRun({ text: clean(proj.clientGithubLabel), color: '0056B3', size: 17 }));
            }
            if (proj.serverGithubLabel) {
              if (linkRuns.length > 0) linkRuns.push(new TextRun({ text: ' | ', size: 17, color: '94A3B8' }));
              linkRuns.push(new TextRun({ text: clean(proj.serverGithubLabel), color: '0056B3', size: 17 }));
            }

            return [
              new Paragraph({
                children: [
                  new TextRun({ text: clean(proj.title) || 'Project', bold: true, size: 20, color: '0F172A' }),
                  ...(proj.subtitle
                    ? [new TextRun({ text: ` — ${clean(proj.subtitle)}`, bold: true, size: 19, color: '1E293B' })]
                    : []),
                  ...(linkRuns.length > 0
                    ? [new TextRun({ text: '  ', size: 17 }), ...linkRuns]
                    : []),
                ],
                spacing: { before: 90, after: 25 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${clean(proj.techStackLabel) || 'Tech Stack:'} `,
                    bold: true,
                    italics: true,
                    size: 18,
                    color: '1E293B',
                  }),
                  new TextRun({
                    text: clean(proj.techStackText),
                    italics: true,
                    size: 18,
                    color: '475569',
                  }),
                ],
                spacing: { after: 35 },
              }),
              ...(proj.bullets || []).map(
                (b) =>
                  new Paragraph({
                    bullet: { level: 0 },
                    children: [new TextRun({ text: clean(b), size: 18, color: '334155' })],
                    spacing: { after: 25 },
                  })
              ),
            ];
          }),

          // 7. EDUCATION
          new Paragraph({
            children: [
              new TextRun({
                text: clean(data.educationTitle) || 'EDUCATION',
                bold: true,
                size: 21,
                color: '0F172A',
              }),
            ],
            border: {
              bottom: {
                color: 'CBD5E1',
                space: 4,
                style: BorderStyle.SINGLE,
                size: 6,
              },
            },
            spacing: { before: 140, after: 60 },
          }),
          ...education.map(
            (edu) =>
              new Paragraph({
                children: [
                  new TextRun({ text: clean(edu.degree), bold: true, size: 19, color: '0F172A' }),
                  new TextRun({
                    text: `\n${clean(edu.institution)}${edu.statusOrDate ? ` | ${clean(edu.statusOrDate)}` : ''}`,
                    break: 1,
                    size: 18,
                    color: '475569',
                  }),
                ],
                spacing: { after: 50 },
              })
          ),

          // 8. LANGUAGES & ADDITIONAL EXPERTISE
          new Paragraph({
            children: [
              new TextRun({
                text: clean(data.languagesTitle) || 'LANGUAGES & ADDITIONAL EXPERTISE',
                bold: true,
                size: 21,
                color: '0F172A',
              }),
            ],
            border: {
              bottom: {
                color: 'CBD5E1',
                space: 4,
                style: BorderStyle.SINGLE,
                size: 6,
              },
            },
            spacing: { before: 140, after: 60 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${clean(data.languagesLabel) || 'Languages:'} `,
                bold: true,
                size: 19,
                color: '0F172A',
              }),
              new TextRun({
                text: clean(data.languages) || 'English (Fluent), Bangla (Native)',
                size: 19,
                color: '334155',
              }),
            ],
            spacing: { after: 35 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${clean(data.additionalCompetenciesLabel) || 'Additional Competencies:'} `,
                bold: true,
                size: 19,
                color: '0F172A',
              }),
              new TextRun({
                text: clean(data.additionalCompetencies) || 'MS Office (Word, Excel, PowerPoint)',
                size: 19,
                color: '334155',
              }),
            ],
            spacing: { after: 90 },
          }),

          // 9. CUSTOM SECTIONS
          ...customSections.flatMap((sec) => [
            new Paragraph({
              children: [
                new TextRun({
                  text: clean(sec.sectionTitle) || 'SECTION',
                  bold: true,
                  size: 21,
                  color: '0F172A',
                }),
              ],
              border: {
                bottom: {
                  color: 'CBD5E1',
                  space: 4,
                  style: BorderStyle.SINGLE,
                  size: 6,
                },
              },
              spacing: { before: 140, after: 60 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: clean(sec.content),
                  size: 19,
                  color: '334155',
                }),
              ],
              spacing: { after: 90 },
            }),
          ]),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}
