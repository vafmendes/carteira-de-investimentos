import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { pluggyClient } from "@/lib/pluggy/client"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const itemId = body.itemId

    // Cria um Connect Token para o widget Pluggy
    const connectToken = await pluggyClient.createConnectToken(itemId)

    return NextResponse.json({ accessToken: connectToken })
  } catch (error) {
    console.error("Error creating connect token:", error)
    return NextResponse.json({ error: "Failed to create connect token" }, { status: 500 })
  }
}
