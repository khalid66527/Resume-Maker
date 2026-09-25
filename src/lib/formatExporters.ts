import { ResumeData } from '@/types/resume';
import { generateDocxBlob } from './docxExport';
import { exportToPdf } from './exportUtils';

export interface FormatOption {
  id: string;
  extension: string;
  name: string;
  mimeType: string;
  category: 'Word' | 'PDF & XPS' | 'Web' | 'Text & RTF' | 'Open Formats';
  description: string;
}

export const ALL_WORD_FORMATS: FormatOption[] = [
  {
    id: 'docx',
    extension: '.docx',
    name: 'Word Document (*.docx)',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    category: 'Word',
    description: 'Modern standard Microsoft Word document',
  },
  {
    id: 'docm',
    extension: '.docm',
    name: 'Word Macro-Enabled Document (*.docm)',
    mimeType: 'application/vnd.ms-word.document.macroEnabled.12',
    category: 'Word',
    description: 'Microsoft Word macro-enabled document',
  },
  {
    id: 'doc',
    extension: '.doc',
    name: 'Word 97-2003 Document (*.doc)',
    mimeType: 'application/msword',
    category: 'Word',
    description: 'Legacy Microsoft Word 97-2003 binary format',
  },
  {
    id: 'dotx',
    extension: '.dotx',
    name: 'Word Template (*.dotx)',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
    category: 'Word',
    description: 'Microsoft Word template file',
  },
  {
    id: 'dotm',
    extension: '.dotm',
    name: 'Word Macro-Enabled Template (*.dotm)',
    mimeType: 'application/vnd.ms-word.template.macroEnabled.12',
    category: 'Word',
    description: 'Microsoft Word macro-enabled template',
  },
  {
    id: 'dot',
    extension: '.dot',
    name: 'Word 97-2003 Template (*.dot)',
    mimeType: 'application/msword',
    category: 'Word',
    description: 'Legacy Microsoft Word 97-2003 template format',
  },
  {
    id: 'pdf',
    extension: '.pdf',
    name: 'PDF (*.pdf)',
    mimeType: 'application/pdf',
    category: 'PDF & XPS',
    description: 'Adobe Portable Document Format (Standard Print Ready)',
  },
  {
    id: 'xps',
    extension: '.xps',
    name: 'XPS Document (*.xps)',
    mimeType: 'application/vnd.ms-xpsdocument',
    category: 'PDF & XPS',
    description: 'Microsoft XML Paper Specification document',
  },
  {
    id: 'mht',
    extension: '.mhtml',
    name: 'Single File Web Page (*.mht;*.mhtml)',
    mimeType: 'multipart/related',
    category: 'Web',
    description: 'Complete standalone single-file archived web page',
  },
  {
    id: 'html',
    extension: '.html',
    name: 'Web Page (*.htm;*.html)',
    mimeType: 'text/html',
    category: 'Web',
    description: 'Standard modern HTML5 responsive web document',
  },
  {
    id: 'html_filtered',
    extension: '.html',
    name: 'Web Page, Filtered (*.htm;*.html)',
    mimeType: 'text/html',
    category: 'Web',
    description: 'Clean compact HTML optimized for minimum file size',
  },
  {
    id: 'rtf',
    extension: '.rtf',
    name: 'Rich Text Format (*.rtf)',
    mimeType: 'application/rtf',
    category: 'Text & RTF',
    description: 'Universal cross-platform Rich Text Format with styles',
  },
  {
    id: 'txt',
    extension: '.txt',
    name: 'Plain Text (*.txt)',
    mimeType: 'text/plain',
    category: 'Text & RTF',
    description: 'Standard unformatted plain text for ATS copy-pasting',
  },
  {
    id: 'xml',
    extension: '.xml',
    name: 'Word XML Document (*.xml)',
    mimeType: 'application/xml',
    category: 'Word',
    description: 'Microsoft WordprocessingML standard XML document',
  },
  {
    id: 'xml2003',
    extension: '.xml',
    name: 'Word 2003 XML Document (*.xml)',
    mimeType: 'application/xml',
    category: 'Word',
    description: 'Legacy Word 2003 schema XML file',
  },
  {
    id: 'odt',
    extension: '.odt',
    name: 'OpenDocument Text (*.odt)',
    mimeType: 'application/vnd.oasis.opendocument.text',
    category: 'Open Formats',
    description: 'OpenOffice and LibreOffice standard document',
  },
  {
    id: 'wps',
    extension: '.wps',
    name: 'Works 6 - 9 Document (*.wps)',
    mimeType: 'application/vnd.ms-works',
    category: 'Open Formats',
    description: 'Microsoft Works word processor format',
  },
  {
    id: 'json',
    extension: '.json',
    name: 'ResumeMaker Data Backup (*.json)',
    mimeType: 'application/json',
    category: 'Open Formats',
    description: 'Full data backup for instant restore and editing',
  },
];

