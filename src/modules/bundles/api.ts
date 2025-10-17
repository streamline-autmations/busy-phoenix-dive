import { toast } from "sonner";
import { env } from "@/lib/env";

export async function saveDraft(bundle: unknown) {
  try {
    const res = await fetch("/webhook/products-intake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bundle),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to save draft");
    }
    toast.success("Draft saved successfully");
  } catch (error) {
    toast.error(`Save draft failed: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

export async function publishPR({ branchClean, slug, title }: { branchClean: string; slug: string; title: string }) {
  try {
    const res = await fetch("/webhook/pr-intake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ branchClean, slug, title }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to publish PR");
    }
    const data = await res.json();
    toast.success("Publish request sent successfully");
    return data;
  } catch (error) {
    toast.error(`Publish failed: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

export function sanitizeBranchName(slug: string): string {
  // kebab-case, strip invalid git ref chars
  return `add-${slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/--+/g, "-")}`;
}