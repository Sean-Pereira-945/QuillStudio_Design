import { useState, type FormEvent } from "react";
import { CalendarCheck, CheckCircle2, MessageSquare } from "lucide-react";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { site } from "@/config/site";

type State = "idle" | "sending" | "sent" | "error";

export function Cta() {
  const [state, setState] = useState<State>("idle");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [name, setName] = useState("");

  const talkHref = site.contactEmail ? `mailto:${site.contactEmail}` : "#enquiry";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const next: typeof errors = {};
    if (!data.name?.trim()) next.name = "Enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(data.email ?? "")) next.email = "Enter a work email, for example name@company.com.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setName(data.name.trim().split(" ")[0]);
    if (!site.formEndpoint) {
      // No endpoint configured yet: confirm locally. Wire `site.formEndpoint` before launch.
      setState("sent");
      return;
    }
    setState("sending");
    try {
      const res = await fetch(site.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-24 pt-28 sm:px-8 lg:pt-32">
      <div className="grid gap-14 lg:grid-cols-[1fr_0.95fr] lg:gap-20">
        <Reveal>
          <RevealItem>
            <h2 className="display shine-rose text-[clamp(2.6rem,6vw,4.8rem)] font-medium leading-[0.98]">
              See it on your own documents.
            </h2>
          </RevealItem>
          <RevealItem>
            <p className="mt-6 max-w-[46ch] text-[1.08rem] leading-relaxed text-slate">
              Bring a real template, a cost sheet or a booking form, and we will walk through it with you on Salesforce.
            </p>
          </RevealItem>
          <RevealItem>
            <div className="mt-9 flex flex-wrap gap-3">
              <LiquidMetalButton
                label="Book a demo"
                size="lg"
                href={site.bookDemoUrl}
                icon={<CalendarCheck className="h-4 w-4" aria-hidden="true" />}
              />
              <LiquidMetalButton
                label="Talk to us"
                size="lg"
                href={talkHref}
                icon={<MessageSquare className="h-4 w-4" aria-hidden="true" />}
              />
            </div>
          </RevealItem>
          <RevealItem>
            <div className="mt-12 max-w-[46ch] border-t border-line pt-6">
              <h3 className="text-[1rem] font-semibold">Pricing</h3>
              <p className="mt-2 text-[0.98rem] leading-relaxed text-slate">
                Licensing is seat-based and managed from an admin console. Tell us how many people will generate or approve
                documents and we will share the details.
              </p>
            </div>
          </RevealItem>
        </Reveal>

        <div id="enquiry" className="scroll-mt-28 rounded-[28px] border border-line bg-white p-6 shadow-[0_30px_80px_-50px_rgba(22,32,46,0.45)] sm:p-8">
          {state === "sent" ? (
            <div className="flex min-h-[340px] flex-col items-start justify-center" role="status">
              <CheckCircle2 className="h-9 w-9 text-[#1f6b43]" aria-hidden="true" />
              <h3 className="display mt-5 text-[1.8rem] font-medium">Thank you{name ? `, ${name}` : ""}.</h3>
              <p className="mt-3 max-w-[40ch] text-slate">Your enquiry has been received. We will reply to the email you gave us.</p>
              <button type="button" onClick={() => setState("idle")} className="mt-6 text-[0.92rem] font-medium text-rose underline underline-offset-4">
                Send another enquiry
              </button>
            </div>
          ) : (
            <form noValidate onSubmit={onSubmit} aria-describedby="form-note">
              <h3 className="text-[1.2rem] font-semibold">Send an enquiry</h3>
              <p id="form-note" className="mt-1 text-[0.9rem] text-slate">Only your name and work email are required.</p>

              <div className="mt-6 space-y-4">
                <Field label="Name" name="name" autoComplete="name" required error={errors.name} />
                <Field label="Work email" name="email" type="email" autoComplete="email" required error={errors.email} />
                <Field label="Company" name="company" autoComplete="organization" optional />
                <div>
                  <label htmlFor="f-message" className="flex justify-between text-[0.9rem] font-medium">
                    What would you like to see? <span className="font-normal text-slate">Optional</span>
                  </label>
                  <textarea
                    id="f-message"
                    name="message"
                    rows={3}
                    placeholder="For example: our booking form and allotment letter"
                    className="mt-1.5 w-full resize-y rounded-xl border border-line bg-paper px-3.5 py-2.5 text-[0.98rem] placeholder:text-slate/70 focus:border-rose/50 focus:outline-none focus-visible:outline-2 focus-visible:outline-rose"
                  />
                </div>
              </div>

              {state === "error" && (
                <p role="alert" className="mt-4 text-[0.9rem] text-rose-deep">
                  The enquiry did not send. Check your connection and try again.
                </p>
              )}

              <div className="mt-6">
                <LiquidMetalButton label={state === "sending" ? "Sending" : "Send enquiry"} type="submit" width="wide" disabled={state === "sending"} />
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  required,
  optional,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
}) {
  const id = `f-${name}`;
  return (
    <div>
      <label htmlFor={id} className="flex justify-between text-[0.9rem] font-medium">
        {label}
        {optional && <span className="font-normal text-slate">Optional</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        className="mt-1.5 h-12 w-full rounded-xl border border-line bg-paper px-3.5 text-[0.98rem] focus:border-rose/50 focus:outline-none focus-visible:outline-2 focus-visible:outline-rose aria-[invalid]:border-rose"
      />
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-[0.85rem] text-rose-deep">
          {error}
        </p>
      )}
    </div>
  );
}
