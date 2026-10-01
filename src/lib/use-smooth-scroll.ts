import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/**
 * Smooth, inertial wheel scrolling (Lenis). The page still scrolls natively underneath,
 * so window scroll listeners keep working. Touch keeps the device's own scrolling,
 * and reduced-motion users get plain scrolling.
 */
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
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);
}
