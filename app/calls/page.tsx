// "use client";

// import { useMemo, useState } from "react";
// import {
//   PhoneCall,
//   Search,
//   Clock,
//   Download,
//   CalendarDays,
//   Play,
//   Shield,
// } from "lucide-react";

// type TranscriptTurn = { speaker: "Agent" | "Caller"; text: string; ts?: string };
// type ExtractedData = {
//   name?: string;
//   phone?: string;
//   email?: string;
//   intent?: string;
//   tags?: string[];
//   notes?: string;
// };
// type CallRow = {
//   id: string;
//   from: string;
//   to: string;
//   startedAt: string;
//   durationSec: number;
//   status: "completed" | "missed" | "failed" | "in-progress";
//   recordingUrl?: string;
//   transcript: TranscriptTurn[];
//   extracted?: ExtractedData;
// };

// /* ---------- MOCK DATA ---------- */
// const SEED: CallRow[] = [
//   {
//     id: "919967159549-2025-07-18-185842",
//     from: "+91 99671 59549",
//     to: "Support Line",
//     startedAt: "2025-07-18T18:58:42+05:30",
//     durationSec: 72,
//     status: "completed",
//     recordingUrl:
//       "https://file-examples.com/storage/fe1a57bb138b59c12/sample-audio.mp3",
//     transcript: [
//       {
//         speaker: "Agent",
//         text: "Hello, This is Meera. Thanks for calling Rolkol hotel, Banglore. How can I assist you today?",
//         ts: "06:02 PM",
//       },
//       { speaker: "Caller", text: "Hello Meera, I want to book a room.", ts: "06:02 PM" },
//       { speaker: "Agent", text: "Yes, I can hear you. What date would you like to check in?", ts: "06:02 PM" },
//       { speaker: "Caller", text: "Tomorrow.", ts: "06:03 PM" },
//       { speaker: "Agent", text: "Just to confirm, you want to check in on October 28, 2025, right? And when will you check out?", ts: "06:03 PM" },
//       { speaker: "Caller", text: "On 30th October.", ts: "06:03 PM" },
//       { speaker: "Agent", text: "Great! How many guests will be staying?", ts: "06:04 PM" },
//       { speaker: "Caller", text: "Just me.", ts: "06:04 PM" },
//       { speaker: "Agent", text: "We have a deluxe single room available for your dates. The rate is $120 per night. Would you like to proceed with the booking?", ts: "06:04 PM" },
//       { speaker: "Caller", text: "Yes, please go ahead.", ts: "06:05 PM" },
//       { speaker: "Agent", text: "Could you please provide your full name and contact number for the reservation?", ts: "06:05 PM" },
//       { speaker: "Caller", text: "Rahul Sharma, +91 99671 59549.", ts: "06:05 PM" },
//       { speaker: "Agent", text: "Thank you, Mr. Sharma. Your booking is confirmed from October 28 to October 30 in a deluxe single room. We look forward to welcoming you!", ts: "06:06 PM" },
//     ],
//     extracted: {
//       name: "Rahul",
//       phone: "+91 99671 59549",
//       intent: "Delivery status",
//       tags: ["support", "hindi"],
//       notes: "Promised delivery by tomorrow.",
//     },
//   },
//   {
//     id: "918954553498-2025-07-18-185910",
//     from: "+91 89545 53498",
//     to: "Sales Line",
//     startedAt: "2025-07-18T18:59:10+05:30",
//     durationSec: 15,
//     status: "missed",
//     transcript: [],
//   },
//   {
//     id: "919927687993-2025-07-18-190102",
//     from: "+91 99276 87993",
//     to: "Sales Line",
//     startedAt: "2025-07-18T19:01:02+05:30",
//     durationSec: 116,
//     status: "completed",
//     recordingUrl:
//       "https://file-examples.com/storage/fe1a57bb138b59c12/sample-audio.mp3",
//     transcript: [
//       { speaker: "Caller", text: "Bulk pricing चाहिए 20 cases का.", ts: "07:01 PM" },
//       { speaker: "Agent", text: "मैं चेक करता/करती हूँ, आप का नाम?", ts: "07:01 PM" },
//       { speaker: "Caller", text: "Ankit from DS Distributor.", ts: "07:02 PM" },
//       { speaker: "Agent", text: "मैं आपको कोटेशन मेल कर दूँगा/दूँगी।", ts: "07:02 PM" },
//     ],
//     extracted: {
//       name: "Ankit",
//       email: "ankit@dsdistributor.in",
//       intent: "Bulk purchase",
//       tags: ["lead", "pricing"],
//     },
//   },
// ];

