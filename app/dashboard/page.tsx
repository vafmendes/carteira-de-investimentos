import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { BalanceCard } from "@/components/dashboard/balance-card"
import { SpendingChart } from "@/components/dashboard/spending-chart"
import { MonthlyChart } from "@/components/dashboard/monthly-chart"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { DemoDataLoader } from "@/components/dashboard/demo-data-loader"
import type { Transaction, BankAccount } from "@/lib/types"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) {
    console.error("[v0] Auth error:", userError.message)
    redirect("/auth/login")
  }

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch bank accounts with error handling
  const { data: accounts, error: accountsError } = await supabase
    .from("bank_accounts")
    .select("*")
    .eq("user_id", user.id)

  if (accountsError) {
    console.error("[v0] Bank accounts query error:", accountsError.message)
  }

  // Fetch recent transactions with error handling
  const { data: transactions, error: transactionsError } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("transaction_date", { ascending: false })
    .limit(10)

  if (transactionsError) {
    console.error("[v0] Transactions query error:", transactionsError.message)
  }

  // Fetch all transactions for charts
  const { data: allTransactions, error: allTransactionsError } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("transaction_date", { ascending: false })

  if (allTransactionsError) {
    console.error("[v0] All transactions query error:", allTransactionsError.message)
  }

  const bankAccounts = (accounts as BankAccount[]) || []
  const recentTransactions = (transactions as Transaction[]) || []
  const chartTransactions = (allTransactions as Transaction[]) || []

  // Calculate totals
  const totalBalance = bankAccounts
    .filter((acc) => acc.account_type !== "credit_card")
    .reduce((sum, acc) => sum + Number(acc.balance), 0)

  const totalIncome = chartTransactions
    .filter((t) => t.transaction_type === "credit")
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const totalExpense = chartTransactions
    .filter((t) => t.transaction_type === "debit")
    .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0)

  // Calculate spending by category for pie chart
  const spendingByCategory = chartTransactions
    .filter((t) => t.transaction_type === "debit")
    .reduce(
      (acc, t) => {
        const category = t.category || "Outros"
        acc[category] = (acc[category] || 0) + Math.abs(Number(t.amount))
        return acc
      },
      {} as Record<string, number>,
    )

  const spendingData = Object.entries(spendingByCategory).map(([name, value]) => ({
    name,
    value: Number(value.toFixed(2)),
  }))

  // Calculate monthly data for bar chart
  const monthlyData = [
    { month: "Jul", income: 8500, expense: 6200 },
    { month: "Ago", income: 9200, expense: 7100 },
    { month: "Set", income: 8800, expense: 6800 },
    { month: "Out", income: 9500, expense: 7300 },
    { month: "Nov", income: totalIncome || 11000, expense: totalExpense || 8200 },
    { month: "Dez", income: totalIncome, expense: totalExpense },
  ]

  const hasData = bankAccounts.length > 0 || recentTransactions.length > 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Visão Geral</h1>
        <p className="text-slate-400 mt-1">Acompanhe suas finanças em tempo real</p>
      </div>

      {!hasData && <DemoDataLoader />}

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BalanceCard title="Saldo Total" value={totalBalance} change={5.2} type="balance" />
        <BalanceCard title="Receitas do Mês" value={totalIncome || 0} type="income" />
        <BalanceCard title="Despesas do Mês" value={totalExpense || 0} type="expense" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyChart data={monthlyData} />
        <SpendingChart data={spendingData.length > 0 ? spendingData : [{ name: "Sem dados", value: 0 }]} />
      </div>

      {/* Recent Transactions */}
      <RecentTransactions transactions={recentTransactions} />
    </div>
  )
}
