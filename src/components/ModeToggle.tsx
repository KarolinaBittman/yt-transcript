type Mode = 'transcript' | 'summary';

interface ModeToggleProps {
  mode: Mode;
  onChange: (mode: Mode) => void;
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="flex rounded-lg overflow-hidden border border-gray-200">
      {(['transcript', 'summary'] as Mode[]).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          className={`flex-1 py-2.5 text-sm font-medium capitalize transition ${
            mode === m
              ? 'bg-indigo-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {m === 'transcript' ? 'Transcript' : 'Summary (AI)'}
        </button>
      ))}
    </div>
  );
}
