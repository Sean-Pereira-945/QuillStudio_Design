import { useEffect, useRef, useState, type FormEvent, type RefObject } from "react";
import { CheckCircle2, ChevronDown, Mail } from "lucide-react";
import { GlassButton } from "@/components/ui/glass-button";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Get early access: the enquiry form.
 *
 * idle / sending: the form
 * sent:     the endpoint accepted it
 * mailto:   no endpoint, so the visitor's email app was opened with the enquiry filled in
 * error:    the endpoint refused it or the network failed; the form keeps what was typed
 * offline:  neither an endpoint nor a contact email is configured; nothing was sent, and we say so
 */
type State = "idle" | "sending" | "sent" | "mailto" | "error" | "offline";
type Errors = Partial<Record<(typeof REQUIRED)[number], string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LIMITS = { name: 80, email: 254, company: 160, phone: 32 };

// Field names and option values match the lead API behind quillstudio.tech (POST /api/leads).
// Checked in this order, so focus lands on the first problem in reading order.
const REQUIRED = ["first_name", "last_name", "email", "company", "salesforce_edition", "phone"] as const;

type Option = { value: string; label: string };
const opt = (value: string, label = value): Option => ({ value, label });

const EDITIONS = ["Essentials", "Professional", "Enterprise", "Unlimited", "Developer", "Not using Salesforce yet"].map((v) => opt(v));
const CHALLENGES = [
  opt("Manual document creation", "Creating documents manually is time-consuming"),
  opt("Copy-paste errors", "Too many errors from copy-pasting Salesforce data"),
  opt("No PDF from Salesforce", "Can’t generate PDFs directly from Salesforce"),
  opt("Inconsistent branding", "Documents lack consistent formatting & branding"),
  opt("Slow approval cycles", "Slow document approval & sending cycles"),
  opt("Other"),
];

// Inputs sit on a soft warm fill with a visible edge, and take a peach focus ring that matches the send button.
const FIELD =
  "mt-1.5 w-full rounded-xl border border-[#c9c3b5] bg-white/80 px-3.5 text-[0.98rem] text-ink transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-slate hover:border-[#a39c8d] focus:border-[#c46a2e] focus:bg-white focus:shadow-[0_0_0_4px_rgba(249,194,156,0.45)] focus:outline-none aria-[invalid]:border-rose";

const hasPrivacy = site.privacyUrl !== "#";

