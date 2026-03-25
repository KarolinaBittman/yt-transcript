import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function downloadAsTxt(text: string, filename: string) {
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadAsPdf(text: string, filename: string) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  doc.setFontSize(11);
  const lines = doc.splitTextToSize(text, 180);
  let y = 20;
  for (const line of lines) {
    if (y > 280) { doc.addPage(); y = 20; }
    doc.text(line, 15, y);
    y += 6;
  }
  doc.save(`${filename}.pdf`);
}

export async function downloadAsDocx(text: string, filename: string) {
  const paragraphs = text.split('\n').map(
    (line) => new Paragraph({ children: [new TextRun(line)] })
  );
  const doc = new Document({ sections: [{ children: paragraphs }] });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${filename}.docx`);
}
