import Link from "next/link";
import { FileCheck2, ShieldCheck, ClipboardList } from "lucide-react";

import { createClient } from "@/lib/supabase-server";
import UserMenu from "./UserMenu";

export default async function Nav() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="site-nav">
      <div className="container nav-inner">
        <Link href="/" className="brand">
          <span className="brand-mark">
            <ShieldCheck size={20} />
          </span>

          <span>
            Dastavez <b>Saarthi</b>
          </span>
        </Link>

        <div className="nav-links">
          <Link className="nav-link" href="/services">
            Services
          </Link>

          <Link className="nav-link" href="/dashboard">
            <ClipboardList size={16} />
            My applications
          </Link>

          <Link className="nav-link" href="/#trust">
            <FileCheck2 size={16} />
            Audit & trust
          </Link>

          {user ? (
            <UserMenu email={user.email || "Citizen"} />
          ) : (
            <Link href="/login" className="nav-login">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
