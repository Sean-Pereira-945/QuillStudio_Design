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
];

export function Problem() {
  return (
    <div className="mx-auto grid max-w-[1200px] gap-10 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 pb-12 pt-24 lg:pb-10 lg:pt-[5.5rem]">
      <Reveal>
        <RevealItem>
          <h2 className="display text-[clamp(2.1rem,4vw,3.2rem)] font-medium">
            Your sales team closes the deal. Then someone rebuilds the paperwork by hand.
          </h2>
        </RevealItem>
        <RevealItem delay={0.08}>
          <p className="mt-4 max-w-[44ch] text-[1.04rem] leading-relaxed text-slate">
            Cost sheets, booking forms, payment schedules, allotment letters and sale agreements all start from data
            already sitting in Salesforce. Getting that data onto paper is where the time goes.
          </p>
        </RevealItem>
      </Reveal>

      <Reveal as="ul" className="divide-y divide-line border-y border-line">
        {pains.map((p) => (
          <RevealItem as="li" key={p.title} className="grid gap-1.5 py-4 sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-8">
            <h3 className="text-[1.05rem] font-semibold leading-snug text-ink">{p.title}</h3>
            <p className="text-[1rem] leading-relaxed text-slate">{p.body}</p>
          </RevealItem>
        ))}
      </Reveal>
    </div>
  );
}
