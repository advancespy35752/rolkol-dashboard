export type ProviderKey = "twilio" | "plivo" | "shopify" | "whatsapp" | "instagram";

export type IntegrationConfig = {
  key: ProviderKey;
  name: string;
  desc: string;
  help?: string;
  fields: { name: string; label: string; placeholder?: string; secret?: boolean }[];
  category: "Telephony" | "Commerce" | "Communication";
  logoUrl: string;
};

export const PROVIDERS: IntegrationConfig[] = [
  {
    key: "twilio",
    name: "Twilio",
    desc: "Access Twilio phone numbers for voice calls",
    help:
      "Enter your Authorized Token and Authorized Secret Key from Twilio, plus the verified caller ID (phone number).",
    fields: [
      { name: "authToken",  label: "Authorized token",      placeholder: "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", secret: true },
      { name: "authSecret", label: "Authorized secret key", placeholder: "Your Twilio secret key",            secret: true },
      { name: "fromNumber", label: "Phone number",          placeholder: "+14155551234" },
    ],
    category: "Telephony",
    logoUrl: "/integration-logos/twilio.png",
  },
  {
    key: "plivo",
    name: "Plivo",
    desc: "Access Plivo phone numbers for voice calls",
    help:
      "Enter your Authorized Token and Authorized Secret Key from Plivo, plus the caller ID phone number.",
    fields: [
      { name: "authToken",  label: "Authorized token",      placeholder: "MAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", secret: true },
      { name: "authSecret", label: "Authorized secret key", placeholder: "Your Plivo secret key",             secret: true },
      { name: "fromNumber", label: "Phone number",          placeholder: "+14155551234" },
    ],
    category: "Telephony",
    logoUrl: "/integration-logos/plivo.png",
  },
  {
    key: "shopify",
    name: "Shopify",
    desc: "Connect your store to pull orders & customer data",
    help:
      "Create a custom app in Shopify and paste the required credentials below. Storefront token is for the Storefront API; Admin token is for the Admin API.",
    fields: [
      { name: "SHOPIFY_SHOP_DOMAIN",     label: "Shop domain",         placeholder: "my-store.myshopify.com" },
      { name: "SHOPIFY_STOREFRONT_TOKEN",label: "Storefront token",     placeholder: "shptka_***", secret: true },
      { name: "SHOPIFY_ADMIN_TOKEN",     label: "Admin token",          placeholder: "shpat_***", secret: true },
      { name: "SHOPIFY_API_VERSION",     label: "API version",          placeholder: "2024-10" },
      { name: "SHOPIFY_COUNTRY",         label: "Country",              placeholder: "US" },
      { name: "SHOPIFY_CURRENCY",        label: "Currency",             placeholder: "USD" },
    ],
    category: "Commerce",
    logoUrl: "/integration-logos/shopify.png",
  },
  {
    key: "whatsapp",
    name: "Whatsapp Business",
    desc: "Manage your Whatsapp Business conversations",
    fields: [],
    category: "Communication",
    logoUrl: "/integration-logos/whatsapp.png",
  },
  {
    key: "instagram",
    name: "Instagram",
    desc: "Manage your Instagram Page conversations",
    fields: [],
    category: "Communication",
    logoUrl: "/integration-logos/instagram.png",
  },
];

export const CATEGORIES: Array<{ title: string; keys: ProviderKey[] }> = [
  { title: "Telephony", keys: ["twilio", "plivo"] },
  { title: "Communication", keys: ["whatsapp", "instagram"] },
  { title: "Commerce", keys: ["shopify"] },
];