// // add many more to make the list scroll
// const EXTRA: CallRow[] = Array.from({ length: 40 }, (_, i) => {
//   const status: CallRow["status"][] = ["completed", "missed", "failed"];
//   const st = status[i % status.length];
//   return {
//     id: `91${9100000000 + i}-2025-07-18-${180000 + i}`,
//     from: `+91 ${91000 + i} ${10000 + (i % 9000)}`,
//     to: i % 2 ? "Support Line" : "Sales Line",
//     startedAt: new Date(2025, 6, 18, 17 + (i % 4), (i * 7) % 60).toISOString(),
//     durationSec: 15 + ((i * 11) % 280),
//     status: st,
//     transcript:
//       st === "completed"
//         ? [
//             { speaker: "Caller", text: "Hello, I need help with my order.", ts: "06:0" + (i % 9) + " PM" },
//             { speaker: "Agent", text: "Sure, can I have the order ID?", ts: "06:0" + (i % 9) + " PM" },
//           ]
//         : [],
//   };
// });

// const CALLS: CallRow[] = [...SEED, ...EXTRA];

// /* ---------- HELPERS ---------- */

// const callDateFormatter = new Intl.DateTimeFormat("en-US", {
//   year: "numeric",
//   month: "2-digit",
//   day: "2-digit",
//   hour: "numeric",
//   minute: "2-digit",
//   second: "2-digit",
//   hour12: true,
//   timeZone: "Asia/Kolkata",
// });

// function formatCallDate(iso: string) {
//   const date = new Date(iso);
//   if (Number.isNaN(date.getTime())) return "";
//   return callDateFormatter.format(date);
// }

// function secondsToMmSs(s: number) {
//   const m = Math.floor(s / 60);
//   const r = s % 60;
//   return `${m}m ${r.toString().padStart(2, "0")}s`;
// }

// /* ---------- PAGE ---------- */
// export default function CallsPage() {
//   const [query, setQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState<
//     "all" | "completed" | "missed" | "failed"
//   >("all");
//   const [selectedId, setSelectedId] = useState<string | null>(
//     CALLS[0]?.id ?? null
//   );

//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     return CALLS.filter((c) => {
//       const matchesQ =
//         !q ||
//         c.id.toLowerCase().includes(q) ||
//         c.from.toLowerCase().includes(q) ||
//         c.to.toLowerCase().includes(q);
//       const matchesStatus = statusFilter === "all" || c.status === statusFilter;
//       return matchesQ && matchesStatus;
//     });
//   }, [query, statusFilter]);

//   const selected =
//     filtered.find((c) => c.id === selectedId) ?? filtered[0] ?? null;

//   // keep selection valid when filters change
//   if (selected && !filtered.some((c) => c.id === selected.id)) {
//     setSelectedId(filtered[0]?.id ?? null);
//   }

//   function downloadTranscript(call: CallRow) {
//     const text =
//       call.transcript.length === 0
//         ? "No transcript."
//         : call.transcript.map((t) => `${t.speaker}: ${t.text}`).join("\n");
//     const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `${call.id}-transcript.txt`;
//     a.click();
//     URL.revokeObjectURL(url);
//   }

//   return (
//     <div className="calls-legacy-root">
//       <div className="calls-layout">
//         {/* LEFT — LIST */}
//         <aside className="calls-panel calls-panel--list">
//           <div className="calls-panel-header">
//             <h2 className="calls-panel-title">Calls</h2>
//             <p className="calls-panel-hint">Search and filter through recent calls.</p>
//           </div>

