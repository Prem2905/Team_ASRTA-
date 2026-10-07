import Link from "next/link";
import { createClient } from "@/lib/supabase-server";

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = await createClient();

  const { data: service } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!service) {
    return (
      <main className="container page-shell">
        <h1>Service not available</h1>
        <p>This service is currently unavailable.</p>
      </main>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const applicationUrl = user
    ? `/application/new?service=${service.slug}`
    : `/login?redirect=/application/new?service=${encodeURIComponent(
        service.slug,
      )}`;

  return (
    <main className="container page-shell">
      <div className="page-heading">
        <span className="eyebrow">
          {service.category || "GOVERNMENT SERVICE"}
        </span>

        <h1>{service.name}</h1>

        <p>{service.description}</p>
      </div>

      <div className="service-detail-card">
        <h2>Start your application</h2>

        <p>Your saved citizen details will automatically appear in the form.</p>

        <Link href={applicationUrl} className="primary-btn">
          {user ? "Start application" : "Login to apply"}
        </Link>
      </div>
    </main>
  );
}
