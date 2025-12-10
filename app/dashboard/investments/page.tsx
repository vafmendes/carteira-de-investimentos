import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { InvestmentsList } from "@/components/dashboard/investments-list"
import type { Investment } from "@/lib/types"

export default async function InvestmentsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: investments } = await supabase
    .from("investments")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Investimentos</h1>
        <p className="text-slate-400 mt-1">Acompanhe a rentabilidade dos seus investimentos</p>
      </div>

      <InvestmentsList investments={(investments as Investment[]) || []} userId={user.id} />
    </div>
  )
}
