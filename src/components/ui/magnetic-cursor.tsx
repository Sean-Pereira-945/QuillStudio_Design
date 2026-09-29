import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useFinePointer, usePrefersReducedMotion } from "@/lib/use-media";

/**
 * MagneticCursor
 *
 * Same public API as the 21st.dev "Fluid Magnetic Cursor" by Hossain Jahed
 * (https://21st.dev/@jahed/components/magnetic-cursor): a wrapper with
 * `magneticFactor`, `cursorSize` and `blendMode`, and elements opt in with `data-magnetic`.
 * The page only exposed the usage file, not the component source, so this is a
 * compatible implementation built on GSAP. If the original source is supplied it can
 * replace this file without touching any other component.
 *
 * Site rules (requirements 7.5 and 11):
 *  - off on touch and coarse pointers, and with reduced motion
 *  - the system cursor always stays visible; the ring trails it (see index.css)
 *  - never intercepts clicks (pointer-events: none) and text fields keep their cursor
 *  - keyboard focus rings are untouched
 */

type Props = {
  children: ReactNode;
  magneticFactor?: number;
  cursorSize?: number;
  blendMode?: "normal" | "difference" | "exclusion" | "multiply";
};

const INTERACTIVE = "[data-magnetic], a[href], button, [role='button'], summary, label[for]";

export function MagneticCursor({
  children,
  magneticFactor = 0.3,
  cursorSize = 30,
  blendMode = "normal",
}: Props) {
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const enabled = fine && !reduced;
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (!enabled) {
      html.classList.remove("has-magnetic-cursor");
      return;
    }
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    let started = false;
    let target: HTMLElement | null = null;
    let pulled: HTMLElement | null = null;

    try {
      gsap.set([ring, dot], { xPercent: -50, yPercent: -50 });
      gsap.set(ring, { width: cursorSize, height: cursorSize });
    } catch {
      return; // leave the system cursor alone
    }

    const ringX = gsap.quickTo(ring, "x", { duration: 0.38, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.38, ease: "power3.out" });
    const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power2.out" });

    const release = () => {
      if (pulled) {
        gsap.to(pulled, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.45)" });
        pulled = null;
      }
      target = null;
      ring.classList.remove("is-active");
      gsap.to(ring, { width: cursorSize, height: cursorSize, borderRadius: 999, duration: 0.3, ease: "power3.out" });
      gsap.to(dot, { scale: 1, duration: 0.2 });
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!started) {
        started = true;
        html.classList.add("has-magnetic-cursor");
      }
      html.classList.remove("mc-hidden");
      dotX(e.clientX);
      dotY(e.clientY);

      const hit = (e.target as Element | null)?.closest?.(INTERACTIVE) as HTMLElement | null;
      if (hit !== target) {
        release();
        if (hit) {
          target = hit;
          ring.classList.add("is-active");
          gsap.to(dot, { scale: 0.5, duration: 0.2 });
        }
      }

      if (target) {
        const r = target.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const small = r.width < 360 && r.height < 120;
        if (small) {
          // Wrap the element and let it lean toward the pointer.
          const radius = getComputedStyle(target).borderRadius || "12px";
          gsap.to(ring, {
            width: r.width + 10,
            height: r.height + 10,
            borderRadius: radius === "0px" ? 12 : radius,
            duration: 0.3,
            ease: "power3.out",
          });
          ringX(cx + dx * 0.12);
          ringY(cy + dy * 0.12);
          if (target.hasAttribute("data-magnetic")) {
            pulled = target;
            gsap.to(target, { x: dx * magneticFactor * 0.4, y: dy * magneticFactor * 0.4, duration: 0.4, ease: "power3.out" });
          }
        } else {
          // Large targets (cards): grow the ring a little instead of wrapping.
          gsap.to(ring, { width: cursorSize * 1.8, height: cursorSize * 1.8, borderRadius: 999, duration: 0.3 });
          ringX(e.clientX);
          ringY(e.clientY);
        }
      } else {
        ringX(e.clientX);
        ringY(e.clientY);
      }
    };

    const onLeaveWindow = () => html.classList.add("mc-hidden");
    const onDown = () => gsap.to(ring, { scale: 0.88, duration: 0.12 });
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.3, ease: "back.out(3)" });
    const onTouch = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") html.classList.remove("has-magnetic-cursor");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointerdown", onTouch, { passive: true });
    document.addEventListener("mouseleave", onLeaveWindow);
    window.addEventListener("scroll", release, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointerdown", onTouch);
      document.removeEventListener("mouseleave", onLeaveWindow);
      window.removeEventListener("scroll", release);
      release();
      html.classList.remove("has-magnetic-cursor", "mc-hidden");
    };
  }, [enabled, cursorSize, magneticFactor]);

  return (
    <>
      {children}
      {enabled && (
        <>
          <div ref={ringRef} className="mc-ring" style={{ mixBlendMode: blendMode }} aria-hidden="true" />
          <div ref={dotRef} className="mc-dot" aria-hidden="true" />
        </>
      )}
    </>
  );
}

export default MagneticCursor;
