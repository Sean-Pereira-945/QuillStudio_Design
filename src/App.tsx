import { Navbar } from "@/components/layout/Navbar";
import { SmudgeLayer } from "@/components/layout/SmudgeLayer";
import { Scene, SceneStack } from "@/components/layout/SceneStack";
import { MagneticCursor } from "@/components/ui/magnetic-cursor";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Demo } from "@/components/sections/Demo";
import { Capabilities } from "@/components/sections/Capabilities";
import { Pricing } from "@/components/sections/Pricing";
import { Cta } from "@/components/sections/Cta";
import { Footer } from "@/components/sections/Footer";
import { useSmoothScroll } from "@/lib/use-smooth-scroll";

export default function App() {
  useSmoothScroll();

  return (
    <MagneticCursor magneticFactor={0.35} cursorSize={30}>
      <a href="#main" className="skip-link">Skip to content</a>
      <Navbar />
      <SmudgeLayer />
      <main id="main">
        <SceneStack>
          <Scene id="top" label="Introduction" flush>
            <Hero />
          </Scene>
          <Scene id="problem" label="The problem" tone="paper">
            <Problem />
          </Scene>
          <Scene id="how-it-works" label="How it works" tone="cream">
            <Demo />
          </Scene>
          <Scene id="features" label="Features" tone="paper">
            <Capabilities />
          </Scene>
          <Scene id="pricing" label="Pricing" tone="cream">
            <Pricing />
          </Scene>
          <Scene id="early-access" label="Get early access" tone="paper">
            <Cta />
          </Scene>
        </SceneStack>
        <Footer />
      </main>
    </MagneticCursor>
  );
}
