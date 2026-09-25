import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
} from 'docx';
import { ResumeData } from '@/types/resume';

export async function generateDocxBlob(data: ResumeData): Promise<Blob> {
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
                text: data.fullName,
                bold: true,
                size: 36,
                color: '111827',
              }),
            ],
            spacing: { after: 60 },
          }),

          // 2. TITLE
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: data.title,
                bold: true,
                size: 22,
                color: '0056B3',
              }),
            ],
            spacing: { after: 120 },
          }),

          // 3. CONTACT INFO
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: `${data.contact.location} | `, size: 18 }),
              new TextRun({ text: `${data.contact.phone} | `, size: 18 }),
              new TextRun({ text: `${data.contact.email}`, size: 18 }),
            ],
            spacing: { after: 40 },
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: `Portfolio: ${data.contact.portfolio} | `, size: 18, color: '0056B3' }),
              new TextRun({ text: `LinkedIn: ${data.contact.linkedin}`, size: 18, color: '0056B3' }),
            ],
            spacing: { after: 200 },
          }),

          // 4. PROFESSIONAL SUMMARY
          new Paragraph({
            children: [
              new TextRun({
                text: data.summaryTitle || 'PROFESSIONAL SUMMARY',
                bold: true,
                size: 22,
                color: '000000',
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
            spacing: { before: 120, after: 80 },
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: data.summary,
                size: 19,
                color: '334155',
              }),
            ],
            spacing: { after: 180 },
          }),

          // 5. TECHNICAL SKILLS
          new Paragraph({
            children: [
              new TextRun({
                text: data.skillsTitle || 'TECHNICAL SKILLS',
                bold: true,
                size: 22,
                color: '000000',
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
            spacing: { before: 120, after: 80 },
          }),
          ...data.skills.map(
            (sk) =>
              new Paragraph({
                children: [
                  new TextRun({ text: `${sk.categoryName}: `, bold: true, size: 19 }),
                  new TextRun({ text: sk.skillsText, size: 19, color: '334155' }),
                ],
                spacing: { after: 40 },
              })
          ),

          // 6. FEATURED PROJECTS & EXPERIENCE
          new Paragraph({
            children: [
              new TextRun({
                text: data.projectsTitle || 'FEATURED PROJECTS & EXPERIENCE',
                bold: true,
                size: 22,
                color: '000000',
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
            spacing: { before: 180, after: 80 },
          }),
          ...data.projects.flatMap((proj) => [
            new Paragraph({
              children: [
                new TextRun({ text: proj.title, bold: true, size: 20 }),
                proj.subtitle ? new TextRun({ text: ` — ${proj.subtitle}`, bold: true, size: 19 }) : new TextRun({ text: '' }),
                new TextRun({ text: ' | • Live Demo | GitHub', color: '0056B3', size: 17 }),
              ],
              spacing: { before: 100, after: 30 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Tech Stack: ', bold: true, italics: true, size: 18 }),
                new TextRun({ text: proj.techStackText, italics: true, size: 18, color: '475569' }),
              ],
              spacing: { after: 40 },
            }),
            ...proj.bullets.map(
              (b) =>
                new Paragraph({
                  bullet: { level: 0 },
                  children: [new TextRun({ text: b, size: 18, color: '334155' })],
                  spacing: { after: 30 },
                })
            ),
          ]),

          // 7. EDUCATION
          new Paragraph({
            children: [
              new TextRun({
                text: data.educationTitle || 'EDUCATION',
                bold: true,
                size: 22,
                color: '000000',
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
            spacing: { before: 180, after: 80 },
          }),
          ...data.education.map(
            (edu) =>
              new Paragraph({
                children: [
                  new TextRun({ text: `${edu.degree}\n`, bold: true, size: 19 }),
                  new TextRun({ text: `${edu.institution} | ${edu.statusOrDate}`, size: 18, color: '475569' }),
                ],
                spacing: { after: 60 },
              })
          ),

          // 8. LANGUAGES & ADDITIONAL EXPERTISE
          new Paragraph({
            children: [
              new TextRun({
                text: data.languagesTitle || 'LANGUAGES & ADDITIONAL EXPERTISE',
                bold: true,
                size: 22,
                color: '000000',
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
            spacing: { before: 180, after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Languages: ', bold: true, size: 19 }),
              new TextRun({ text: data.languages, size: 19, color: '334155' }),
            ],
            spacing: { after: 40 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Additional Competencies: ', bold: true, size: 19 }),
              new TextRun({ text: data.additionalCompetencies, size: 19, color: '334155' }),
            ],
            spacing: { after: 100 },
          }),

          // 9. CUSTOM SECTIONS
          ...(data.customSections || []).flatMap((sec) => [
            new Paragraph({
              children: [
                new TextRun({
                  text: sec.sectionTitle,
                  bold: true,
                  size: 22,
                  color: '000000',
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
              spacing: { before: 180, after: 80 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: sec.content,
                  size: 19,
                  color: '334155',
                }),
              ],
              spacing: { after: 100 },
            }),
          ]),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}
