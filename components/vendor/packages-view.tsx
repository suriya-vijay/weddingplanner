"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { Panel } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { VendorPackage } from "@/lib/mock-data";

type Pkg = VendorPackage & { id: string };

export function PackagesView({ seed }: { seed: VendorPackage[] }) {
  const [pkgs, setPkgs] = useState<Pkg[]>(
    seed.map((p, i) => ({ ...p, id: `pkg-${i}` })),
  );
  const [editing, setEditing] = useState<Pkg | null>(null);
  const [creating, setCreating] = useState(false);

  const remove = (id: string) => setPkgs((prev) => prev.filter((p) => p.id !== id));

  const save = (pkg: Pkg) =>
    setPkgs((prev) => {
      const exists = prev.some((p) => p.id === pkg.id);
      return exists ? prev.map((p) => (p.id === pkg.id ? pkg : p)) : [...prev, pkg];
    });

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow text-gold-600">Vendor portal</p>
          <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">Packages</h1>
          <p className="mt-1 text-ink-soft">
            The offerings couples can enquire about. Preview only — saving comes
            with the backend.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" /> Add package
        </Button>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {pkgs.map((pkg) => (
          <Panel key={pkg.id} className="flex flex-col">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-gold-600">
                  {pkg.name}
                </p>
                <p className="mt-1 font-serif text-2xl text-ink">{pkg.price}</p>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setEditing(pkg)}
                  aria-label={`Edit ${pkg.name}`}
                  className="grid h-8 w-8 place-items-center rounded-lg text-ink-faint transition-colors hover:bg-forest-700/[0.06] hover:text-forest-700"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(pkg.id)}
                  aria-label={`Delete ${pkg.name}`}
                  className="grid h-8 w-8 place-items-center rounded-lg text-ink-faint transition-colors hover:bg-maroon/10 hover:text-maroon"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <ul className="mt-4 space-y-2">
              {pkg.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-ink-soft">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest-600" />
                  {f}
                </li>
              ))}
            </ul>
          </Panel>
        ))}
      </div>

      {(creating || editing) && (
        <PackageDialog
          initial={editing}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSave={(pkg) => {
            save(pkg);
            setCreating(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function PackageDialog({
  initial,
  onClose,
  onSave,
}: {
  initial: Pkg | null;
  onClose: () => void;
  onSave: (pkg: Pkg) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [price, setPrice] = useState(initial?.price ?? "");
  const [features, setFeatures] = useState((initial?.features ?? []).join("\n"));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initial?.id ?? `pkg-${Date.now()}`,
      name: name.trim() || "New package",
      price: price.trim() || "₹—",
      features: features
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-forest-900/45 px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-cream p-6 shadow-[var(--shadow-lg)]">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl text-ink">
            {initial ? "Edit package" : "Add package"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-ink-faint hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">Name</span>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Signature" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">Price</span>
            <Input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. ₹6,50,000" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">
              Features (one per line)
            </span>
            <textarea
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              rows={4}
              placeholder={"2-day coverage\nFilm + photo\nHighlight reel"}
              className="w-full rounded-xl border border-border-strong bg-ivory px-4 py-3 text-[0.95rem] text-ink transition-colors duration-[var(--dur-fast)] focus:border-gold-400 focus:outline-2 focus:outline-offset-2 focus:outline-gold-500"
            />
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              {initial ? "Save" : "Add package"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