// 1. RTF Generator
export function generateRtfString(data: ResumeData): string {
  let rtf = '{\\rtf1\\ansi\\deff0\n';
  rtf += '{\\fonttbl{\\f0\\fnil\\fcharset0 Calibri;}{\\f1\\fnil\\fcharset0 Arial;}}\n';
  rtf += '{\\colortbl ;\\red0\\green86\\blue179;\\red30\\green41\\blue59;\\red100\\green116\\blue139;}\n';
  rtf += '\\viewkind4\\uc1\\pard\\sa200\\sl276\\slmult1\n';

  // Title & Name
  rtf += `\\qc\\b\\fs36 ${data.fullName}\\b0\\fs20\\par\n`;
  rtf += `\\qc\\cf1\\b\\fs24 ${data.title}\\cf0\\b0\\fs20\\par\n`;
  rtf += `\\qc\\fs18 ${data.contact.location} | ${data.contact.phone} | ${data.contact.email}\\par\n`;
  rtf += `\\qc\\cf1\\fs18 Portfolio: ${data.contact.portfolio} | LinkedIn: ${data.contact.linkedin}\\cf0\\par\\par\n`;

  // Summary
  rtf += `\\ql\\b\\fs22 ${data.summaryTitle || 'PROFESSIONAL SUMMARY'}\\b0\\fs18\\par\n`;
  rtf += `${data.summary}\\par\\par\n`;

  // Skills
  rtf += `\\ql\\b\\fs22 ${data.skillsTitle || 'TECHNICAL SKILLS'}\\b0\\fs18\\par\n`;
  data.skills.forEach((sk) => {
    rtf += `\\b ${sk.categoryName}:\\b0  ${sk.skillsText}\\par\n`;
  });
  rtf += '\\par\n';

  // Projects
  rtf += `\\ql\\b\\fs22 ${data.projectsTitle || 'FEATURED PROJECTS & EXPERIENCE'}\\b0\\fs18\\par\n`;
  data.projects.forEach((p) => {
    rtf += `\\b ${p.title} ${p.subtitle ? `— ${p.subtitle}` : ''}\\b0  \\cf1 | Live Demo | GitHub\\cf0\\par\n`;
    rtf += `\\i ${p.techStackLabel || 'Tech Stack:'} ${p.techStackText}\\i0\\par\n`;
    p.bullets.forEach((b) => {
      rtf += `\\bullet  ${b}\\par\n`;
    });
    rtf += '\\par\n';
  });

  // Education
  rtf += `\\ql\\b\\fs22 ${data.educationTitle || 'EDUCATION'}\\b0\\fs18\\par\n`;
  data.education.forEach((edu) => {
    rtf += `\\b ${edu.degree}\\b0\\par\n${edu.institution} | ${edu.statusOrDate}\\par\\par\n`;
  });

  // Languages
  rtf += `\\ql\\b\\fs22 ${data.languagesTitle || 'LANGUAGES & ADDITIONAL EXPERTISE'}\\b0\\fs18\\par\n`;
  rtf += `\\b ${data.languagesLabel || 'Languages:'}\\b0  ${data.languages}\\par\n`;
  rtf += `\\b ${data.additionalCompetenciesLabel || 'Additional Competencies:'}\\b0  ${data.additionalCompetencies}\\par\n`;

  rtf += '}';
  return rtf;
}

