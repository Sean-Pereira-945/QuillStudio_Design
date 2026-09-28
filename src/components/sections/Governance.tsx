import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Download, Lock, RotateCcw, Unlock } from "lucide-react";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { usePrefersReducedMotion } from "@/lib/use-media";
import { cn } from "@/lib/utils";

const levels = ["Sales manager", "Finance", "Head of CRM"];
const trail = [
  { who: "Sales executive", what: "Submitted for approval", time: "09:12" },
  { who: "Sales manager", what: "Approved, level 1", time: "09:40" },
  { who: "Finance", what: "Approved, level 2", time: "10:05", note: "Payment plan checked against the booking." },
  { who: "Head of CRM", what: "Approved, level 3", time: "10:21" },
];

export function Governance() {
  const [done, setDone] = useState(0); // approvals completed, 0 to 3
  const [run, setRun] = useState(0);
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!seen) return;
    if (reduced) {
      setDone(levels.length);
      return;
    }
    setDone(0);
    const timers = levels.map((_, i) => window.setTimeout(() => setDone(i + 1), 1100 + i * 1100));
    return () => timers.forEach(clearTimeout);
  }, [seen, run, reduced]);

  const unlocked = done === levels.length;

  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-24 pt-28 sm:px-8 lg:pt-32">
      <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]">
        <Reveal>
          <RevealItem>
            <h2 className="display shine-ink text-[clamp(2.2rem,4.6vw,3.7rem)] font-medium">
              Enforced automatically, not left to a policy someone has to remember.
            </h2>
          </RevealItem>
          <RevealItem>
            <ul className="mt-8 space-y-4 text-[1.03rem] leading-relaxed text-ink/90">
              <Point>A generated PDF cannot be downloaded until its status is Approved or Not Required.</Point>
              <Point>A template's sample copy can never be downloaded.</Point>
              <Point>Only licensed users can download a QuillStudio file.</Point>
              <Point>Who submitted, who approved, when, and every comment, kept in one audit trail.</Point>
            </ul>
          </RevealItem>
        </Reveal>

        <div ref={ref} className="rounded-[28px] border border-line bg-white p-5 shadow-[0_30px_80px_-50px_rgba(22,32,46,0.45)] sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[0.84rem] text-slate">Allotment letter, B-1204.pdf</div>
              <div className="mt-1 text-[1.25rem] font-semibold" aria-live="polite">
                {unlocked ? "Approved. Ready to download." : "Locked until approved."}
              </div>
            </div>
            <motion.div
              key={unlocked ? "u" : "l"}
              initial={reduced ? false : { scale: 0.6, rotate: -12, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 16 }}
              className={cn(
                "grid h-12 w-12 shrink-0 place-items-center rounded-2xl",
                unlocked ? "bg-[#e7f4ec] text-[#1f6b43]" : "bg-[#fbe6ee] text-rose-deep",
              )}
              aria-hidden="true"
            >
              {unlocked ? <Unlock className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
            </motion.div>
          </div>

          <ol className="mt-6 grid grid-cols-3 gap-2" aria-label="Approval levels">
            {levels.map((l, i) => (
              <li
                key={l}
                className={cn(
                  "rounded-2xl border px-3 py-3 transition-colors duration-500",
                  i < done ? "border-[#bfe0cc] bg-[#f1f9f4]" : i === done ? "border-amber/40 bg-[#fdf6ec]" : "border-line bg-pearl/50",
                )}
              >
                <div className="data-label text-slate">Level {i + 1}</div>
                <div className="mt-1 flex items-start gap-1.5 text-[0.84rem] font-medium sm:text-[0.88rem]">
                  {i < done && <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1f6b43]" aria-hidden="true" />}
                  <span className="leading-tight">{l}</span>
                </div>
                <div className="sr-only">{i < done ? "approved" : "waiting"}</div>
              </li>
            ))}
          </ol>

          <div className="mt-6">
            <div className="data-label text-slate">Audit trail, sample</div>
            <ul className="mt-3 space-y-0">
              <AnimatePresence initial={false}>
                {trail.slice(0, done + 1).map((t) => (
                  <motion.li
                    key={t.who}
                    initial={reduced ? false : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-baseline justify-between gap-3 border-b border-line py-2.5 text-[0.88rem]">
                      <div className="min-w-0">
                        <span className="font-medium">{t.who}</span>
                        <span className="text-slate">: {t.what}</span>
                        {t.note && <div className="mt-0.5 text-[0.82rem] italic text-slate">{t.note}</div>}
                      </div>
                      <span className="data-label shrink-0 text-slate">{t.time}</span>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              disabled={!unlocked}
              aria-disabled={!unlocked}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[0.92rem] font-medium transition-colors",
                unlocked ? "bg-ink text-paper" : "cursor-not-allowed bg-pearl text-slate",
              )}
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              {unlocked ? "Download PDF" : "Download locked"}
            </button>
            <button
              type="button"
              onClick={() => {
                setSeen(true);
                setRun((r) => r + 1);
              }}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[0.88rem] text-slate hover:text-ink"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Replay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Point({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-rose" aria-hidden="true" />
      <span>{children}</span>
    </li>
  );
}
