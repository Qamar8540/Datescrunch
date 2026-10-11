"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/slug";
import StatusBanner from "@/components/status-banner";
import ProductImageUploader from "@/components/product-image-uploader";
import ProductVideoInput from "@/components/product-video-input";
import type { ProductInput } from "@/lib/actions/products";

interface Category {
  id: string;
  name: string;
}

export interface ProductFormValues {
  name: string;
  slug: string;
  description: string;
  category_id: string;
  price: string;
  discount_price: string;
  stock_qty: string;
  is_active: boolean;
  is_featured: boolean;
  video_url: string;
  images: string[];
}

const emptyValues: ProductFormValues = {
  name: "",
  slug: "",
  description: "",
  category_id: "",
  price: "",
  discount_price: "",
  stock_qty: "0",
  is_active: true,
  is_featured: false,
  video_url: "",
  images: [],
};

export default function ProductForm({
  categories,
  initialValues,
  onSave,
}: {
  categories: Category[];
  initialValues?: ProductFormValues;
  onSave: (input: ProductInput) => Promise<{ error?: string }>;
}) {
  const router = useRouter();
  const isEdit = Boolean(initialValues);
  const [values, setValues] = useState<ProductFormValues>(
    initialValues ?? emptyValues
  );
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleNameChange(name: string) {
    update("name", name);
    if (!slugTouched) {
      update("slug", slugify(name));
    }
  }

  function validateClientSide(): string | null {
    if (!values.name.trim()) return "Product name is required.";
    if (!values.category_id) return "Please select a category.";
    const price = Number(values.price);
    if (!values.price || Number.isNaN(price) || price <= 0) {
      return "Price must be a number greater than 0.";
    }
    if (
      values.discount_price &&
      Number(values.discount_price) >= price
    ) {
      return "Discount price must be less than the regular price.";
    }
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const clientError = validateClientSide();
    if (clientError) {
      setError(clientError);
      return;
    }

    setSaving(true);
    const result = await onSave(values);
    setSaving(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    router.push("/admin/products?success=1");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl space-y-6 rounded-card border border-sand bg-white p-6"
    >
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Product name
        </label>
        <input
          id="name"
          required
          value={values.name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="mt-1 w-full rounded-card border border-sand bg-white px-3 py-2 text-sm focus:border-mahogany focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium">
          Slug
        </label>
        <input
          id="slug"
          value={values.slug}
          onChange={(e) => {
            setSlugTouched(true);
            update("slug", e.target.value);
          }}
          className="mt-1 w-full rounded-card border border-sand bg-white px-3 py-2 text-sm font-mono focus:border-mahogany focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
          className="mt-1 w-full rounded-card border border-sand bg-white px-3 py-2 text-sm focus:border-mahogany focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium">
          Category
        </label>
        <select
          id="category"
          required
          value={values.category_id}
          onChange={(e) => update("category_id", e.target.value)}
          className="mt-1 w-full rounded-card border border-sand bg-white px-3 py-2 text-sm focus:border-mahogany focus:outline-none"
        >
          <option value="">Select a category…</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="price" className="block text-sm font-medium">
            Price (₹)
          </label>
          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            required
            value={values.price}
            onChange={(e) => update("price", e.target.value)}
            className="mt-1 w-full rounded-card border border-sand bg-white px-3 py-2 text-sm focus:border-mahogany focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="discount_price" className="block text-sm font-medium">
            Discount price (₹)
          </label>
          <input
            id="discount_price"
            type="number"
            min="0"
            step="0.01"
            value={values.discount_price}
            onChange={(e) => update("discount_price", e.target.value)}
            className="mt-1 w-full rounded-card border border-sand bg-white px-3 py-2 text-sm focus:border-mahogany focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="stock_qty" className="block text-sm font-medium">
            Stock quantity
          </label>
          <input
            id="stock_qty"
            type="number"
            min="0"
            step="1"
            required
            value={values.stock_qty}
            onChange={(e) => update("stock_qty", e.target.value)}
            className="mt-1 w-full rounded-card border border-sand bg-white px-3 py-2 text-sm focus:border-mahogany focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={values.is_active}
            onChange={(e) => update("is_active", e.target.checked)}
          />
          Active (visible to customers)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={values.is_featured}
            onChange={(e) => update("is_featured", e.target.checked)}
          />
          Featured
        </label>
      </div>

      <div>
        <span className="block text-sm font-medium">Product images</span>
        <div className="mt-2">
          <ProductImageUploader
            images={values.images}
            onChange={(images) => update("images", images)}
          />
        </div>
      </div>

      <div>
        <span className="block text-sm font-medium">Product video (optional)</span>
        <div className="mt-2">
          <ProductVideoInput
            value={values.video_url}
            onChange={(url) => update("video_url", url)}
          />
        </div>
      </div>

      {error && <StatusBanner type="error" message={error} />}

      <div className="flex items-center gap-3 border-t border-sand pt-6">
        <button
          type="submit"
          disabled={saving}
          className="rounded-card bg-mahogany px-5 py-2 text-sm font-medium text-ivory hover:bg-mahogany-dark disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save product"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="text-sm text-stone hover:text-coffee"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