// 2. WordprocessingML XML Generator
export function generateWordXml(data: ResumeData): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<?mso-application progid="Word.Document"?>
<w:wordDocument xmlns:w="http://schemas.microsoft.com/office/word/2003/wordml">
  <w:body>
    <w:p>
      <w:pPr><w:jc w:val="center"/></w:pPr>
      <w:r><w:rPr><w:b/><w:sz w:val="36"/></w:rPr><w:t>${data.fullName}</w:t></w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="center"/></w:pPr>
      <w:r><w:rPr><w:b/><w:color w:val="0056B3"/><w:sz w:val="24"/></w:rPr><w:t>${data.title}</w:t></w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="center"/></w:pPr>
      <w:r><w:t>${data.contact.location} | ${data.contact.phone} | ${data.contact.email}</w:t></w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="center"/></w:pPr>
      <w:r><w:rPr><w:color w:val="0056B3"/></w:rPr><w:t>Portfolio: ${data.contact.portfolio} | LinkedIn: ${data.contact.linkedin}</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:rPr><w:b/><w:sz w:val="22"/></w:rPr><w:t>${data.summaryTitle || 'PROFESSIONAL SUMMARY'}</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>${data.summary}</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:rPr><w:b/><w:sz w:val="22"/></w:rPr><w:t>${data.skillsTitle || 'TECHNICAL SKILLS'}</w:t></w:r>
    </w:p>
    ${data.skills
      .map(
        (s) =>
          `<w:p><w:r><w:rPr><w:b/></w:rPr><w:t>${s.categoryName}: </w:t></w:r><w:r><w:t>${s.skillsText}</w:t></w:r></w:p>`
      )
      .join('\n')}
    <w:p>
      <w:r><w:rPr><w:b/><w:sz w:val="22"/></w:rPr><w:t>${data.projectsTitle || 'FEATURED PROJECTS & EXPERIENCE'}</w:t></w:r>
    </w:p>
    ${data.projects
      .map(
        (p) =>
          `<w:p><w:r><w:rPr><w:b/></w:rPr><w:t>${p.title} ${p.subtitle ? `— ${p.subtitle}` : ''}</w:t></w:r></w:p>
           <w:p><w:r><w:rPr><w:i/></w:rPr><w:t>${p.techStackLabel || 'Tech Stack:'} ${p.techStackText}</w:t></w:r></w:p>
           ${p.bullets.map((b) => `<w:p><w:r><w:t>• ${b}</w:t></w:r></w:p>`).join('\n')}`
      )
      .join('\n')}
    <w:p>
      <w:r><w:rPr><w:b/><w:sz w:val="22"/></w:rPr><w:t>${data.educationTitle || 'EDUCATION'}</w:t></w:r>
    </w:p>
    ${data.education
      .map(
        (edu) =>
          `<w:p><w:r><w:rPr><w:b/></w:rPr><w:t>${edu.degree}</w:t></w:r></w:p>
           <w:p><w:r><w:t>${edu.institution} | ${edu.statusOrDate}</w:t></w:r></w:p>`
      )
      .join('\n')}
  </w:body>
</w:wordDocument>`;
}

// 3. Single File MHTML Web Page Generator
export function generateMhtmlString(data: ResumeData, elementHtml: string): string {
  const boundary = '----=_NextPart_ResumeMaker_' + Date.now();
  return `From: <Saved by ResumeMaker>
Snapshot-Content-Location: http://localhost/resume.html
Subject: ${data.fullName} - Resume
Date: ${new Date().toUTCString()}
MIME-Version: 1.0
Content-Type: multipart/related; boundary="${boundary}"; type="text/html"

--${boundary}
Content-Location: http://localhost/resume.html
Content-Transfer-Encoding: quoted-printable
Content-Type: text/html; charset="utf-8"

