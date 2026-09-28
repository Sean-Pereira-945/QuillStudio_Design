import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/use-media";

/** Soft blur-to-sharp entrance, staggered across children marked with <RevealItem>. */
const group: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(8px)" },
  shown: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export function Reveal({ children, className, as = "div" }: { children: ReactNode; className?: string; as?: "div" | "ul" | "ol" }) {
  const reduced = usePrefersReducedMotion();
  const M = as === "ul" ? motion.ul : as === "ol" ? motion.ol : motion.div;
  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }
  return (
    <M className={className} variants={group} initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.15 }}>
      {children}
    </M>
  );
}

export function RevealItem({ children, className, as = "div" }: { children: ReactNode; className?: string; as?: "div" | "li" }) {
  const reduced = usePrefersReducedMotion();
  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }
  const M = as === "li" ? motion.li : motion.div;
  return (
    <M className={className} variants={item}>
      {children}
    </M>
  );
}