//           <div className="calls-stack">
//             <label className="calls-field">
//               <span className="calls-label">Search</span>
//               <div className="calls-input-wrap">
//                 <Search className="calls-input-icon" />
//                 <input
//                   className="calls-input"
//                   placeholder="Search by caller, number, or call id…"
//                   value={query}
//                   onChange={(e) => setQuery(e.target.value)}
//                 />
//               </div>
//             </label>

//             <label className="calls-field">
//               <span className="calls-label">Status</span>
//               <select
//                 value={statusFilter}
//                 onChange={(e) =>
//                   setStatusFilter(e.target.value as typeof statusFilter)
//                 }
//                 className="calls-input calls-select"
//               >
//                 <option value="all">All</option>
//                 <option value="completed">Completed</option>
//                 <option value="missed">Missed</option>
//                 <option value="failed">Failed</option>
//               </select>
//             </label>
//           </div>

//           <div className="calls-list" role="list">
//             {filtered.length === 0 ? (
//               <div className="calls-empty">No calls.</div>
//             ) : (
//               filtered.map((c) => {
//                 const active = selected?.id === c.id;
//                 return (
//                   <button
//                     key={c.id}
//                     type="button"
//                     role="listitem"
//                     className={`calls-card${active ? " is-active" : ""}`}
//                     onClick={() => setSelectedId(c.id)}
//                   >
//                     <div className="calls-card-head">
//                       <div className="calls-card-icon">
//                         <PhoneCall className="calls-card-icon-svg" />
//                       </div>
//                       <div className="calls-card-title">
//                         <strong>{c.from}</strong>
//                         <span>to {c.to}</span>
//                       </div>
//                     </div>
//                     <div className="calls-card-meta">
//                       <span>{formatCallDate(c.startedAt)}</span>
//                       <span>
//                         {secondsToMmSs(c.durationSec)} · {c.status}
//                       </span>
//                     </div>
//                   </button>
//                 );
//               })
//             )}
//           </div>
//         </aside>

//         {/* CENTER — MESSAGES */}
//         <section className="calls-panel calls-panel--transcript">
//           {!selected ? (
//             <div className="calls-empty">Select a call.</div>
//           ) : (
//             <>
//               <div className="calls-active-head">
//                 <div className="calls-active-party">
//                   <div className="calls-card-icon calls-card-icon--large">
//                     <PhoneCall className="calls-card-icon-svg" />
//                   </div>
//                   <div className="calls-active-ident">
//                     <h3>{selected.from}</h3>
//                     <span className="calls-active-sub">Call ID • {selected.id}</span>
//                   </div>
//                 </div>
//                 {selected.recordingUrl && (
//                   <a
//                     href={selected.recordingUrl}
//                     target="_blank"
//                     rel="noreferrer"
//                     className="calls-link calls-link--primary"
//                   >
//                     <Play className="calls-active-chip-icon" />
//                     Play / Download
//                   </a>
//                 )}
//               </div>

//               <div className="calls-messages">
//                 {selected.transcript.length === 0 ? (
//                   <div className="calls-empty">No messages.</div>
//                 ) : (
//                   selected.transcript.map((m, i) => {
//                     const isAgent = m.speaker === "Agent";
//                     return (
//                       <div
//                         key={i}
//                         className={`calls-bubble${isAgent ? " is-agent" : ""}`}
//                       >
//                         <div className="calls-bubble-meta">
//                           <span>{m.speaker}</span>
//                           {m.ts && <time>{m.ts}</time>}
//                         </div>
//                         <p>{m.text}</p>
//                       </div>
//                     );
//                   })
//                 )}
//               </div>

//               <div className="calls-footer">
//                 <button
//                   onClick={() => selected && downloadTranscript(selected)}
//                   className="calls-btn calls-btn--primary"
//                 >
//                   <Download className="calls-btn-icon" />
//                   Download Transcript
//                 </button>
//               </div>
//             </>
//           )}
//         </section>

