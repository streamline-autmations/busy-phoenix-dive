import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr] bg-neutral-50 text-neutral-900">
      <Sidebar />
      <div className="flex flex-col">
        <Topbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}