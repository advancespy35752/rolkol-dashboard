"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";

/* ====================== Demo / Seeded Data (deterministic) ====================== */
const YESTERDAY_24H: number[] = [
  2, 1, 0, 1, 2, 4, 6, 9, 12, 14, 13, 11, 9, 8, 7, 8, 10, 12, 15, 13, 9, 6, 4, 3,
];

const calls7d = [18, 22, 34, 28, 31, 26, 40];
const avgDurationSec = 134; // 2m 14s
const answerRate = 0.86;

const connectedNumbers = [
  { label: "+1 (415) 555-0108", provider: "Twilio", logo: "/integration-logos/twilio.png" },
  { label: "+1 (628) 215-7781", provider: "Plivo", logo: "/integration-logos/plivo.png" },
  { label: "+91 99671 59549", provider: "Twilio", logo: "/integration-logos/twilio.png" },
];

const recentCalls = [
  { id: "C-78431", from: "+91 98301 12233", to: "Support", ts: "Nov 5, 10:22 PM", durationSec: 208, status: "completed" as const },
  { id: "C-78430", from: "+91 98215 56677", to: "Reservations", ts: "Nov 5, 09:15 PM", durationSec: 92, status: "completed" as const },
  { id: "C-78429", from: "+91 98804 43322", to: "Sales", ts: "Nov 5, 8:16 PM", durationSec: 110, status: "completed" as const },
  { id: "C-78428", from: "+91 97009 98877", to: "Billing", ts: "Nov 5, 03:14 PM", durationSec: 95, status: "completed" as const },
  { id: "C-78427", from: "+91 89545 53498", to: "Sales", ts: "Nov 5, 10:59 AM", durationSec: 0, status: "missed" as const },
];

/* ====================== helpers ====================== */
const sum = (a: number[]) => a.reduce((s, n) => s + n, 0);
const total7d = sum(calls7d);
const prev7d = 144;
const trendPct = ((total7d - prev7d) / Math.max(prev7d, 1)) * 100;

