"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { slugify } from "@/lib/slugify";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SpecialFormValue {
  id: string;
  title: string;
  slug: string;
  heroImage?: string;
  shortDescription?: string;
  discountId?: string;
  badge?: string;
  status: "active" | "paused";
  startAt?: string;
  endAt?: string;
}

interface SpecialFormProps {
  value: SpecialFormValue;
  onChange: (updates: Partial<SpecialFormValue>) => void;
  onSaveDraft?: () => void;
  onPublish?: () => void;
}

export default function SpecialForm({ value, onChange, onSaveDraft, onPublish }: SpecialFormProps) {
  const [localValue, setLocalValue] = useState<SpecialFormValue>(value);
  const { uploadOne } = useCloudinaryUpload();
  const inputFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  function patch(updates: Partial<SpecialFormValue>) {
    const next = { ...localValue, ...updates };
    setLocalValue(next);
    onChange(next);
  }

  function handleSlugBlur() {
    if (localValue.slug) {
      patch({ slug: slugify(localValue.slug) });
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadOne(file);
      patch({ heroImage: url });
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(`Upload failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      if (inputFileRef.current) inputFileRef.current.value = "";
    }
  }

  function validate() {
    if (!localValue.id.trim()) {
      toast.error("ID is required");
      return false;
    }
    if (!localValue.title.trim()) {
      toast.error("Title is required");
      return false;
    }
    if (!localValue.slug.trim()) {
      toast.error("Slug is required");
      return false;
    }
    if (!localValue.status) {
      toast.error("Status is required");
      return false;
    }
    return true;
  }

  return (
    <form
      className="space-y-4 max-w-lg"
      onSubmit={(e) => {
        e.preventDefault();
        if (!validate()) return;
        onPublish?.();
      }}
    >
      <div>
        <Label htmlFor="id">ID *</Label>
        <Input
          id="id"
          value={localValue.id}
          onChange={(e) => patch({ id: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={localValue.title}
          onChange={(e) => patch({ title: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="slug">Slug *</Label>
        <Input
          id="slug"
          value={localValue.slug}
          onChange={(e) => patch({ slug: e.target.value })}
          onBlur={handleSlugBlur}
          required
        />
      </div>

      <div>
        <Label htmlFor="heroImage">Hero Image</Label>
        {localValue.heroImage ? (
          <img src={localValue.heroImage} alt="Hero" className="w-full max-w-xs rounded" />
        ) : (
          <div className="w-full max-w-xs h-40 bg-gray-200 rounded flex items-center justify-center text-gray-500">
            No image uploaded
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          ref={inputFileRef}
          className="mt-2 cursor-pointer"
        />
      </div>

      <div>
        <Label htmlFor="shortDescription">Short Description</Label>
        <Textarea
          id="shortDescription"
          rows={3}
          value={localValue.shortDescription || ""}
          onChange={(e) => patch({ shortDescription: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="discountId">Discount ID</Label>
        <Input
          id="discountId"
          value={localValue.discountId || ""}
          onChange={(e) => patch({ discountId: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="badge">Badge</Label>
        <Input
          id="badge"
          value={localValue.badge || ""}
          onChange={(e) => patch({ badge: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select
          value={localValue.status}
          onValueChange={(val: "active" | "paused") => patch({ status: val })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="startAt">Start At</Label>
        <Input
          id="startAt"
          type="datetime-local"
          value={localValue.startAt || ""}
          onChange={(e) => patch({ startAt: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="endAt">End At</Label>
        <Input
          id="endAt"
          type="datetime-local"
          value={localValue.endAt || ""}
          onChange={(e) => patch({ endAt: e.target.value })}
        />
      </div>

      <div className="flex gap-2 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => onSaveDraft?.()}
        >
          💾 Save Draft
        </Button>
        <Button type="submit">
          🚀 Publish
        </Button>
      </div>
    </form>
  );
}