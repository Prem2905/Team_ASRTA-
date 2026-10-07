import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase-server";

import ApplicationForm from "@/components/ApplicationForm";

type Props = {
  searchParams: Promise<{
    service?: string;
  }>;
};

export default async function NewApplicationPage({ searchParams }: Props) {
  const params = await searchParams;

  const serviceSlug = params.service;

  if (!serviceSlug) {
    redirect("/services");
  }

  const supabase = await createClient();

  /*
   * Require login.
   */

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/login?redirect=/application/new?service=${encodeURIComponent(
        serviceSlug,
      )}`,
    );
  }

  /*
   * Get service.
   */

  const { data: service } = await supabase
    .from("services")
    .select("id,name,slug,description,category")
    .eq("slug", serviceSlug)
    .eq("is_active", true)
    .single();

  if (!service) {
    return (
      <main className="container page-shell">
        <h1>Service not available</h1>

        <p>This government service is currently unavailable.</p>
      </main>
    );
  }

  /*
   * Get saved citizen profile.
   */

  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  /*
   * Create profile if it doesn't exist.
   */

  if (!profile) {
    const { data: newProfile } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || "",
      })
      .select()
      .single();

    profile = newProfile;
  }

  if (!profile) {
    return (
      <main className="container page-shell">
        <h1>Profile could not be loaded</h1>
      </main>
    );
  }

  return (
    <main className="container page-shell">
      <div className="page-heading">
        <span className="eyebrow">APPLICATION</span>

        <h1>{service.name}</h1>

        <p>
          We already know some of your details. Review them and fill only what
          is missing.
        </p>
      </div>

      <div className="application-card">
        <ApplicationForm service={service} profile={profile} />
      </div>
    </main>
  );
}
