import { BrandPill } from "@/components/layout/Logo";
import { site } from "@/config/site";
import { RevealItem } from "@/components/ui/reveal";

type FooterLink = { label: string; href: string; external?: boolean };

// Links render only when they lead somewhere real: no "#" placeholders, no duplicates of the enquiry form.
const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Features", href: "#features" },
      ...(site.appExchangeConfirmed ? [{ label: "Get it on AppExchange", href: site.appExchangeUrl, external: true }] : []),
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "Book a demo", href: site.bookDemoUrl },
      ...(site.contactEmail ? [{ label: "Email us", href: `mailto:${site.contactEmail}` }] : []),
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: site.privacyUrl },
      { label: "Terms", href: site.termsUrl },
      { label: "Cookies", href: site.cookiesUrl },
    ].filter((l) => l.href !== "#"),
  },
].filter((c) => c.links.length > 0);

export function Footer() {
  return (
    <footer className="relative border-t border-line bg-pearl">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.3fr_2fr]">
        <RevealItem>
          <BrandPill />
          <p className="mt-5 max-w-[38ch] text-[0.95rem] leading-relaxed text-slate">
            Salesforce-native document generation and governance for real estate developers.
          </p>
        </RevealItem>
        <RevealItem delay={0.08}>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {columns.map((c) => (
            <div key={c.title}>
              <h2 className="text-[0.9rem] font-semibold">{c.title}</h2>
              <ul className="mt-2">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="inline-block py-1.5 text-[0.92rem] text-slate hover:text-ink"
                      {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        </RevealItem>
      </div>
      <RevealItem delay={0.12} className="border-t border-line">
        <div className="mx-auto flex max-w-[1200px] flex-wrap justify-between gap-2 px-5 py-5 text-[0.85rem] text-slate sm:px-8">
          <span>© {new Date().getFullYear()} {site.company}. All rights reserved.</span>
          <span>QuillStudio is a product of {site.company}.</span>
        </div>
      </RevealItem>
    </footer>
  );
}
