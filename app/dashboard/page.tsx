"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
export default function Dashboard() {
  const [a, setA] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/applications")
      .then((r) => r.json())
      .then((d) => setA(d.applications || []));
  }, []);
  return (
    <main className="container" style={{ paddingTop: 55, minHeight: "70vh" }}>
      <h1>My Applications</h1>
      <p style={{ color: "#60708a" }}>
        Track verification and certificate issue.
      </p>
      {a.length === 0 ? (
        <div className="card" style={{ padding: 25 }}>
          No applications.{" "}
          <Link href="/services" style={{ color: "#155eef" }}>
            Find a service
          </Link>
        </div>
      ) : (
        a.map((x) => (
          <Link
            key={x.id}
            href={"/dashboard/application/" + x.id}
            className="card"
            style={{
              padding: 22,
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <div>
              <b>{x.application_number}</b>
              <h3>{x.services?.name}</h3>
            </div>
            <span className="badge">{x.status}</span>
          </Link>
        ))
      )}
    </main>
  );
}
