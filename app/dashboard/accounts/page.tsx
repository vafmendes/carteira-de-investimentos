import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AccountsList } from "@/components/dashboard/accounts-list"
import type { BankAccount } from "@/lib/types"

export default async function AccountsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: accounts } = await supabase
    .from("bank_accounts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Contas Bancárias</h1>
        <p className="text-slate-400 mt-1">Gerencie suas contas integradas via Pluggy</p>
      </div>

      <AccountsList accounts={(accounts as BankAccount[]) || []} userId={user.id} />
    </div>
  )
}
