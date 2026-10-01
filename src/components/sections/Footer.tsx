import { Cloud, Lock, ShieldCheck } from "lucide-react";
import { BrandPill } from "@/components/layout/Logo";
import { RevealItem } from "@/components/ui/reveal";
import { site } from "@/config/site";

type FooterLink = { label: string; href: string; external?: boolean };

// Links render only when they lead somewhere real: no "#" placeholders, no empty URLs.
const real = (l: FooterLink) => l.href !== "" && l.href !== "#";

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Documentation", href: site.docsUrl, external: true },
    ].filter(real),
  },
  {
    title: "Support",
    links: [
      { label: "Help centre", href: site.helpUrl, external: true },
      { label: "Contact us", href: "#enquiry" },
      { label: "AppExchange", href: site.appExchangeUrl, external: true },
      { label: "Exceller Tech", href: site.excellerTechUrl, external: true },
    ].filter(real),
  },
].filter((c) => c.links.length > 0);

const legal: FooterLink[] = [
  { label: "Privacy policy", href: site.privacyUrl },
  { label: "Terms of service", href: site.termsUrl },
  { label: "Cookie policy", href: site.cookiesUrl },
].filter(real);

const trust = [
  { icon: Cloud, label: "Enterprise-grade cloud" },
  { icon: Lock, label: "TLS encryption" },
  { icon: ShieldCheck, label: "Data stays in your Salesforce org*" },
];

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

export function Footer() {
  return (
    <footer className="relative">
      <div className="border-t border-line bg-pearl">
        {/* Trust strip */}
        <RevealItem className="mx-auto max-w-[1200px] px-5 pb-10 pt-12 text-center sm:px-8">
          <p className="text-[0.95rem] text-slate">
            Trusted by <span className="font-medium text-rose">Salesforce</span> organizations worldwide
          </p>
          <a
            href={site.appExchangeUrl}
            {...ext}
            data-magnetic
            className="mt-5 inline-flex items-center gap-3 rounded-2xl border border-[#c9dcef] bg-[linear-gradient(180deg,#f2f8fe,#e3effb)] px-6 py-3 text-left shadow-[0_10px_24px_-14px_rgba(1,118,211,0.45)] transition-transform hover:-translate-y-0.5"
          >
            <img src={site.logos.salesforce} alt="" width={46} height={32} className="h-8 w-auto shrink-0" />
            <span className="leading-tight">
              <span className="block text-[0.78rem] text-slate">Available on</span>
              <span className="block text-[1.1rem] font-semibold text-[#032d60]">Salesforce AppExchange</span>
            </span>
          </a>
          <ul className="mt-6 flex flex-wrap justify-center gap-2.5">
            {trust.map(({ icon: Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 text-[0.85rem] text-ink/80">
                <Icon className="h-3.5 w-3.5 text-slate" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-4 max-w-[60ch] text-[0.78rem] leading-snug text-slate">
            *Templates and generated files remain in your Salesforce org; processing is transient with no app-side retention.
          </p>
        </RevealItem>

        {/* Brand and links */}
        <div className="mx-auto grid max-w-[1200px] gap-10 border-t border-line px-5 py-12 sm:px-8 md:grid-cols-[1.3fr_2fr]">
          <RevealItem>
            <BrandPill />
            <p className="mt-5 max-w-[40ch] text-[0.95rem] leading-relaxed text-slate">
              The most powerful document automation tool for Salesforce. Transform Word templates into professional PDFs with
              real customer data.
            </p>
          </RevealItem>
          <RevealItem delay={0.08}>
            <nav aria-label="Footer" className="grid grid-cols-2 gap-8 md:justify-items-end">
              {columns.map((c) => (
                <div key={c.title}>
                  <h2 className="text-[0.9rem] font-semibold">{c.title}</h2>
                  <ul className="mt-2">
                    {c.links.map((l) => (
                      <li key={l.label}>
                        <a href={l.href} className="inline-block py-1.5 text-[0.92rem] text-slate hover:text-ink" {...(l.external ? ext : {})}>
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

        {/* Bottom bar */}
        <RevealItem delay={0.12} className="border-t border-line">
          <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-5 text-[0.85rem] text-slate sm:px-8">
            <span>
              © {new Date().getFullYear()} QuillStudio. All rights reserved. · Managed &amp; developed by {site.legalEntity}
            </span>
            {legal.length > 0 && (
              <ul className="flex flex-wrap gap-x-5 gap-y-1">
                {legal.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="hover:text-ink">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </RevealItem>
      </div>
    </footer>
  );
}
