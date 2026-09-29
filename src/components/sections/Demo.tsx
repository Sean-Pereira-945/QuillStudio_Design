import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Check, CircleCheck, Loader2 } from "lucide-react";
import { RevealItem } from "@/components/ui/reveal";
import { usePrefersReducedMotion } from "@/lib/use-media";
import { cn } from "@/lib/utils";

/**
 * How QuillStudio works. Mirrors the section of the same name on quillstudio.tech:
 * a looping three-stage demo (Word template, processing, PDF generated).
 * Differences: pauses while off screen, and holds still for reduced motion.
 */

const stages = [
  { label: "Word Template", short: "Word" },
  { label: "Processing", short: "Processing" },
  { label: "PDF Generated", short: "PDF" },
];

// Timings measured from the live site.
const stageMs = [4500, 2200, 4400];
const progressItems = [
  "Connecting to Salesforce...",
  "Fetching Opportunity & Contact records...",
  "Merging fields into Word template...",
  "Converting .docx → .pdf...",
];
const progressAt = [200, 500, 1000, 1500];

export function Demo() {
  const [stage, setStage] = useState(0);
  const [done, setDone] = useState(0); // progress items ticked in stage 2
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduced || !inView) return;
    const t = window.setTimeout(() => setStage((s) => (s + 1) % stages.length), stageMs[stage]);
    return () => window.clearTimeout(t);
  }, [stage, reduced, inView]);

  useEffect(() => {
    setDone(0);
    if (stage !== 1) return;
    if (reduced) {
      setDone(progressItems.length);
      return;
    }
    const ts = progressAt.map((ms, i) => window.setTimeout(() => setDone(i + 1), ms));
    return () => ts.forEach(window.clearTimeout);
  }, [stage, reduced]);

  return (
    <div className="qs-how mx-auto max-w-[1200px] px-5 sm:px-8 pb-12 pt-24 lg:pb-4 lg:pt-[5.5rem]">
      <div className="text-center">
        <RevealItem>
        <h2 className="mb-1 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-[2.4rem]">
          How QuillStudio
          {" "}
          <span className="block bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent lg:inline">Works</span>
        </h2>
        </RevealItem>

        <div className="mx-auto mt-1 max-w-5xl">
          <RevealItem delay={0.08}>
          <p className="mb-4 text-slate-600">Watch how tags in your Word documents become real customer data in PDFs</p>
          </RevealItem>

          <RevealItem delay={0.16}>
          <div ref={ref} className="relative rounded-2xl border border-slate-200/50 bg-white/80 p-4 shadow-2xl backdrop-blur-sm sm:px-8 sm:py-4">
            {/* Stepper */}
            <div className="mb-3 flex items-center justify-center gap-1 sm:gap-2">
              {stages.map((s, i) => (
                <div key={s.label} className="flex items-center gap-1 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => setStage(i)}
                    aria-current={stage === i ? "step" : undefined}
                    className="flex items-center gap-1 sm:gap-2"
                  >
                    <span
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-500",
                        stage === i
                          ? "scale-110 bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md"
                          : i < stage
                            ? "bg-orange-300 text-white"
                            : "bg-slate-200 text-slate-500",
                      )}
                    >
                      {i < stage ? <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" /> : i + 1}
                    </span>
                    <span className={cn("hidden text-xs font-medium transition-colors duration-300 sm:inline", stage === i ? "text-orange-600" : "text-slate-400")}>
                      {s.label}
                    </span>
                    <span className={cn("text-[0.625rem] font-medium transition-colors duration-300 sm:hidden", stage === i ? "text-orange-600" : "text-slate-400")}>
                      {s.short}
                    </span>
                  </button>
                  {i < stages.length - 1 && (
                    <div className={cn("h-0.5 w-6 transition-colors duration-500 sm:w-10", i < stage ? "bg-orange-300" : "bg-slate-200")} />
                  )}
                </div>
              ))}
            </div>

            {/* Phones and tablets: one document at a time */}
            <div className="block lg:hidden">{stage === 2 ? <PdfDoc /> : <WordDoc />}</div>

            {/* Desktop: template, converter, PDF */}
            <div className="hidden grid-cols-[1fr_8.5rem_1fr] items-center gap-4 lg:grid">
              <div className={cn("transition-all duration-500", stage === 2 ? "scale-100 opacity-60" : "scale-100 opacity-100")}>
                <WordDoc />
              </div>
              <div className="flex justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div
                    className={cn(
                      "flex h-16 w-16 items-center justify-center rounded-full text-white shadow-lg transition-all duration-500",
                      stage === 2 ? "bg-gradient-to-r from-green-400 to-emerald-500" : "bg-gradient-to-r from-orange-400 to-pink-400",
                    )}
                  >
                    {stage === 0 && <ArrowRight className="h-7 w-7" aria-hidden="true" />}
                    {stage === 1 && <Loader2 className={cn("h-7 w-7", !reduced && "animate-spin")} aria-hidden="true" />}
                    {stage === 2 && <CircleCheck className="h-8 w-8" aria-hidden="true" />}
                  </div>
                  <div
                    className={cn(
                      "rounded-full px-3 py-1 text-center text-[0.6875rem] font-semibold",
                      stage === 0 && "bg-slate-100 text-slate-500",
                      stage === 1 && "bg-orange-100 text-orange-600",
                      stage === 2 && "bg-green-100 text-green-700",
                    )}
                  >
                    {stage === 0 ? ".docx → .pdf" : stage === 1 ? "converting..." : "done!"}
                  </div>
                </div>
              </div>
              <div
                className={cn(
                  "transition-all duration-700",
                  stage === 0 && "scale-95 opacity-20 blur-sm",
                  stage === 1 && "scale-95 opacity-50",
                  stage === 2 && "scale-100 opacity-100",
                )}
              >
                <PdfDoc />
              </div>
            </div>

            {/* Caption, progress or success */}
            <div className="mt-3 min-h-[3.25rem] border-t border-slate-200 pt-3" aria-live="polite">
              {stage === 0 && (
                <p className="text-center text-xs text-slate-500">
                  <span className="qs-mono rounded bg-orange-100 px-1.5 py-0.5 text-[0.6875rem] text-orange-700">{"{{field tags}}"}</span> in your Word
                  template are automatically replaced with live Salesforce data and exported as a pixel-perfect PDF.
                </p>
              )}
              {stage === 1 && (
                <div>
                  <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">Conversion progress</p>
                  <ul className="grid gap-2 text-left sm:grid-cols-2 lg:grid-cols-4">
                    {progressItems.map((item, i) => (
                      <li
                        key={item}
                        className={cn("flex items-center gap-2 text-xs transition-all duration-300", i < done ? "text-slate-700 opacity-100" : "text-slate-400 opacity-40")}
                      >
                        <span className={cn("flex h-4 w-4 shrink-0 items-center justify-center rounded-full", i < done ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-400")}>
                          <Check className="h-2.5 w-2.5" strokeWidth={3} aria-hidden="true" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {stage === 2 && (
                <div className="flex flex-col items-center gap-1 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-center">
                  <div className="flex items-center gap-2">
                    <CircleCheck className="h-4 w-4 text-green-600" aria-hidden="true" />
                    <p className="text-sm font-semibold text-green-800">PDF generated successfully!</p>
                  </div>
                  <p className="text-xs text-green-600">Salesforce data merged · Tables preserved · Formatting intact · Ready to send</p>
                </div>
              )}
            </div>

            {/* Dots */}
            <div className="mt-2 text-center">
              <div className="inline-flex items-center space-x-2">
                {stages.map((s, i) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => setStage(i)}
                    aria-label={`Show step ${i + 1}: ${s.label}`}
                    className={cn(
                      "h-2.5 w-2.5 rounded-full transition-all duration-300 hover:scale-125",
                      stage === i ? "scale-125 bg-gradient-to-r from-orange-500 to-pink-500" : "bg-slate-300 hover:bg-slate-400",
                    )}
                  />
                ))}
              </div>
              <p className="mt-1.5 text-xs text-slate-400">Click dots to navigate · Auto-plays on loop</p>
            </div>
          </div>
          </RevealItem>
        </div>
      </div>

    </div>
  );
}

function Tag({ children }: { children: ReactNode }) {
  return <span className="qs-mono rounded border border-orange-200 bg-orange-100 px-1 text-[0.625rem] font-semibold text-orange-700">{children}</span>;
}

function WordDoc() {
  return (
    <div className="overflow-hidden rounded-xl border-2 border-blue-300 bg-white shadow-md">
      <div className="flex items-center gap-2 bg-blue-600 px-3 py-2">
        <div className="flex h-4 w-4 items-center justify-center rounded bg-white">
          <span className="text-[0.5625rem] font-bold text-blue-600">W</span>
        </div>
        <span className="text-xs font-medium text-white">invoice_template.docx</span>
      </div>
      <div className="flex items-center gap-1.5 border-b border-blue-100 bg-blue-50 px-3 py-1" aria-hidden="true">
        {["B", "I", "U"].map((b) => (
          <span key={b} className="rounded border border-blue-200 px-1 text-[0.625rem] font-bold text-blue-400">
            {b}
          </span>
        ))}
        <span className="ml-1 text-[0.625rem] text-blue-300">| Calibri · 11pt</span>
      </div>
      <div className="qs-mono space-y-2 bg-white p-3 text-xs">
        <div className="border-b border-slate-200 pb-2 text-center text-base font-bold tracking-wide text-slate-800">INVOICE</div>
        <div className="flex justify-between text-[0.625rem]">
          <div>
            <div className="font-bold text-slate-700">Acme Corp</div>
            <div className="text-slate-500">123 Market St, San Francisco, CA</div>
          </div>
          <div className="space-y-0.5 text-right">
            <div>
              Invoice #: <Tag>{"{{Invoice.Number}}"}</Tag>
            </div>
            <div>
              Date: <Tag>{"{{Invoice.Date}}"}</Tag>
            </div>
            <div>
              Due: <Tag>{"{{Invoice.DueDate}}"}</Tag>
            </div>
          </div>
        </div>
        <div className="rounded border border-slate-200 bg-slate-50 p-2 text-[0.625rem]">
          <span className="font-bold text-slate-600">Bill To: </span>
          <Tag>{"{{Contact.Name}}"}</Tag>
          <span className="text-slate-400">, </span>
          <Tag>{"{{Account.Name}}"}</Tag>
          <div className="mt-1 text-slate-500">
            <Tag>{"{{Contact.Email}}"}</Tag>
          </div>
        </div>
        <table className="w-full table-fixed border-collapse text-[0.625rem]">
          <colgroup>
            <col style={{ width: "48%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "32%" }} />
          </colgroup>
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="px-2 py-1 text-left font-semibold">Description</th>
              <th className="px-2 py-1 text-center font-semibold">Qty</th>
              <th className="px-2 py-1 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2].map((n) => (
              <tr key={n} className={cn("border-b border-slate-200", n === 1 ? "bg-white" : "bg-slate-50")}>
                <td className="overflow-hidden px-1 py-1">
                  <Tag>{`{{Item${n}.Name}}`}</Tag>
                </td>
                <td className="overflow-hidden px-1 py-1">
                  <div className="flex justify-center">
                    <Tag>{`{{Item${n}.Qty}}`}</Tag>
                  </div>
                </td>
                <td className="overflow-hidden px-1 py-1">
                  <div className="flex justify-end">
                    <Tag>{`{{Item${n}.Amt}}`}</Tag>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="space-y-0.5 text-right text-[0.625rem]">
          <div className="text-slate-500">
            Subtotal: <Tag>{"{{Invoice.Subtotal}}"}</Tag>
          </div>
          <div className="text-slate-500">
            Tax (9%): <Tag>{"{{Invoice.Tax}}"}</Tag>
          </div>
          <div className="text-[0.6875rem] font-bold text-slate-800">
            Total Due: <Tag>{"{{Invoice.Total}}"}</Tag>
          </div>
        </div>
      </div>
    </div>
  );
}

function PdfDoc() {
  const v = "font-semibold text-slate-800";
  return (
    <div className="overflow-hidden rounded-xl border-2 border-red-300 bg-white shadow-md">
      <div className="flex items-center gap-2 bg-red-600 px-3 py-2">
        <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded bg-white">
          <span className="text-[0.4375rem] font-black leading-none tracking-tight text-red-600">PDF</span>
        </div>
        <span className="truncate text-xs font-medium text-white">invoice_INV-2025-0042.pdf</span>
        <span className="ml-auto shrink-0 text-[0.625rem] text-red-200">🔒 Read-only</span>
      </div>
      <div className="flex items-center border-b border-red-100 bg-red-50 px-3 py-1">
        <span className="text-[0.625rem] text-red-300">Page 1 of 1</span>
        <span className="ml-auto text-[0.625rem] text-red-400">100%</span>
      </div>
      <div className="qs-mono space-y-2 bg-gray-50 p-3 text-xs">
        <div className="border-b border-slate-300 pb-2 text-center text-base font-bold tracking-wide text-slate-800">INVOICE</div>
        <div className="flex justify-between text-[0.625rem]">
          <div>
            <div className="font-bold text-slate-700">Acme Corp</div>
            <div className="text-slate-500">123 Market St, San Francisco, CA</div>
          </div>
          <div className="space-y-0.5 text-right">
            <div className="text-slate-600">
              Invoice #: <span className={v}>INV-2025-0042</span>
            </div>
            <div className="text-slate-600">
              Date: <span className={v}>Jan 15, 2025</span>
            </div>
            <div className="text-slate-600">
              Due: <span className={v}>Feb 15, 2025</span>
            </div>
          </div>
        </div>
        <div className="rounded border border-slate-200 bg-white p-2 text-[0.625rem]">
          <span className="font-bold text-slate-600">Bill To: </span>
          <span className={v}>John Smith</span>
          <span className="text-slate-400">, </span>
          <span className={v}>Acme Enterprises</span>
          <div className="mt-1 text-slate-500">
            <span className={v}>john.smith@acme.com</span>
          </div>
        </div>
        <table className="w-full table-fixed border-collapse text-[0.625rem]">
          <colgroup>
            <col style={{ width: "48%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "32%" }} />
          </colgroup>
          <thead>
            <tr className="bg-slate-700 text-white">
              <th className="px-2 py-1 text-left font-semibold">Description</th>
              <th className="px-2 py-1 text-center font-semibold">Qty</th>
              <th className="px-2 py-1 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-200 bg-white">
              <td className="overflow-hidden px-2 py-1 text-slate-700">Enterprise License</td>
              <td className="px-2 py-1 text-center text-slate-700">5</td>
              <td className="px-2 py-1 text-right font-medium text-slate-800">$7,500.00</td>
            </tr>
            <tr className="border-b border-slate-200 bg-slate-50">
              <td className="overflow-hidden px-2 py-1 text-slate-700">Implementation Hrs</td>
              <td className="px-2 py-1 text-center text-slate-700">10</td>
              <td className="px-2 py-1 text-right font-medium text-slate-800">$2,000.00</td>
            </tr>
          </tbody>
        </table>
        <div className="space-y-0.5 text-right text-[0.625rem]">
          <div className="text-slate-500">
            Subtotal: <span className={v}>$9,500.00</span>
          </div>
          <div className="text-slate-500">
            Tax (9%): <span className={v}>$855.00</span>
          </div>
          <div className="text-[0.6875rem] font-bold text-slate-800">
            Total Due: <span className={v}>$10,355.00</span>
          </div>
        </div>
      </div>
    </div>
  );
}
