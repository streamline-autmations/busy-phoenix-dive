import { createBrowserRouter } from "react-router-dom";
import AddProductPage from "@/pages/admin/AddProductPage";
import EditProductPage from "@/pages/admin/EditProductPage";
import NewProductPage from "@/pages/products/NewProductPage";
import NewFurniturePage from "@/pages/furniture/NewFurniturePage";
import NewBundlePage from "@/pages/bundles/NewBundlePage";
import OwnerPortal from "@/pages/admin/OwnerPortal";
import Navigation from "@/components/Navigation";

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      {/* ... rest unchanged ... */}
    </div>
  );
}

export const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/products/new", element: <NewProductPage /> },
  { path: "/furniture/new", element: <NewFurniturePage /> },
  { path: "/bundles/new", element: <NewBundlePage /> },
  { path: "/admin/products/new", element: <AddProductPage /> },
  { path: "/admin/products/:slug/edit", element: <EditProductPage /> },
  { path: "/admin/owner-portal", element: <OwnerPortal /> },
]);