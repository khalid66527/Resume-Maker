/**
 * Utility to extract clean human-readable text from uploaded PDF, DOCX, RTF, HTML, TXT files
 */

export async function extractTextFromFile(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();

  // 1. PDF File extraction with line position tracking
  if (fileName.endsWith('.pdf')) {
    try {
      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdf = await loadingTask.promise;
      
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        let lastY: number | null = null;
        let pageLines: string[] = [];
        let currentLine = '';

        for (const item of (textContent.items as any[])) {
          const str = (item.str || '').trim();
          if (!str) continue;

          const currentY = item.transform ? Math.round(item.transform[5]) : null;

          if (lastY !== null && currentY !== null && Math.abs(currentY - lastY) > 6) {
            if (currentLine.trim()) {
              pageLines.push(currentLine.trim());
            }
            currentLine = str;
          } else {
            currentLine = currentLine ? `${currentLine} ${str}` : str;
          }

          if (currentY !== null) {
            lastY = currentY;
          }
        }

        if (currentLine.trim()) {
          pageLines.push(currentLine.trim());
        }

        fullText += pageLines.join('\n') + '\n\n';
      }

      if (fullText.trim().length > 20) {
        return fullText;
      }
    } catch (err) {
      console.warn('pdfjs-dist parse error, trying fallback', err);
    }

    // Fallback simple PDF text stream extractor if worker fails
    try {
      const buffer = await file.arrayBuffer();
      const decoder = new TextDecoder('utf-8', { fatal: false });
      const raw = decoder.decode(buffer);
      
      const textMatches: string[] = [];
      const parenthesesRegex = /\(([^()]{2,})\)\s*T[jJ]/g;
      let match;
      while ((match = parenthesesRegex.exec(raw)) !== null) {
        textMatches.push(match[1]);
      }
      if (textMatches.length > 5) {
        return textMatches.join('\n');
      }
    } catch (fallbackErr) {
      console.error('Fallback PDF extract error:', fallbackErr);
    }
  }

  // 2. DOCX File extraction
  if (fileName.endsWith('.docx') || fileName.endsWith('.docm') || fileName.endsWith('.dotx')) {
    try {
      const mammoth = await import('mammoth');
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      if (result.value && result.value.trim().length > 10) {
        return result.value;
      }
    } catch (err) {
      console.error('Mammoth DOCX parse error:', err);
    }
  }

  // 3. Plain Text / RTF / HTML / XML / Markdown / JSON
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      let content = reader.result as string;
      
      if (fileName.endsWith('.html') || fileName.endsWith('.htm') || fileName.endsWith('.mht')) {
        const div = document.createElement('div');
        div.innerHTML = content;
        content = div.innerText || div.textContent || content;
      }
      
      if (fileName.endsWith('.rtf')) {
        content = content
          .replace(/\\par[d]?/g, '\n')
          .replace(/\\[a-zA-Z0-9\-]+ ?/g, '')
          .replace(/[{}]/g, '');
      }

      resolve(content);
    };
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
}
