import { useEffect, useRef, useState, type FormEvent, type RefObject } from "react";
import { CalendarCheck, CheckCircle2, Mail, MessageSquare } from "lucide-react";
import { GlassButton } from "@/components/ui/glass-button";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { site } from "@/config/site";

/**
 * idle / sending: the form
 * sent:     the endpoint accepted it
 * mailto:   no endpoint, so the visitor's email app was opened with the enquiry filled in
 * error:    the endpoint refused it or the network failed; the form keeps what was typed
 * offline:  neither an endpoint nor a contact email is configured; nothing was sent, and we say so
 */
type State = "idle" | "sending" | "sent" | "mailto" | "error" | "offline";
type Errors = { name?: string; email?: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LIMITS = { name: 120, email: 254, company: 160, message: 2000 };

// Book a demo and Talk to us only earn a button when they lead somewhere other than the form beside them.
const hasBookingLink = !site.bookDemoUrl.startsWith("#");
const hasPrivacy = site.privacyUrl !== "#";

export function Cta() {
  const [state, setState] = useState<State>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [name, setName] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);

  // Move focus to the outcome so keyboard and screen reader users hear it.
  useEffect(() => {
    if (state === "sent" || state === "mailto" || state === "offline") resultRef.current?.focus();
  }, [state]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const next: Errors = {};
    if (!data.name?.trim()) next.name = "Enter your name.";
    if (!EMAIL.test((data.email ?? "").trim())) next.email = "Enter a work email, for example name@company.com.";
    setErrors(next);
    const firstInvalid = next.name ? "name" : next.email ? "email" : null;
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLInputElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setName(data.name.trim().split(/\s+/)[0].slice(0, 40));

    if (!site.formEndpoint) {
      if (site.contactEmail) {
        const body = [`Name: ${data.name}`, `Email: ${data.email}`, data.company && `Company: ${data.company}`, data.message && `\n${data.message}`]
          .filter(Boolean)
          .join("\n");
        window.location.href = `mailto:${site.contactEmail}?subject=${encodeURIComponent("QuillStudio demo enquiry")}&body=${encodeURIComponent(body)}`;
        setState("mailto");
      } else {
        // Launch blocker: set site.formEndpoint or site.contactEmail.
        console.warn("QuillStudio: the enquiry form has no endpoint or contact email configured, so nothing was sent.");
        setState("offline");
      }
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
    <div className="mx-auto max-w-[1200px] px-5 pb-12 pt-24 sm:px-8 lg:pb-6 lg:pt-[5.5rem]">
      <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:gap-16">
        <Reveal>
          <RevealItem>
            <h2 className="display shine-rose text-[clamp(2.4rem,5vw,4rem)] font-medium leading-[0.98]">
              See it on your own documents.
            </h2>
          </RevealItem>
          <RevealItem delay={0.08}>
            <p className="mt-4 max-w-[46ch] text-[1.04rem] leading-relaxed text-slate">
              Bring a real template, a cost sheet or a booking form, and we will walk through it with you on Salesforce.
            </p>
          </RevealItem>

          {(hasBookingLink || site.contactEmail) && (
            <RevealItem delay={0.12}>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                {hasBookingLink && (
                  <GlassButton
                    label="Book a demo"
                    size="lg"
                    variant="warm"
                    href={site.bookDemoUrl}
                    icon={<CalendarCheck className="h-4 w-4" aria-hidden="true" />}
                  />
                )}
                {site.contactEmail && (
                  <a
                    href={`mailto:${site.contactEmail}`}
                    data-magnetic
                    className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[0.98rem] font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
                  >
                    <MessageSquare className="h-4 w-4" aria-hidden="true" />
                    {site.contactEmail}
                  </a>
                )}
              </div>
            </RevealItem>
          )}

          <RevealItem delay={0.16}>
            <div className="mt-7 max-w-[46ch]">
              <h3 className="text-[1rem] font-semibold">What happens next</h3>
              <ol className="mt-3 space-y-2.5 text-[0.98rem] leading-snug text-slate">
                {[
                  `We reply to your work email${site.replyTime ? `, ${site.replyTime}` : ""}.`,
                  "We agree a time for a walkthrough on Salesforce.",
                  "You bring a real template, and we build it with you.",
                ].map((step, i) => (
                  <li key={step} className="flex gap-3">
                    <span className="mt-[0.1rem] grid h-5 w-5 shrink-0 place-items-center rounded-full bg-ink text-[0.72rem] font-semibold text-white" aria-hidden="true">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </RevealItem>

          <RevealItem delay={0.24}>
            <div className="mt-7 max-w-[46ch] border-t border-line pt-5">
              <h3 className="text-[1rem] font-semibold">Pricing</h3>
              <p className="mt-2 text-[0.98rem] leading-relaxed text-slate">
                {site.pricingFrom ? `${site.pricingFrom}. ` : ""}
                Licensing is seat-based and managed from an admin console. Tell us how many people will generate or approve
                documents and we will share the details.
              </p>
            </div>
          </RevealItem>
        </Reveal>

        <div id="enquiry" className="scroll-mt-28 rounded-[1.75rem] border border-line bg-white p-6 shadow-[0_30px_80px_-50px_rgba(22,32,46,0.45)] sm:p-8">
          {state === "sent" || state === "mailto" || state === "offline" ? (
            <Outcome state={state} name={name} headingRef={resultRef} onReset={() => setState("idle")} />
          ) : (
            <form ref={formRef} noValidate onSubmit={onSubmit} aria-describedby="form-note">
              <h3 className="text-[1.2rem] font-semibold">Send an enquiry</h3>
              <p id="form-note" className="mt-1 text-[0.9rem] text-slate">Only your name and work email are required.</p>

              <div className="mt-5 space-y-3.5">
                <Field label="Name" name="name" autoComplete="name" maxLength={LIMITS.name} required error={errors.name} />
                <Field label="Work email" name="email" type="email" autoComplete="email" maxLength={LIMITS.email} required error={errors.email} />
                <Field label="Company" name="company" autoComplete="organization" maxLength={LIMITS.company} optional />
                <div>
                  <label htmlFor="f-message" className="flex justify-between text-[0.9rem] font-medium">
                    What would you like to see? <span className="font-normal text-slate">Optional</span>
                  </label>
                  <textarea
                    id="f-message"
                    name="message"
                    rows={3}
                    maxLength={LIMITS.message}
                    placeholder="For example: our booking form and allotment letter"
                    className="mt-1.5 w-full resize-y rounded-xl border border-line bg-paper px-3.5 py-2.5 text-[0.98rem] placeholder:text-slate focus:border-rose/50 focus:outline-none focus-visible:outline-2 focus-visible:outline-rose"
                  />
                </div>
              </div>

              {state === "error" && (
                <p role="alert" className="mt-4 text-[0.9rem] text-rose-deep">
                  The enquiry did not send. Your details are still here: check your connection and try again
                  {site.contactEmail ? `, or email ${site.contactEmail}` : ""}.
                </p>
              )}

              <div className="mt-6">
                <GlassButton
                  label={state === "sending" ? "Sending…" : "Send enquiry"}
                  type="submit"
                  width="wide"
                  variant="warm"
                  disabled={state === "sending"}
                />
              </div>
              <p className="mt-3 text-[0.82rem] leading-snug text-slate">
                We use these details only to reply to your enquiry.
                {hasPrivacy && (
                  <>
                    {" "}
                    <a href={site.privacyUrl} className="underline underline-offset-2 hover:text-ink">
                      Privacy notice
                    </a>
                  </>
                )}
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Outcome({
  state,
  name,
  headingRef,
  onReset,
}: {
  state: "sent" | "mailto" | "offline";
  name: string;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onReset: () => void;
}) {
  const copy = {
    sent: {
      title: `Thank you${name ? `, ${name}` : ""}.`,
      body: `Your enquiry has been received. We will reply to the email you gave us${site.replyTime ? `, ${site.replyTime}` : ""}.`,
    },
    mailto: {
      title: "Your email app should now be open.",
      body: `We filled in a message to ${site.contactEmail} with your details. Press send there to reach us.`,
    },
    offline: {
      title: "This form is not connected yet.",
      body: "Nothing was sent. Please reach us through your Exceller Tech contact while we finish setting it up.",
    },
  }[state];
  const Icon = state === "sent" ? CheckCircle2 : Mail;

  return (
    <div className="flex min-h-[21.25rem] flex-col items-start justify-center" role="status">
      <Icon className={state === "offline" ? "h-9 w-9 text-rose-deep" : "h-9 w-9 text-[#1f6b43]"} aria-hidden="true" />
      <h3 ref={headingRef} tabIndex={-1} className="display mt-5 max-w-full break-words text-[1.8rem] font-medium focus:outline-none">
        {copy.title}
      </h3>
      <p className="mt-3 max-w-[40ch] text-slate">{copy.body}</p>
      <button type="button" onClick={onReset} className="mt-6 text-[0.92rem] font-medium text-rose underline underline-offset-4">
        {state === "offline" ? "Back to the form" : "Send another enquiry"}
      </button>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  maxLength,
  required,
  optional,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  maxLength?: number;
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
        maxLength={maxLength}
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
