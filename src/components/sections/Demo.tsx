import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, FileText, Lock, Unlock } from "lucide-react";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { usePrefersReducedMotion } from "@/lib/use-media";
import { cn } from "@/lib/utils";

const steps = [
  { title: "Template in Word", body: "Your team designs the cost sheet in Word and drops in merge tags. No coding, not even HTML." },
  { title: "Merge the record", body: "QuillStudio reads the booking record, its unit and its payment milestones, and fills every tag." },
  { title: "Route for approval", body: "The generated PDF goes to the right approvers and stays locked until it is approved." },
  { title: "Send to the client", body: "Once approved, download the PDF, or an editable Word file if you need one." },
];

// Illustrative tag names. Real names follow your own Salesforce fields.
const tags = {
  project: "{{Project__c.Name}}",
  unit: "{{Unit__c.Name}}",
  area: "{{Unit__c.Carpet_Area__c}}",
  customer: "{{Booking__c.Customer_Name__c}}",
  loopStart: "{{#Payment_Milestones__r}}",
  milestone: "{{Milestone__c}}",
  amount: "{{Amount__c}}",
  loopEnd: "{{/Payment_Milestones__r}}",
  cond: "{{#if Parking_Included__c}}",
};

const sample = {
  project: "Riverside Heights",
  unit: "B-1204",
  area: "1,180 sq ft",
  customer: "A. Mehta",
  milestones: [
    ["On booking", "10%"],
    ["On agreement", "20%"],
    ["On plinth", "15%"],
    ["On possession", "Balance"],
  ],
};

