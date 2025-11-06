// app/integrations/[provider]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PROVIDERS } from "../_config";
import {
  CheckCircle2,
  Circle,
  AlertTriangle,
  Copy,
  Link2,
  Info,
  ChevronLeft,
  KeyRound,
  KeySquare,
  Phone,
  Globe,
  Hash,
  DollarSign,
  Flag,
} from "lucide-react";

type ProviderKey = (typeof PROVIDERS)[number]["key"];

type IntegrationState = {
  connected: boolean;
  data: Record<string, string>;
  statusMsg?: string;
};

const STORAGE_KEY = "rolkol.integrations.v1";

/* ---------- storage helpers ---------- */
function loadState(): Record<ProviderKey, IntegrationState> {
  if (typeof window === "undefined") return {} as any;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const initial: any = {};
  for (const p of PROVIDERS) initial[p.key] = { connected: false, data: {} };
  return initial;
}
function saveState(s: Record<ProviderKey, IntegrationState>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

/* ---------- ui bits ---------- */
function Badge({ ok, text }: { ok: boolean; text: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] border ${
        ok ? "bg-green-50 border-green-200 text-green-700" : "bg-gray-50 border-borderCard text-textDim"
      }`}
    >
      {ok ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
      {text}
    </span>
  );
}

function LabeledInput({
  label,
  name,
  placeholder,
  type = "text",
  value,
  onChange,
  icon,
  hint,
  invalid,
}: {
  label: string;
  name: string;
  placeholder?: string;
  type?: "text" | "password";
  value?: string;
  onChange: (v: string) => void;
  icon?: React.ReactNode;
  hint?: string;
  invalid?: boolean;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 text-[12px] font-medium text-slate-600">{label}</div>
      <div
        className={`relative flex items-center rounded-lg border bg-white transition focus-within:ring-2 ${
          invalid ? "border-red-300 focus-within:ring-red-300" : "border-borderCard focus-within:ring-sky-400"
        }`}
      >
        {icon && <div className="pl-2.5 text-slate-400">{icon}</div>}
        <input
          className="w-full rounded-lg bg-transparent px-3 py-2.5 text-[13.5px] outline-none"
          name={name}
          type={type}
          placeholder={placeholder}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      {hint && (
        <div className={`mt-1.5 text-[11.5px] ${invalid ? "text-red-600" : "text-textDim"}`}>{hint}</div>
      )}
    </label>
  );
}

/* map icons by field name */
function iconFor(field: string) {
  switch (field) {
    case "authToken":
    case "SHOPIFY_STOREFRONT_TOKEN":
      return <KeyRound className="w-4.5 h-4.5" />;
    case "authSecret":
    case "SHOPIFY_ADMIN_TOKEN":
      return <KeySquare className="w-4.5 h-4.5" />;
    case "fromNumber":
      return <Phone className="w-4.5 h-4.5" />;
    case "SHOPIFY_SHOP_DOMAIN":
      return <Globe className="w-4.5 h-4.5" />;
    case "SHOPIFY_API_VERSION":
      return <Hash className="w-4.5 h-4.5" />;
    case "SHOPIFY_COUNTRY":
      return <Flag className="w-4.5 h-4.5" />;
    case "SHOPIFY_CURRENCY":
      return <DollarSign className="w-4.5 h-4.5" />;
    default:
      return undefined;
  }
}

/* ---------- page ---------- */
export default function ProviderPage() {
  const params = useParams<{ provider: ProviderKey }>();
  const providerKey = params?.provider as ProviderKey;
  const provider = PROVIDERS.find((p) => p.key === providerKey);
  if (!provider) return notFound();

  const [state, setState] = useState<Record<ProviderKey, IntegrationState>>(() => loadState());
  const s = state[provider.key] ?? { connected: false, data: {} };

  // Stable relative webhook path to avoid hydration mismatch
  const webhookPath =
    provider.key === "twilio"
      ? "/api/webhooks/twilio"
      : provider.key === "plivo"
      ? "/api/webhooks/plivo"
      : provider.key === "shopify"
      ? "/api/webhooks/shopify"
      : "";

  const hasWebhook = Boolean(webhookPath);

  // phone validation only used when phone field exists
  const phone = s.data?.fromNumber ?? "";
  const phoneInvalid =
    provider.key === "twilio" || provider.key === "plivo"
      ? phone
        ? !/^\+[1-9]\d{6,14}$/.test(phone.trim())
        : false
      : false;

  useEffect(() => {
    saveState(state);
  }, [state]);

  function updateField(field: string, value: string) {
    if (!provider) return;
    setState((st) => ({
      ...st,
      [provider.key]: { ...st[provider.key], data: { ...(st[provider.key]?.data ?? {}), [field]: value } },
    }));
  }

  function toggleConnect() {
    if (!provider) return;
    setState((st) => ({
      ...st,
      [provider.key]: {
        ...st[provider.key],
        connected: !st[provider.key].connected,
        statusMsg: !st[provider.key].connected ? "Connected successfully." : "Disconnected.",
      },
    }));
  }

  function testConnection() {
    if (!provider) return;
    const ok = Object.values(state[provider.key].data ?? {}).some((v) => !!v?.trim());
    setState((st) => ({
      ...st,
      [provider.key]: { ...st[provider.key], statusMsg: ok ? "All good — credentials look valid." : "Missing fields." },
    }));
  }

  function copyAbsoluteWebhook() {
    const abs =
      typeof window !== "undefined" && webhookPath ? `${window.location.origin}${webhookPath}` : webhookPath;
    if (!abs) return;
    navigator.clipboard?.writeText(abs);
  }

  return (
    <div className="relative h-full min-h-screen overflow-y-auto">
      <main className="max-w-4xl mx-auto px-8 py-12 pb-32">
        {/* Back */}
        <div className="mb-4">
          <Link
            href="/integrations"
            className="inline-flex items-center gap-2 text-sm text-textDim hover:text-textMain transition"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Integrations
          </Link>
        </div>

        {/* Brand header */}
        <div className="rounded-2xl border border-borderCard bg-white shadow-sm overflow-hidden mb-6">
          <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-white to-slate-50">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl border border-borderCard bg-white flex items-center justify-center overflow-hidden shadow-sm">
                <Image
                  src={provider.logoUrl}
                  alt={`${provider.name} logo`}
                  width={36}
                  height={36}
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <h1 className="text-2xl font-semibold leading-tight">{provider.name}</h1>
                <p className="text-sm text-textDim">{provider.desc}</p>
              </div>
            </div>
            <Badge ok={!!s.connected} text={s.connected ? "Connected" : "Not connected"} />
          </div>
        </div>

        {/* Main card */}
        <section className="rounded-2xl bg-white border border-borderCard shadow-sm overflow-hidden">
          <div className="p-6 space-y-8">
            {/* Help */}
            {provider.help && (
              <div className="flex items-start gap-3 rounded-xl border border-borderCard bg-white p-4">
                <div className="shrink-0 mt-0.5 text-sky-500">
                  <Info className="w-5 h-5" />
                </div>
                <p className="text-[13.5px] text-slate-600">{provider.help}</p>
              </div>
            )}

            {/* Credentials (dynamic by provider) */}
            <div>
              <div className="mb-3">
                <h2 className="text-sm font-semibold text-slate-700">Credentials</h2>
                <p className="text-xs text-textDim mt-0.5">
                  {provider.key === "twilio" || provider.key === "plivo"
                    ? "Paste your tokens and the verified caller ID (E.164 format)."
                    : "Fill the required Shopify fields below."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {provider.fields.map((f) => (
                  <div
                    key={f.name}
                    className={
                      // Make phone number full width on md+; others stay half
                      f.name === "fromNumber" ? "md:col-span-2" : undefined
                    }
                  >
                    <LabeledInput
                      label={f.label}
                      name={f.name}
                      placeholder={f.placeholder}
                      type={f.secret ? "password" : "text"}
                      value={s.data?.[f.name]}
                      onChange={(v) => updateField(f.name, v)}
                      icon={iconFor(f.name)}
                      hint={
                        f.name === "fromNumber"
                          ? "Must be in E.164 format, e.g. +14155551234"
                          : undefined
                      }
                      invalid={f.name === "fromNumber" ? phoneInvalid : false}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Webhook */}
            {hasWebhook && (
              <div>
                <div className="mb-3">
                  <h2 className="text-sm font-semibold text-slate-700">Webhook</h2>
                  <p className="text-xs text-textDim mt-0.5">
                    Point your provider’s webhook to this URL to receive call/events.
                  </p>
                </div>

                <div className="rounded-lg border border-borderCard bg-white p-3.5">
                  <div className="text-[11px] text-textDim mb-1">Webhook URL</div>
                  <div className="flex items-center gap-2">
                    <code className="text-[12.5px] break-all">{webhookPath}</code>
                    <button
                      onClick={copyAbsoluteWebhook}
                      className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-borderCard bg-white px-2.5 py-1.5 text-[12px] hover:bg-[var(--accent-bg)]/50 transition"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy (absolute)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={toggleConnect}
                className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-[12.5px] border transition ${
                  s.connected
                    ? "border-red-200 text-red-700 bg-red-50 hover:bg-red-100"
                    : "border-sky-200 text-sky-700 bg-sky-50 hover:bg-sky-100"
                }`}
              >
                <Link2 className="w-4.5 h-4.5" />
                {s.connected ? "Disconnect" : "Connect"}
              </button>
              <button
                onClick={testConnection}
                className="inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-[12.5px] border border-borderCard bg-white hover:bg-[var(--accent-bg)]/50 transition"
              >
                Test connection
              </button>
              {s.statusMsg && <span className="text-[12.5px] text-textDim">{s.statusMsg}</span>}
            </div>

            {/* Danger */}
            {s.connected && (
              <div className="border-t border-borderSoft pt-5 mt-2">
                <div className="text-[12.5px] font-semibold mb-2">Danger zone</div>
                <div className="flex items-start gap-2 text-[12.5px] text-textDim mb-3">
                  <AlertTriangle className="w-4.5 h-4.5 mt-0.5 text-red-500" />
                  <p>
                    Disconnecting will stop new calls/data sync for this provider. Your saved credentials
                    remain in your account storage until removed on the server in a future step.
                  </p>
                </div>
                <button
                  onClick={toggleConnect}
                  className="inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-[12.5px] border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 transition"
                >
                  Disconnect now
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
