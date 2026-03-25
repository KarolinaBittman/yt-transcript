import { useState } from 'react';

interface ResultDisplayProps {
  title: string;
  content: string;
  mode: 'transcript' | 'summary';
}

function formatTranscript(text: string): string[] {
  // Flatten subtitle line-breaks into spaces, then regroup into paragraphs
  const normalized = text.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
  const sentences = normalized.match(/[^.!?]+[.!?]+(\s|$)/g) ?? [normalized];
  const paragraphs: string[] = [];
  let current = '';
  for (const s of sentences) {
    if (current.length + s.length > 600 && current.length > 0) {
      paragraphs.push(current.trim());
      current = s;
    } else {
      current += s;
    }
  }
  if (current.trim()) paragraphs.push(current.trim());
  return paragraphs;
}

export function ResultDisplay({ title, content, mode }: ResultDisplayProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h2 className="text-sm font-medium text-gray-800 truncate pr-4">{title}</h2>
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 text-xs text-indigo-500 hover:text-indigo-700 font-medium transition"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {mode === 'transcript' ? (
        <div
          className="bg-gray-50 p-4 overflow-y-auto text-sm text-gray-800 leading-relaxed"
          style={{ maxHeight: '480px' }}
        >
          {formatTranscript(content).map((para, i) => (
            <p key={i} className="mb-4 last:mb-0">{para}</p>
          ))}
        </div>
      ) : (
        <pre
          className="font-mono text-sm bg-gray-50 p-4 overflow-y-auto whitespace-pre-wrap break-words"
          style={{ maxHeight: '480px' }}
        >
          {content}
        </pre>
      )}
    </div>
  );
}
