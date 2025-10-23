"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const schema = z.object({
  name: z.string().min(2),
  price_cents: z.coerce.number().int().min(0),
  status: z.enum(["draft", "active", "archived"]).default("draft"),
});

type FormValues = z.infer<typeof schema>;

export default function NewProductPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { status: "draft" } });
  const [uploading, setUploading] = useState(false);

  const onSubmit = async (values: FormValues) => {
    setUploading(true);
    const { error } = await supabase.from("products").insert({
      name: values.name,
      status: values.status,
      price_cents: values.price_cents,
    });
    setUploading(false);
    if (!error) navigate("/catalog/products");
    else alert(error.message);
  };

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-xl font-semibold">New Product</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="block text-sm">Name</label>
          <input className="mt-1 w-full rounded-lg border px-3 py-2" {...register("name")} />
          {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm">Price (cents)</label>
          <input type="number" className="mt-1 w-full rounded-lg border px-3 py-2" {...register("price_cents", { valueAsNumber: true })} />
          {errors.price_cents && <p className="text-xs text-red-600">{errors.price_cents.message}</p>}
        </div>
        <div>
          <label className="block text-sm">Status</label>
          <select className="mt-1 w-full rounded-lg border px-3 py-2" {...register("status")}>
            <option value="draft">draft</option>
            <option value="active">active</option>
            <option value="archived">archived</option>
          </select>
        </div>
        <Button disabled={isSubmitting || uploading} type="submit" className="inline-flex rounded-lg bg-black px-4 py-2 text-white">
          {uploading ? "Saving..." : "Create"}
        </Button>
      </form>
    </div>
  );
}