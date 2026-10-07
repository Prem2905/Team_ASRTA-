import Link from "next/link";
import { FileCheck2, ShieldCheck, ClipboardList } from "lucide-react";

export default function Nav() {
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
          <Link className="nav-link active" href="/services">
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
        </div>
      </div>
    </nav>
  );
}
