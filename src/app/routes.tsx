import React from "react";
import { createBrowserRouter } from "react-router-dom";
import DashboardPage from "./page";
import ProductsPage from "./catalog/products/page";
import NewProductPage from "./catalog/products/new/page";
import EditProductPage from "./catalog/products/[id]/page";
import NewFurniturePage from "./furniture/new/page";
import NewBundlePage from "./bundles/new/page";

export const router = createBrowserRouter([
  { path: "/", element: <DashboardPage /> },
  { path: "/catalog/products", element: <ProductsPage /> },
  { path: "/catalog/products/new", element: <NewProductPage /> },
  { path: "/catalog/products/:id", element: <EditProductPage /> },
  { path: "/furniture/new", element: <NewFurniturePage /> },
  { path: "/bundles/new", element: <NewBundlePage /> },
]);