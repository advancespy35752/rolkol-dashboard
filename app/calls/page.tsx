"use client";

import { useMemo, useState } from "react";
import {
  PhoneCall,
  Search,
  Clock,
  Download,
  CalendarDays,
  Play,
  Shield,
} from "lucide-react";

type TranscriptTurn = { speaker: "Agent" | "Caller"; text: string; ts?: string };
type ExtractedData = {
  name?: string;
  phone?: string;
  email?: string;
  intent?: string;
  tags?: string[];
  notes?: string;
};
type CallRow = {
  id: string;
  from: string;
  to: string;
  startedAt: string;
  durationSec: number;
  status: "completed" | "missed" | "failed" | "in-progress";
  recordingUrl?: string;
  transcript: TranscriptTurn[];
  extracted?: ExtractedData;
};

/* ---------- MOCK DATA ---------- */
const SEED: CallRow[] = [
  {
    id: "919967159549-2025-07-18-185842",
    from: "+91 99671 59549",
    to: "Support Line",
    startedAt: "2025-07-18T18:58:42+05:30",
    durationSec: 72,
    status: "completed",
    recordingUrl:
      "https://file-examples.com/storage/fe1a57bb138b59c12/sample-audio.mp3",
    transcript: [
      {
        speaker: "Agent",
        text: "Hello, This is Meera. Thanks for calling Rolkol hotel, Banglore. How can I assist you today?",
        ts: "06:02 PM",
      },
      { speaker: "Caller", text: "Hello Meera, I want to book a room.", ts: "06:02 PM" },
      { speaker: "Agent", text: "Yes, I can hear you. What date would you like to check in?", ts: "06:02 PM" },
      { speaker: "Caller", text: "Tomorrow.", ts: "06:03 PM" },
      { speaker: "Agent", text: "Just to confirm, you want to check in on October 28, 2025, right? And when will you check out?", ts: "06:03 PM" },
      { speaker: "Caller", text: "On 30th October.", ts: "06:03 PM" },
      { speaker: "Agent", text: "Great! How many guests will be staying?", ts: "06:04 PM" },
      { speaker: "Caller", text: "Just me.", ts: "06:04 PM" },
      { speaker: "Agent", text: "We have a deluxe single room available for your dates. The rate is $120 per night. Would you like to proceed with the booking?", ts: "06:04 PM" },
      { speaker: "Caller", text: "Yes, please go ahead.", ts: "06:05 PM" },
      { speaker: "Agent", text: "Could you please provide your full name and contact number for the reservation?", ts: "06:05 PM" },
      { speaker: "Caller", text: "Rahul Sharma, +91 99671 59549.", ts: "06:05 PM" },
      { speaker: "Agent", text: "Thank you, Mr. Sharma. Your booking is confirmed from October 28 to October 30 in a deluxe single room. We look forward to welcoming you!", ts: "06:06 PM" },
    ],
    extracted: {
      name: "Rahul",
      phone: "+91 99671 59549",
      intent: "Delivery status",
      tags: ["support", "hindi"],
      notes: "Promised delivery by tomorrow.",
    },
  },
  {
    id: "918954553498-2025-07-18-185910",
    from: "+91 89545 53498",
    to: "Sales Line",
    startedAt: "2025-07-18T18:59:10+05:30",
    durationSec: 15,
    status: "missed",
    transcript: [],
  },
  {
    id: "919927687993-2025-07-18-190102",
    from: "+91 99276 87993",
    to: "Sales Line",
    startedAt: "2025-07-18T19:01:02+05:30",
    durationSec: 116,
    status: "completed",
    recordingUrl:
      "https://file-examples.com/storage/fe1a57bb138b59c12/sample-audio.mp3",
    transcript: [
      { speaker: "Caller", text: "Bulk pricing चाहिए 20 cases का.", ts: "07:01 PM" },
      { speaker: "Agent", text: "मैं चेक करता/करती हूँ, आप का नाम?", ts: "07:01 PM" },
      { speaker: "Caller", text: "Ankit from DS Distributor.", ts: "07:02 PM" },
      { speaker: "Agent", text: "मैं आपको कोटेशन मेल कर दूँगा/दूँगी।", ts: "07:02 PM" },
    ],
    extracted: {
      name: "Ankit",
      email: "ankit@dsdistributor.in",
      intent: "Bulk purchase",
      tags: ["lead", "pricing"],
    },
  },
];

