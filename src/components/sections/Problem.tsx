import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ClipboardCopy, Hourglass, MessagesSquare, type LucideIcon } from "lucide-react";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { usePrefersReducedMotion } from "@/lib/use-media";
import { cn } from "@/lib/utils";

/**
 * The three problems as a stacked deck of cards.
 * The front card slides off and tucks in behind the others: on a timer while the deck is on screen,
 * or when the visitor clicks, swipes, or picks a dot. Hover pauses the timer; reduced motion turns it off.
 */

type Pain = { icon: LucideIcon; title: string; body: string; chip: string };

const pains: Pain[] = [
  {
    icon: ClipboardCopy,
    title: "Documents are built by hand",
    body: "Figures copied from the CRM into Word, then checked by eye.",
    chip: "Copy → paste → check, field by field",
  },
  {
    icon: Hourglass,
    title: "Every small change waits in a queue",
    body: "A new clause or logo means a developer ticket, then waiting.",
    chip: "Ticket raised · Waiting on IT",
  },
  {
    icon: MessagesSquare,
    title: "Approvals live in email and chat",
    body: "Sign-off is scattered, so the wrong version can reach the client.",
    chip: "Re: Re: cost_sheet_final_v3.docx",
  },
];

const AUTO_MS = 4200;
const LEAVE_MS = 320;
const PEEK = 18; // px each card behind peeks out below the one in front

export function Problem() {
  const reduced = usePrefersReducedMotion();
  const [order, setOrder] = useState(() => pains.map((_, i) => i)); // order[0] is the front card
  const [leaving, setLeaving] = useState(false); // the front card is sliding off
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const busy = useRef(false); // a swipe also fires a click; only the first moves the deck

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Send the front card to the back: it slides off, then rejoins the deck behind the others.
  const next = useCallback(() => {
    if (busy.current) return;
    if (reduced) {
      setOrder((o) => [...o.slice(1), o[0]]);
      return;
    }
    busy.current = true;
    setLeaving(true);
    window.setTimeout(() => {
      setOrder((o) => [...o.slice(1), o[0]]);
      setLeaving(false);
      busy.current = false;
    }, LEAVE_MS);
  }, [reduced]);

  function show(card: number) {
    if (busy.current || order[0] === card) return;
    const at = order.indexOf(card);
    setOrder((o) => [...o.slice(at), ...o.slice(0, at)]);
  }

  useEffect(() => {
    if (reduced || paused || !inView || leaving) return;
    const t = window.setTimeout(next, AUTO_MS);
    return () => window.clearTimeout(t);
  }, [order, next, reduced, paused, inView, leaving]);

  const front = order[0];

  // Desktop: columns size to their content and the pair is centred, so the text sits close to the cards.
  return (
    <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,29rem)_minmax(0,31rem)] lg:justify-center lg:gap-10">
      <Reveal>
        <RevealItem>
          <h2 className="display text-[clamp(2.3rem,4.6vw,3.8rem)] font-medium leading-[1.02]">
            The deal closes. Then the paperwork starts by hand.
          </h2>
        </RevealItem>
        <RevealItem delay={0.08}>
          <p className="mt-5 max-w-[44ch] text-[1.12rem] leading-relaxed text-slate">
            Every cost sheet and agreement starts from data already in Salesforce. Getting it onto paper is where the time goes.
          </p>
        </RevealItem>
      </Reveal>

      <RevealItem delay={0.12}>
        <div
          ref={ref}
          className="mx-auto w-full max-w-[34rem] lg:mx-0 lg:max-w-none"
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="relative h-[17.75rem]">
            {pains.map((p, i) => {
              const pos = order.indexOf(i);
              const isLeaving = leaving && pos === 0;
              const isFront = pos === 0;
              const Icon = p.icon;
              return (
                <motion.article
                  key={p.title}
                  aria-hidden={isFront ? undefined : true}
                  className={cn(
                    "absolute inset-x-0 top-0 flex h-[15.25rem] cursor-pointer select-none flex-col overflow-hidden rounded-[1.5rem] border border-[#efe2d6] bg-white p-6 shadow-[0_1px_2px_rgba(22,32,46,0.04),0_24px_50px_-28px_rgba(160,90,40,0.45)]",
                    !isFront && "pointer-events-none",
                  )}
                  style={{ zIndex: isLeaving ? 10 : pains.length - pos }}
                  initial={false}
                  animate={
                    isLeaving
                      ? { x: "60%", y: -24, rotate: 8, opacity: 0, scale: 1 }
                      : { x: 0, y: pos * PEEK, rotate: 0, opacity: pos > 2 ? 0 : 1, scale: 1 - pos * 0.05 }
                  }
                  transition={{ type: "spring", stiffness: 260, damping: 26 }}
                  drag={isFront && !reduced ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.6}
                  onDragEnd={(_, info) => {
                    if (Math.abs(info.offset.x) > 70) next();
                  }}
                  onClick={isFront ? next : undefined}
                >
                  {/* Peach glow in the corner, as on the other cards. */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(80%_100%_at_100%_0%,rgba(249,194,156,0.3),transparent_70%)]"
                  />
                  <div className="relative flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#fde0cb] text-[#8a4a1f]" aria-hidden="true">
                      <Icon className="h-5 w-5" strokeWidth={1.9} />
                    </span>
                    <span className="data-label text-slate">
                      {String(i + 1).padStart(2, "0")} / {String(pains.length).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="display relative mt-5 text-[1.6rem] font-medium leading-[1.15]">{p.title}</h3>
                  <p className="relative mt-2 text-[1.02rem] leading-snug text-slate">{p.body}</p>
                  <p className="relative mt-auto w-fit max-w-full truncate rounded-md bg-[#fdf4ec] px-2 py-0.5 font-mono text-[0.74rem] text-[#8a4a1f]">
                    {p.chip}
                  </p>
                </motion.article>
              );
            })}
          </div>

          {/* Controls */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {pains.map((p, i) => (
                <button
                  key={p.title}
                  type="button"
                  onClick={() => show(i)}
                  aria-label={`Show problem ${i + 1}: ${p.title}`}
                  aria-current={front === i ? "true" : undefined}
                  className={cn("h-2 rounded-full transition-all duration-300", front === i ? "w-6 bg-rose" : "w-2 bg-[#e3ddd0] hover:bg-[#cfc7b6]")}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={next}
              data-magnetic
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-[0.85rem] font-medium text-ink transition-colors hover:bg-[#fdf4ec]"
            >
              Next problem
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
          <p className="sr-only" aria-live="polite">
            {`Problem ${front + 1} of ${pains.length}: ${pains[front].title}. ${pains[front].body}`}
          </p>
        </div>
      </RevealItem>
    </div>
  );
}
