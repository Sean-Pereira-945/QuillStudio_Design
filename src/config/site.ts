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

  // TODO: endpoint that receives the enquiry form as JSON (HubSpot, Salesforce Web-to-Lead proxy, etc).
  formEndpoint: "",

  // TODO: legal pages.
  privacyUrl: "#",
  termsUrl: "#",
  cookiesUrl: "#",

  // Logo files served from /public/brand.
  logos: {
    quillstudio: "/brand/quillstudio-logo.png",
    excellerTech: "/brand/exceller-tech-logo.png",
  },

  company: "Exceller Tech",

  // TODO: proof shown under the hero. Leave empty and the strip does not render; never add placeholders.
  // e.g. { label: "Used by", items: ["Developer A", "Developer B"] }
  proof: { label: "", items: [] as string[] },

  // TODO: how fast the team replies to an enquiry, e.g. "within one working day". Empty hides the promise.
  replyTime: "",

  // TODO: indicative pricing, e.g. "From ₹X per user per month". Empty keeps the "tell us your seats" line.
  pricingFrom: "",
} as const;
