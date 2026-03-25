import { downloadAsTxt, downloadAsPdf, downloadAsDocx, slugify } from '../utils/download';

interface DownloadButtonsProps {
  text: string;
  title: string;
}

export function DownloadButtons({ text, title }: DownloadButtonsProps) {
  const filename = slugify(title) || 'transcript';

  return (
    <div className="flex gap-2 flex-wrap">
      <button
        type="button"
        onClick={() => downloadAsTxt(text, filename)}
        className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
      >
        TXT
      </button>
      <button
        type="button"
        onClick={() => downloadAsPdf(text, filename)}
        className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
      >
        PDF
      </button>
      <button
        type="button"
        onClick={() => downloadAsDocx(text, filename)}
        className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
      >
        DOCX
      </button>
    </div>
  );
}
