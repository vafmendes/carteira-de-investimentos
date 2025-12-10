import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownLeft, ArrowUpRight } from "lucide-react"
import type { Transaction } from "@/lib/types"

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    })
  }

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white">Transações Recentes</CardTitle>
        <CardDescription className="text-slate-400">Suas últimas movimentações</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-8">Nenhuma transação encontrada</p>
          ) : (
            transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      transaction.transaction_type === "credit" ? "bg-emerald-500/10" : "bg-red-500/10"
                    }`}
                  >
                    {transaction.transaction_type === "credit" ? (
                      <ArrowDownLeft className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{transaction.description}</p>
                    <p className="text-xs text-slate-500">{formatDate(transaction.transaction_date)}</p>
                  </div>
                </div>
                <span
                  className={`text-sm font-medium ${
                    transaction.transaction_type === "credit" ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {transaction.transaction_type === "credit" ? "+" : "-"}
                  {formatCurrency(Math.abs(transaction.amount))}
                </span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
