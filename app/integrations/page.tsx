import Image from "next/image";
import Link from "next/link";
import { PROVIDERS, CATEGORIES } from "./_config";

export const metadata = {
  title: "Integrations · Rolkol",
};

const CATEGORY_DESC: Record<string, string> = {
  Telephony: "Connect phone providers to place and receive calls.",
  Communication: "Hook up social channels to manage conversations.",
  Commerce: "Sync orders and customers from your store.",
};

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7.5 4.5l5 5-5 5"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function IntegrationsIndex() {
  return (
    <div className="relative min-h-screen">
      {/* Scale the whole content a touch to reduce the need for scroll */}
      <div className="origin-top scale-[0.93] [transform:translateZ(0)]">
        <main className="max-w-7xl mx-auto px-7 pt-12 pb-20">
          {/* Page header */}
          <header className="mb-8">
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-[34px] leading-[1.15] font-semibold tracking-tight text-textMain">
                  Integrations
                </h1>
                <p className="mt-2.5 text-[15px] text-textDim max-w-3xl">
                  Connect your favorite providers to supercharge Rolkol. Add telephony, communication,
                  or commerce integrations at any time.
                </p>
              </div>
              <span className="hidden md:inline-flex items-center rounded-full border border-[var(--border-card)]/60 px-4 py-2 text-xs font-semibold text-textDim bg-white shadow-sm">
                {PROVIDERS.length} available
              </span>
            </div>
            <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-[var(--border-card)] to-transparent" />
          </header>

          {/* Sections */}
          <div className="space-y-10">
            {CATEGORIES.map((cat) => (
              <section key={cat.title}>
                <div className="mb-4 flex items-baseline justify-between">
                  <h2 className="text-xl font-semibold text-textMain">{cat.title}</h2>
                  {CATEGORY_DESC[cat.title] && (
                    <p className="text-sm text-textDim">{CATEGORY_DESC[cat.title]}</p>
                  )}
                </div>

                {/* Keep big cards, but tightened gaps to help fit without scroll */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {cat.keys.map((k) => {
                    const p = PROVIDERS.find((x) => x.key === k)!;
                    return (
                      <Link
                        key={p.key}
                        href={`/integrations/${p.key}`}
                        className="group relative flex items-center gap-6 rounded-2xl border border-[var(--border-card)]/70 bg-white/90 p-6 shadow-md transition
                                   hover:bg-white hover:shadow-xl hover:border-sky-300/70
                                   focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
                      >
                        {/* Logo bigger */}
                        <div className="flex-shrink-0 h-16 w-16 rounded-xl bg-slate-50 border border-[var(--border-card)]/70 flex items-center justify-center overflow-hidden shadow-sm">
                          <Image
                            src={p.logoUrl}
                            alt={`${p.name} logo`}
                            width={44}
                            height={44}
                            className="object-contain"
                            priority
                          />
                        </div>

                        {/* Text */}
                        <div className="min-w-0">
                          <h3 className="text-lg font-semibold text-textMain group-hover:text-sky-700 transition-colors">
                            {p.name}
                          </h3>
                          <p className="mt-1.5 text-sm leading-6 text-textDim line-clamp-2">{p.desc}</p>
                        </div>

                        {/* Chevron */}
                        <ChevronRightIcon className="ml-auto h-6 w-6 text-slate-300 group-hover:text-sky-500 transition-colors" />
                        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-transparent group-hover:ring-sky-200/70" />
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
