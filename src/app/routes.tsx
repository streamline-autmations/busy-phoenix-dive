import React from "react";
import { createBrowserRouter } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import DashboardPage from "./app/page";
import ProductsPage from "./app/catalog/products/page";
import NewProductPage from "./app/catalog/products/new/page";
import NewFurniturePage from "../pages/furniture/NewFurniturePage";
import NewBundlePage from "../pages/bundles/NewBundlePage";
import EditProductPage from "../pages/admin/EditProductPage";

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: "/", element: <DashboardPage /> },
      { path: "/catalog/products", element: <ProductsPage /> },
      { path: "/catalog/products/new", element: <NewProductPage /> },
      { path: "/catalog/products/:id", element: <EditProductPage /> },
      { path: "/furniture/new", element: <NewFurniturePage /> },
      { path: "/bundles/new", element: <NewBundlePage /> },
    ],
  },
]);