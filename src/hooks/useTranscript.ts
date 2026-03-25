import { useState } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface TranscriptResult {
  result: string;
  mode: string;
  title: string;
}

interface UseTranscriptReturn {
  status: Status;
  data: TranscriptResult | null;
  error: string | null;
  fetch: (videoUrl: string, mode: 'transcript' | 'summary') => Promise<void>;
  reset: () => void;
}

export function useTranscript(): UseTranscriptReturn {
  const [status, setStatus] = useState<Status>('idle');
  const [data, setData] = useState<TranscriptResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function fetch(videoUrl: string, mode: 'transcript' | 'summary') {
    setStatus('loading');
    setError(null);
    setData(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90_000);

    try {
      const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
      const response = await window.fetch(webhookUrl, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl, mode }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const json = await response.json();
      setData(json);
      setStatus('success');
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else if (err instanceof Error) {
        setError(err.message || 'Something went wrong. Please try again.');
      } else {
        setError('Something went wrong. Please try again.');
      }
      setStatus('error');
    } finally {
      clearTimeout(timeoutId);
    }
  }

  function reset() {
    setStatus('idle');
    setData(null);
    setError(null);
  }

  return { status, data, error, fetch, reset };
}
