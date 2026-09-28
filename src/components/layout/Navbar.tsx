import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { QuillStudioLogo } from "./Logo";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

const links = [
  { href: "#problem", label: "The problem" },
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#benefits", label: "Benefits" },
  { href: "#pricing", label: "Pricing" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  // Highlight the scene currently in view.
  useEffect(() => {
    const ids = links.map((l) => l.href.slice(1));
    const onScroll = () => {
      let current = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 z-50 flex justify-center px-2 sm:px-3" style={{ top: "calc(env(safe-area-inset-top, 0px) + 14px)" }}>
      <nav aria-label="Main" className="glass relative flex min-w-0 w-full max-w-[980px] items-center gap-1 rounded-full py-1.5 pl-3 pr-1 sm:gap-2 sm:py-2 sm:pl-5 sm:pr-2">
        <a href="#top" className="mr-auto flex min-w-0 items-center rounded-full py-1" aria-label="QuillStudio, back to top" data-magnetic>
          <QuillStudioLogo className="h-8 max-w-[116px] sm:h-9 sm:max-w-none" />
        </a>

        <ul className="hidden items-center gap-0.5 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                data-magnetic
                aria-current={active === l.href.slice(1) ? "true" : undefined}
                className={cn(
                  "inline-block rounded-full px-3.5 py-2 text-[0.93rem] text-slate transition-colors hover:text-ink",
                  active === l.href.slice(1) && "bg-ink/[0.06] text-ink",
                )}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <LiquidMetalButton label="Book a demo" href={site.bookDemoUrl} className="ml-1 hidden h-11 sm:inline-flex" />

        <button
          type="button"
          className="ml-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink lg:hidden sm:h-11 sm:w-11"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>

        {open && (
          <ul id="mobile-menu" className="glass glass-menu absolute inset-x-0 top-[calc(100%+8px)] flex flex-col rounded-3xl p-2 lg:hidden">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-[1rem] text-ink hover:bg-ink/[0.05]"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  );
}
