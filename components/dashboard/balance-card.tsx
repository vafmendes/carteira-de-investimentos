import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Wallet } from "lucide-react"

interface BalanceCardProps {
  title: string
  value: number
  change?: number
  type?: "balance" | "income" | "expense"
  currency?: string
}

export function BalanceCard({ title, value, change, type = "balance", currency = "BRL" }: BalanceCardProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currency,
    }).format(val)
  }

  const icons = {
    balance: Wallet,
    income: TrendingUp,
    expense: TrendingDown,
  }

  const colors = {
    balance: "text-emerald-400 bg-emerald-500/10",
    income: "text-cyan-400 bg-cyan-500/10",
    expense: "text-red-400 bg-red-500/10",
  }

  const Icon = icons[type]

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-slate-400">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${colors[type]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{formatCurrency(value)}</div>
        {change !== undefined && (
          <p className={`text-xs mt-1 ${change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {change >= 0 ? "+" : ""}
            {change.toFixed(2)}% em relação ao mês anterior
          </p>
        )}
      </CardContent>
    </Card>
  )
}
