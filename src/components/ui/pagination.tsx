"use client";

type Props = {
  page: number;
  totalPages: number;
  onChangePage: (p: number) => void;
};

export default function Pagination({ page, totalPages, onChangePage }: Props) {
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

  const handleChangePage = (newPage: number) => {
    if (page !== newPage) {
      onChangePage(newPage);
    }
  };
  return (
    <nav className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
      <button
        className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-400"
        onClick={() => handleChangePage(page - 1)}
        disabled={page === 1}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {getPages().map((p, i) => (
        <button
          key={i}
          disabled={p === "..."}
          onClick={() => handleChangePage(Number(p))}
          className={`
            w-10 h-10 rounded-xl  font-bold shadow-md shadow-blue-200
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
    </nav>
  );
}
