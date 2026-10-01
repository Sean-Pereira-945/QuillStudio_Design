import { useRef, type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/use-media";

/**
 * GradientCard
 * Used only for cards that describe a capability or a document type (requirements 8.2).
 *
 * Changes from the supplied component:
 *  - the four variants (orange, gray, purple, green) are retuned to rose, amber, violet, neutral
 *  - the stock background image slot is replaced by a large, low-opacity Lucide icon cropped at the corner
 *  - the badge shows a real category, never a marketing label
 *  - the CTA link renders only when a real `href` is supplied
 *  - hovering lifts and tilts the card toward the pointer, with a soft light that follows it; all off for reduced motion
 */

const cardVariants = cva(
  "group relative isolate flex h-full flex-col overflow-hidden rounded-[1.375rem] border p-5 text-ink shadow-[0_1px_2px_rgba(22,32,46,0.04)] transition-shadow duration-500 hover:shadow-[0_28px_50px_-22px_rgba(22,32,46,0.32)]",
  {
    variants: {
      variant: {
        rose: "border-[#f1d6df] bg-[radial-gradient(120%_90%_at_100%_0%,rgba(201,42,99,0.16),transparent_58%),radial-gradient(90%_70%_at_0%_100%,rgba(221,139,31,0.12),transparent_60%),linear-gradient(180deg,#ffffff,#fdf8f6)]",
        amber:
          "border-[#f0e0c6] bg-[radial-gradient(120%_90%_at_100%_0%,rgba(221,139,31,0.18),transparent_58%),radial-gradient(90%_70%_at_0%_100%,rgba(201,42,99,0.08),transparent_60%),linear-gradient(180deg,#ffffff,#fdf9f2)]",
        violet:
          "border-[#e2dcf3] bg-[radial-gradient(120%_90%_at_100%_0%,rgba(109,79,196,0.15),transparent_58%),radial-gradient(90%_70%_at_0%_100%,rgba(201,42,99,0.07),transparent_60%),linear-gradient(180deg,#ffffff,#f9f8fd)]",
        neutral:
          "border-line bg-[radial-gradient(120%_90%_at_100%_0%,rgba(91,101,119,0.12),transparent_58%),linear-gradient(180deg,#ffffff,#f7f6f2)]",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

const accent: Record<NonNullable<VariantProps<typeof cardVariants>["variant"]>, string> = {
  rose: "#c92a63",
  amber: "#b76d10",
  violet: "#6d4fc4",
  neutral: "#5b6577",
};

export type GradientCardProps = VariantProps<typeof cardVariants> & {
  title: string;
  description: ReactNode;
  badge: string;
  icon: LucideIcon;
  href?: string;
  linkLabel?: string;
  className?: string;
  children?: ReactNode;
};

export function GradientCard({
  title,
  description,
  badge,
  icon: Icon,
  href,
  linkLabel,
  variant = "neutral",
  className,
  children,
}: GradientCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 180, damping: 16 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 180, damping: 16 });
  // Light that follows the pointer, in percent of the card.
  const lx = useTransform(mx, (v) => (v + 0.5) * 100);
  const ly = useTransform(my, (v) => (v + 0.5) * 100);
  const glow = useMotionTemplate`radial-gradient(60% 60% at ${lx}% ${ly}%, rgba(255,255,255,0.75), transparent 70%)`;
  const color = accent[variant ?? "neutral"];

  return (
    <motion.article
      ref={ref}
      className={cn(cardVariants({ variant }), className)}
      style={reduced ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 800 }}
      initial={reduced ? false : { y: 28, scale: 0.97 }}
      whileInView={reduced ? undefined : { y: 0, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      whileHover={reduced ? undefined : { y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      onPointerMove={(e) => {
        if (reduced || e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      <Icon
        aria-hidden="true"
        strokeWidth={1.1}
        className="pointer-events-none absolute -bottom-8 -right-8 -z-10 h-36 w-36 opacity-[0.1] transition-all duration-700 ease-out group-hover:-translate-x-2 group-hover:-translate-y-2 group-hover:-rotate-6 group-hover:scale-[1.2] group-hover:opacity-[0.18]"
        style={{ color }}
      />
      {!reduced && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-[5] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: glow }}
        />
      )}

      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ background: color }} aria-hidden="true" />
        <span className="data-label" style={{ color }}>
          {badge}
        </span>
      </div>

      <h3 className="display mt-3 text-[1.3rem] font-medium leading-[1.15]">{title}</h3>
      <div className="mt-2 max-w-[46ch] text-[0.9rem] leading-snug text-slate">{description}</div>

      {children}

      {href && linkLabel && (
        <a
          href={href}
          data-magnetic
          className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full text-[0.88rem] font-medium underline decoration-1 underline-offset-4"
          style={{ color }}
        >
          {linkLabel}
        </a>
      )}
    </motion.article>
  );
}

export default GradientCard;
