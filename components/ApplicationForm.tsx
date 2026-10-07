"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Service = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  category?: string | null;
};

type Profile = {
  full_name?: string | null;
  email?: string | null;
  mobile?: string | null;
  date_of_birth?: string | null;
  gender?: string | null;
  father_name?: string | null;
  mother_name?: string | null;
  address?: string | null;
  city?: string | null;
  district?: string | null;
  state?: string | null;
  pincode?: string | null;
  aadhaar_last4?: string | null;
};

type Props = {
  service: Service;
  profile: Profile;
};

export default function ApplicationForm({ service, profile }: Props) {
  const router = useRouter();

  /*
   * IMPORTANT:
   * Initial values come from the saved profile.
   */

  const [form, setForm] = useState({
    full_name: profile.full_name || "",
    email: profile.email || "",
    mobile: profile.mobile || "",

    date_of_birth: profile.date_of_birth || "",

    gender: profile.gender || "",

    father_name: profile.father_name || "",

    mother_name: profile.mother_name || "",

    address: profile.address || "",

    city: profile.city || "",

    district: profile.district || "",

    state: profile.state || "",

    pincode: profile.pincode || "",

    aadhaar_last4: profile.aadhaar_last4 || "",
  });

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  function update(field: keyof typeof form, value: string) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function submitApplication(e: FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const response = await fetch("/api/applications", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        service_id: service.id,

        service_slug: service.slug,

        citizen_data: form,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      setMessage(result.error || "Unable to submit application.");

      setLoading(false);

      return;
    }

    setMessage(
      `Application submitted successfully. Application number: ${result.application.application_number}`,
    );

    setLoading(false);

    setTimeout(() => {
      router.push("/dashboard");
      router.refresh();
    }, 1500);
  }

  return (
    <form onSubmit={submitApplication} className="application-form">
      <div className="auto-fill-notice">
        ✓ Your saved profile information has been automatically filled.
      </div>

      <div className="application-section">
        <h2>Personal information</h2>

        <div className="profile-grid">
          <label>
            Full name
            <input
              value={form.full_name}
              onChange={(e) => update("full_name", e.target.value)}
              required
            />
          </label>

          <label>
            Email
            <input value={form.email} disabled />
          </label>

          <label>
            Mobile
            <input
              value={form.mobile}
              onChange={(e) => update("mobile", e.target.value)}
              required
            />
          </label>

          <label>
            Date of birth
            <input
              type="date"
              value={form.date_of_birth}
              onChange={(e) => update("date_of_birth", e.target.value)}
            />
          </label>

          <label>
            Gender
            <select
              value={form.gender}
              onChange={(e) => update("gender", e.target.value)}
            >
              <option value="">Select</option>

              <option value="Male">Male</option>

              <option value="Female">Female</option>

              <option value="Other">Other</option>
            </select>
          </label>

          <label>
            Father's name
            <input
              value={form.father_name}
              onChange={(e) => update("father_name", e.target.value)}
            />
          </label>

          <label>
            Mother's name
            <input
              value={form.mother_name}
              onChange={(e) => update("mother_name", e.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="application-section">
        <h2>Address</h2>

        <div className="profile-grid">
          <label className="profile-full">
            Address
            <textarea
              rows={3}
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
            />
          </label>

          <label>
            City
            <input
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
            />
          </label>

          <label>
            District
            <input
              value={form.district}
              onChange={(e) => update("district", e.target.value)}
            />
          </label>

          <label>
            State
            <input
              value={form.state}
              onChange={(e) => update("state", e.target.value)}
            />
          </label>

          <label>
            Pincode
            <input
              value={form.pincode}
              onChange={(e) => update("pincode", e.target.value)}
            />
          </label>

          <label>
            Aadhaar last 4 digits
            <input
              maxLength={4}
              value={form.aadhaar_last4}
              onChange={(e) =>
                update("aadhaar_last4", e.target.value.replace(/\D/g, ""))
              }
            />
          </label>
        </div>
      </div>

      <div className="application-submit">
        <button className="primary-btn" disabled={loading}>
          {loading ? "Submitting..." : `Submit ${service.name} application`}
        </button>

        {message && <p className="application-message">{message}</p>}
      </div>
    </form>
  );
}
