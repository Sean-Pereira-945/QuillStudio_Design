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
} as const;