export function Demo() {
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduced || paused || !inView) return;
    const t = window.setTimeout(() => setStep((s) => (s + 1) % steps.length), 3600);
    return () => window.clearTimeout(t);
  }, [step, paused, reduced, inView]);

  const merged = step >= 1;
  const approved = step >= 3;

  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-16 pt-20 sm:px-8 lg:pt-24">
      <Reveal className="max-w-[760px]">
        <RevealItem>
          <h2 className="display text-[clamp(1.9rem,3.6vw,2.9rem)] font-medium">
            Whatever the template looks like is exactly what your client receives.
          </h2>
        </RevealItem>
        <RevealItem>
          <p className="mt-3 max-w-[56ch] text-[1.02rem] leading-relaxed text-slate">
            Here is a cost sheet going from a Word template to an approved PDF, inside Salesforce.
          </p>
        </RevealItem>
      </Reveal>

      <div
        ref={ref}
        className="mt-8 rounded-[28px] border border-line bg-white p-3 shadow-[0_30px_80px_-50px_rgba(22,32,46,0.45)] sm:p-4"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        {/* Steps */}
        <ol className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="Demo steps">
          {steps.map((s, i) => (
            <li key={s.title}>
              <button
                type="button"
                onClick={() => setStep(i)}
                aria-current={step === i ? "step" : undefined}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-[0.88rem] transition-colors",
                  step === i ? "bg-ink text-paper" : "bg-pearl/70 text-slate hover:text-ink",
                )}
              >
                <span
                  className={cn(
                    "grid h-6 w-6 shrink-0 place-items-center rounded-full text-[0.75rem] font-semibold",
                    step === i ? "bg-paper text-ink" : i < step ? "bg-ink/80 text-paper" : "bg-white text-slate",
                  )}
                >
                  {i < step ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : i + 1}
                </span>
                <span className="font-medium">{s.title}</span>
              </button>
            </li>
          ))}
        </ol>

        <div className="grid gap-3 lg:grid-cols-[1fr_0.55fr_1fr]">
          {/* Template */}
          <Pane className={cn(step !== 0 && "hidden lg:block")} active={step === 0} title="Cost sheet template.docx" icon={<FileText className="h-4 w-4" aria-hidden="true" />}>
            <div className="space-y-2.5 font-mono text-[0.78rem] leading-relaxed text-ink">
              <Row k="Project" v={tags.project} hot={step === 0} />
              <Row k="Unit" v={tags.unit} hot={step === 0} />
              <Row k="Carpet area" v={tags.area} hot={step === 0} />
              <Row k="Customer" v={tags.customer} hot={step === 0} />
              <div className="rounded-lg border border-dashed border-violet/40 bg-violet/[0.04] p-2.5">
                <div className="text-violet">{tags.loopStart}</div>
                <div className="flex justify-between gap-2 pl-3">
                  <span>{tags.milestone}</span>
                  <span>{tags.amount}</span>
                </div>
                <div className="text-violet">{tags.loopEnd}</div>
              </div>
              <div className="text-amber-deep">{tags.cond}</div>
            </div>
            <p className="mt-3 text-[0.75rem] text-slate">Illustrative tags. Yours follow your own Salesforce fields.</p>
          </Pane>

          {/* Converting */}
          <div className="order-first flex items-center gap-4 rounded-[20px] bg-pearl/70 px-4 py-3 lg:order-none lg:flex-col lg:justify-center lg:py-6" aria-live="polite">
            <div className="relative h-12 w-12 shrink-0 lg:h-16 lg:w-16">
              <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90" aria-hidden="true">
                <circle cx="32" cy="32" r="27" fill="none" stroke="#e4e0d7" strokeWidth="5" />
                <motion.circle
                  cx="32"
                  cy="32"
                  r="27"
                  fill="none"
                  stroke="#c92a63"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 27}
                  animate={{ strokeDashoffset: 2 * Math.PI * 27 * (1 - (step + 1) / steps.length) }}
                  transition={{ duration: reduced ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
              </svg>
              <span className="absolute inset-0 grid place-items-center">
                {approved ? (
                  <Check className="h-6 w-6 text-[#1f6b43]" aria-hidden="true" />
                ) : (
                  <span className="text-[0.8rem] font-semibold">{step + 1}/4</span>
                )}
              </span>
            </div>
            <div className="lg:text-center">
              <div className="text-[0.95rem] font-semibold">{steps[step].title}</div>
              <div className="mt-0.5 text-[0.85rem] lg:mt-1 lg:max-w-[26ch] leading-snug text-slate">{steps[step].body}</div>
            </div>
          </div>

          {/* Finished */}
          <Pane
            className={cn(step === 0 && "hidden lg:block")}
            active={step >= 2}
            title="Cost sheet, B-1204.pdf"
            icon={approved ? <Unlock className="h-4 w-4" aria-hidden="true" /> : <Lock className="h-4 w-4" aria-hidden="true" />}
            status={!merged ? "Waiting" : approved ? "Approved" : step === 2 ? "Pending approval" : "Generated"}
          >
            <AnimatePresence mode="wait" initial={false}>
              {merged ? (
                <motion.div
                  key="doc"
                  initial={reduced ? false : { opacity: 0, filter: "blur(6px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="display text-[1.15rem] font-medium">{sample.project}</div>
                  <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[0.84rem]">
                    <dt className="text-slate">Unit</dt>
                    <dd className="text-right font-medium">{sample.unit}</dd>
                    <dt className="text-slate">Carpet area</dt>
                    <dd className="text-right font-medium">{sample.area}</dd>
                    <dt className="text-slate">Customer</dt>
                    <dd className="text-right font-medium">{sample.customer}</dd>
                  </dl>
                  <table className="mt-3 w-full text-[0.82rem]">
                    <caption className="sr-only">Payment schedule</caption>
                    <thead>
                      <tr className="border-b border-line text-left text-slate">
                        <th className="pb-1.5 font-normal">Milestone</th>
                        <th className="pb-1.5 text-right font-normal">Due</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sample.milestones.map(([m, a]) => (
                        <tr key={m} className="border-b border-line/70 last:border-0">
                          <td className="py-1">{m}</td>
                          <td className="py-1 text-right font-medium">{a}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-3 text-[0.8rem] text-slate">Covered parking included.</div>
                </motion.div>
              ) : (
                <motion.div key="empty" className="space-y-2.5 py-2" exit={{ opacity: 0 }}>
                  {[70, 50, 80, 60, 40].map((w, i) => (
                    <div key={i} className="h-2 rounded-full bg-ink/[0.07]" style={{ width: `${w}%` }} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            <p className="mt-3 text-[0.75rem] text-slate">Sample data.</p>
          </Pane>
        </div>

      </div>
    </div>
  );
}

function Pane({
  className,
  active,
  title,
  icon,
  status,
  children,
}: {
  className?: string;
  active: boolean;
  title: string;
  icon: React.ReactNode;
  status?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[20px] border p-4 transition-[border-color,box-shadow] duration-500",
        active ? "border-rose/35 shadow-[0_0_0_4px_rgba(201,42,99,0.07)]" : "border-line",
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 text-[0.84rem] font-medium text-ink">
          {icon}
          <span className="truncate">{title}</span>
        </div>
        {status && (
          <span
            className={cn(
              "data-label shrink-0 rounded-full px-2 py-0.5",
              status === "Approved"
                ? "bg-[#e7f4ec] text-[#1f6b43]"
                : status === "Pending approval"
                  ? "bg-[#fbeedd] text-amber-deep"
                  : "bg-pearl text-slate",
            )}
          >
            {status}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function Row({ k, v, hot }: { k: string; v: string; hot: boolean }) {
  return (
    <div className="flex flex-col gap-0.5 min-[480px]:flex-row min-[480px]:items-baseline min-[480px]:justify-between min-[480px]:gap-3">
      <span className="font-sans text-[0.84rem] text-slate">{k}</span>
      <span className={cn("w-fit break-all rounded px-1 transition-colors duration-500 min-[480px]:text-right", hot ? "bg-rose/10 text-rose-deep" : "text-ink")}>{v}</span>
    </div>
  );
}
