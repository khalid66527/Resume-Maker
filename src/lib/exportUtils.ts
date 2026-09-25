import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ResumeData } from '@/types/resume';
import { generateDocxBlob } from './docxExport';

// 1. Export as Microsoft Word (.docx)
export async function exportToDocx(data: ResumeData, filename?: string) {
  const blob = await generateDocxBlob(data);
  const name = filename || `${data.fullName.replace(/[^a-zA-Z0-9]/g, '_')}_Resume.docx`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// 2. Export as PDF (.pdf)
export async function exportToPdf(elementId: string, filename?: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }

    pdf.save(filename || 'Resume.pdf');
  } catch (err) {
    console.error('PDF generation error, fallback to print:', err);
    window.print();
  }
}

// 3. Export as Plain Text (.txt)
export function exportToTxt(data: ResumeData, filename?: string) {
  let txt = `${data.fullName.toUpperCase()}\n`;
  txt += `${data.title}\n`;
  txt += `${data.contact.location} | ${data.contact.phone} | ${data.contact.email}\n`;
  txt += `Portfolio: ${data.contact.portfolio} | LinkedIn: ${data.contact.linkedin}\n\n`;

  txt += `${data.summaryTitle || 'PROFESSIONAL SUMMARY'}\n`;
  txt += `${data.summary}\n\n`;

  txt += `${data.skillsTitle || 'TECHNICAL SKILLS'}\n`;
  data.skills.forEach((sk) => {
    txt += `${sk.categoryName}: ${sk.skillsText}\n`;
  });
  txt += `\n`;

  txt += `${data.projectsTitle || 'FEATURED PROJECTS & EXPERIENCE'}\n`;
  data.projects.forEach((p) => {
    txt += `${p.title} ${p.subtitle ? `— ${p.subtitle}` : ''}\n`;
    txt += `Tech Stack: ${p.techStackText}\n`;
    p.bullets.forEach((b) => {
      txt += `• ${b}\n`;
    });
    txt += `\n`;
  });

  txt += `${data.educationTitle || 'EDUCATION'}\n`;
  data.education.forEach((edu) => {
    txt += `${edu.degree}\n${edu.institution} | ${edu.statusOrDate}\n\n`;
  });

  txt += `${data.languagesTitle || 'LANGUAGES & ADDITIONAL EXPERTISE'}\n`;
  txt += `Languages: ${data.languages}\n`;
  txt += `Additional Competencies: ${data.additionalCompetencies}\n\n`;

  if (data.customSections && data.customSections.length > 0) {
    data.customSections.forEach((sec) => {
      txt += `${sec.sectionTitle}\n`;
      txt += `${sec.content}\n\n`;
    });
  }

  const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `${data.fullName.replace(/[^a-zA-Z0-9]/g, '_')}_Resume.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// 4. Export as HTML (.html)
export function exportToHtml(elementId: string, data: ResumeData, filename?: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${data.fullName} - Resume</title>
  <style>
    body { font-family: Inter, Arial, sans-serif; background: #f8fafc; padding: 30px; margin: 0; color: #1e293b; }
    .page { max-width: 800px; margin: 0 auto; background: #fff; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border-radius: 8px; }
    h1 { font-size: 26px; text-align: center; margin-bottom: 4px; }
    h2 { font-size: 14px; text-transform: uppercase; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 4px; margin-top: 24px; color: #0f172a; }
    p, li { font-size: 13px; line-height: 1.6; }
    a { color: #0056b3; text-decoration: none; }
  </style>
</head>
<body>
  <div class="page">
    ${element.innerHTML}
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `${data.fullName.replace(/[^a-zA-Z0-9]/g, '_')}_Resume.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
