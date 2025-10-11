import { useState } from "react";

export default function PreviewFrame({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<"desktop" | "mobile">("desktop");
  
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <button 
          className={`px-3 py-1 text-sm border rounded ${
            view === 'desktop' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-50'
          }`} 
          onClick={() => setView("desktop")}
        >
          Desktop
        </button>
        <button 
          className={`px-3 py-1 text-sm border rounded ${
            view === 'mobile' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-50'
          }`} 
          onClick={() => setView("mobile")}
        >
          Mobile
        </button>
      </div>
      <div 
        style={{ width: view === "mobile" ? 390 : 1200 }} 
        className="border rounded-2xl overflow-hidden bg-white shadow-sm mx-auto"
      >
        {children}
      </div>
    </div>
  );
}