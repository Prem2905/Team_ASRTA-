import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  Mic,
  ShieldCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase-server";
import Assistant from "@/components/Assistant";

export default async function Home() {
  const supabase = await createClient();

  const { data: services } = await supabase
    .from("services")
    .select("id,name,slug,description,category,requirements")
    .eq("is_active", true)
    .order("created_at", { ascending: true })
    .limit(6);

  const schemeCards = services?.length
    ? services
    : [
        {
          id: "birth",
          name: "Birth Certificate",
          slug: "birth-certificate",
          description:
            "Official record of a child's birth, needed for school, passport and Aadhaar.",
          category: "जन्म प्रमाण पत्र",
          requirements: ["ID proof", "Birth record", "Address proof"],
        },
        {
          id: "caste",
          name: "Caste Certificate",
          slug: "caste-certificate",
          description:
            "Certifies SC / ST / OBC status for reservations and scholarships.",
          category: "जाति प्रमाण पत्र",
          requirements: [
            "ID proof",
            "Address proof",
            "Supporting document",
            "Application",
          ],
        },
        {
          id: "income",
          name: "Income Certificate",
          slug: "income-certificate",
          description:
            "States annual family income for subsidies, fee waivers and welfare schemes.",
          category: "आय प्रमाण पत्र",
          requirements: ["ID proof", "Address proof", "Income proof"],
        },
        {
          id: "pension",
          name: "Atal Pension Yojana",
          slug: "pension",
          description:
            "Government-backed pension planning support for eligible citizens.",
          category: "अटल पेंशन योजना",
          requirements: ["ID proof", "Bank details", "Age proof"],
        },
        {
          id: "scholarship",
          name: "E-Kalyan Scholarship",
          slug: "scholarship",
          description:
            "Scholarship assistance for eligible students and families.",
          category: "ई-कल्याण छात्रवृत्ति",
          requirements: [
            "ID proof",
            "Student ID",
            "Income proof",
            "Academic record",
          ],
        },
      ];

  return (
    <main>
      {/* HERO */}
      <section className="saathi-hero">
        <div className="hero-wash" />

        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="portal-pill">
              <ShieldCheck size={15} />
              Civic Tech • Citizen Service Portal
            </span>

            <h1>
              Your sarkari kaam,
              <br />
              <em>done end to end.</em>
            </h1>

            <p>
              Tell Saarthi what you need in your own language. It explains the
              process, lists the documents, helps fill the form and keeps your
              application on track.
            </p>

            <div className="hero-actions">
              <Link className="hero-btn" href="/agent">
                Talk to Saarthi
                <ArrowRight size={18} />
              </Link>

              <Link className="hero-secondary" href="/services">
                Browse services
              </Link>
            </div>

            <div className="hero-trust">
              <CheckCircle2 size={16} />
              Guided by AI • Human verification • Transparent tracking
            </div>
          </div>

          {/* ASHOKA CHAKRA STYLE VISUAL */}
          <div className="chakra-art" aria-hidden="true">
            <div className="paint paint-orange" />
            <div className="paint paint-green" />

            <div className="chakra">
              <div className="chakra-center" />

              {Array.from({ length: 24 }).map((_, i) => (
                <i
                  key={i}
                  style={{
                    transform: `rotate(${i * 15}deg) translateY(-4px)`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SCHEME INTRO */}
      <section className="container saathi-intro">
        <div>
          <span className="section-kicker">
            SAARTHI WILL GUIDE YOU STEP BY STEP
          </span>

          <h2>Popular schemes & certificates</h2>

          <p>
            Start with a service below. Saarthi can explain eligibility,
            documents and the application process before you submit anything.
          </p>
        </div>

        <Link href="/services" className="view-all">
          View all services
          <ArrowRight size={16} />
        </Link>
      </section>

      {/* SCHEME CARDS */}
      <section className="container scheme-grid">
        {schemeCards.map((service: any) => (
          <Link
            href={`/services/${service.slug}`}
            className="scheme-card"
            key={service.id}
          >
            <span className="scheme-hi">{service.category}</span>

            <h3>{service.name}</h3>

            <p>{service.description}</p>

            <div className="scheme-meta">
              <span>
                <FileText size={14} />
                {Array.isArray(service.requirements)
                  ? service.requirements.length
                  : 0}{" "}
                documents
              </span>

              <span>
                <Clock3 size={14} />
                Guided process
              </span>

              <ArrowRight className="scheme-arrow" size={19} />
            </div>
          </Link>
        ))}
      </section>

      {/* PROCESS */}
      <section className="container process-section" id="trust">
        <div className="process-copy">
          <span className="section-kicker">ONE SIMPLE JOURNEY</span>

          <h2>From “I need this” to “It’s done.”</h2>

          <p>
            Saarthi turns complicated government processes into a guided journey
            while keeping verification and important actions transparent.
          </p>
        </div>

        <div className="process-steps">
          {[
            [
              Mic,
              "1",
              "Tell Saarthi",
              "Ask in text or voice in your preferred language.",
            ],
            [
              FileText,
              "2",
              "Prepare",
              "Get the exact document checklist and fill your details.",
            ],
            [
              ShieldCheck,
              "3",
              "Verify",
              "Upload documents and follow the verification status.",
            ],
            [
              CheckCircle2,
              "4",
              "Receive",
              "An authorised admin can issue the certificate.",
            ],
          ].map(([Icon, number, title, description]: any) => (
            <div className="process-step" key={number}>
              <div className="step-icon">
                <Icon size={20} />
              </div>

              <span className="step-no">{number}</span>

              <h3>{title}</h3>

              <p>{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FLOATING AI ASSISTANT */}
      <Assistant />
    </main>
  );
}
