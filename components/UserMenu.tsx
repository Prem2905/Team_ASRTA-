"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

type Props = {
  email: string;
};

export default function UserMenu({ email }: Props) {
  const router = useRouter();

  async function logout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    router.push("/");
    router.refresh();
  }

  return (
    <div className="user-menu">
      <Link href="/profile" className="user-profile-link">
        <span className="user-avatar">{email.charAt(0).toUpperCase()}</span>

        <span className="user-email">{email}</span>
      </Link>

      <Link href="/dashboard" className="nav-login">
        My applications
      </Link>

      <button type="button" onClick={logout} className="logout-btn">
        Logout
      </button>
    </div>
  );
}
