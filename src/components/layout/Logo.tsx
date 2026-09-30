import { useState } from "react";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Brand marks. Uses the official files from /public/brand when present.
 * Until they are added, a plain type wordmark stands in. The logos are never redrawn.
 */
export function QuillStudioLogo({ className }: { className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!failed) {
    return (
      <img
        src={site.logos.quillstudio}
        alt="QuillStudio"
        className={cn("h-9 w-auto object-contain", className)}
        onError={() => setFailed(true)}
      />
    );
  }
  return <span className={cn("display text-[1.3rem] font-semibold tracking-[-0.02em] text-ink", className)}>QuillStudio</span>;
}

export function ExcellerTechLogo({ className }: { className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!failed) {
    return (
      <img
        src={site.logos.excellerTech}
        alt="Exceller Tech"
        className={cn("h-9 w-auto object-contain", className)}
        onError={() => setFailed(true)}
      />
    );
  }
  return <span className={cn("text-[0.95rem] font-semibold tracking-tight text-ink", className)}>Exceller Tech</span>;
}

/** Both marks together in the white-background pill with a divider (requirements, Section 3 item 6). */
export function BrandPill({ className }: { className?: string }) {
  return (
    <div className={cn("inline-flex items-center gap-4 rounded-full border border-line bg-white px-5 py-2.5", className)}>
      <QuillStudioLogo />
      <span className="h-6 w-px bg-line" aria-hidden="true" />
      <span className="flex items-center gap-2 text-[0.8rem] text-slate">
        <span className="sr-only">A product of</span>
        <ExcellerTechLogo />
      </span>
    </div>
  );
}
