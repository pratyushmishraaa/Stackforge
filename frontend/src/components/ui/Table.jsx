export default function Table({ columns, data, onRowClick }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/8">
            {columns.map(col => (
              <th key={col.key} className="px-4 py-3 text-left text-[11px] font-semibold text-zinc-500 uppercase tracking-widest whitespace-nowrap">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-16 text-center text-zinc-600 text-sm">
                No records found
              </td>
            </tr>
          ) : data.map((row, i) => (
            <tr
              key={row._id || i}
              onClick={() => onRowClick?.(row)}
              className={`group transition-colors duration-100 ${onRowClick ? 'cursor-pointer hover:bg-white/3' : ''}`}
            >
              {columns.map(col => (
                <td key={col.key} className="px-4 py-3.5 text-sm text-zinc-300 whitespace-nowrap">
                  {col.render ? col.render(row) : (row[col.key] ?? <span className="text-zinc-600">—</span>)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
