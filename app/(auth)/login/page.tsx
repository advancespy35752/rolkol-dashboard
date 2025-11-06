"use client";

import { useState } from "react";
import { Shield } from "lucide-react";
import clsx from "clsx";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (email === "anish@rolkol.com" && password === "@Rolkol123") {
      // successful login
      setError("");
      localStorage.setItem("rolkol_auth", "true");
      window.location.href = "/";
    } else {
      setError("Invalid email or password. Please try again.");
      localStorage.removeItem("rolkol_auth");
    }
  }

  return (
    <div className="w-full max-w-sm">
      {/* Card */}
      <div className="bg-white rounded-xl shadow-card border border-borderCard p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-lg bg-white border border-borderCard shadow-card flex items-center justify-center">
            <Shield className="w-5 h-5 text-accentText" />
          </div>
          <div>
            <div className="text-sm font-semibold text-textMain leading-tight">
              Rolkol Admin
            </div>
            <div className="text-[12px] text-textDim leading-tight">
              Super Admin Sign-in
            </div>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="space-y-1">
            <label htmlFor="email" className="text-[13px] font-medium text-textMain">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              className="w-full rounded-lg border border-borderCard bg-white px-3 py-2 text-[13px] text-textMain placeholder-textDim shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              placeholder="you@rolkol.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label htmlFor="password" className="text-[13px] font-medium text-textMain">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="w-full rounded-lg border border-borderCard bg-white px-3 py-2 text-[13px] text-textMain placeholder-textDim shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className={clsx(
              "w-full rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-[13px] font-medium py-2.5 transition shadow-sm"
            )}
          >
            Sign in
          </button>
        </form>

        {/* Little footer */}
        <div className="text-[11px] text-textDim text-center mt-6 leading-snug">
          This panel is restricted to Rolkol Super Admin.
          <br />
          All activity is monitored.
        </div>
      </div>

      {/* Product footer */}
      <div className="text-[11px] text-textMuted text-center mt-6">
        © {new Date().getFullYear()} Rolkol
      </div>
    </div>
  );
}