//         {/* RIGHT — DETAILS */}
//         <aside className="calls-panel calls-panel--details">
//           {!selected ? (
//             <div className="calls-empty">Details</div>
//           ) : (
//             <>
//               <div className="calls-details-head">
//                 <h3>Details</h3>
//                 <span>
//                   <Shield className="calls-active-chip-icon" /> Secure
//                 </span>
//               </div>

//               <div className="calls-details-body">
//                 <section>
//                   <h4>Conversation Details</h4>
//                   <div className="calls-details-grid">
//                     <KV label="Call ID" value={selected.id} />
//                     <KV
//                       label="Call Duration"
//                       value={secondsToMmSs(selected.durationSec)}
//                     />
//                     <KV label="Call From" value={selected.from} />
//                     <KV label="Start time" value={formatCallDate(selected.startedAt)} />
//                   </div>
//                 </section>

//                 <section>
//                   <h4>Extraction Details</h4>
//                   {!selected.extracted ? (
//                     <p className="calls-empty">No extracted data.</p>
//                   ) : (
//                     <div className="calls-details-grid">
//                       {selected.extracted.name && (
//                         <KV label="Name" value={selected.extracted.name} />
//                       )}
//                       {selected.extracted.phone && (
//                         <KV label="Phone" value={selected.extracted.phone} />
//                       )}
//                       {selected.extracted.email && (
//                         <KV label="Email" value={selected.extracted.email} />
//                       )}
//                       {selected.extracted.intent && (
//                         <KV label="Intent" value={selected.extracted.intent} />
//                       )}
//                       {selected.extracted.tags && selected.extracted.tags.length > 0 && (
//                         <div className="calls-tags">
//                           {selected.extracted.tags.map((t) => (
//                             <span key={t}>{t}</span>
//                           ))}
//                         </div>
//                       )}
//                       {selected.extracted.notes && (
//                         <div className="calls-notes">{selected.extracted.notes}</div>
//                       )}
//                     </div>
//                   )}
//                 </section>

//                 <section>
//                   <h4>Tags</h4>
//                   <p className="calls-muted">No tags assigned</p>
//                 </section>
//               </div>
//             </>
//           )}
//         </aside>
//       </div>
//     </div>
//   );
// }

// /* ---------- SMALL UI ---------- */
// function KV({ label, value }: { label: string; value: string }) {
//   return (
//     <div className="calls-kv">
//       <span>{label}</span>
//       <strong>{value}</strong>
//     </div>
//   );
// }



"use client";

