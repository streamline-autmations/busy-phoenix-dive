import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex gap-4">
      <Link to="/catalog/products">
        <Button variant="outline">Products</Button>
      </Link>
      <Link to="/furniture/new">
        <Button variant="outline">Add Furniture</Button>
      </Link>
      <Link to="/bundles/new">
        <Button variant="outline">Add Bundle</Button>
      </Link>
    </nav>
  );
}