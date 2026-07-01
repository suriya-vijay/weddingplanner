"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Shield, Store, LogOut, ChevronDown } from "lucide-react";
import { useSession, initialsOf } from "@/components/auth/session";
import { cn } from "@/lib/utils";

/**
 * Desktop account menu — shown in the header when a (mock) user is signed in.
 * Avatar + name button toggling a small dropdown with role-gated links.
 * Plain React state; no dropdown library, no new motion/blur.
 */
export function AccountMenu({ solid }: { solid: boolean }) {
  const { user, signOut } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!user) return null;

  const handleSignOut = () => {
    setOpen(false);
    signOut();
    router.push("/");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          "flex items-center gap-2 rounded-full py-1 pl-1 pr-2.5 text-sm font-medium transition-colors duration-[var(--dur-fast)]",
          solid
            ? "text-ink-soft hover:bg-forest-700/[0.06]"
            : "text-cream hover:bg-cream/10",
        )}
      >
        <span
          aria-hidden
          className="grid h-8 w-8 place-items-center rounded-full bg-gold-500 text-xs font-semibold text-forest-900"
        >
          {initialsOf(user.name)}
        </span>
        <span className="hidden max-w-[9rem] truncate xl:inline">{user.name}</span>
        <ChevronDown className="h-4 w-4 opacity-70" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+0.5rem)] w-60 overflow-hidden rounded-2xl border border-border bg-cream shadow-[var(--shadow-lg)]"
        >
          <div className="border-b border-border px-4 py-3">
            <p className="truncate text-sm font-medium text-ink">{user.name}</p>
            <p className="text-xs capitalize text-ink-faint">
              {user.role} · demo session
            </p>
          </div>
          <div className="p-1.5">
            {user.role === "couple" && (
              <MenuLink href="/dashboard" icon={LayoutDashboard} onClick={() => setOpen(false)}>
                Wedding dashboard
              </MenuLink>
            )}
            {user.role === "vendor" && (
              <MenuLink href="/vendor" icon={Store} onClick={() => setOpen(false)}>
                Vendor portal
              </MenuLink>
            )}
            {user.role === "admin" && (
              <MenuLink href="/admin" icon={Shield} onClick={() => setOpen(false)}>
                Admin panel
              </MenuLink>
            )}
            <button
              type="button"
              role="menuitem"
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-soft transition-colors hover:bg-forest-700/[0.06] hover:text-forest-700"
            >
              <LogOut className="h-[1.1rem] w-[1.1rem]" /> Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  icon: Icon,
  onClick,
  children,
}: {
  href: string;
  icon: typeof LayoutDashboard;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-soft transition-colors hover:bg-forest-700/[0.06] hover:text-forest-700"
    >
      <Icon className="h-[1.1rem] w-[1.1rem]" /> {children}
    </Link>
  );
}
