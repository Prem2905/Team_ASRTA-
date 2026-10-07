"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

type Profile = {
  id: string;
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
  profile: Profile;
};

export default function ProfileForm({ profile }: Props) {
  const router = useRouter();

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

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function update(field: keyof typeof form, value: string) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function saveProfile(e: FormEvent) {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    const supabase = createClient();

    const { error } = await supabase
      .from("profiles")
      .update(form)
      .eq("id", profile.id);

    if (error) {
      setMessage(error.message);
      setSaving(false);
      return;
    }

    setMessage("Your details have been saved.");

    setSaving(false);

    router.refresh();
  }

  return (
    <form onSubmit={saveProfile} className="profile-form">
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
          Mobile number
          <input
            value={form.mobile}
            onChange={(e) => update("mobile", e.target.value)}
            placeholder="10 digit mobile number"
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

        <label className="profile-full">
          Address
          <textarea
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
            rows={3}
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
            placeholder="XXXX"
          />
        </label>
      </div>

      <div className="profile-actions">
        <button className="primary-btn" disabled={saving}>
          {saving ? "Saving..." : "Save my details"}
        </button>

        {message && <span className="profile-message">{message}</span>}
      </div>
    </form>
  );
}
