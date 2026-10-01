import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/**
 * Smooth, inertial wheel scrolling (Lenis). The page still scrolls natively underneath,
 * so window scroll listeners keep working. Touch keeps the device's own scrolling,
 * and reduced-motion users get plain scrolling.
 *
 * Desktop also snaps section by section: once a wheel or trackpad gesture ends, the page glides to the
 * next section in the direction you scrolled (or back, after a tiny nudge). While it glides, and until
 * trackpad momentum dies down, further wheel events are swallowed, so one gesture never skips a section.
 * Sections taller than the screen stay free to scroll through. Off on touch and small screens.
 */

const SNAP_MEDIA = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";
const IDLE_MS = 140; // a gesture has ended once the wheel is quiet this long
const QUIET_MS = 180; // after a snap, wheel events are ignored until they stop for this long
const NUDGE = 0.08; // of the viewport: scrolls smaller than this settle back where they started

type Point = { y: number; section: number; edge: "top" | "end" };

function snapPoints(vh: number): Point[] {
  const blocks = [...document.querySelectorAll<HTMLElement>("section.scene, footer")];
  const max = document.documentElement.scrollHeight - vh;
  const points: Point[] = [];
  blocks.forEach((el, section) => {
    const top = el.getBoundingClientRect().top + window.scrollY;
    const h = el.offsetHeight;
    points.push({ y: Math.min(top, max), section, edge: "top" });
    // Clearly taller than the screen: also stop where its bottom meets the bottom of the screen.
    if (h > vh + 24) points.push({ y: Math.min(top + h - vh, max), section, edge: "end" });
  });
  return points.sort((a, b) => a.y - b.y);
}

export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.085, // lower = silkier glide, higher = tighter to the wheel
      wheelMultiplier: 1,
      smoothWheel: true,
    });

    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });

    // ---------- Section snapping (desktop, mouse or trackpad) ----------
    const snapMedia = window.matchMedia(SNAP_MEDIA);
    let snapping = false;
    let quietUntil = 0;
    let gestureStart: number | null = null;
    let idle = 0;

    const settle = () => {
      const start = gestureStart ?? lenis.scroll;
      gestureStart = null;
      const vh = window.innerHeight;
      const y = lenis.targetScroll;
      const dir = Math.sign(y - start);
      if (dir === 0) return;

      const points = snapPoints(vh);
      const prev = points.filter((p) => p.y <= y).at(-1);
      const next = points.find((p) => p.y > y);
      if (!prev || !next) return;
      // Inside a section taller than the screen: let it scroll freely.
      if (prev.section === next.section && prev.edge === "top" && next.edge === "end") return;

      const nudge = NUDGE * vh;
      const target = dir > 0 ? (y - prev.y > nudge ? next : prev) : next.y - y > nudge ? prev : next;
      if (Math.abs(target.y - lenis.scroll) < 1) return;

      snapping = true;
      lenis.scrollTo(target.y, {
        duration: 0.85,
        easing: (t) => 1 - Math.pow(1 - t, 3),
        lock: true,
        onComplete: () => {
          snapping = false;
          quietUntil = performance.now() + QUIET_MS;
        },
      });
    };

    // Capture phase on window runs before Lenis's own wheel listener, so swallowed events never move the page.
    const onWheel = (e: WheelEvent) => {
      if (!snapMedia.matches || e.ctrlKey) return;
      const now = performance.now();
      if (snapping || now < quietUntil) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (!snapping) quietUntil = now + QUIET_MS; // momentum still arriving: stay quiet
        return;
      }
      if (gestureStart === null) gestureStart = lenis.scroll;
      window.clearTimeout(idle);
      idle = window.setTimeout(settle, IDLE_MS);
    };
    window.addEventListener("wheel", onWheel, { capture: true, passive: false });

    // In-page links glide too. The skip link keeps its default jump so focus moves with it.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const link = (e.target as Element).closest?.<HTMLAnchorElement>('a[href^="#"]');
      if (!link || link.classList.contains("skip-link")) return;
      const hash = link.getAttribute("href")!;
      const target = hash === "#" ? null : document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { duration: 1.2 });
      history.pushState(null, "", hash);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("wheel", onWheel, { capture: true });
      window.clearTimeout(idle);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);
}
