"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  inspirationItems as seed,
  ceremonies,
  traditions,
  locations,
  type InspirationItem,
} from "@/lib/mock-data";

const BLANK: Omit<InspirationItem, "id"> = {
  title: "",
  ceremony: "Mandap",
  tradition: "North Indian",
  color: "Forest & Gold",
  budget: "₹₹₹",
  location: "Udaipur",
  vendors: [],
  plate: "linear-gradient(135deg, #1b4332 0%, #2d6a4f 55%, #40916c 100%)",
  aspect: 1,
};

/**
 * Inspiration manager — add / edit / delete gallery items. Operates on
 * IN-MEMORY mock state (changes are not persisted; a clear notice says so).
 * Real CRUD + image upload come with the backend. No new animations.
 */
export function InspirationManager() {
  const [items, setItems] = useState<InspirationItem[]>(seed);
  const [editing, setEditing] = useState<InspirationItem | null>(null);
  const [creating, setCreating] = useState(false);

  function remove(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function save(draft: InspirationItem) {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === draft.id);
      return exists
        ? prev.map((i) => (i.id === draft.id ? draft : i))
        : [draft, ...prev];
    });
    setEditing(null);
    setCreating(false);
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-ink sm:text-4xl">
            Inspiration
          </h1>
          <p className="mt-1 text-ink-soft">
            {items.length} items in the gallery.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => {
            setEditing({ ...BLANK, id: `insp-${Date.now()}` });
            setCreating(true);
          }}
        >
          <Plus className="h-4 w-4" /> Add inspiration
        </Button>
      </header>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-ivory shadow-[var(--shadow-sm)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-cream-deep/40 text-xs uppercase tracking-wider text-ink-faint">
            <tr>
              <th className="px-4 py-3 font-semibold">Item</th>
              <th className="hidden px-4 py-3 font-semibold sm:table-cell">
                Tradition
              </th>
              <th className="hidden px-4 py-3 font-semibold md:table-cell">
                Location
              </th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="h-10 w-10 shrink-0 rounded-lg"
                      style={{ background: item.plate }}
                    />
                    <span className="font-medium text-ink">{item.title}</span>
                  </div>
                </td>
                <td className="hidden px-4 py-3 text-ink-soft sm:table-cell">
                  {item.tradition}
                </td>
                <td className="hidden px-4 py-3 text-ink-soft md:table-cell">
                  {item.location}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(item);
                        setCreating(false);
                      }}
                      aria-label={`Edit ${item.title}`}
                      className="grid h-9 w-9 place-items-center rounded-lg text-ink-soft hover:bg-cream-deep hover:text-forest-700"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      aria-label={`Delete ${item.title}`}
                      className="grid h-9 w-9 place-items-center rounded-lg text-ink-soft hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-ink-soft">
                  No items. Click “Add inspiration” to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <EditDialog
          item={editing}
          creating={creating}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSave={save}
        />
      )}
    </div>
  );
}

function EditDialog({
  item,
  creating,
  onClose,
  onSave,
}: {
  item: InspirationItem;
  creating: boolean;
  onClose: () => void;
  onSave: (i: InspirationItem) => void;
}) {
  const [draft, setDraft] = useState<InspirationItem>(item);
  const set = <K extends keyof InspirationItem>(k: K, v: InspirationItem[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-forest-900/45"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={creating ? "Add inspiration" : "Edit inspiration"}
        className="relative w-full max-w-lg rounded-3xl bg-ivory p-6 shadow-[var(--shadow-lg)] sm:p-8"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl text-ink">
            {creating ? "Add inspiration" : "Edit inspiration"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-full text-ink-soft hover:bg-cream-deep"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (draft.title.trim()) onSave(draft);
          }}
        >
          {/* Image upload placeholder */}
          <div className="flex items-center gap-4">
            <span
              aria-hidden
              className="grid h-16 w-16 shrink-0 place-items-center rounded-xl text-cream/70"
              style={{ background: draft.plate }}
            >
              <ImageIcon className="h-6 w-6" />
            </span>
            <button
              type="button"
              className="rounded-xl border border-dashed border-border-strong px-4 py-2.5 text-sm text-ink-soft hover:border-gold-400 hover:text-forest-700"
            >
              Upload image (coming soon)
            </button>
          </div>

          <Field label="Title">
            <Input
              value={draft.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Golden Mandap at Dawn"
              autoFocus
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Ceremony">
              <Select
                value={draft.ceremony}
                options={ceremonies}
                onChange={(v) => set("ceremony", v as InspirationItem["ceremony"])}
              />
            </Field>
            <Field label="Tradition">
              <Select
                value={draft.tradition}
                options={traditions}
                onChange={(v) =>
                  set("tradition", v as InspirationItem["tradition"])
                }
              />
            </Field>
            <Field label="Location">
              <Select
                value={draft.location}
                options={locations}
                onChange={(v) => set("location", v as InspirationItem["location"])}
              />
            </Field>
            <Field label="Budget">
              <Select
                value={draft.budget}
                options={["₹", "₹₹", "₹₹₹", "₹₹₹₹"]}
                onChange={(v) => set("budget", v as InspirationItem["budget"])}
              />
            </Field>
          </div>

          <Field label="Vendors (comma-separated)">
            <Input
              value={draft.vendors.join(", ")}
              onChange={(e) =>
                set(
                  "vendors",
                  e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                )
              }
              placeholder="Mandap Studio, The Lighthouse Films"
            />
          </Field>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" size="md" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              {creating ? "Add item" : "Save changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}

function Select({
  value,
  options,
  onChange,
}: {
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "h-12 w-full rounded-xl border border-border-strong bg-ivory px-3 text-[0.95rem] text-ink",
        "focus:border-gold-400 focus:outline-2 focus:outline-offset-2 focus:outline-gold-500",
      )}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
