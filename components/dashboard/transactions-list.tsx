"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowDownLeft, ArrowUpRight, Plus, Search } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Transaction } from "@/lib/types"
import { useRouter } from "next/navigation"

interface TransactionsListProps {
  transactions: Transaction[]
  userId: string
}

export function TransactionsList({ transactions, userId }: TransactionsListProps) {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "credit" | "debit">("all")
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const [newTransaction, setNewTransaction] = useState({
    description: "",
    amount: "",
    transaction_type: "debit" as "credit" | "debit",
    category: "",
    transaction_date: new Date().toISOString().split("T")[0],
  })

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === "all" || t.transaction_type === filter
    return matchesSearch && matchesFilter
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()
    const { error } = await supabase.from("transactions").insert({
      user_id: userId,
      description: newTransaction.description,
      amount: Number.parseFloat(newTransaction.amount),
      transaction_type: newTransaction.transaction_type,
      category: newTransaction.category || null,
      transaction_date: newTransaction.transaction_date,
    })

    if (!error) {
      setIsOpen(false)
      setNewTransaction({
        description: "",
        amount: "",
        transaction_type: "debit",
        category: "",
        transaction_date: new Date().toISOString().split("T")[0],
      })
      router.refresh()
    }

    setIsLoading(false)
  }

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <CardTitle className="text-white">Todas as Transações</CardTitle>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-500 hover:bg-emerald-600">
                <Plus className="h-4 w-4 mr-2" />
                Nova Transação
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800">
              <DialogHeader>
                <DialogTitle className="text-white">Adicionar Transação</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-2">
                  <Label className="text-slate-300">Descrição</Label>
                  <Input
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction((p) => ({ ...p, description: e.target.value }))}
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-slate-300">Valor</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newTransaction.amount}
                      onChange={(e) => setNewTransaction((p) => ({ ...p, amount: e.target.value }))}
                      className="bg-slate-800 border-slate-700 text-white"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-slate-300">Tipo</Label>
                    <Select
                      value={newTransaction.transaction_type}
                      onValueChange={(v: "credit" | "debit") =>
                        setNewTransaction((p) => ({ ...p, transaction_type: v }))
                      }
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="credit">Receita</SelectItem>
                        <SelectItem value="debit">Despesa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-slate-300">Categoria</Label>
                    <Input
                      value={newTransaction.category}
                      onChange={(e) => setNewTransaction((p) => ({ ...p, category: e.target.value }))}
                      className="bg-slate-800 border-slate-700 text-white"
                      placeholder="Ex: Alimentação"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-slate-300">Data</Label>
                    <Input
                      type="date"
                      value={newTransaction.transaction_date}
                      onChange={(e) => setNewTransaction((p) => ({ ...p, transaction_date: e.target.value }))}
                      className="bg-slate-800 border-slate-700 text-white"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600" disabled={isLoading}>
                  {isLoading ? "Salvando..." : "Salvar Transação"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Buscar transações..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>
          <Select value={filter} onValueChange={(v: "all" | "credit" | "debit") => setFilter(v)}>
            <SelectTrigger className="w-full sm:w-40 bg-slate-800 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="credit">Receitas</SelectItem>
              <SelectItem value="debit">Despesas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <p className="text-slate-500 text-center py-12">Nenhuma transação encontrada</p>
          ) : (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-lg ${
                      transaction.transaction_type === "credit" ? "bg-emerald-500/10" : "bg-red-500/10"
                    }`}
                  >
                    {transaction.transaction_type === "credit" ? (
                      <ArrowDownLeft className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-white">{transaction.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500">{formatDate(transaction.transaction_date)}</span>
                      {transaction.category && (
                        <>
                          <span className="text-slate-600">•</span>
                          <span className="text-xs text-slate-400">{transaction.category}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <span
                  className={`text-lg font-semibold ${
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
