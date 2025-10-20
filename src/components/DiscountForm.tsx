"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { slugify } from "@/lib/slugify";

export interface DiscountFormValue {
  id: string;
  type: "coupon" | "auto";
  code?: string;
  label?: string;
  valueType: "percent" | "amount";
  percent?: number;
  amount?: number;
  currency?: string;
  appliesToAll: boolean;
  appliesToProducts: string[];
  appliesToBundles: string[];
  appliesToCategories: string[];
  constraintsStartAt?: string;
  constraintsEndAt?: string;
  minSubtotal?: number;
  maxRedemptions?: number;
  perCustomerLimit?: number;
  stackingExclusive: boolean;
  stackingPriority: number;
  status: "active" | "paused";
}

interface DiscountFormProps {
  value: DiscountFormValue;
  onChange: (updates: Partial<DiscountFormValue>) => void;
  onSaveDraft?: () => void;
  onPublish?: () => void;
}

export default function DiscountForm({ value, onChange, onSaveDraft, onPublish }: DiscountFormProps) {
  const [localValue, setLocalValue] = useState<DiscountFormValue>(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  function patch(updates: Partial<DiscountFormValue>) {
    const next = { ...localValue, ...updates };
    setLocalValue(next);
    onChange(next);
  }

  function handleIdBlur() {
    if (localValue.id) {
      patch({ id: slugify(localValue.id) });
    }
  }

  function validate() {
    if (!localValue.id.trim()) {
      toast.error("ID is required");
      return false;
    }
    if (localValue.type === "coupon" && !localValue.code?.trim()) {
      toast.error("Code is required for coupon type");
      return false;
    }
    if (localValue.valueType === "percent") {
      if (localValue.percent === undefined || localValue.percent <= 0 || localValue.percent > 100) {
        toast.error("Percent value must be between 1 and 100");
        return false;
      }
    } else if (localValue.valueType === "amount") {
      if (localValue.amount === undefined || localValue.amount <= 0) {
        toast.error("Amount value must be greater than 0");
        return false;
      }
      if (!localValue.currency) {
        toast.error("Currency is required for amount value");
        return false;
      }
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
        <Label htmlFor="id">ID (slug-safe) *</Label>
        <Input
          id="id"
          value={localValue.id}
          onChange={(e) => patch({ id: e.target.value })}
          onBlur={handleIdBlur}
          required
        />
      </div>

      <div>
        <Label htmlFor="type">Type</Label>
        <Select
          value={localValue.type}
          onValueChange={(val) => patch({ type: val as "coupon" | "auto" })}
        >
          <SelectTrigger id="type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="coupon">Coupon</SelectItem>
            <SelectItem value="auto">Auto</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {localValue.type === "coupon" && (
        <div>
          <Label htmlFor="code">Code *</Label>
          <Input
            id="code"
            value={localValue.code || ""}
            onChange={(e) => patch({ code: e.target.value })}
            required
          />
        </div>
      )}

      <div>
        <Label htmlFor="label">Label</Label>
        <Input
          id="label"
          value={localValue.label || ""}
          onChange={(e) => patch({ label: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="valueType">Value Type</Label>
        <Select
          value={localValue.valueType}
          onValueChange={(val) => patch({ valueType: val as "percent" | "amount" })}
        >
          <SelectTrigger id="valueType">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="percent">Percent</SelectItem>
            <SelectItem value="amount">Amount</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {localValue.valueType === "percent" && (
        <div>
          <Label htmlFor="percent">Percent (%) *</Label>
          <Input
            id="percent"
            type="number"
            min={1}
            max={100}
            value={localValue.percent ?? ""}
            onChange={(e) => patch({ percent: Number(e.target.value) })}
            required
          />
        </div>
      )}

      {localValue.valueType === "amount" && (
        <>
          <div>
            <Label htmlFor="amount">Amount *</Label>
            <Input
              id="amount"
              type="number"
              min={0.01}
              step={0.01}
              value={localValue.amount ?? ""}
              onChange={(e) => patch({ amount: Number(e.target.value) })}
              required
            />
          </div>
          <div>
            <Label htmlFor="currency">Currency *</Label>
            <Input
              id="currency"
              value={localValue.currency || ""}
              onChange={(e) => patch({ currency: e.target.value })}
              required
            />
          </div>
        </>
      )}

      <div>
        <Label>Applies To All</Label>
        <Switch
          checked={localValue.appliesToAll}
          onCheckedChange={(checked) => patch({ appliesToAll: checked })}
        />
      </div>

      {!localValue.appliesToAll && (
        <>
          <div>
            <Label htmlFor="appliesToProducts">Applies To Products (comma separated slugs)</Label>
            <Input
              id="appliesToProducts"
              value={localValue.appliesToProducts.join(", ")}
              onChange={(e) =>
                patch({ appliesToProducts: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })
              }
            />
          </div>
          <div>
            <Label htmlFor="appliesToBundles">Applies To Bundles (comma separated slugs)</Label>
            <Input
              id="appliesToBundles"
              value={localValue.appliesToBundles.join(", ")}
              onChange={(e) =>
                patch({ appliesToBundles: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })
              }
            />
          </div>
          <div>
            <Label htmlFor="appliesToCategories">Applies To Categories (comma separated)</Label>
            <Input
              id="appliesToCategories"
              value={localValue.appliesToCategories.join(", ")}
              onChange={(e) =>
                patch({ appliesToCategories: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })
              }
            />
          </div>
        </>
      )}

      <div>
        <Label htmlFor="constraintsStartAt">Start At</Label>
        <Input
          id="constraintsStartAt"
          type="datetime-local"
          value={localValue.constraintsStartAt || ""}
          onChange={(e) => patch({ constraintsStartAt: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="constraintsEndAt">End At</Label>
        <Input
          id="constraintsEndAt"
          type="datetime-local"
          value={localValue.constraintsEndAt || ""}
          onChange={(e) => patch({ constraintsEndAt: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="minSubtotal">Min Subtotal</Label>
        <Input
          id="minSubtotal"
          type="number"
          min={0}
          value={localValue.minSubtotal ?? ""}
          onChange={(e) => patch({ minSubtotal: e.target.value ? Number(e.target.value) : undefined })}
        />
      </div>

      <div>
        <Label htmlFor="maxRedemptions">Max Redemptions</Label>
        <Input
          id="maxRedemptions"
          type="number"
          min={0}
          value={localValue.maxRedemptions ?? ""}
          onChange={(e) => patch({ maxRedemptions: e.target.value ? Number(e.target.value) : undefined })}
        />
      </div>

      <div>
        <Label htmlFor="perCustomerLimit">Per Customer Limit</Label>
        <Input
          id="perCustomerLimit"
          type="number"
          min={0}
          value={localValue.perCustomerLimit ?? ""}
          onChange={(e) => patch({ perCustomerLimit: e.target.value ? Number(e.target.value) : undefined })}
        />
      </div>

      <div>
        <Label>Stacking Exclusive</Label>
        <Switch
          checked={localValue.stackingExclusive}
          onCheckedChange={(checked) => patch({ stackingExclusive: checked })}
        />
      </div>

      <div>
        <Label htmlFor="stackingPriority">Stacking Priority</Label>
        <Input
          id="stackingPriority"
          type="number"
          min={0}
          value={localValue.stackingPriority}
          onChange={(e) => patch({ stackingPriority: Number(e.target.value) })}
        />
      </div>

      <div>
        <Label>Status</Label>
        <Select
          value={localValue.status}
          onValueChange={(val) => patch({ status: val as "active" | "paused" })}
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