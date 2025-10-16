import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import ProductMediaInput from "./ProductMediaInput";

interface FullProductFormProps {
  value: FullProductFormValue;
  onChange: (updates: Partial<FullProductFormValue>) => void;
}

export default function FullProductForm({ value, onChange }: FullProductFormProps) {
  // ... your existing form code ...

  // Helper component for editing arrays of strings
  function ArrayInput({
    label,
    values,
    onChange,
  }: {
    label: string;
    values: string[];
    onChange: (newValues: string[]) => void;
  }) {
    const [newValue, setNewValue] = useState("");

    function add() {
      if (newValue.trim()) {
        onChange([...values, newValue.trim()]);
        setNewValue("");
      }
    }

    function remove(index: number) {
      onChange(values.filter((_, i) => i !== index));
    }

    return (
      <div className="mb-4">
        <Label>{label}</Label>
        {values.map((val, i) => (
          <div key={i} className="flex items-center gap-2 mb-1">
            <Input
              value={val}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const copy = [...values];
                copy[i] = e.target.value;
                onChange(copy);
              }}
            />
            <Button variant="destructive" size="icon" onClick={() => remove(i)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <div className="flex gap-2">
          <Input
            placeholder={`Add ${label.toLowerCase()}`}
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          />
          <Button onClick={add}>Add</Button>
        </div>
      </div>
    );
  }

  // ... rest of your form JSX unchanged ...
}