function mmss(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}m ${r.toString().padStart(2, "0")}s`;
}

function getYesterdayDate(): Date {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  d.setMinutes(0, 0, 0);
  return d;
}

function formatHourLabel(base: Date, hour: number) {
  const d = new Date(base);
  d.setHours(hour);
  const hh = d.getHours().toString().padStart(2, "0");
  return `${hh}:00`;
}

/* ====================== Page ====================== */
export default function DashboardPage() {
  const yesterday = useMemo(getYesterdayDate, []);
  const completed24h = sum(YESTERDAY_24H) - 24; // fake split
  const missed24h = 18;
  const failed24h = 9;

  return (
    // NEW: page-local scroll container
    <div className="flex h-full min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto space-y-8 pb-16 pr-1">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-[28px] leading-[1.05] font-semibold tracking-[-0.02em] text-textMain">
              Overview
            </h1>
            <p className="text-[13.5px] text-textDim">Quick stats across your assistant.</p>
          </div>
          <span className="inline-flex items-center gap-2 text-[11px] rounded-full border border-borderCard bg-white px-3 py-1 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <KpiCard
            label="Total Calls (7d)"
            value={String(total7d)}
            sub={trendPct >= 0 ? `▲ ${trendPct.toFixed(1)}% vs prev.` : `▼ ${Math.abs(trendPct).toFixed(1)}% vs prev.`}
            subClass={trendPct >= 0 ? "text-emerald-600" : "text-rose-600"}
          >
            <MiniLine data={calls7d} />
          </KpiCard>

          <KpiCard label="Avg Duration" value={mmss(avgDurationSec)} sub="24h window" />
          <KpiCard label="Answer Rate" value={`${Math.round(answerRate * 100)}%`} sub="Answered / All" />
          <KpiCard label="Connected Numbers" value={String(connectedNumbers.length)} sub="Active providers" />
        </div>

        {/* Status + Line chart for YESTERDAY */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card title="By status (24h)" subtitle="last 24h">
            <div className="space-y-4">
              <StatusRow label="Completed" value={completed24h} colorClass="bg-emerald-500" />
              <StatusRow label="Missed" value={missed24h} colorClass="bg-amber-500" />
              <StatusRow label="Failed" value={failed24h} colorClass="bg-rose-500" />
            </div>
            <div className="mt-5 rounded-lg border border-borderSoft p-3 bg-slate-50 text-xs text-textDim">
              Total: {completed24h + missed24h + failed24h} calls in the last 24 hours.
            </div>
          </Card>

          <Card className="xl:col-span-2" title={`Calls timeline (yesterday)`} subtitle="3h ticks • hover for details">
            <InteractiveLine24h data={YESTERDAY_24H} baseDate={yesterday} />
          </Card>
        </div>

        {/* Recent + Connected numbers with logos */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className="xl:col-span-2" title="Recent activity" subtitle="Last 5 calls">
            <div className="divide-y divide-borderSoft">
              {recentCalls.map((c) => (
                <div key={c.id} className="py-3 flex items-center justify-between gap-4 group">
                  <div className="min-w-0">
                    <div className="text-[14px] font-medium text-textMain truncate group-hover:text-sky-700 transition-colors">
                      {c.from} <span className="text-textDim font-normal">→ {c.to}</span>
                    </div>
                    <div className="text-[12px] text-textDim">
                      {c.ts} · {c.status === "completed" ? mmss(c.durationSec) : "—"}
                    </div>
                  </div>
                  <span
                    className={`text-[11px] rounded-full px-2 py-0.5 border ${
                      c.status === "completed"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : c.status === "missed"
                        ? "bg-amber-50 border-amber-200 text-amber-700"
                        : "bg-rose-50 border-rose-200 text-rose-700"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Connected numbers" subtitle="Providers">
            <ul className="space-y-3">
              {connectedNumbers.map((n) => (
                <li key={n.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg border border-borderCard bg-white grid place-items-center overflow-hidden">
                      <Image
                        src={n.logo}
                        alt={`${n.provider} logo`}
                        width={20}
                        height={20}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{n.label}</div>
                      <div className="text-xs text-textDim">{n.provider}</div>
                    </div>
                  </div>
                  <span className="text-[11px] rounded-full px-2 py-0.5 border bg-emerald-50 border-emerald-200 text-emerald-700">
                    Active
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ====================== Components ====================== */

function Card({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-2xl p-5 shadow-sm border border-borderCard hover:shadow-md transition ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-semibold tracking-[-0.01em]">{title}</h3>
        {subtitle && <span className="text-[11.5px] text-textDim">{subtitle}</span>}
      </div>
      {children}
    </div>
  );
}

function KpiCard({
  label,
  value,
  sub,
  subClass,
  children,
}: {
  label: string;
  value: string;
  sub?: string;
  subClass?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-borderCard hover:shadow-md transition">
      <div className="text-[12.5px] text-textDim mb-1">{label}</div>
      <div className="flex items-end justify-between gap-3">
        <div className="text-[30px] leading-none font-semibold tracking-[-0.02em] text-textMain">
          {value}
        </div>
        {children}
      </div>
      {sub && <div className={`text-[11.5px] mt-2 ${subClass ?? "text-textDim"}`}>{sub}</div>}
    </div>
  );
}

/* --------- small KPI mini-line --------- */
function MiniLine({ data }: { data: number[] }) {
  const w = 140, h = 52, pad = 6;
  const max = Math.max(...data, 1);
  const step = (w - pad * 2) / (data.length - 1 || 1);
  const pts = data.map((v, i) => {
    const x = pad + i * step;
    const y = h - pad - (v / max) * (h - pad * 2);
    return { x, y, v, i };
  });
  const d = `M ${pts.map((p) => `${p.x},${p.y}`).join(" L ")}`;
  const fill = `${d} L ${pad + (data.length - 1) * step},${h - pad} L ${pad},${h - pad} Z`;
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div
      className="relative select-none"
      style={{ width: w, height: h }}
      onMouseMove={(e) => {
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const idx = Math.round((x - pad) / step);
        setHover(Math.max(0, Math.min(pts.length - 1, idx)));
      }}
      onMouseLeave={() => setHover(null)}
      aria-label="7-day calls"
    >
      <svg width={w} height={h}>
        <defs>
          <linearGradient id="miniFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={fill} fill="url(#miniFill)" />
        <path d={d} fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
        <path d={d} fill="none" stroke="#93c5fd" strokeWidth="6" strokeOpacity="0.25" />
        {hover != null && (
          <>
            <line x1={pts[hover].x} y1={pad} x2={pts[hover].x} y2={h - pad} stroke="#bae6fd" strokeDasharray="3 3" />
            <circle cx={pts[hover].x} cy={pts[hover].y} r={4} fill="#2563eb" stroke="white" strokeWidth="2" />
          </>
        )}
      </svg>
      {hover != null && (
        <div
          className="absolute -translate-x-1/2 -translate-y-full px-2 py-1 rounded-md border border-borderCard bg-white text-[11px] shadow-md"
          style={{ left: pts[hover].x, top: pts[hover].y - 6 }}
        >
          {pts[hover].v} calls
        </div>
      )}
    </div>
  );
}

/* --------- FULL 24h interactive line chart (yesterday) with 3h ticks --------- */
function InteractiveLine24h({ data, baseDate }: { data: number[]; baseDate: Date }) {
  const w = 680;
  const h = 220;
  const pad = { l: 28, r: 10, t: 10, b: 28 };
  const max = Math.max(...data, 1);
  const stepX = (w - pad.l - pad.r) / (data.length - 1);
  const pts = data.map((v, i) => {
    const x = pad.l + i * stepX;
    const y = h - pad.b - (v / max) * (h - pad.t - pad.b);
    return { x, y, v, hour: i };
  });

  const path = `M ${pts.map((p) => `${p.x},${p.y}`).join(" L ")}`;
  const fill = `${path} L ${pad.l + (data.length - 1) * stepX},${h - pad.b} L ${pad.l},${h - pad.b} Z`;

  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const idx = Math.round((x - pad.l) / stepX);
    setHover(Math.max(0, Math.min(pts.length - 1, idx)));
  }

  const ticks = useMemo(() => Array.from({ length: 8 }, (_, i) => i * 3), []);

  return (
    <div
      ref={ref}
      className="relative select-none"
      style={{ width: w, height: h }}
      onMouseMove={onMove}
      onMouseLeave={() => setHover(null)}
      aria-label="Yesterday hourly calls"
    >
      <svg width={w} height={h}>
        {[0.25, 0.5, 0.75, 1].map((t, i) => {
          const y = h - pad.b - t * (h - pad.t - pad.b);
          return <line key={i} x1={pad.l} y1={y} x2={w - pad.r} y2={y} stroke="#e5e7eb" />;
        })}

        <defs>
          <linearGradient id="areaY" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={fill} fill="url(#areaY)" />
        <path d={path} fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" />
        <path d={path} fill="none" stroke="#7dd3fc" strokeWidth="8" strokeOpacity="0.25" />

        {hover != null && (
          <>
            <line x1={pts[hover].x} y1={pad.t} x2={pts[hover].x} y2={h - pad.b} stroke="#bae6fd" strokeDasharray="3 3" />
            <circle cx={pts[hover].x} cy={pts[hover].y} r={5} fill="#0ea5e9" stroke="white" strokeWidth="2" />
          </>
        )}

        {ticks.map((hr) => {
          const x = pad.l + hr * stepX;
          return (
            <g key={hr}>
              <line x1={x} y1={h - pad.b} x2={x} y2={h - pad.b + 4} stroke="#cbd5e1" />
              <text x={x} y={h - 6} textAnchor="middle" fontSize="11" fill="#6b7280">
                {formatHourLabel(baseDate, hr).slice(0, 2)}
              </text>
            </g>
          );
        })}

        <line x1={pad.l} y1={h - pad.b} x2={w - pad.r} y2={h - pad.b} stroke="#cbd5e1" />
      </svg>

      {hover != null && (
        <div
          className="absolute -translate-x-1/2 -translate-y-full px-2 py-1 rounded-md border border-borderCard bg-white text-[12px] shadow-md"
          style={{ left: pts[hover].x, top: pts[hover].y - 8 }}
        >
          <span className="font-medium">{formatHourLabel(baseDate, pts[hover].hour)}</span>
          <span className="mx-1 text-textDim">•</span>
          <span>{pts[hover].v} calls</span>
        </div>
      )}
    </div>
  );
}

function StatusRow({ label, value, colorClass }: { label: string; value: number; colorClass: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={`inline-block h-2.5 w-2.5 rounded-full ${colorClass}`} />
        <span className="text-[13.5px]">{label}</span>
      </div>
      <span className="text-[13.5px] font-semibold tracking-[-0.01em]">{value}</span>
    </div>
  );
}
