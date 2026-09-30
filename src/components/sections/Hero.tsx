import { lazy, Suspense } from "react";
import { ArrowDown, ExternalLink } from "lucide-react";
import { GlassButton } from "@/components/ui/glass-button";
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
            color1: "#ffffff",
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
          fallback="radial-gradient(60% 60% at 80% 20%, #f6c9d7, transparent), radial-gradient(50% 50% at 90% 90%, #f7dcb3, transparent), #ffffff"
          style={{ zIndex: -2 }}
        />
      </Suspense>
      {/* A soft violet bloom and a paper veil keep the headline side calm and legible. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-[1]"
        style={{
          background:
            "radial-gradient(40% 35% at 78% 72%, rgba(109,79,196,0.14), transparent 70%), linear-gradient(90deg, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.78) 42%, rgba(255,255,255,0.15) 75%, rgba(255,255,255,0) 100%)",
        }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-[1] h-40 bg-gradient-to-b from-transparent to-paper" />

      <div className="mx-auto grid w-full max-w-[1200px] items-center gap-12 px-5 pb-20 pt-32 sm:px-8 lg:grid-cols-[1fr_1fr] lg:pb-24">
        <Reveal>
          <RevealItem>
            <h1 className="display shine-ink text-[clamp(3.4rem,11vw,8.6rem)] font-medium leading-[0.92]">QuillStudio</h1>
          </RevealItem>
          <RevealItem delay={0.08}>
            <p className="mt-6 max-w-[34ch] text-[clamp(1.15rem,2.1vw,1.45rem)] leading-[1.45] text-ink/85">
              Turn any Salesforce record into an approved, client-ready document, without leaving Salesforce.
            </p>
          </RevealItem>
          <RevealItem delay={0.16}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <GlassButton label="Book a demo" size="lg" variant="warm" href={site.bookDemoUrl} />
              <GlassButton
                label="See how it works"
                size="lg"
                href="#how-it-works"
                icon={<ArrowDown className="h-4 w-4" aria-hidden="true" />}
              />
            </div>
          </RevealItem>
          {/* Shown only once the real listing URL is confirmed in site.ts. */}
          {site.appExchangeConfirmed && (
            <RevealItem delay={0.24}>
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
          )}
          {site.proof.items.length > 0 && (
            <RevealItem delay={0.3}>
              <div className="mt-9 max-w-[34rem] border-t border-ink/10 pt-4">
                <p className="text-[0.82rem] text-slate">{site.proof.label}</p>
                <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-1.5 text-[0.95rem] font-medium text-ink/80">
                  {site.proof.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </RevealItem>
          )}
        </Reveal>

        <HeroObjectSlot />
      </div>
    </div>
  );
}

/**
 * 3D slot (requirements Section 10).
 * Until the 3D asset arrives, this illustration of a Salesforce record becoming an approved
 * cost sheet stands in, on every screen size.
 */
function HeroObjectSlot() {
  return (
    <div data-slot="hero-3d" className="relative mx-auto w-full max-w-[33rem]">
      {/* Warm glow behind the frame */}
      <div
        aria-hidden="true"
        className="absolute -inset-6 -z-[1] rounded-[3rem] bg-[radial-gradient(60%_60%_at_30%_30%,rgba(245,176,110,0.35),transparent_70%),radial-gradient(55%_55%_at_80%_80%,rgba(236,120,120,0.25),transparent_70%)] blur-2xl"
      />
      <div className="rounded-[1.9rem] border border-white/80 bg-[linear-gradient(150deg,rgba(255,246,236,0.9)_0%,rgba(253,232,214,0.88)_55%,rgba(250,218,208,0.88)_100%)] p-2.5 shadow-[0_40px_80px_-40px_rgba(120,60,20,0.45)] backdrop-blur-xl">
        <img
          src="/hero/one-click-generation.webp"
          width={724}
          height={526}
          alt="A Salesforce Opportunity for Acme Corp., amount $50,000, turned by QuillStudio into an approved cost sheet with a payment schedule and signature."
          className="block h-auto w-full rounded-[1.4rem]"
        />
      </div>
    </div>
  );
}
