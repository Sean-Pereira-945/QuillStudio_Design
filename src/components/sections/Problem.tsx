import { Reveal, RevealItem } from "@/components/ui/reveal";

const pains = [
  {
    title: "Documents are built by hand",
    body: "Figures are copied from the CRM into Word, and every field is checked by eye before anything goes out.",
  },
  {
    title: "Every small change waits in a queue",
    body: "A new clause, a price format or a logo swap means raising a ticket with a developer or IT vendor, then waiting.",
  },
  {
    title: "Approvals live in email and chat",
    body: "Sign-off happens in threads and messages, with no guarantee the approved version is the one that reaches the client.",
  },
  {
    title: "One wrong figure costs trust",
    body: "An incorrect price or an outdated payment plan on a cost sheet is a risk to the relationship, not just a typo.",
  },
  {
    title: "Leadership wants proof",
    body: "When a new tool is proposed, the first question is how much time it actually saves. Few teams can answer it.",
  },
];

export function Problem() {
  return (
    <div className="mx-auto grid max-w-[1200px] gap-12 px-5 pb-24 pt-28 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:pt-36">
      <Reveal>
        <RevealItem>
          <h2 className="display text-[clamp(2.3rem,5vw,3.9rem)] font-medium">
            Your sales team closes the deal. Then someone rebuilds the paperwork by hand.
          </h2>
        </RevealItem>
        <RevealItem>
          <p className="mt-6 max-w-[44ch] text-[1.08rem] leading-relaxed text-slate">
            Cost sheets, booking forms, payment schedules, allotment letters and sale agreements all start from data
            already sitting in Salesforce. Getting that data onto paper is where the time goes.
          </p>
        </RevealItem>
      </Reveal>

      <Reveal as="ul" className="divide-y divide-line border-y border-line">
        {pains.map((p) => (
          <RevealItem as="li" key={p.title} className="grid gap-1.5 py-6 sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-8">
            <h3 className="text-[1.05rem] font-semibold leading-snug text-ink">{p.title}</h3>
            <p className="text-[1rem] leading-relaxed text-slate">{p.body}</p>
          </RevealItem>
        ))}
      </Reveal>
    </div>
  );
}
