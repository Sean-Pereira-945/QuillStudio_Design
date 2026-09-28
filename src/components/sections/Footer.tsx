import { BrandPill } from "@/components/layout/Logo";
import { site } from "@/config/site";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Governance", href: "#benefits" },
      { label: "Get it on AppExchange", href: site.appExchangeUrl, external: true },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Book a demo", href: site.bookDemoUrl },
      { label: "Contact", href: site.contactEmail ? `mailto:${site.contactEmail}` : "#enquiry" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: site.privacyUrl },
      { label: "Terms", href: site.termsUrl },
      { label: "Cookies", href: site.cookiesUrl },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-line bg-pearl">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.3fr_2fr]">
        <div>
          <BrandPill />
          <p className="mt-5 max-w-[38ch] text-[0.95rem] leading-relaxed text-slate">
            Salesforce-native document generation and governance for real estate developers.
          </p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {columns.map((c) => (
            <div key={c.title}>
              <h2 className="text-[0.9rem] font-semibold">{c.title}</h2>
              <ul className="mt-3 space-y-2">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-[0.92rem] text-slate hover:text-ink"
                      {...("external" in l && l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1200px] flex-wrap justify-between gap-2 px-5 py-5 text-[0.85rem] text-slate sm:px-8">
          <span>© {new Date().getFullYear()} {site.company}. All rights reserved.</span>
          <span>QuillStudio is a product of {site.company}.</span>
        </div>
      </div>
    </footer>
  );
}
