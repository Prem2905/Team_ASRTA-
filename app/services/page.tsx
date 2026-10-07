"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
export default function Services() {
  const [q, setQ] = useState(""),
    [s, setS] = useState<any[]>([]);
  useEffect(() => {
    const t = setTimeout(
      () =>
        fetch("/api/services?q=" + encodeURIComponent(q))
          .then((r) => r.json())
          .then((d) => setS(d.services || [])),
      250,
    );
    return () => clearTimeout(t);
  }, [q]);
  return (
    <main className="container" style={{ paddingTop: 55, minHeight: "70vh" }}>
      <span className="badge">Services & schemes</span>
      <h1 style={{ fontSize: 46 }}>Find the service you need</h1>
      <p style={{ color: "#60708a" }}>
        Search the live Supabase catalogue. The assistant never invents an
        unavailable service.
      </p>
      <div style={{ maxWidth: 650, margin: "25px 0", position: "relative" }}>
        <Search style={{ position: "absolute", left: 14, top: 13 }} />
        <input
          className="input"
          style={{ paddingLeft: 43 }}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Income certificate, pension, scholarship..."
        />
      </div>
      {s.length === 0 ? (
        <div className="card" style={{ padding: 25 }}>
          Service not available in the current catalogue. Try another search or
          ask the AI assistant.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: 18,
          }}
        >
          {s.map((x) => (
            <div className="card" style={{ padding: 24 }} key={x.id}>
              <span className="badge">{x.category}</span>
              <h2>{x.name}</h2>
              <p style={{ color: "#60708a" }}>{x.description}</p>
              <Link className="btn btn-primary" href={"/services/" + x.slug}>
                View details <ArrowRight size={10} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
