import React from "react";
import Navigation from "@/components/Navigation";
import BundleBuilder from "@/modules/bundles/BundleBuilder";

export default function NewBundlePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <main className="container mx-auto p-6 flex flex-col lg:flex-row gap-8 flex-1">
        <div className="flex-1 max-w-full lg:max-w-lg overflow-auto">
          <BundleBuilder />
        </div>
        {/* For preview, you can add a separate preview component if needed */}
      </main>
    </div>
  );
}