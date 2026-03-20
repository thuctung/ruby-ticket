"use client";

type Props = {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
};

export default function Pagination({ page, totalPages, onChange }: Props) {
  const getPages = () => {
    const delta = 2;
    const range: (number | string)[] = [];

    const left = Math.max(2, page - delta);
    const right = Math.min(totalPages - 1, page + delta);

    // luôn có page 1
    range.push(1);

    if (left > 2) {
      range.push("...");
    }

    for (let i = left; i <= right; i++) {
      range.push(i);
    }

    if (right < totalPages - 1) {
      range.push("...");
    }

    // luôn có page cuối
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  const pages = getPages();

  const handleChangePage = (newPage: number) => {
    if (page === newPage) return;
    onChange(page);
  };

  return (
    <div className="flex items-center gap-2 justify-center mt-6">
      <div className="flex items-center justify-between mt-8 px-2">
        <div className="flex gap-2">
          <button
            className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-400"
            onClick={() => handleChangePage(page - 1)}
            disabled={page === 1}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {pages.map((p, i) => (
            <button
              key={i}
              disabled={p === "..."}
              onClick={() => typeof p === "number" && handleChangePage(p)}
              className={`
            w-10 h-10 rounded-xl bg-blue-600 text-white font-bold shadow-md shadow-blue-200
            ${p === page ? "bg-blue-500 text-white" : ""}
            ${p === "..." ? "cursor-default border-none" : ""}
          `}
            >
              {p}
            </button>
          ))}
          <button
            className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-400"
            onClick={() => handleChangePage(page + 1)}
            disabled={page === totalPages}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
