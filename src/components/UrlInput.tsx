interface UrlInputProps {
  value: string;
  onChange: (value: string) => void;
  isValid: boolean;
  showError: boolean;
}

export function UrlInput({ value, onChange, isValid, showError }: UrlInputProps) {
  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://youtube.com/watch?v=..."
        className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
          showError && !isValid
            ? 'border-red-400 bg-red-50'
            : 'border-gray-200 bg-white'
        }`}
      />
      {showError && !isValid && (
        <p className="mt-1.5 text-xs text-red-500">
          Please enter a valid YouTube URL (youtube.com/watch?v= or youtu.be/)
        </p>
      )}
    </div>
  );
}