import { useMemo, useState } from "react";
import { PhoneCall, Search, Clock, Download, CalendarDays, Play, Shield } from "lucide-react";

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
  // --- original 1: Rahul (hotel booking) ---
  {
    id: "919967159549-2025-07-18-185842",
    from: "+91 99671 59549",
    to: "Support Line",
    startedAt: "2025-07-18T18:58:42+05:30",
    durationSec: 72,
    status: "completed",
    recordingUrl: "https://file-examples.com/storage/fe1a57bb138b59c12/sample-audio.mp3",
    transcript: [
      { speaker: "Agent", text: "Hello, This is Meera. Thanks for calling Rolkol hotel, Banglore. How can I assist you today?", ts: "06:02 PM" },
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
  // --- original 2: missed ---
  {
    id: "918954553498-2025-07-18-185910",
    from: "+91 89545 53498",
    to: "Sales Line",
    startedAt: "2025-07-18T18:59:10+05:30",
    durationSec: 15,
    status: "missed",
    transcript: [],
  },
  // --- original 3: Ankit (bulk pricing) ---
  {
    id: "919927687993-2025-07-18-190102",
    from: "+91 99276 87993",
    to: "Sales Line",
    startedAt: "2025-07-18T19:01:02+05:30",
    durationSec: 116,
    status: "completed",
    recordingUrl: "https://file-examples.com/storage/fe1a57bb138b59c12/sample-audio.mp3",
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

  // --- NEW 1: Long support escalation (device not powering on) ---
  {
    id: "919830112233-2025-07-19-101512",
    from: "+91 98301 12233",
    to: "Support Line",
    startedAt: "2025-07-19T10:15:12+05:30",
    durationSec: 152,
    status: "completed",
    recordingUrl: "https://file-examples.com/storage/fe1a57bb138b59c12/sample-audio.mp3",
    transcript: [
      { speaker: "Agent", text: "Thank you for calling Rolkol Support, this is Arjun. How may I help you today?", ts: "10:15 AM" },
      { speaker: "Caller", text: "Hi, my device won’t power on after last night’s update.", ts: "10:15 AM" },
      { speaker: "Agent", text: "I’m sorry to hear that. May I have your name and the device serial number?", ts: "10:16 AM" },
      { speaker: "Caller", text: "Neha Gupta. Serial is RX-22-7A-9812.", ts: "10:16 AM" },
      { speaker: "Agent", text: "Thanks, Neha. Let’s try a soft reset: hold the top button for 15 seconds.", ts: "10:17 AM" },
      { speaker: "Caller", text: "Doing it… still no response.", ts: "10:17 AM" },
      { speaker: "Agent", text: "Understood. We’ll try recovery mode. Connect the charger and hold both buttons for 30 seconds.", ts: "10:18 AM" },
      { speaker: "Caller", text: "Okay… I see a blinking green light.", ts: "10:19 AM" },
      { speaker: "Agent", text: "Perfect. That means recovery worked. When the logo shows, release the buttons.", ts: "10:19 AM" },
      { speaker: "Caller", text: "It booted! But it says ‘Storage nearly full’.", ts: "10:20 AM" },
      { speaker: "Agent", text: "We can clear cache safely. Go to Settings → Storage → Clear temporary files.", ts: "10:20 AM" },
      { speaker: "Caller", text: "Done. Now it looks normal.", ts: "10:21 AM" },
      { speaker: "Agent", text: "I’m glad. I’ll also create a case and email steps in case it happens again.", ts: "10:21 AM" },
      { speaker: "Caller", text: "Please do. Thanks for the quick fix!", ts: "10:22 AM" },
      { speaker: "Agent", text: "You’re welcome, Neha. Anything else I can help with today?", ts: "10:22 AM" },
      { speaker: "Caller", text: "No, that’s all.", ts: "10:22 AM" },
      { speaker: "Agent", text: "Have a great day!", ts: "10:22 AM" },
    ],
    extracted: {
      name: "Neha Gupta",
      phone: "+91 98301 12233",
      intent: "Technical issue",
      tags: ["escalation", "firmware", "resolved"],
      notes: "Guided to recovery mode; cleared cache; device booted.",
    },
  },

  // --- NEW 2: Long reservation with payment link ---
  {
    id: "919821556677-2025-07-20-091045",
    from: "+91 98215 56677",
    to: "Reservations",
    startedAt: "2025-07-20T09:10:45+05:30",
    durationSec: 118,
    status: "completed",
    recordingUrl: "https://file-examples.com/storage/fe1a57bb138b59c12/sample-audio.mp3",
    transcript: [
      { speaker: "Agent", text: "Good morning, Rolkol Reservations, Priya speaking. How may I help?", ts: "09:10 AM" },
      { speaker: "Caller", text: "Hi, I need two deluxe rooms for 3 nights starting 15th Nov.", ts: "09:10 AM" },
      { speaker: "Agent", text: "We have availability. May I know the number of adults and if breakfast is needed?", ts: "09:11 AM" },
      { speaker: "Caller", text: "4 adults, breakfast included please.", ts: "09:11 AM" },
      { speaker: "Agent", text: "Great. Rate is ₹7,200 per night per room with breakfast. Shall I proceed?", ts: "09:12 AM" },
      { speaker: "Caller", text: "Yes, name is Karthik Iyer. My number is this one.", ts: "09:12 AM" },
      { speaker: "Agent", text: "Thanks Mr. Iyer. I’ll send a payment link for the first-night deposit.", ts: "09:13 AM" },
      { speaker: "Caller", text: "Send it to karthik.iyer@example.com.", ts: "09:13 AM" },
      { speaker: "Agent", text: "Email noted. Any special request—late check-in or airport pickup?", ts: "09:14 AM" },
      { speaker: "Caller", text: "Late check-in around 11 PM.", ts: "09:14 AM" },
      { speaker: "Agent", text: "Done. You’ll receive the confirmation once payment is received.", ts: "09:15 AM" },
      { speaker: "Caller", text: "Thanks, that works.", ts: "09:15 AM" },
      { speaker: "Agent", text: "Thank you for choosing Rolkol!", ts: "09:15 AM" },
    ],
    extracted: {
      name: "Karthik Iyer",
      phone: "+91 98215 56677",
      email: "karthik.iyer@example.com",
      intent: "Room booking",
      tags: ["reservation", "payment-link", "breakfast"],
      notes: "2 rooms, 3 nights, late check-in.",
    },
  },

  // --- NEW 3: Sales demo scheduling (B2B) ---
  {
    id: "919880443322-2025-07-21-121222",
    from: "+91 98804 43322",
    to: "Sales Line",
    startedAt: "2025-07-21T12:12:22+05:30",
    durationSec: 91,
    status: "completed",
    recordingUrl: "https://file-examples.com/storage/fe1a57bb138b59c12/sample-audio.mp3",
    transcript: [
      { speaker: "Caller", text: "Hi, we’re evaluating Rolkol for our contact center.", ts: "12:12 PM" },
      { speaker: "Agent", text: "Happy to help! May I know your use case and team size?", ts: "12:12 PM" },
      { speaker: "Caller", text: "We run 15 agents, need call recording and Shopify syncing.", ts: "12:13 PM" },
      { speaker: "Agent", text: "We support both. I can schedule a 30-min demo. What time works?", ts: "12:13 PM" },
      { speaker: "Caller", text: "Tomorrow 3 PM IST.", ts: "12:14 PM" },
      { speaker: "Agent", text: "Booked. I’ll send a calendar invite to ops@vandanaretail.in.", ts: "12:14 PM" },
      { speaker: "Caller", text: "Great. Do you have a trial?", ts: "12:15 PM" },
      { speaker: "Agent", text: "Yes, 14-day trial with 1000 free minutes. We’ll enable that.", ts: "12:15 PM" },
      { speaker: "Caller", text: "Perfect, thanks.", ts: "12:16 PM" },
      { speaker: "Agent", text: "See you tomorrow!", ts: "12:16 PM" },
    ],
    extracted: {
      name: "Vandana Ops",
      email: "ops@vandanaretail.in",
      intent: "Product demo",
      tags: ["b2b", "shopify", "trial"],
      notes: "Demo set for Tue 3 PM IST. 15 agents.",
    },
  },

  // --- NEW 4: Billing dispute with resolution ---
  {
    id: "919700998877-2025-07-22-151004",
    from: "+91 97009 98877",
    to: "Billing Helpdesk",
    startedAt: "2025-07-22T15:10:04+05:30",
    durationSec: 55,
    status: "completed",
    recordingUrl: "https://file-examples.com/storage/fe1a57bb138b59c12/sample-audio.mp3",
    transcript: [
      { speaker: "Caller", text: "I was charged twice for my last invoice.", ts: "03:10 PM" },
      { speaker: "Agent", text: "Let me verify. Could you confirm invoice number?", ts: "03:10 PM" },
      { speaker: "Caller", text: "INV-78431.", ts: "03:11 PM" },
      { speaker: "Agent", text: "I see two payments within 3 minutes. One is pending-capture.", ts: "03:11 PM" },
      { speaker: "Caller", text: "So I won’t be charged twice?", ts: "03:12 PM" },
      { speaker: "Agent", text: "Correct. I will void the pending one now and email the confirmation.", ts: "03:12 PM" },
      { speaker: "Caller", text: "Thanks, please send it to finance@solis.in.", ts: "03:13 PM" },
      { speaker: "Agent", text: "Done. Anything else I can help with?", ts: "03:14 PM" },
      { speaker: "Caller", text: "No, that’s all.", ts: "03:14 PM" },
      { speaker: "Agent", text: "Have a great day!", ts: "03:14 PM" },
    ],
    extracted: {
      name: "Solis Finance",
      email: "finance@solis.in",
      intent: "Billing issue",
      tags: ["refund", "duplicate-charge", "resolved"],
      notes: "Voided pending capture against INV-78431.",
    },
  },

  // --- NEW 5: Post-stay follow-up with review ask ---
  {
    id: "919912340001-2025-07-23-110545",
    from: "+91 99123 40001",
    to: "Support Line",
    startedAt: "2025-07-23T11:05:45+05:30",
    durationSec: 35,
    status: "completed",
    recordingUrl: "https://file-examples.com/storage/fe1a57bb138b59c12/sample-audio.mp3",
    transcript: [
      { speaker: "Agent", text: "Hi, this is Nisha from Rolkol. Following up on your recent stay.", ts: "11:05 AM" },
      { speaker: "Caller", text: "Hi, overall good. AC was a bit noisy the first night.", ts: "11:06 AM" },
      { speaker: "Agent", text: "Sorry about that. We’ve logged maintenance. May I offer 15% off your next booking?", ts: "11:06 AM" },
      { speaker: "Caller", text: "Appreciated. I’ll visit again next month.", ts: "11:07 AM" },
      { speaker: "Agent", text: "Great to hear. I’ll also send a review link—your feedback helps us improve.", ts: "11:07 AM" },
      { speaker: "Caller", text: "Sure, send it over.", ts: "11:08 AM" },
      { speaker: "Agent", text: "Thank you! Have a nice day.", ts: "11:08 AM" },
    ],
    extracted: {
      name: "Arvind",
      phone: "+91 99123 40001",
      intent: "Feedback",
      tags: ["post-stay", "discount-offer"],
      notes: "Offered 15% voucher; review link sent.",
    },
  },
];

// add many more to make the list scroll (kept your generator)
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
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "missed" | "failed">("all");
  const [selectedId, setSelectedId] = useState<string | null>(CALLS[0]?.id ?? null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CALLS.filter((c) => {
      const matchesQ = !q || c.id.toLowerCase().includes(q) || c.from.toLowerCase().includes(q) || c.to.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      return matchesQ && matchesStatus;
    });
  }, [query, statusFilter]);

  const selected = filtered.find((c) => c.id === selectedId) ?? filtered[0] ?? null;

  // keep selection valid when filters change
  if (selected && !filtered.some((c) => c.id === selected.id)) {
    setSelectedId(filtered[0]?.id ?? null);
  }

  function downloadTranscript(call: CallRow) {
    const text = call.transcript.length === 0 ? "No transcript." : call.transcript.map((t) => `${t.speaker}: ${t.text}`).join("\n");
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
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)} className="calls-input calls-select">
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
                  <button key={c.id} type="button" role="listitem" className={`calls-card${active ? " is-active" : ""}`} onClick={() => setSelectedId(c.id)}>
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
                  <a href={selected.recordingUrl} target="_blank" rel="noreferrer" className="calls-link calls-link--primary">
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
                      <div key={i} className={`calls-bubble${isAgent ? " is-agent" : ""}`}>
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
                <button onClick={() => selected && downloadTranscript(selected)} className="calls-btn calls-btn--primary">
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
                    <KV label="Call Duration" value={secondsToMmSs(selected.durationSec)} />
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
                      {selected.extracted.name && <KV label="Name" value={selected.extracted.name} />}
                      {selected.extracted.phone && <KV label="Phone" value={selected.extracted.phone} />}
                      {selected.extracted.email && <KV label="Email" value={selected.extracted.email} />}
                      {selected.extracted.intent && <KV label="Intent" value={selected.extracted.intent} />}
                      {selected.extracted.tags && selected.extracted.tags.length > 0 && (
                        <div className="calls-tags">
                          {selected.extracted.tags.map((t) => (
                            <span key={t}>{t}</span>
                          ))}
                        </div>
                      )}
                      {selected.extracted.notes && <div className="calls-notes">{selected.extracted.notes}</div>}
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
