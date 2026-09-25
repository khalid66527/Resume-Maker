/**
 * Utility to extract clean human-readable text from uploaded PDF, DOCX, RTF, HTML, TXT files
 */

export async function extractTextFromFile(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();

  // 1. PDF File extraction
  if (fileName.endsWith('.pdf')) {
    try {
      const pdfjs = await import('pdfjs-dist');
      // Set worker source to CDN for smooth client-side loading
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdf = await loadingTask.promise;
      
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageStrings = textContent.items
          .map((item: any) => item.str || '')
          .join(' ');
        fullText += pageStrings + '\n';
      }

      if (fullText.trim().length > 20) {
        return fullText;
      }
    } catch (err) {
      console.warn('pdfjs-dist primary parse failed, trying fallback stream extraction', err);
    }

    // Fallback simple PDF text stream extractor if worker fails
    try {
      const buffer = await file.arrayBuffer();
      const decoder = new TextDecoder('utf-8', { fatal: false });
      const raw = decoder.decode(buffer);
      
      // Extract text inside BT ... ET text blocks or /Contents streams or parenthesis (text)
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
      
      // If it's HTML, strip HTML tags for cleaner text parsing
      if (fileName.endsWith('.html') || fileName.endsWith('.htm') || fileName.endsWith('.mht')) {
        const div = document.createElement('div');
        div.innerHTML = content;
        content = div.innerText || div.textContent || content;
      }
      
      // If RTF, strip rtf control codes
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
