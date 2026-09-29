import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * GlassButton
 * A clear, frosted glass pill, modelled on the Glass Button by @jahed on 21st.dev
 * (https://21st.dev/@jahed/components/glass-button). Rebuilt here in plain CSS, see `.glass-btn` in index.css.
 *
 *  - `href` renders an <a>, otherwise a <button>
 *  - `width`: "auto" grows with the label, "wide" fills its container
 *  - `variant`: "primary" tints the glass ink for the one main action on a screen
 *  - no WebGL, so it costs nothing on phones
 */

type Props = {
  label: string;
  onClick?: () => void;
  href?: string;
  icon?: ReactNode;
  width?: "auto" | "wide";
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary";
  type?: "button" | "submit";
  ariaLabel?: string;
  className?: string;
  external?: boolean;
  disabled?: boolean;
};

export function GlassButton({
  label,
  onClick,
  href,
  icon,
  width = "auto",
  size = "md",
  variant = "secondary",
  type = "button",
  ariaLabel,
  className,
  external,
  disabled,
}: Props) {
  const shared = {
    className: cn(
      "glass-btn relative inline-flex shrink-0 select-none items-center justify-center gap-2 rounded-full font-medium tracking-[0.01em] disabled:opacity-60",
      size === "lg" ? "h-14 px-7 text-[1.02rem]" : size === "sm" ? "h-10 px-4 text-[0.88rem]" : "h-12 px-6 text-[0.95rem]",
      variant === "primary" ? "is-primary" : "text-ink",
      width === "wide" ? "w-full" : "w-auto",
      className,
    ),
    "aria-label": ariaLabel,
    "data-magnetic": "",
  };

  const content = (
    <>
      <span className="relative z-10 whitespace-nowrap">{label}</span>
      {icon && <span className="relative z-10 flex">{icon}</span>}
    </>
  );

  if (href) {
    return (
      <a {...shared} href={href} onClick={onClick} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {content}
      </a>
    );
  }
  return (
    <button {...shared} type={type} onClick={onClick} disabled={disabled}>
      {content}
    </button>
  );
}

export default GlassButton;
