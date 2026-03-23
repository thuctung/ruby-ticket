interface InventoryTableProps {
  filtered: any[];
  soldMap: Map<string, number>;
}

export function InventoryTable({ filtered, soldMap }: InventoryTableProps) {
  return (
    <div className=" rounded-2xl border table-wrapper">
      <table className="w-full text-sm">
        <thead className="text-left text-muted-foreground">
          <tr>
            <th className="p-3">Ngày (ngày bán)</th>
            <th className="p-3">Điểm đến</th>
            <th className="p-3">Capacity</th>
            <th className="p-3">Đã bán</th>
            <th className="p-3">Còn lại</th>
            <th className="p-3">Updated</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td className="p-3 text-muted-foreground" colSpan={6}>
                Chưa có inventory
              </td>
            </tr>
          ) : (
            filtered.map((r) => {
              const sold = soldMap.get(`${r.date}|${r.product_key}`) ?? 0;
              const remaining = Math.max(0, r.capacity - sold);
              return (
                <tr key={r.id} className="border-t">
                  <td className="p-3">{r.date}</td>
                  <td className="p-3">{r.product_key}</td>
                  <td className="p-3 font-medium">{r.capacity}</td>
                  <td className="p-3">{sold}</td>
                  <td className="p-3 font-semibold">{remaining}</td>
                  <td className="p-3">{r.updated_at?.slice(0, 10)}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
