import { Reveal, RevealItem } from "@/components/ui/reveal";

// Placeholders stay in square brackets until Blaze supplies real values (requirements, Scene 6).
const beforeAfter = [
  {
    topic: "Preparing a cost sheet",
    before: "[client's current average document time], copied field by field",
    after: "Generated from the booking record in one step",
  },
  {
    topic: "Changing a clause or price format",
    before: "A ticket in a developer or vendor queue",
    after: "Edited in Word by your own team",
  },
  {
    topic: "Getting sign-off",
    before: "Email threads and chat messages",
    after: "Up to four levels, tracked in Salesforce",
  },
  {
    topic: "Sending the right version",
    before: "Left to whoever remembers the policy",
    after: "Download locked until Approved or Not Required",
  },
];

const templates = [
  { name: "Cost sheet", w: 88 },
  { name: "Booking form", w: 70 },
  { name: "Payment schedule", w: 56 },
  { name: "Allotment letter", w: 42 },
  { name: "Sale agreement", w: 30 },
];

export function Proof() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-16 pt-20 sm:px-8 lg:pt-24">
      <Reveal className="max-w-[760px]">
        <RevealItem>
          <h2 className="display text-[clamp(1.9rem,3.6vw,2.9rem)] font-medium">Show leadership the time you save.</h2>
        </RevealItem>
        <RevealItem>
          <p className="mt-3 max-w-[58ch] text-[1.02rem] leading-relaxed text-slate">
            The built-in dashboard tracks time saved, approval status and template usage, from your own data.
          </p>
        </RevealItem>
      </Reveal>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_1.1fr]">
        {/* Before and after */}
        <Reveal className="overflow-hidden rounded-[24px] border border-line bg-white">
          <div className="grid grid-cols-[1fr_1fr] border-b border-line bg-pearl/60 text-[0.84rem] font-semibold">
            <div className="px-5 py-2.5 text-slate">Before</div>
            <div className="px-5 py-2.5 text-ink">With QuillStudio</div>
          </div>
          {beforeAfter.map((r) => (
            <RevealItem key={r.topic} className="border-b border-line px-5 py-3 last:border-0">
              <div className="text-[0.92rem] font-semibold">{r.topic}</div>
              <div className="mt-1 grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-4 text-[0.86rem] leading-snug sm:gap-5">
                <div className="text-slate">{r.before}</div>
                <div className="text-ink">{r.after}</div>
              </div>
            </RevealItem>
          ))}
        </Reveal>

        {/* Dashboard preview */}
        <Reveal className="rounded-[24px] border border-line bg-white p-5 shadow-[0_30px_80px_-50px_rgba(22,32,46,0.4)]">
          <RevealItem className="flex items-center justify-between gap-3">
            <div className="text-[0.95rem] font-semibold">QuillStudio analytics</div>
            <div className="text-[0.78rem] text-slate">Illustrative layout</div>
          </RevealItem>

          <RevealItem className="mt-4 grid gap-3 grid-cols-2">
            <div className="rounded-2xl bg-pearl/70 px-4 py-3">
              <div className="text-[0.84rem] text-slate">Time saved this quarter</div>
              <div className="display mt-1 text-[1.2rem] font-medium">[hours saved]</div>
            </div>
            <div className="rounded-2xl bg-pearl/70 px-4 py-3">
              <div className="text-[0.84rem] text-slate">Documents generated</div>
              <div className="display mt-1 text-[1.2rem] font-medium">[document count]</div>
            </div>
          </RevealItem>

          <RevealItem className="mt-4">
            <div className="text-[0.84rem] font-medium">Approval status</div>
            <div className="mt-2 flex h-2.5 overflow-hidden rounded-full" aria-hidden="true">
              <span className="bg-[#2f8a59]" style={{ width: "58%" }} />
              <span className="bg-amber" style={{ width: "24%" }} />
              <span className="bg-violet/60" style={{ width: "18%" }} />
            </div>
            <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[0.82rem] text-slate">
              <li className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#2f8a59]" aria-hidden="true" />Approved [count]</li>
              <li className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber" aria-hidden="true" />Pending [count]</li>
              <li className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-violet/60" aria-hidden="true" />Not Required [count]</li>
            </ul>
          </RevealItem>

          <RevealItem className="mt-4">
            <div className="text-[0.84rem] font-medium">Template usage</div>
            <ul className="mt-2 space-y-1.5">
              {templates.map((t) => (
                <li key={t.name} className="grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_auto] items-center gap-2 text-[0.84rem] sm:grid-cols-[9.5rem_1fr_auto] sm:gap-3">
                  <span className="min-w-0 break-words">{t.name}</span>
                  <span className="h-2 rounded-full bg-pearl" aria-hidden="true">
                    <span className="block h-2 rounded-full bg-gradient-to-r from-rose to-amber" style={{ width: `${t.w}%` }} />
                  </span>
                  <span className="text-slate">[uses]</span>
                </li>
              ))}
            </ul>
          </RevealItem>
          <p className="mt-3 text-[0.75rem] leading-snug text-slate">
            Bar lengths show the layout only. Your dashboard shows your own figures.
          </p>
        </Reveal>
      </div>
    </div>
  );
}
