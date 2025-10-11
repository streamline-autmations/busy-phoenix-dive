import { createBrowserRouter } from "react-router-dom";
import AddProductPage from "@/pages/admin/AddProductPage";
import EditProductPage from "@/pages/admin/EditProductPage";

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">BLOM Admin</h1>
        <p className="text-gray-600 mb-6">Product management system</p>
        <a 
          href="/admin/products/new" 
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Product
        </a>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  { 
    path: "/", 
    element: <HomePage /> 
  },
  { 
    path: "/admin/products/new", 
    element: <AddProductPage /> 
  },
  { 
    path: "/admin/products/:slug/edit", 
    element: <EditProductPage /> 
  }
]);