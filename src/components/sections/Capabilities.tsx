import { BarChart3, FileText, GitCompareArrows, Lock, ShieldCheck, Workflow } from "lucide-react";
import { GradientCard } from "@/components/ui/gradient-card";
import { Reveal, RevealItem } from "@/components/ui/reveal";

export function Capabilities() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-16 pt-20 sm:px-8 lg:pt-24">
      <Reveal className="max-w-[720px]">
        <RevealItem>
          <h2 className="display text-[clamp(1.9rem,3.6vw,2.9rem)] font-medium">Each problem, answered inside Salesforce.</h2>
        </RevealItem>
        <RevealItem>
          <p className="mt-3 max-w-[56ch] text-[1.02rem] leading-relaxed text-slate">
            QuillStudio works on any standard or custom Salesforce object, so it fits the way your projects, units and
            bookings are already set up.
          </p>
        </RevealItem>
      </Reveal>

      <Reveal className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <RevealItem>
          <GradientCard
            variant="rose"
            badge="Templates"
            icon={FileText}
            title="Templates in plain Word"
            answers="Every small change waits in a developer queue."
            description={
              <ul className="space-y-1">
                <li>Build and edit templates in Word. No coding, not even HTML.</li>
                <li>Change a clause, a price format or a logo yourself, the same day.</li>
                <li>Works on any standard or custom Salesforce object.</li>
              </ul>
            }
          />
        </RevealItem>
        <RevealItem>
          <GradientCard
            variant="violet"
            badge="Merge logic"
            icon={Workflow}
            title="Smart merge logic"
            answers="Figures copied by hand from the CRM."
            description="Loops for repeating rows, nested tables and related records. Conditions, images and QR codes, all inside the template."
          />
        </RevealItem>
        <RevealItem>
          <GradientCard
            variant="amber"
            badge="Approvals"
            icon={ShieldCheck}
            title="Approvals you can trace"
            answers="Sign-off buried in email and chat."
            description="Up to four levels, fixed approvers or a reusable team, real-time Salesforce notifications and a full audit trail."
          />
        </RevealItem>
        <RevealItem>
          <GradientCard
            variant="rose"
            badge="Governance"
            icon={Lock}
            title="Locked until approved"
            answers="The wrong version reaching the client."
            description="A PDF cannot be downloaded until it is Approved or Not Required. Enforced automatically."
            href="#benefits"
            linkLabel="See the lock in action"
          />
        </RevealItem>
        <RevealItem>
          <GradientCard
            variant="neutral"
            badge="Versions"
            icon={GitCompareArrows}
            title="Version changes in plain English"
            answers="An outdated price or payment plan slipping through."
            description="Full version history. Every new upload comes with a plain-English summary of exactly what changed."
          />
        </RevealItem>
        <RevealItem>
          <GradientCard
            variant="amber"
            badge="Analytics"
            icon={BarChart3}
            title="Proof of time saved"
            answers="Leadership asking whether the tool really saves time."
            description="A built-in dashboard shows time saved, approval status and which templates your teams use most."
            href="#proof"
            linkLabel="Preview the dashboard"
          />
        </RevealItem>
      </Reveal>
    </div>
  );
}
