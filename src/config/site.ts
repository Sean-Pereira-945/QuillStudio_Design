/**
 * Every real-world link and asset the site depends on lives here.
 * Items marked TODO are waiting on Blaze (see Section 14 of the requirements).
 */
export const site = {
  // TODO: replace with the live AppExchange listing URL. The button must lead to a working listing.
  appExchangeUrl: "https://appexchange.salesforce.com/",
  appExchangeConfirmed: false,

  // TODO: demo booking link (Calendly, HubSpot meetings, etc). Falls back to the enquiry form.
  bookDemoUrl: "#enquiry",

  // TODO: real contact email. Until set, "Talk to us" scrolls to the enquiry form.
  contactEmail: "",

  // The enquiry form posts JSON here. It is the same lead API quillstudio.tech uses: vercel.json (and the
  // dev server in vite.config.ts) forward /api/leads to https://www.quillstudio.tech/api/leads, because that
  // API does not accept cross-origin requests from the browser.
  formEndpoint: "/api/leads",

  // TODO: documentation and help centre. Footer links stay hidden until these are set.
  docsUrl: "",
  helpUrl: "",

  excellerTechUrl: "https://exceller.tech",
  legalEntity: "Exceller Management Consultancy LLP",

  // TODO: legal pages.
  privacyUrl: "#",
  termsUrl: "#",
  cookiesUrl: "#",

  // Logo files served from /public/brand.
  logos: {
    quillstudio: "/brand/quillstudio-logo.png",
    excellerTech: "/brand/exceller-tech-logo.png",
    salesforce: "/brand/salesforce-logo.svg",
  },

  company: "Exceller Tech",

  // TODO: proof shown under the hero. Leave empty and the strip does not render; never add placeholders.
  // e.g. { label: "Used by", items: ["Developer A", "Developer B"] }
  proof: { label: "", items: [] as string[] },

  // TODO: how fast the team replies to an enquiry, e.g. "within one working day". Empty hides the promise.
  replyTime: "",

  // The plan shown in the Pricing section.
  plan: {
    name: "QuillStudio",
    price: "$20",
    unit: "/ user / month",
    features: ["Unlimited document generation", "Salesforce native integration", "Secure & scalable"],
    salesThreshold: "100+",
  },
} as const;
