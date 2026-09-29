import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { QuillStudioLogo } from "./Logo";
import { GlassButton } from "@/components/ui/glass-button";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

const links = [
  // Same order as the sections on the page.
  { href: "#problem", label: "The problem" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);

  // Always on screen; turns more solid once the page leaves the top.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the scene currently in view.
  useEffect(() => {
    const ids = links.map((l) => l.href.slice(1));
    const onScroll = () => {
      // The section whose top most recently passed the 40% line, by page position, not link order.
      let current = "";
      let best = -Infinity;
      for (const id of ids) {
        const top = document.getElementById(id)?.getBoundingClientRect().top;
        if (top !== undefined && top <= window.innerHeight * 0.4 && top > best) {
          best = top;
          current = id;
        }
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
    <header className="fixed inset-x-0 z-50 flex justify-center px-5 sm:px-8" style={{ top: "calc(env(safe-area-inset-top, 0px) + 14px)" }}>
      <nav
        aria-label="Main"
        className={cn(
          "glass relative flex min-w-0 w-full max-w-[1232px] items-center gap-1 rounded-full py-1.5 pl-3 pr-1 transition-[background,box-shadow] duration-300 sm:gap-2 sm:py-2 sm:pl-5 sm:pr-2",
          scrolled && "is-scrolled",
        )}
      >
        <a href="#top" className="mr-auto flex min-w-0 items-center rounded-full py-1" aria-label="QuillStudio, back to top" data-magnetic>
          <QuillStudioLogo className="h-8 max-w-[7.25rem] sm:h-9 sm:max-w-none" />
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

        <GlassButton label="Book a demo" href={site.bookDemoUrl} variant="primary" size="sm" className="ml-1 sm:h-11 sm:px-6 sm:text-[0.95rem]" />

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
