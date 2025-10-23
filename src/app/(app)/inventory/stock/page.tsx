export default function StockPage() {
  return (
    <div className="min-h-screen bg-white p-6 rounded-2xl shadow-sm max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Inventory — Stock Movements</h1>
      <p className="text-gray-600 mb-6">Track stock adjustments, reasons, and audit trail.</p>
      <table className="w-full text-left border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-300 px-3 py-2">Date</th>
            <th className="border border-gray-300 px-3 py-2">Product</th>
            <th className="border border-gray-300 px-3 py-2">Delta</th>
            <th className="border border-gray-300 px-3 py-2">Reason</th>
            <th className="border border-gray-300 px-3 py-2">Reference</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 px-3 py-2">2024-06-01</td>
            <td className="border border-gray-300 px-3 py-2">Sample Product</td>
            <td className="border border-gray-300 px-3 py-2">+10</td>
            <td className="border border-gray-300 px-3 py-2">Initial stock</td>
            <td className="border border-gray-300 px-3 py-2">N/A</td>
          </tr>
          {/* TODO: Fetch and render real stock movements */}
        </tbody>
      </table>
    </div>
  );
}