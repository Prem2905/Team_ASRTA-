import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      service_id,
      service_slug,
      citizen_data,
    } = body;

    if (!service_id) {
      return NextResponse.json(
        {
          error: "Service is required.",
        },
        { status: 400 }
      );
    }

    /*
     * Save/update citizen profile.
     *
     * This means information entered during an application
     * becomes available for the next application.
     */

    const profileData = {
      id: user.id,

      email: user.email,

      full_name: citizen_data.full_name || null,
      mobile: citizen_data.mobile || null,

      date_of_birth:
        citizen_data.date_of_birth || null,

      gender: citizen_data.gender || null,

      father_name:
        citizen_data.father_name || null,

      mother_name:
        citizen_data.mother_name || null,

      address:
        citizen_data.address || null,

      city:
        citizen_data.city || null,

      district:
        citizen_data.district || null,

      state:
        citizen_data.state || null,

      pincode:
        citizen_data.pincode || null,

      aadhaar_last4:
        citizen_data.aadhaar_last4 || null,

      updated_at: new Date().toISOString(),
    };

    const { error: profileError } = await supabase
      .from("profiles")
      .upsert(profileData, {
        onConflict: "id",
      });

    if (profileError) {
      return NextResponse.json(
        {
          error: profileError.message,
        },
        { status: 500 }
      );
    }


    /*
     * Create application number.
     */

    const applicationNumber =
      `DS-${Date.now()}-${crypto
        .randomUUID()
        .slice(0, 6)
        .toUpperCase()}`;


    /*
     * Create application.
     */

    const { data: application, error } =
      await supabase
        .from("applications")
        .insert({
          application_number:
            applicationNumber,

          user_id: user.id,

          service_id,

          status: "submitted",

          citizen_data,
        })
        .select()
        .single();

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 }
      );
    }


    /*
     * Add agent event.
     */

    await supabase
      .from("agent_events")
      .insert({
        application_id: application.id,

        event_type: "application_created",

        message:
          `Application submitted for ${service_slug || "government service"}.`,

        status: "completed",
      });


    return NextResponse.json({
      success: true,

      application,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}