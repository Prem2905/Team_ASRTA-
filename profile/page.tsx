import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase-server";
import ProfileForm from "@/components/ProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/profile");
  }

  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

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
        <h1>Unable to load profile</h1>
      </main>
    );
  }

  return (
    <main className="container page-shell">
      <div className="page-heading">
        <span className="eyebrow">CITIZEN PROFILE</span>

        <h1>Your details, saved once.</h1>

        <p>
          Dastavez Saarthi uses these details to automatically fill future
          government service applications.
        </p>
      </div>

      <div className="profile-card">
        <ProfileForm profile={profile} />
      </div>
    </main>
  );
}
