import { Check } from "lucide-react";
import { GlassButton } from "@/components/ui/glass-button";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { site } from "@/config/site";

/** One plan, centred: eyebrow, heading, the plan card, and a line for large teams. */
export function Pricing() {
  const { plan } = site;
  return (
    <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
      <Reveal className="mx-auto max-w-[640px] text-center">
        <RevealItem>
          <p className="data-label text-rose">Simple &amp; transparent</p>
        </RevealItem>
        <RevealItem delay={0.06}>
          <h2 className="display mt-3 text-[clamp(2.4rem,5vw,4rem)] font-medium leading-[0.98]">
            <span className="shine-rose">Pricing</span>
          </h2>
        </RevealItem>
        <RevealItem delay={0.12}>
          <p className="mx-auto mt-4 max-w-[44ch] text-[1.04rem] leading-relaxed text-slate">
            Get started with flexible pricing that scales with your team.
          </p>
        </RevealItem>
      </Reveal>

      <RevealItem delay={0.18} className="mx-auto mt-10 max-w-[26rem]">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-[#efe2d6] bg-white p-7 shadow-[0_1px_2px_rgba(22,32,46,0.04),0_30px_70px_-40px_rgba(160,90,40,0.38)] sm:p-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[radial-gradient(90%_100%_at_50%_0%,rgba(249,194,156,0.34),transparent_70%)]"
          />
          <div className="relative text-center">
            <h3 className="text-[1.15rem] font-semibold">{plan.name}</h3>
            <p className="mt-4 flex items-baseline justify-center gap-2">
              <span className="display text-[3.4rem] font-medium leading-none">{plan.price}</span>
              <span className="text-[0.98rem] text-slate">{plan.unit}</span>
            </p>

            <ul className="mx-auto mt-7 w-fit space-y-3 text-left text-[0.98rem]">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#fde0cb] text-[#8a4a1f]" aria-hidden="true">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <GlassButton label="Get started" href="#enquiry" variant="warm" width="wide" />
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-[0.92rem] text-slate">
          For {plan.salesThreshold} users,{" "}
          <a href="#enquiry" className="font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
            connect with our sales team
          </a>{" "}
          for custom pricing.
        </p>
      </RevealItem>
    </div>
  );
}
