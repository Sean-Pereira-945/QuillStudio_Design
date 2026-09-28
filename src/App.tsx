import { Navbar } from "@/components/layout/Navbar";
import { SmudgeLayer } from "@/components/layout/SmudgeLayer";
import { Scene, SceneStack } from "@/components/layout/SceneStack";
import { MagneticCursor } from "@/components/ui/magnetic-cursor";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Demo } from "@/components/sections/Demo";
import { Capabilities } from "@/components/sections/Capabilities";
import { Governance } from "@/components/sections/Governance";
import { Proof } from "@/components/sections/Proof";
import { Cta } from "@/components/sections/Cta";
import { Footer } from "@/components/sections/Footer";

export default function App() {
  return (
    <MagneticCursor magneticFactor={0.35} cursorSize={30}>
      <a href="#main" className="skip-link">Skip to content</a>
      <Navbar />
      <SmudgeLayer />
      <main id="main">
        <SceneStack>
          <Scene id="top" label="Introduction" first>
            <Hero />
          </Scene>
          <Scene id="problem" label="The problem" tone="pearl">
            <Problem />
          </Scene>
          <Scene id="how-it-works" label="How it works" tone="paper">
            <Demo />
          </Scene>
          <Scene id="features" label="Features" tone="pearl">
            <Capabilities />
          </Scene>
          <Scene id="benefits" label="Governance" tone="paper">
            <Governance />
          </Scene>
          <Scene id="proof" label="Proof" tone="pearl">
            <Proof />
          </Scene>
          <Scene id="pricing" label="Book a demo and pricing" tone="paper">
            <Cta />
          </Scene>
        </SceneStack>
        <Footer />
      </main>
    </MagneticCursor>
  );
}
