/**
 * Utility to extract clean human-readable text from uploaded PDF, DOCX, RTF, HTML, TXT files
 */

export async function extractTextFromFile(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();

  // 1. PDF File extraction with line position tracking and spatial ordering
  if (fileName.endsWith('.pdf') || file.type === 'application/pdf') {
    try {
      const pdfjs = await import('pdfjs-dist');
      // Configure robust worker source
      if (typeof window !== 'undefined') {
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
      }

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({
        data: new Uint8Array(arrayBuffer),
        useSystemFonts: true,
      });
      const pdf = await loadingTask.promise;
      
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        interface TextItemPos {
          str: string;
          x: number;
          y: number;
          height: number;
        }

        const items: TextItemPos[] = [];

        for (const rawItem of (textContent.items as any[])) {
          if (!rawItem || typeof rawItem.str !== 'string') continue;
          const str = rawItem.str;
          if (!str && !rawItem.hasEOL) continue;
          
          const transform = rawItem.transform;
          const x = transform ? transform[4] : 0;
          const y = transform ? transform[5] : 0;
          const height = rawItem.height || (transform ? Math.abs(transform[3]) : 10);
          items.push({ str, x, y, height });
        }

        // Sort items by Y desc (top to bottom), then X asc (left to right)
        items.sort((a, b) => {
          if (Math.abs(a.y - b.y) <= 3.5) {
            return a.x - b.x;
          }
          return b.y - a.y; // higher Y is higher on page in PDF coordinates
        });

        // Group into line rows
        const lines: string[] = [];
        let currentLineY: number | null = null;
        let linePieces: { x: number; str: string }[] = [];

        const flushLine = () => {
          if (linePieces.length > 0) {
            linePieces.sort((a, b) => a.x - b.x);
            let lineStr = '';
            for (let k = 0; k < linePieces.length; k++) {
              const piece = linePieces[k].str;
              if (!lineStr) {
                lineStr = piece;
              } else if (lineStr.endsWith(' ') || piece.startsWith(' ')) {
                lineStr += piece;
              } else {
                lineStr += ' ' + piece;
              }
            }
            if (lineStr.trim()) {
              lines.push(lineStr.trim());
            }
            linePieces = [];
          }
        };

        for (const item of items) {
          if (currentLineY === null) {
            currentLineY = item.y;
            linePieces.push({ x: item.x, str: item.str });
          } else if (Math.abs(item.y - currentLineY) <= 3.5) {
            linePieces.push({ x: item.x, str: item.str });
          } else {
            flushLine();
            currentLineY = item.y;
            linePieces.push({ x: item.x, str: item.str });
          }
        }
        flushLine();

        const pageText = lines.join('\n');
        if (pageText.trim()) {
          fullText += pageText + '\n\n';
        }
      }

      if (fullText.trim().length > 15) {
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
        const cleaned = match[1].replace(/\\([()\\])/g, '$1').trim();
        if (cleaned) textMatches.push(cleaned);
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

