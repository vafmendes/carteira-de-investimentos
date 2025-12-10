"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { TrendingUp, TrendingDown, Plus, PiggyBank, Plug, Landmark, BarChart3, Coins } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Investment } from "@/lib/types"
import { useRouter } from "next/navigation"

interface InvestmentsListProps {
  investments: Investment[]
  userId: string
}

const investmentTypes = [
  { value: "FIXED_INCOME", label: "Renda Fixa", icon: Landmark },
  { value: "MUTUAL_FUND", label: "Fundos", icon: BarChart3 },
  { value: "EQUITY", label: "Ações", icon: TrendingUp },
  { value: "ETF", label: "ETF", icon: Coins },
  { value: "Tesouro Direto", label: "Tesouro Direto", icon: Landmark },
  { value: "CDB", label: "CDB", icon: Landmark },
  { value: "LCI/LCA", label: "LCI/LCA", icon: Landmark },
  { value: "Ações", label: "Ações", icon: TrendingUp },
  { value: "Fundos Imobiliários", label: "FIIs", icon: BarChart3 },
  { value: "Criptomoedas", label: "Cripto", icon: Coins },
  { value: "Poupança", label: "Poupança", icon: PiggyBank },
  { value: "Outros", label: "Outros", icon: PiggyBank },
]

export function InvestmentsList({ investments, userId }: InvestmentsListProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const [newInvestment, setNewInvestment] = useState({
    name: "",
    type: "",
    institution: "",
    initial_value: "",
    current_value: "",
    due_date: "",
  })

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val)
  }

  const totalInvested = investments.reduce((sum, inv) => sum + Number(inv.current_value), 0)
  const totalProfit = investments.reduce((sum, inv) => sum + Number(inv.profit_loss), 0)
  const avgProfitPercentage =
    investments.length > 0
      ? investments.reduce((sum, inv) => sum + Number(inv.profit_loss_percentage), 0) / investments.length
      : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const initialValue = Number.parseFloat(newInvestment.initial_value)
    const currentValue = Number.parseFloat(newInvestment.current_value)
    const profitLoss = currentValue - initialValue
    const profitLossPercentage = initialValue > 0 ? ((currentValue - initialValue) / initialValue) * 100 : 0

    const supabase = createClient()
    const { error } = await supabase.from("investments").insert({
      user_id: userId,
      name: newInvestment.name,
      type: newInvestment.type,
      institution: newInvestment.institution || null,
      initial_value: initialValue,
      current_value: currentValue,
      balance: currentValue,
      profit_loss: profitLoss,
      profit_loss_percentage: profitLossPercentage,
      due_date: newInvestment.due_date || null,
    })

    if (!error) {
      setIsOpen(false)
      setNewInvestment({
        name: "",
        type: "",
        institution: "",
        initial_value: "",
        current_value: "",
        due_date: "",
      })
      router.refresh()
    }

    setIsLoading(false)
  }

  const getInvestmentIcon = (type: string) => {
    const found = investmentTypes.find((t) => t.value === type || t.label === type)
    return found?.icon || PiggyBank
  }

  const getTypeLabel = (type: string) => {
    const found = investmentTypes.find((t) => t.value === type)
    return found?.label || type
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Investido</p>
                <p className="text-2xl font-bold text-white mt-1">{formatCurrency(totalInvested)}</p>
              </div>
              <div className="p-3 rounded-lg bg-cyan-500/10">
                <PiggyBank className="h-6 w-6 text-cyan-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Rendimento Total</p>
                <p className={`text-2xl font-bold mt-1 ${totalProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {totalProfit >= 0 ? "+" : ""}
                  {formatCurrency(totalProfit)}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${totalProfit >= 0 ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
                {totalProfit >= 0 ? (
                  <TrendingUp className="h-6 w-6 text-emerald-400" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-red-400" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Rentabilidade Média</p>
                <p
                  className={`text-2xl font-bold mt-1 ${avgProfitPercentage >= 0 ? "text-emerald-400" : "text-red-400"}`}
                >
                  {avgProfitPercentage >= 0 ? "+" : ""}
                  {avgProfitPercentage.toFixed(2)}%
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/10">
                <BarChart3 className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Investments List */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <CardTitle className="text-white">Meus Investimentos</CardTitle>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-500 hover:bg-emerald-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Investimento
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-800">
                <DialogHeader>
                  <DialogTitle className="text-white">Adicionar Investimento</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-2">
                    <Label className="text-slate-300">Nome</Label>
                    <Input
                      value={newInvestment.name}
                      onChange={(e) => setNewInvestment((p) => ({ ...p, name: e.target.value }))}
                      className="bg-slate-800 border-slate-700 text-white"
                      placeholder="Ex: Tesouro Selic 2029"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label className="text-slate-300">Tipo</Label>
                      <Select
                        value={newInvestment.type}
                        onValueChange={(v) => setNewInvestment((p) => ({ ...p, type: v }))}
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {investmentTypes.slice(0, 8).map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-slate-300">Instituição</Label>
                      <Input
                        value={newInvestment.institution}
                        onChange={(e) => setNewInvestment((p) => ({ ...p, institution: e.target.value }))}
                        className="bg-slate-800 border-slate-700 text-white"
                        placeholder="Ex: Nu Invest"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label className="text-slate-300">Valor Inicial</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={newInvestment.initial_value}
                        onChange={(e) => setNewInvestment((p) => ({ ...p, initial_value: e.target.value }))}
                        className="bg-slate-800 border-slate-700 text-white"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-slate-300">Valor Atual</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={newInvestment.current_value}
                        onChange={(e) => setNewInvestment((p) => ({ ...p, current_value: e.target.value }))}
                        className="bg-slate-800 border-slate-700 text-white"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-slate-300">Data de Vencimento</Label>
                    <Input
                      type="date"
                      value={newInvestment.due_date}
                      onChange={(e) => setNewInvestment((p) => ({ ...p, due_date: e.target.value }))}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600" disabled={isLoading}>
                    {isLoading ? "Salvando..." : "Salvar Investimento"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {investments.length === 0 ? (
              <div className="text-center py-12">
                <PiggyBank className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500">Nenhum investimento cadastrado</p>
                <p className="text-slate-600 text-sm mt-1">
                  Adicione seu primeiro investimento ou carregue dados de demonstração
                </p>
              </div>
            ) : (
              investments.map((investment) => {
                const Icon = getInvestmentIcon(investment.type)
                const isPluggyInvestment = !!investment.pluggy_investment_id
                const isPositive = investment.profit_loss >= 0

                return (
                  <div
                    key={investment.id}
                    className="p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-cyan-500/10">
                          <Icon className="h-5 w-5 text-cyan-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-white">{investment.name}</p>
                            {isPluggyInvestment && (
                              <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                                <Plug className="h-3 w-3" />
                                Pluggy
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                              {getTypeLabel(investment.type)}
                            </span>
                            {investment.institution && (
                              <span className="text-xs text-slate-500">{investment.institution}</span>
                            )}
                            {investment.due_date && (
                              <span className="text-xs text-slate-500">
                                Venc: {new Date(investment.due_date).toLocaleDateString("pt-BR")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-white">{formatCurrency(investment.current_value)}</p>
                        <p className={`text-sm ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                          {isPositive ? "+" : ""}
                          {formatCurrency(investment.profit_loss)} ({investment.profit_loss_percentage.toFixed(2)}%)
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
