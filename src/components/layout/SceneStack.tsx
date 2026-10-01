import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * SceneStack: the page's sections in normal document flow.
 * Content fades in item by item, see RevealItem.
 * Anchors are zero-height markers before each scene, so nav links land on the section top.
 */

export function SceneStack({ children }: { children: ReactNode }) {
  return <div className="relative">{children}</div>;
}

type SceneProps = {
  id: string;
  label: string;
  children: ReactNode;
  tone?: "paper" | "cream" | "pearl" | "mist";
  /** No section padding: for the hero, which fills the first screen itself. */
  flush?: boolean;
  className?: string;
};

// cream alternates with paper so each section reads as its own block while scrolling.
const tones = { paper: "#ffffff", cream: "#fbf8f3", pearl: "#f0eee6", mist: "#ffffff" };

export function Scene({ id, label, children, tone = "paper", flush, className }: SceneProps) {
  return (
    <>
      <div id={id} className="scene-anchor" aria-hidden="true" />
      <section className="scene" aria-label={label} style={{ "--scene-bg": tones[tone] } as CSSProperties}>
        <div className={cn("scene-inner", flush && "is-flush", className)}>{children}</div>
      </section>
    </>
  );
}
