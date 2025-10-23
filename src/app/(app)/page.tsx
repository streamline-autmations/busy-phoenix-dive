export default function DashboardPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <div className="rounded-2xl border bg-white p-4 flex flex-col justify-center items-center text-center">
        <h2 className="text-lg font-semibold mb-2">Sales (24h)</h2>
        <p className="text-gray-500 text-sm">—</p>
      </div>
      <div className="rounded-2xl border bg-white p-4 flex flex-col justify-center items-center text-center">
        <h2 className="text-lg font-semibold mb-2">Top Products</h2>
        <p className="text-gray-500 text-sm">No data available</p>
      </div>
      <div className="rounded-2xl border bg-white p-4 flex flex-col justify-center items-center text-center">
        <h2 className="text-lg font-semibold mb-2">Reviews in Queue</h2>
        <p className="text-gray-500 text-sm">0 pending</p>
      </div>
    </div>
  );
}