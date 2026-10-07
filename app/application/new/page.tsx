"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
export default function New() {
  const sp = useSearchParams();
  const [sv, setSv] = useState<any[]>([]),
    [service, setService] = useState(sp.get("service") || ""),
    [name, setName] = useState(""),
    [phone, setPhone] = useState(""),
    [msg, setMsg] = useState("");
  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((d) => setSv(d.services || []));
  }, []);
  async function submit(e: any) {
    e.preventDefault();
    const r = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceSlug: service,
        citizenData: { name, phone },
      }),
    });
    const d = await r.json();
    if (d.application) {
      setMsg("Created " + d.application.application_number);
      setTimeout(() => (location.href = "/dashboard"), 600);
    } else setMsg(d.error || "Please login first.");
  }
  return (
    <main className="container" style={{ paddingTop: 55, minHeight: "70vh" }}>
      <div className="card" style={{ padding: 30, maxWidth: 760 }}>
        <span className="badge">AI-assisted application</span>
        <h1>Start your application</h1>
        <form onSubmit={submit} style={{ display: "grid", gap: 14 }}>
          <label>
            Service
            <select
              className="input"
              value={service}
              onChange={(e) => setService(e.target.value)}
              required
            >
              <option value="">Select</option>
              {sv.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Full name
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            Mobile
            <input
              className="input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </label>
          <button className="btn btn-primary">Create application</button>
        </form>
        {msg && (
          <p className="badge" style={{ marginTop: 15 }}>
            {msg}
          </p>
        )}
        <p>
          <Link href="/services" style={{ color: "#155eef" }}>
            ← Back to services
          </Link>
        </p>
      </div>
    </main>
  );
}
