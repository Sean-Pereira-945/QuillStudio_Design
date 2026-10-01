import { BarChart3, FileText, GitCompareArrows, Lock, ShieldCheck, Workflow } from "lucide-react";
import { GradientCard } from "@/components/ui/gradient-card";
import { Reveal, RevealItem } from "@/components/ui/reveal";

export function Capabilities() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
      <Reveal className="max-w-[720px]">
        <RevealItem>
          <h2 className="display text-[clamp(1.9rem,3.6vw,2.9rem)] font-medium">Each problem, answered inside Salesforce.</h2>
        </RevealItem>
        <RevealItem delay={0.08}>
          <p className="mt-3 max-w-[56ch] text-[1.02rem] leading-relaxed text-slate">
            QuillStudio works on any standard or custom Salesforce object, so it fits the way your projects, units and
            bookings are already set up.
          </p>
        </RevealItem>
      </Reveal>

      {/* auto-rows-fr gives every row, and so every card, the same height. */}
      <Reveal className="mt-6 grid gap-3 sm:auto-rows-fr sm:grid-cols-2 lg:grid-cols-3">
        <RevealItem className="h-full">
          <GradientCard
            variant="rose"
            badge="Templates"
            icon={FileText}
            title="Templates in plain Word"
            description={
              <ul className="space-y-1">
                <li>Build and edit templates in Word. No coding, not even HTML.</li>
                <li>Change a clause, a price format or a logo yourself, the same day.</li>
                <li>Works on any standard or custom Salesforce object.</li>
              </ul>
            }
          />
        </RevealItem>
        <RevealItem className="h-full" delay={0.08}>
          <GradientCard
            variant="violet"
            badge="Merge logic"
            icon={Workflow}
            title="Smart merge logic"
            description="Loops for repeating rows, nested tables and related records. Conditions, images and QR codes, all inside the template."
          />
        </RevealItem>
        <RevealItem className="h-full" delay={0.16}>
          <GradientCard
            variant="amber"
            badge="Approvals"
            icon={ShieldCheck}
            title="Approvals you can trace"
            description="Up to four levels, fixed approvers or a reusable team, real-time Salesforce notifications and a full audit trail."
          />
        </RevealItem>
        <RevealItem className="h-full">
          <GradientCard
            variant="rose"
            badge="Governance"
            icon={Lock}
            title="Locked until approved"
            description="A PDF cannot be downloaded until it is Approved or Not Required. Enforced automatically."
          />
        </RevealItem>
        <RevealItem className="h-full" delay={0.08}>
          <GradientCard
            variant="neutral"
            badge="Versions"
            icon={GitCompareArrows}
            title="Version changes in plain English"
            description="Full version history. Every new upload comes with a plain-English summary of exactly what changed."
          />
        </RevealItem>
        <RevealItem className="h-full" delay={0.16}>
          <GradientCard
            variant="amber"
            badge="Analytics"
            icon={BarChart3}
            title="Proof of time saved"
            description="A built-in dashboard shows time saved, approval status and which templates your teams use most."
          />
        </RevealItem>
      </Reveal>
    </div>
  );
}
