import { useState } from 'react';
import { UrlInput } from './components/UrlInput';
import { ModeToggle } from './components/ModeToggle';
import { LoadingState } from './components/LoadingState';
import { ResultDisplay } from './components/ResultDisplay';
import { DownloadButtons } from './components/DownloadButtons';
import { useTranscript } from './hooks/useTranscript';
import { isValidYouTubeUrl } from './utils/validate';

type Mode = 'transcript' | 'summary';

export default function App() {
  const [url, setUrl] = useState('');
  const [mode, setMode] = useState<Mode>('transcript');
  const [showValidation, setShowValidation] = useState(false);
  const { status, data, error, fetch, reset } = useTranscript();

  const isValid = isValidYouTubeUrl(url);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setShowValidation(true);
    if (!isValid) return;
    fetch(url, mode);
  }

  function handleReset() {
    setUrl('');
    setMode('transcript');
    setShowValidation(false);
    reset();
  }

  return (
    <div className="min-h-screen bg-[#fafafa] py-10 px-6">
      <div className="mx-auto w-full max-w-[680px]">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            YT Transcript
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Get a transcript or AI summary from any YouTube video
          </p>
        </header>

        {/* Card */}
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 shadow-sm">
          {status === 'idle' || status === 'error' ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <ModeToggle mode={mode} onChange={setMode} />
              <UrlInput
                value={url}
                onChange={setUrl}
                isValid={isValid}
                showError={showValidation}
              />
              {status === 'error' && error && (
                <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-3">
                  {error}
                </p>
              )}
              <button
                type="submit"
                className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition text-sm"
              >
                Get {mode === 'transcript' ? 'Transcript' : 'AI Summary'}
              </button>
            </form>
          ) : status === 'loading' ? (
            <LoadingState mode={mode} />
          ) : status === 'success' && data ? (
            <div className="flex flex-col gap-4">
              <ResultDisplay title={data.title} content={data.result} mode={data.mode as 'transcript' | 'summary'} />
              <div className="flex items-center justify-between flex-wrap gap-3">
                <DownloadButtons text={data.result} title={data.title} />
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-sm text-gray-500 hover:text-gray-700 transition"
                >
                  Start over
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
