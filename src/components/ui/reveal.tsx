import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/use-media";

/**
 * Fade-in on scroll.
 * Each <RevealItem> watches its own position, so an item low on a long phone page fades in when it actually
 * reaches the screen, not when its group first appears. <Reveal> is a plain wrapper kept for layout.
 * Items fade in and rise a little. For reduced motion they only fade, more quickly, with no movement.
 */

const viewport = { once: true, amount: 0, margin: "0px 0px -40px 0px" } as const;

export function Reveal({ children, className, as = "div" }: { children: ReactNode; className?: string; as?: "div" | "ul" | "ol" }) {
  const Tag = as;
  return <Tag className={className}>{children}</Tag>;
}

export function RevealItem({
  children,
  className,
  as = "div",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li";
  /** Seconds. Use small steps (0.08) to stagger items that sit side by side. */
  delay?: number;
}) {
  const reduced = usePrefersReducedMotion();
  const M = as === "li" ? motion.li : motion.div;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: reduced ? 0.3 : 0.8, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  );
}
