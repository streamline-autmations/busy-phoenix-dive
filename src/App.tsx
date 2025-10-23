import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/routes";
import Navigation from "./components/Navigation";

export default function App() {
  return (
    <>
      <Navigation />
      <RouterProvider router={router} />
    </>
  );
}