import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TransactionsList } from "@/components/dashboard/transactions-list"
import type { Transaction } from "@/lib/types"

export default async function TransactionsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("transaction_date", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Transações</h1>
        <p className="text-slate-400 mt-1">Histórico completo das suas movimentações</p>
      </div>

      <TransactionsList transactions={(transactions as Transaction[]) || []} userId={user.id} />
    </div>
  )
}
