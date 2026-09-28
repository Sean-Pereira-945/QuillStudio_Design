import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * SceneStack: each section is a full-height scene that sticks while the next slides up over it.
 * The covered scene scales down and fades slightly as the next arrives.
 *
 * Safety rules (requirements 7.3 and 11):
 *  - scenes taller than the viewport stick only once their bottom is reached
 *    (top = viewport height minus scene height), so no content is ever hidden
 *  - anchors are zero-height markers in normal flow, so nav links work in both directions
 *  - normal scrolling below 768px wide, below 760px tall, and with reduced motion
 */

export function SceneStack({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const mq = window.matchMedia("(min-width: 768px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)");
    let raf = 0;
    let on = false;

    const scenes = () => Array.from(root.querySelectorAll<HTMLElement>(":scope > .scene"));
    const anchors = () => Array.from(root.querySelectorAll<HTMLElement>(":scope > .scene-anchor"));

    const measure = () => {
      const vh = window.innerHeight;
      scenes().forEach((s) => {
        const top = Math.min(0, vh - s.offsetHeight);
        s.style.setProperty("--stick-top", `${top}px`);
      });
    };

    const frame = () => {
      raf = 0;
      if (!on) return;
      const vh = window.innerHeight;
      const s = scenes();
      const a = anchors();
      s.forEach((scene, i) => {
        const inner = scene.firstElementChild as HTMLElement | null;
        const next = a[i + 1];
        if (!inner) return;
        if (!next) {
          inner.style.transform = "";
          inner.style.opacity = "";
          return;
        }
        const top = next.getBoundingClientRect().top;
        const p = Math.min(1, Math.max(0, 1 - top / vh));
        inner.style.transform = p > 0 ? `scale(${1 - 0.06 * p})` : "";
        inner.style.opacity = p > 0 ? String(1 - 0.45 * p) : "";
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const apply = () => {
      on = mq.matches;
      root.dataset.stack = on ? "on" : "off";
      if (on) {
        measure();
        frame();
      } else {
        scenes().forEach((s) => {
          const inner = s.firstElementChild as HTMLElement | null;
          if (inner) {
            inner.style.transform = "";
            inner.style.opacity = "";
          }
        });
      }
    };

    const ro = new ResizeObserver(() => {
      if (on) {
        measure();
        onScroll();
      }
    });
    scenes().forEach((s) => ro.observe(s));

    apply();
    mq.addEventListener("change", apply);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", apply);
    return () => {
      mq.removeEventListener("change", apply);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", apply);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={rootRef} data-stack="off" className="relative">
      {children}
    </div>
  );
}

type SceneProps = {
  id: string;
  label: string;
  children: ReactNode;
  tone?: "paper" | "pearl" | "mist";
  first?: boolean;
  className?: string;
};

const tones = { paper: "#fbfaf7", pearl: "#f3f1ec", mist: "#ffffff" };

/** Returns an anchor marker and the scene itself, as siblings, so the stack can find both. */
export function Scene({ id, label, children, tone = "paper", first, className }: SceneProps) {
  return (
    <>
      <div id={id} className="scene-anchor" aria-hidden="true" />
      <section
        className="scene"
        aria-label={label}
        data-first={first ? "" : undefined}
        style={{ "--scene-bg": tones[tone] } as CSSProperties}
      >
        <div className={cn("scene-inner", className)}>{children}</div>
      </section>
    </>
  );
}