function validate(d: Record<string, string>): Errors {
  const e: Errors = {};
  if (!d.first_name?.trim()) e.first_name = "Enter your first name.";
  if (!d.last_name?.trim()) e.last_name = "Enter your last name.";
  if (!EMAIL.test((d.email ?? "").trim())) e.email = "Enter a work email, for example name@company.com.";
  if (!d.company?.trim()) e.company = "Enter your company.";
  if (!d.salesforce_edition) e.salesforce_edition = "Choose your Salesforce edition.";
  if ((d.phone ?? "").replace(/\D/g, "").length < 7) e.phone = "Enter a phone number, including the country code.";
  return e;
}

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
    const next = validate(data);
    setErrors(next);
    const firstInvalid = REQUIRED.find((k) => next[k]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setName(data.first_name.trim().slice(0, 40));

    if (!site.formEndpoint) {
      if (site.contactEmail) {
        const body = [
          `Name: ${data.first_name} ${data.last_name}`,
          `Email: ${data.email}`,
          `Company: ${data.company}`,
          `Salesforce edition: ${data.salesforce_edition}`,
          data.biggest_challenge && `Biggest challenge: ${data.biggest_challenge}`,
          `Phone: ${data.phone}`,
        ]
          .filter(Boolean)
          .join("\n");
        window.location.href = `mailto:${site.contactEmail}?subject=${encodeURIComponent("QuillStudio early access enquiry")}&body=${encodeURIComponent(body)}`;
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
    <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
      {/* Desktop: columns size to their content and the pair is centred, so the text sits close to the form. */}
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,36rem)] lg:justify-center lg:gap-12">
        <Reveal>
          <RevealItem>
            <p className="data-label text-rose">Get early access</p>
          </RevealItem>
          <RevealItem delay={0.06}>
            <h2 className="display shine-rose mt-3 text-[clamp(2.2rem,4.4vw,3.6rem)] font-medium leading-[1]">
              Ready to automate your document workflow?
            </h2>
          </RevealItem>
          <RevealItem delay={0.12}>
            <p className="mt-4 max-w-[42ch] text-[1.04rem] leading-relaxed text-slate">
              Leave your details and our team will reach out to set up a personalised demo.
            </p>
          </RevealItem>

          <RevealItem delay={0.18}>
            <div className="mt-7 max-w-[42ch]">
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
        </Reveal>

        <RevealItem delay={0.12}>
        {/* No card: the fields sit straight on the page, sized to match the text beside them. */}
        <div id="enquiry" className="scroll-mt-28">
          {state === "sent" || state === "mailto" || state === "offline" ? (
            <Outcome state={state} name={name} headingRef={resultRef} onReset={() => setState("idle")} />
          ) : (
            <form ref={formRef} noValidate onSubmit={onSubmit} aria-label="Early access enquiry">
              <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
                <Field label="First name" name="first_name" autoComplete="given-name" placeholder="John" maxLength={LIMITS.name} error={errors.first_name} />
                <Field label="Last name" name="last_name" autoComplete="family-name" placeholder="Smith" maxLength={LIMITS.name} error={errors.last_name} />
                <Field label="Work email" name="email" type="email" autoComplete="email" placeholder="john@company.com" maxLength={LIMITS.email} error={errors.email} />
                <Field label="Company" name="company" autoComplete="organization" placeholder="Acme Corp" maxLength={LIMITS.company} error={errors.company} />
                <Select label="Salesforce edition" name="salesforce_edition" placeholder="Select your edition" options={EDITIONS} error={errors.salesforce_edition} />
                <Select label="Biggest challenge" name="biggest_challenge" placeholder="Select your challenge" options={CHALLENGES} optional />
                <div className="sm:col-span-2">
                  <Field label="Phone" name="phone" type="tel" autoComplete="tel" placeholder="+1 (555) 000-0000" maxLength={LIMITS.phone} error={errors.phone} />
                </div>
              </div>

              {state === "error" && (
                <p role="alert" className="mt-4 text-[0.9rem] text-rose-deep">
                  The enquiry did not send. Your details are still here: check your connection and try again
                  {site.contactEmail ? `, or email ${site.contactEmail}` : ""}.
                </p>
              )}

              <div className="mt-5">
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
        </RevealItem>
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

function Label({ id, label, optional }: { id: string; label: string; optional?: boolean }) {
  return (
    <label htmlFor={id} className="flex justify-between text-[0.9rem] font-medium">
      <span>
        {label}
        {!optional && (
          <span className="text-rose" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </span>
      {optional && <span className="font-normal text-slate">Optional</span>}
    </label>
  );
}

function ErrorText({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={`${id}-err`} className="mt-1.5 text-[0.85rem] text-rose-deep">
      {error}
    </p>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  placeholder,
  maxLength,
  optional,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  maxLength?: number;
  optional?: boolean;
  error?: string;
}) {
  const id = `f-${name}`;
  return (
    <div>
      <Label id={id} label={label} optional={optional} />
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        maxLength={maxLength}
        required={!optional}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        className={`${FIELD} h-11`}
      />
      <ErrorText id={id} error={error} />
    </div>
  );
}

function Select({
  label,
  name,
  placeholder,
  options,
  optional,
  error,
}: {
  label: string;
  name: string;
  placeholder: string;
  options: Option[];
  optional?: boolean;
  error?: string;
}) {
  const id = `f-${name}`;
  const [empty, setEmpty] = useState(true);
  return (
    <div>
      <Label id={id} label={label} optional={optional} />
      <div className="relative">
        <select
          id={id}
          name={name}
          defaultValue=""
          required={!optional}
          onChange={(e) => setEmpty(e.target.value === "")}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-err` : undefined}
          className={cn(FIELD, "h-11 cursor-pointer appearance-none pr-10", empty && "text-slate")}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value} className="text-ink">
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 mt-[0.1875rem] h-4 w-4 -translate-y-1/2 text-slate" aria-hidden="true" />
      </div>
      <ErrorText id={id} error={error} />
    </div>
  );
}