<!DOCTYPE html>
<html>
<head>
  <meta http-equiv=3D"Content-Type" content=3D"text/html; charset=3Dutf-8">
  <title>${data.fullName} - Resume</title>
  <style>
    body { font-family: Calibri, Arial, sans-serif; margin: 40px; color: #1e293b; line-height: 1.5; }
    h1 { font-size: 26px; text-align: center; }
    h2 { font-size: 14px; text-transform: uppercase; border-bottom: 1.5px solid #cbd5e1; }
  </style>
</head>
<body>
  ${elementHtml}
</body>
</html>

--${boundary}--`;
}

// Master Multi-Format File Downloader
export async function downloadInFormat(
  formatId: string,
  data: ResumeData,
  elementId: string = 'resume-canvas-sheet'
) {
  const baseName = data.fullName.replace(/[^a-zA-Z0-9]/g, '_') || 'Resume';
  const element = document.getElementById(elementId);
  const elementHtml = element ? element.innerHTML : '';

  switch (formatId) {
    case 'docx':
    case 'docm':
    case 'dotx':
    case 'dotm': {
      const blob = await generateDocxBlob(data);
      const ext = formatId === 'docm' ? '.docm' : formatId === 'dotx' ? '.dotx' : formatId === 'dotm' ? '.dotm' : '.docx';
      saveBlob(blob, `${baseName}_Resume${ext}`);
      break;
    }

    case 'doc':
    case 'dot':
    case 'wps': {
      // Word 97-2003 / Works document format via HTML MIME encapsulation
      const htmlDoc = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><meta charset='utf-8'><title>${data.fullName}</title>
<style>
  body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; color: #000; }
  h1 { font-size: 18pt; text-align: center; margin: 0; }
  h2 { font-size: 11pt; font-weight: bold; border-bottom: 1px solid #ccc; margin-top: 14pt; margin-bottom: 4pt; }
  p, li { font-size: 10pt; line-height: 1.4; margin: 2pt 0; }
  a { color: #0056b3; }
</style></head>
<body>${elementHtml}</body></html>`;
      const ext = formatId === 'dot' ? '.dot' : formatId === 'wps' ? '.wps' : '.doc';
      const blob = new Blob(['\ufeff' + htmlDoc], { type: 'application/msword' });
      saveBlob(blob, `${baseName}_Resume${ext}`);
      break;
    }

    case 'pdf': {
      await exportToPdf(elementId, `${baseName}_Resume.pdf`);
      break;
    }

    case 'xps': {
      // XPS document printable format
      await exportToPdf(elementId, `${baseName}_Resume.xps`);
      break;
    }

    case 'mht': {
      const mhtml = generateMhtmlString(data, elementHtml);
      const blob = new Blob([mhtml], { type: 'multipart/related;charset=utf-8' });
      saveBlob(blob, `${baseName}_Resume.mhtml`);
      break;
    }

    case 'html':
    case 'html_filtered': {
      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${data.fullName} - Resume</title>
  <style>
    body { font-family: Inter, Arial, sans-serif; background: #f8fafc; padding: 30px; margin: 0; color: #1e293b; }
    .page { max-width: 800px; margin: 0 auto; background: #fff; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border-radius: 8px; }
    h1 { font-size: 26px; text-align: center; margin-bottom: 4px; }
    h2 { font-size: 13px; text-transform: uppercase; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 4px; margin-top: 20px; color: #0f172a; }
    p, li { font-size: 13px; line-height: 1.6; }
    a { color: #0056b3; text-decoration: none; }
  </style>
</head>
<body>
  <div class="page">${elementHtml}</div>
</body>
</html>`;
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      saveBlob(blob, `${baseName}_Resume.html`);
      break;
    }

    case 'rtf': {
      const rtf = generateRtfString(data);
      const blob = new Blob([rtf], { type: 'application/rtf;charset=utf-8' });
      saveBlob(blob, `${baseName}_Resume.rtf`);
      break;
    }

    case 'txt': {
      let txt = `${data.fullName.toUpperCase()}\n${data.title}\n`;
      txt += `${data.contact.location} | ${data.contact.phone} | ${data.contact.email}\n`;
      txt += `Portfolio: ${data.contact.portfolio} | LinkedIn: ${data.contact.linkedin}\n\n`;
      txt += `${data.summaryTitle || 'PROFESSIONAL SUMMARY'}\n${data.summary}\n\n`;
      txt += `${data.skillsTitle || 'TECHNICAL SKILLS'}\n`;
      data.skills.forEach((s) => (txt += `${s.categoryName}: ${s.skillsText}\n`));
      txt += `\n${data.projectsTitle || 'FEATURED PROJECTS & EXPERIENCE'}\n`;
      data.projects.forEach((p) => {
        txt += `${p.title} ${p.subtitle ? `— ${p.subtitle}` : ''}\n${p.techStackLabel || 'Tech Stack:'} ${p.techStackText}\n`;
        p.bullets.forEach((b) => (txt += `• ${b}\n`));
        txt += `\n`;
      });
      txt += `${data.educationTitle || 'EDUCATION'}\n`;
      data.education.forEach((edu) => (txt += `${edu.degree}\n${edu.institution} | ${edu.statusOrDate}\n\n`));
      txt += `${data.languagesTitle || 'LANGUAGES & ADDITIONAL EXPERTISE'}\n`;
      txt += `${data.languagesLabel || 'Languages:'} ${data.languages}\n${data.additionalCompetenciesLabel || 'Additional Competencies:'} ${data.additionalCompetencies}\n`;

      const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
      saveBlob(blob, `${baseName}_Resume.txt`);
      break;
    }

    case 'xml':
    case 'xml2003': {
      const xml = generateWordXml(data);
      const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
      saveBlob(blob, `${baseName}_Resume.xml`);
      break;
    }

    case 'odt': {
      // OpenDocument Text HTML wrapper supported by LibreOffice/OpenOffice
      const odtHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${data.fullName}</title></head><body>${elementHtml}</body></html>`;
      const blob = new Blob([odtHtml], { type: 'application/vnd.oasis.opendocument.text' });
      saveBlob(blob, `${baseName}_Resume.odt`);
      break;
    }

    case 'json': {
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      saveBlob(blob, `${baseName}_resume_data.json`);
      break;
    }

    default: {
      const blob = await generateDocxBlob(data);
      saveBlob(blob, `${baseName}_Resume.docx`);
      break;
    }
  }
}

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
