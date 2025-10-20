import React from "react";
import Navigation from "@/components/Navigation";
import BundleBuilder from "@/modules/bundles/BundleBuilder";

export default function NewBundlePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <main className="container mx-auto p-6 flex flex-col flex-1">
        <h1 className="text-3xl font-bold mb-6">Add New Bundle Deal</h1>
        <BundleBuilder />
      </main>
    </div>
  );
}