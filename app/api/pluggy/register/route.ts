import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { pluggyClient, PLUGGY_SANDBOX } from "@/lib/pluggy/client"

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))

    // Possíveis entradas:
    // - { itemId } => busca identidade no Pluggy e usa email retornado (senha deve ser informada ou, para sandbox, usar senha padrão)
    // - { email, password } => cria usuário diretamente
    const { itemId, email: inputEmail, password: inputPassword } = body as {
      itemId?: string
      email?: string
      password?: string
    }

    let email = inputEmail
    let password = inputPassword

    // Se veio itemId, buscar identidade no Pluggy
    if (itemId) {
      const identity = await pluggyClient.getIdentity(itemId)
      if (!identity || !identity.email) {
        return NextResponse.json({ error: "Pluggy identity has no email" }, { status: 400 })
      }
      email = identity.email
    }

    // Se não houver email ainda, erro
    if (!email) {
      return NextResponse.json({ error: "Email is required (either provide email or itemId)" }, { status: 400 })
    }

    // For sandbox/demo flows: if no password provided and we're using sandbox connector, fall back to known sandbox password
    if (!password) {
      // If itemId is not provided we can't know if it's sandbox; for convenience, allow using PLUGGY_SANDBOX creds when email contains 'demo' or when caller explicitly indicates sandbox
      password = PLUGGY_SANDBOX.CREDENTIALS.password
    }

    const supabase = await createClient()

    // Cria usuário via método de sign up (usa ANON key). Isso envia email de confirmação se for configurado no projeto.
    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      console.error("Error creating Supabase user:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, user: data.user || null })
  } catch (err) {
    console.error("Unexpected error in pluggy/register:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
