import { lazy, Suspense } from "react";
import { ArrowDown, ExternalLink } from "lucide-react";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { site } from "@/config/site";
import { usePrefersReducedMotion } from "@/lib/use-media";

// The gradient is WebGL, so it loads after first paint.
const AnimatedGradient = lazy(() => import("@/components/ui/animated-gradient"));

export function Hero() {
  const reduced = usePrefersReducedMotion();
  return (
    <div className="relative isolate flex min-h-[100svh] items-center overflow-hidden">
      <Suspense fallback={null}>
        <AnimatedGradient
          still={reduced}
          config={{
            preset: "custom",
            color1: "#fbfaf7",
            color2: "#f3b9cc",
            color3: "#f5d09b",
            rotation: -30,
            proportion: 45,
            scale: 0.45,
            speed: 18,
            distortion: 6,
            swirl: 55,
            swirlIterations: 6,
            softness: 100,
            offset: 120,
            shape: "Checks",
            shapeSize: 30,
          }}
          noise={{ opacity: 0.25, scale: 1 }}
          fallback="radial-gradient(60% 60% at 80% 20%, #f6c9d7, transparent), radial-gradient(50% 50% at 90% 90%, #f7dcb3, transparent), #fbfaf7"
          style={{ zIndex: -2 }}
        />
      </Suspense>
      {/* A soft violet bloom and a paper veil keep the headline side calm and legible. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-[1]"
        style={{
          background:
            "radial-gradient(40% 35% at 78% 72%, rgba(109,79,196,0.14), transparent 70%), linear-gradient(90deg, rgba(251,250,247,0.94) 0%, rgba(251,250,247,0.78) 42%, rgba(251,250,247,0.15) 75%, rgba(251,250,247,0) 100%)",
        }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-[1] h-40 bg-gradient-to-b from-transparent to-paper" />

      <div className="mx-auto grid w-full max-w-[1200px] items-center gap-12 px-5 pb-20 pt-32 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:pb-24">
        <Reveal>
          <RevealItem>
            <h1 className="display shine-ink text-[clamp(3.4rem,11vw,8.6rem)] font-medium leading-[0.92]">QuillStudio</h1>
          </RevealItem>
          <RevealItem>
            <p className="mt-6 max-w-[34ch] text-[clamp(1.15rem,2.1vw,1.45rem)] leading-[1.45] text-ink/85">
              Turn any Salesforce record into an approved, client-ready document, without leaving Salesforce.
            </p>
          </RevealItem>
          <RevealItem>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <LiquidMetalButton label="Book a demo" size="lg" href={site.bookDemoUrl} />
              <LiquidMetalButton
                label="See how it works"
                size="lg"
                href="#how-it-works"
                icon={<ArrowDown className="h-4 w-4" aria-hidden="true" />}
              />
            </div>
          </RevealItem>
          <RevealItem>
            <a
              href={site.appExchangeUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-magnetic
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white/70 px-4 py-2 text-[0.92rem] font-medium text-ink backdrop-blur transition-colors hover:bg-white"
            >
              Get it on AppExchange
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </RevealItem>
        </Reveal>

        <HeroObjectSlot />
      </div>
    </div>
  );
}

/**
 * 3D slot (requirements Section 10).
 * Until the 3D asset arrives, this static composition stands in. It doubles as the
 * fallback image for phones, slow networks and reduced motion once the 3D scene is added.
 */
function HeroObjectSlot() {
  return (
    <div data-slot="hero-3d" className="relative mx-auto hidden aspect-[4/5] w-full max-w-[380px] sm:block" aria-hidden="true">
      <div className="absolute inset-0 translate-x-6 translate-y-5 rotate-[5deg] rounded-[20px] border border-white/80 bg-white/55 shadow-[0_30px_60px_-30px_rgba(22,32,46,0.35)] backdrop-blur-md" />
      <div className="absolute inset-0 translate-x-3 translate-y-2.5 rotate-[2.5deg] rounded-[20px] border border-white/80 bg-white/70 backdrop-blur-md" />
      <div className="absolute inset-0 flex flex-col rounded-[20px] border border-white bg-white/90 p-7 shadow-[0_40px_80px_-40px_rgba(22,32,46,0.45)] backdrop-blur-xl">
        <div className="flex items-start justify-between">
          <div>
            <div className="display text-[1.35rem] font-medium">Cost sheet</div>
            <div className="mt-1 text-[0.82rem] text-slate">Tower B, Unit 1204</div>
          </div>
          <span className="data-label rounded-full bg-[#e7f4ec] px-2.5 py-1 text-[#1f6b43]">Approved</span>
        </div>
        <div className="mt-6 space-y-2.5">
          {[82, 64, 74, 58].map((w, i) => (
            <div key={i} className="flex items-center justify-between gap-4">
              <div className="h-2 rounded-full bg-ink/10" style={{ width: `${w * 0.55}%` }} />
              <div className="h-2 w-14 rounded-full bg-ink/15" />
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-xl border border-line bg-pearl/60 p-4">
          <div className="data-label text-slate">Payment schedule</div>
          <div className="mt-3 space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-rose" />
                <div className="h-2 flex-1 rounded-full bg-ink/10" />
                <div className="h-2 w-10 rounded-full bg-ink/15" />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-auto flex items-end justify-between pt-6">
          <div className="grid h-14 w-14 grid-cols-4 gap-[3px] rounded-md border border-line p-1.5">
            {Array.from({ length: 16 }).map((_, i) => (
              <span key={i} className={[0, 1, 3, 4, 6, 9, 11, 12, 14, 15].includes(i) ? "rounded-[1px] bg-ink" : ""} />
            ))}
          </div>
          <div className="text-right">
            <div className="h-px w-28 bg-ink/30" />
            <div className="mt-1.5 text-[0.72rem] text-slate">Authorised signatory</div>
          </div>
        </div>
      </div>
    </div>
  );
}
