"use client"

type Props = {
  page: number
  totalPages: number
  onChange: (p: number) => void
}

export default function Pagination({ page, totalPages, onChange }: Props) {

  const getPages = () => {
    const delta = 2
    const range: (number | string)[] = []

    const left = Math.max(2, page - delta)
    const right = Math.min(totalPages - 1, page + delta)

    // luôn có page 1
    range.push(1)

    if (left > 2) {
      range.push("...")
    }

    for (let i = left; i <= right; i++) {
      range.push(i)
    }

    if (right < totalPages - 1) {
      range.push("...")
    }

    // luôn có page cuối
    if (totalPages > 1) {
      range.push(totalPages)
    }

    return range
  }

  const pages = getPages()

  const handleChangePage = (newPage:number) => {
    if(page === newPage) return 
    onChange(page)
  }

  return (
    <div className="flex items-center gap-2 justify-center mt-6">

      {/* Prev */}
      <button
        onClick={() => handleChangePage(page - 1)}
        disabled={page === 1}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Prev
      </button>

      {/* Pages */}
      {pages.map((p, i) => (
        <button
          key={i}
          disabled={p === "..."}
          onClick={() => typeof p === "number" && handleChangePage(p)}
          className={`
            px-3 py-1 border rounded
            ${p === page ? "bg-blue-500 text-white" : ""}
            ${p === "..." ? "cursor-default border-none" : ""}
          `}
        >
          {p}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => handleChangePage(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>

    </div>
  )
}