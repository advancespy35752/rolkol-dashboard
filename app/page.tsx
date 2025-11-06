export default function DashboardPage() {
  const KPIS = [
    { label: "Total Calls (24h)", value: "128" },
    { label: "Avg Duration", value: "2m 14s" },
    { label: "Connected Numbers", value: "3" },
  ];

  return (
    <div className="space-y-8">
      {/* Title block */}
      <div>
        <h1 className="text-2xl font-semibold text-textMain tracking-tight">
          Overview
        </h1>
        <p className="text-sm text-textDim">Quick stats across your assistant.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {KPIS.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white rounded-xl p-5 shadow-sm border border-borderCard hover:shadow-md transition"
          >
            <div className="text-sm text-textDim mb-1">{kpi.label}</div>
            <div className="text-3xl font-semibold text-textMain">{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-borderCard hover:shadow-md transition">
        <div className="text-base font-medium text-textMain mb-2">Recent activity</div>
        <div className="text-sm text-textDim">(We'll show last 5 calls here soon.)</div>
      </div>
    </div>
  );
}