// add many more to make the list scroll
const EXTRA: CallRow[] = Array.from({ length: 40 }, (_, i) => {
  const status: CallRow["status"][] = ["completed", "missed", "failed"];
  const st = status[i % status.length];
  return {
    id: `91${9100000000 + i}-2025-07-18-${180000 + i}`,
    from: `+91 ${91000 + i} ${10000 + (i % 9000)}`,
    to: i % 2 ? "Support Line" : "Sales Line",
    startedAt: new Date(2025, 6, 18, 17 + (i % 4), (i * 7) % 60).toISOString(),
    durationSec: 15 + ((i * 11) % 280),
    status: st,
    transcript:
      st === "completed"
        ? [
            { speaker: "Caller", text: "Hello, I need help with my order.", ts: "06:0" + (i % 9) + " PM" },
            { speaker: "Agent", text: "Sure, can I have the order ID?", ts: "06:0" + (i % 9) + " PM" },
          ]
        : [],
  };
});

const CALLS: CallRow[] = [...SEED, ...EXTRA];

/* ---------- HELPERS ---------- */

const callDateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
  timeZone: "Asia/Kolkata",
});

function formatCallDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return callDateFormatter.format(date);
}

function secondsToMmSs(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}m ${r.toString().padStart(2, "0")}s`;
}

/* ---------- PAGE ---------- */
export default function CallsPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "completed" | "missed" | "failed"
  >("all");
  const [selectedId, setSelectedId] = useState<string | null>(
    CALLS[0]?.id ?? null
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CALLS.filter((c) => {
      const matchesQ =
        !q ||
        c.id.toLowerCase().includes(q) ||
        c.from.toLowerCase().includes(q) ||
        c.to.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      return matchesQ && matchesStatus;
    });
  }, [query, statusFilter]);

  const selected =
    filtered.find((c) => c.id === selectedId) ?? filtered[0] ?? null;

  // keep selection valid when filters change
  if (selected && !filtered.some((c) => c.id === selected.id)) {
    setSelectedId(filtered[0]?.id ?? null);
  }

  function downloadTranscript(call: CallRow) {
    const text =
      call.transcript.length === 0
        ? "No transcript."
        : call.transcript.map((t) => `${t.speaker}: ${t.text}`).join("\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${call.id}-transcript.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="calls-legacy-root">
      <div className="calls-layout">
        {/* LEFT — LIST */}
        <aside className="calls-panel calls-panel--list">
          <div className="calls-panel-header">
            <h2 className="calls-panel-title">Calls</h2>
            <p className="calls-panel-hint">Search and filter through recent calls.</p>
          </div>

          <div className="calls-stack">
            <label className="calls-field">
              <span className="calls-label">Search</span>
              <div className="calls-input-wrap">
                <Search className="calls-input-icon" />
                <input
                  className="calls-input"
                  placeholder="Search by caller, number, or call id…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </label>

            <label className="calls-field">
              <span className="calls-label">Status</span>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as typeof statusFilter)
                }
                className="calls-input calls-select"
              >
                <option value="all">All</option>
                <option value="completed">Completed</option>
                <option value="missed">Missed</option>
                <option value="failed">Failed</option>
              </select>
            </label>
          </div>

          <div className="calls-list" role="list">
            {filtered.length === 0 ? (
              <div className="calls-empty">No calls.</div>
            ) : (
              filtered.map((c) => {
                const active = selected?.id === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="listitem"
                    className={`calls-card${active ? " is-active" : ""}`}
                    onClick={() => setSelectedId(c.id)}
                  >
                    <div className="calls-card-head">
                      <div className="calls-card-icon">
                        <PhoneCall className="calls-card-icon-svg" />
                      </div>
                      <div className="calls-card-title">
                        <strong>{c.from}</strong>
                        <span>to {c.to}</span>
                      </div>
                    </div>
                    <div className="calls-card-meta">
                      <span>{formatCallDate(c.startedAt)}</span>
                      <span>
                        {secondsToMmSs(c.durationSec)} · {c.status}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* CENTER — MESSAGES */}
        <section className="calls-panel calls-panel--transcript">
          {!selected ? (
            <div className="calls-empty">Select a call.</div>
          ) : (
            <>
              <div className="calls-active-head">
                <div className="calls-active-party">
                  <div className="calls-card-icon calls-card-icon--large">
                    <PhoneCall className="calls-card-icon-svg" />
                  </div>
                  <div className="calls-active-ident">
                    <h3>{selected.from}</h3>
                    <span className="calls-active-sub">Call ID • {selected.id}</span>
                  </div>
                </div>
                {selected.recordingUrl && (
                  <a
                    href={selected.recordingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="calls-link calls-link--primary"
                  >
                    <Play className="calls-active-chip-icon" />
                    Play / Download
                  </a>
                )}
              </div>

              <div className="calls-messages">
                {selected.transcript.length === 0 ? (
                  <div className="calls-empty">No messages.</div>
                ) : (
                  selected.transcript.map((m, i) => {
                    const isAgent = m.speaker === "Agent";
                    return (
                      <div
                        key={i}
                        className={`calls-bubble${isAgent ? " is-agent" : ""}`}
                      >
                        <div className="calls-bubble-meta">
                          <span>{m.speaker}</span>
                          {m.ts && <time>{m.ts}</time>}
                        </div>
                        <p>{m.text}</p>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="calls-footer">
                <button
                  onClick={() => selected && downloadTranscript(selected)}
                  className="calls-btn calls-btn--primary"
                >
                  <Download className="calls-btn-icon" />
                  Download Transcript
                </button>
              </div>
            </>
          )}
        </section>

        {/* RIGHT — DETAILS */}
        <aside className="calls-panel calls-panel--details">
          {!selected ? (
            <div className="calls-empty">Details</div>
          ) : (
            <>
              <div className="calls-details-head">
                <h3>Details</h3>
                <span>
                  <Shield className="calls-active-chip-icon" /> Secure
                </span>
              </div>

              <div className="calls-details-body">
                <section>
                  <h4>Conversation Details</h4>
                  <div className="calls-details-grid">
                    <KV label="Call ID" value={selected.id} />
                    <KV
                      label="Call Duration"
                      value={secondsToMmSs(selected.durationSec)}
                    />
                    <KV label="Call From" value={selected.from} />
                    <KV label="Start time" value={formatCallDate(selected.startedAt)} />
                  </div>
                </section>

                <section>
                  <h4>Extraction Details</h4>
                  {!selected.extracted ? (
                    <p className="calls-empty">No extracted data.</p>
                  ) : (
                    <div className="calls-details-grid">
                      {selected.extracted.name && (
                        <KV label="Name" value={selected.extracted.name} />
                      )}
                      {selected.extracted.phone && (
                        <KV label="Phone" value={selected.extracted.phone} />
                      )}
                      {selected.extracted.email && (
                        <KV label="Email" value={selected.extracted.email} />
                      )}
                      {selected.extracted.intent && (
                        <KV label="Intent" value={selected.extracted.intent} />
                      )}
                      {selected.extracted.tags && selected.extracted.tags.length > 0 && (
                        <div className="calls-tags">
                          {selected.extracted.tags.map((t) => (
                            <span key={t}>{t}</span>
                          ))}
                        </div>
                      )}
                      {selected.extracted.notes && (
                        <div className="calls-notes">{selected.extracted.notes}</div>
                      )}
                    </div>
                  )}
                </section>

                <section>
                  <h4>Tags</h4>
                  <p className="calls-muted">No tags assigned</p>
                </section>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

/* ---------- SMALL UI ---------- */
function KV({ label, value }: { label: string; value: string }) {
  return (
    <div className="calls-kv">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
