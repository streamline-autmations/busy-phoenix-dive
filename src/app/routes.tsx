import { createBrowserRouter } from "react-router-dom";
import AddProductPage from "@/pages/admin/AddProductPage";
import EditProductPage from "@/pages/admin/EditProductPage";
import NewProductPage from "@/pages/products/NewProductPage";
import NewFurniturePage from "@/pages/furniture/NewFurniturePage";
import Navigation from "@/components/Navigation";

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center max-w-2xl mx-auto p-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-2xl">B</span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to BLOM Admin
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Your complete product management system
          </p>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a 
                href="/products/new" 
                className="flex items-center justify-center bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span className="mr-2">📦</span>
                Add Product
              </a>
              <a 
                href="/furniture/new" 
                className="flex items-center justify-center bg-amber-600 text-white px-6 py-4 rounded-lg hover:bg-amber-700 transition-colors"
              >
                <span className="mr-2">🪑</span>
                Add Furniture
              </a>
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Coming Soon</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-gray-100 text-gray-500 px-4 py-3 rounded-lg text-center">
                  <span className="mr-2">⭐</span>
                  Add Special
                </div>
                <div className="bg-gray-100 text-gray-500 px-4 py-3 rounded-lg text-center">
                  <span className="mr-2">💰</span>
                  Add Discount
                </div>
                <div className="bg-gray-100 text-gray-500 px-4 py-3 rounded-lg text-center">
                  <span className="mr-2">🎁</span>
                  Bundle Deal
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-sm text-gray-500">
              <p>Legacy admin available at:</p>
              <div className="space-x-4 mt-2">
                <a href="/admin/products/new" className="text-blue-600 hover:text-blue-800 underline">
                  Legacy Add Product
                </a>
                <span>•</span>
                <span>Edit: <code>/admin/products/your-slug/edit</code></span>
              </div>
            </div>
          </div>
        </div>
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
    path: "/products/new", 
    element: <NewProductPage /> 
  },
  { 
    path: "/furniture/new", 
    element: <NewFurniturePage /> 
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