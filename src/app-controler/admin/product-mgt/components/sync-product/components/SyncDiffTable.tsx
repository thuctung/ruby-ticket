"use client";

import { formatVND } from "@/lib/money";
import { DiffRow, DiffType } from "@/app-controler/admin/product-mgt/components/sync-product/sync";

const BADGE: Record<DiffType, { label: string; badge: string; row: string }> = {
  new: {
    label: "Thêm mới",
    badge: "bg-green-50 text-green-700 ring-green-600/20",
    row: "bg-green-50/40",
  },
  changed: {
    label: "Cập nhật giá",
    badge: "bg-yeelow-50 text-yeelow-700 ring-yeelow-600/20",
    row: "bg-yeelow-50/40",
  },
  unchanged: { label: "Không đổi", badge: "bg-blue-50 text-blue-600 ring-blue-500/20", row: "" },
  only_a: { label: "Vé cũ", badge: "bg-sky-50 text-sky-700 ring-sky-600/20", row: "" },
};

export default function SyncDiffTable({ rows }: { rows: DiffRow[] }) {
  const th = "px-4 py-3  text-sm font-medium text-slate-600 text-center";
  const td = "px-4 py-3  ";

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th rowSpan={2} className={th}>
              Tên vé
            </th>
            <th className={th} colSpan={2}>
              Giá công bố(Public)
            </th>
            <th className={th} colSpan={2}>
              Giá đại lý(Unit)
            </th>
            <th rowSpan={2} className={th}>
              Trạng thái
            </th>
          </tr>
          <tr>
            <th>Giá cũ</th>
            <th>Giá mới</th>
            <th>Giá cũ</th>
            <th>Giá mới</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">
                Không có sản phẩm nào khớp bộ lọc.
              </td>
            </tr>
          ) : (
            rows.map((r) => {
              const s = BADGE[r.type];
              return (
                <tr key={r.code} className={s.row}>
                  <td className={`${td} font-medium`}>{r.name}</td>
                  <td className={`${td}  text-right text-sm`}>
                    {r.oldPublicPrice === null ? "0" : formatVND(r.oldPublicPrice)}
                  </td>
                  <td className={`${td}  text-right`}>
                    {r.newPublicPrice === null ? "0" : formatVND(r.newPublicPrice)}
                  </td>
                  <td className={`${td}  text-right text-sm`}>
                    {r.oldUnitPrice === null ? "0" : formatVND(r.oldUnitPrice)}
                  </td>
                  <td className={`${td}  text-right `}>
                    {r.newUnitPrice === null ? "0" : formatVND(r.newUnitPrice)}
                  </td>
                  <td className={td}>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${s.badge}`}
                    >
                      {s.label}
                    </span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
