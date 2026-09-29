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
  tone?: "paper" | "pearl" | "mist";
  className?: string;
};

const tones = { paper: "#faf9f5", pearl: "#f0eee6", mist: "#ffffff" };

export function Scene({ id, label, children, tone = "paper", className }: SceneProps) {
  return (
    <>
      <div id={id} className="scene-anchor" aria-hidden="true" />
      <section className="scene" aria-label={label} style={{ "--scene-bg": tones[tone] } as CSSProperties}>
        <div className={cn("scene-inner", className)}>{children}</div>
      </section>
    </>
  );
}
