import { Search } from "lucide-react";
import React from "react";
import Pagination from "../../pagination";

export type TableColumn<T> = {
  key: string;
  title: string;
  width?: string | number;
  className?: string;
  render?: (row: T, index: number) => React.ReactNode;
  align?: "left" | "center" | "right";
};

export type TableConfig<T> = {
  columns: TableColumn<T>[];
  data: T[];
  onChangePage?: (page: number) => void;
  currentPage?: number;
  totalPages?: number;
  tableTitle?: string;
};

export function CustomTable<T>({
  columns,
  data,
  onChangePage,
  currentPage,
  totalPages,
  tableTitle,
}: TableConfig<T>) {
  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4 bg-gray-50 ">
      {tableTitle ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h2 className="text-xl font-bold text-gray-800">{tableTitle}</h2>
        </div>
      ) : null}

      <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-auto`}>
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/50 border-b border-gray-100 whitespace-nowrap">
            <tr className="text-gray-500 text-sm uppercase tracking-wider border-b border-gray-50">
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={`py-4 px-4 font-semibold ${col.className ?? ""}`}
                  style={{
                    width: col.width,
                    textAlign: col.align ?? "left",
                  }}
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50 whitespace-nowrap">
            {data.length ? (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="text-gray-700 text-sm hover:bg-gray-50 transition-colors hover:bg-blue-50/50"
                >
                  {columns.map((col, index) => (
                    <td
                      key={index}
                      className={`py-4 px-4  ${col.className ?? ""}`}
                      style={{ textAlign: col.align ?? "left" }}
                    >
                      {col.render ? col.render(row, rowIndex) : (row as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-12 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <Search size={32} className="opacity-20" />
                    <p>Chưa có dữ liệu</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {onChangePage ? (
        <div className="flex justify-center items-center py-4">
          <Pagination
            page={currentPage || 1}
            onChangePage={onChangePage}
            totalPages={totalPages || 0}
          />
        </div>
      ) : null}
    </div>
  );
}
