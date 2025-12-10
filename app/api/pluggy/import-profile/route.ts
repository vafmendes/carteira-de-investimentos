import { NextResponse } from "next/server"
import { pluggyClient } from "@/lib/pluggy/client"
import { demoIdentity } from "@/lib/pluggy/demo-data"

type Body = { itemId?: string; email?: string; password?: string }

/**
 * POST /api/pluggy/import-profile
 * Body: { itemId?: string, email?: string }
 * - If itemId is provided, fetch identity from Pluggy
 * - If SUPABASE_SERVICE_ROLE_KEY is set in env, use it to find/create the auth user and insert into profiles
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as Body

    let identity = undefined
    if (body.itemId) {
      identity = await pluggyClient.getIdentity(body.itemId)
    } else {
      // Fallback to demo identity
      identity = demoIdentity
    }

    if (!identity || !identity.email) {
      return NextResponse.json({ error: "No identity/email found from Pluggy" }, { status: 400 })
    }

    const email = body.email ?? identity.email

    // Create auth user via signUp (anon). This will create the auth user if not exists.
    // We attempt signUp so we can get a user id when possible.
    // Note: creating profile row in DB requires admin (service role) privileges because of RLS.

    // Try to sign up the user using the public/anon key via the built-in endpoint.
    // We reuse the existing public signup flow by calling the client-side auth endpoint.
    // This server route focuses on the admin insertion into profiles using the service role key.

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl) {
      return NextResponse.json({ error: "Missing NEXT_PUBLIC_SUPABASE_URL in environment" }, { status: 500 })
    }

    if (!serviceKey) {
      return NextResponse.json(
        {
          error:
            "SUPABASE_SERVICE_ROLE_KEY is required to insert into profiles from the server. Add it to your .env and restart the app.",
          pluggyEmail: email,
          pluggyIdentity: identity,
        },
        { status: 400 },
      )
    }

    // 1) Ensure there is an auth user and get their id. If user already exists, query admin endpoint to get the id.
    // Try to create user via auth signup endpoint (this may return an error if user exists).
    const signUpResp = await fetch(`${supabaseUrl}/auth/v1/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: serviceKey },
      body: JSON.stringify({ email }),
    })

    let userId: string | null = null

    if (signUpResp.ok) {
      const signupData = await signUpResp.json()
      userId = signupData?.user?.id || null
    }

    // If signup didn't return a user id (user may already exist), fetch by email using admin endpoint
    if (!userId) {
      const adminUsersResp = await fetch(`${supabaseUrl}/auth/v1/admin/users?email=${encodeURIComponent(email)}`, {
        headers: { Authorization: `Bearer ${serviceKey}`, apikey: serviceKey },
      })

      if (!adminUsersResp.ok) {
        const text = await adminUsersResp.text().catch(() => "")
        return NextResponse.json({ error: `Failed to lookup user by email: ${text}` }, { status: 500 })
      }

      const users = await adminUsersResp.json()
      const found = Array.isArray(users) ? users[0] : users?.users?.[0]
      userId = found?.id ?? null
    }

    if (!userId) {
      return NextResponse.json({ error: "Could not create or find auth user id for the provided email" }, { status: 500 })
    }

    // 2) Insert into profiles via PostgREST using service role key (bypasses RLS)
    const profile = {
      id: userId,
      full_name: identity.fullName ?? null,
      email: identity.email ?? email,
      document: (identity as any).cpf ?? null,
      birth_date: identity.birthDate ?? null,
    }

    const insertResp = await fetch(`${supabaseUrl}/rest/v1/profiles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify(profile),
    })

    if (!insertResp.ok) {
      const text = await insertResp.text().catch(() => "")
      return NextResponse.json({ error: `Failed to insert profile: ${text}` }, { status: 500 })
    }

    const inserted = await insertResp.json()

    return NextResponse.json({ success: true, profile: inserted })
  } catch (err) {
    console.error("Error in import-profile:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
