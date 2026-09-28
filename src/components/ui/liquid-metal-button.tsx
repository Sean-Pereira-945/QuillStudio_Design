import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ShaderMount,
  liquidMetalFragmentShader,
  getShaderColorFromString,
} from "@paper-design/shaders";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/use-media";

/**
 * LiquidMetalButton
 * A white button wrapped in a live liquid metal rim (WebGL, @paper-design/shaders).
 *
 * Changes from the supplied component, per requirements 8.1:
 *  - `href` support: renders an <a> when given, a <button> otherwise
 *  - `width`: "auto" grows with the label, "wide" for full-width mobile use; no fixed 142px
 *  - label uses a soft peach on the white surface
 *  - reduced motion: shader renders one still frame
 *  - shader only mounts while the button is near the viewport, and is disposed when far away,
 *    so only a handful of WebGL contexts exist at once
 *  - keeps an accessible name (`ariaLabel` required in icon mode) and the global focus ring
 *  - a CSS chrome gradient shows if WebGL is not available
 */

type Props = {
  label: string;
  onClick?: () => void;
  href?: string;
  viewMode?: "text" | "icon";
  icon?: ReactNode;
  width?: "auto" | "wide";
  size?: "md" | "lg";
  type?: "button" | "submit";
  ariaLabel?: string;
  className?: string;
  external?: boolean;
  disabled?: boolean;
};

const uniforms = {
  u_colorBack: getShaderColorFromString("#9aa0aa"),
  u_colorTint: getShaderColorFromString("#ffffff"),
  u_repetition: 4,
  u_softness: 0.45,
  u_shiftRed: 0.3,
  u_shiftBlue: 0.3,
  u_distortion: 0.12,
  u_contour: 0.4,
  u_angle: 70,
  u_shape: 0,
  u_isImage: false,
  u_fit: 0,
  u_scale: 1,
  u_rotation: 0,
  u_originX: 0.5,
  u_originY: 0.5,
  u_offsetX: 0,
  u_offsetY: 0,
  u_worldWidth: 0,
  u_worldHeight: 0,
};

export function LiquidMetalButton({
  label,
  onClick,
  href,
  viewMode = "text",
  icon,
  width = "auto",
  size = "md",
  type = "button",
  ariaLabel,
  className,
  external,
  disabled,
}: Props) {
  const rimRef = useRef<HTMLSpanElement>(null);
  const mountRef = useRef<ShaderMount | null>(null);
  const reduced = usePrefersReducedMotion();
  const [hovered, setHovered] = useState(false);

  // Mount the shader only while near the viewport.
  useEffect(() => {
    const el = rimRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !mountRef.current) {
          try {
            mountRef.current = new ShaderMount(
              el,
              liquidMetalFragmentShader,
              uniforms,
              { alpha: true, premultipliedAlpha: false },
              reduced ? 0 : 0.6,
              0,
              1,
              400_000,
            );
          } catch {
            mountRef.current = null; // CSS chrome fallback stays visible
          }
        } else if (!entry.isIntersecting && mountRef.current) {
          mountRef.current.dispose();
          mountRef.current = null;
          el.querySelectorAll("canvas").forEach((c) => c.remove());
        }
      },
      { rootMargin: "240px 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      mountRef.current?.dispose();
      mountRef.current = null;
    };
  }, [reduced]);

  useEffect(() => {
    if (!mountRef.current) return;
    mountRef.current.setSpeed(reduced ? 0 : hovered ? 1.4 : 0.6);
  }, [hovered, reduced]);

  const isIcon = viewMode === "icon";
  const h = size === "lg" ? "h-14" : "h-12";

  const content = (
    <>
      <span
        ref={rimRef}
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden rounded-full [&>canvas]:!h-full [&>canvas]:!w-full"
        style={{
          background:
            "conic-gradient(from 210deg, #ffffff, #f7d3cb, #ffffff, #f3b9ae, #ffffff, #f8dcd5, #ffffff)",
        }}
      />
      <span
        className={cn(
          "relative z-10 flex h-full w-full items-center justify-center gap-2 rounded-full font-medium tracking-[0.01em] text-[#d88978]",
          isIcon ? "px-0" : size === "lg" ? "px-7 text-[1.02rem]" : "px-6 text-[0.95rem]",
        )}
        style={{
          background: "#ffffff",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -2px 6px rgba(216,137,120,0.12)",
        }}
      >
        {isIcon ? (
          (icon ?? <ArrowUpRight className="h-5 w-5" aria-hidden="true" />)
        ) : (
          <>
            <span className="whitespace-nowrap">{label}</span>
            {icon}
          </>
        )}
      </span>
    </>
  );

  const shared = {
    className: cn(
      "relative inline-flex shrink-0 select-none items-stretch rounded-full p-[3px] shadow-[0_10px_24px_-12px_rgba(22,32,46,0.55)] transition-shadow duration-300 hover:shadow-[0_14px_30px_-12px_rgba(22,32,46,0.6)] disabled:opacity-60",
      h,
      isIcon ? (size === "lg" ? "w-14" : "w-12") : width === "wide" ? "w-full" : "w-auto",
      className,
    ),
    "aria-label": isIcon ? ariaLabel ?? label : ariaLabel,
    "data-magnetic": "",
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  };

  if (href) {
    return (
      <a
        {...shared}
        href={href}
        onClick={onClick}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
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

export default LiquidMetalButton;
