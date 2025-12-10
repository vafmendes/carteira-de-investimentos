"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Building2, Plus, Wallet, CreditCard, Eye, EyeOff, Plug } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { BankAccount } from "@/lib/types"
import { useRouter } from "next/navigation"

interface AccountsListProps {
  accounts: BankAccount[]
  userId: string
}

const bankNames = [
  "Nubank",
  "Itaú",
  "Bradesco",
  "Santander",
  "Banco do Brasil",
  "Caixa Econômica",
  "Inter",
  "C6 Bank",
  "BTG Pactual",
  "XP Investimentos",
  "Outro",
]

const accountTypes = [
  { value: "checking", label: "Conta Corrente" },
  { value: "savings", label: "Conta Poupança" },
  { value: "investment", label: "Conta Investimento" },
  { value: "credit_card", label: "Cartão de Crédito" },
]

export function AccountsList({ accounts, userId }: AccountsListProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showBalance, setShowBalance] = useState(true)
  const router = useRouter()

  const [newAccount, setNewAccount] = useState({
    bank_name: "",
    account_type: "checking",
    account_number: "",
    agency: "",
    balance: "",
  })

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val)
  }

  const positiveAccounts = accounts.filter((acc) => acc.account_type !== "credit_card")
  const creditCards = accounts.filter((acc) => acc.account_type === "credit_card")

  const totalBalance = positiveAccounts.reduce((sum, acc) => sum + Number(acc.balance), 0)
  const totalCreditDebt = Math.abs(creditCards.reduce((sum, acc) => sum + Number(acc.balance), 0))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()
    const { error } = await supabase.from("bank_accounts").insert({
      user_id: userId,
      bank_name: newAccount.bank_name,
      account_type: newAccount.account_type,
      account_number: newAccount.account_number || null,
      agency: newAccount.agency || null,
      balance: Number.parseFloat(newAccount.balance) || 0,
    })

    if (!error) {
      setIsOpen(false)
      setNewAccount({
        bank_name: "",
        account_type: "checking",
        account_number: "",
        agency: "",
        balance: "",
      })
      router.refresh()
    }

    setIsLoading(false)
  }

  const getAccountTypeLabel = (type: string) => {
    return accountTypes.find((t) => t.value === type)?.label || type
  }

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "checking":
        return Wallet
      case "savings":
        return Building2
      case "credit_card":
        return CreditCard
      default:
        return Wallet
    }
  }

  const getIconColor = (type: string) => {
    switch (type) {
      case "credit_card":
        return "text-purple-400"
      case "savings":
        return "text-emerald-400"
      default:
        return "text-cyan-400"
    }
  }

  const getIconBgColor = (type: string) => {
    switch (type) {
      case "credit_card":
        return "bg-purple-500/10"
      case "savings":
        return "bg-emerald-500/10"
      default:
        return "bg-cyan-500/10"
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Total Balance Card */}
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Saldo em Contas</p>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-2xl font-bold text-white">
                    {showBalance ? formatCurrency(totalBalance) : "••••••"}
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowBalance(!showBalance)}
                    className="text-slate-400 hover:text-white"
                  >
                    {showBalance ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2">{positiveAccounts.length} conta(s)</p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-500/10">
                <Building2 className="h-8 w-8 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credit Card Debt Card */}
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Fatura Cartões</p>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-2xl font-bold text-red-400">
                    {showBalance ? formatCurrency(totalCreditDebt) : "••••••"}
                  </p>
                </div>
                <p className="text-xs text-slate-500 mt-2">{creditCards.length} cartão(ões)</p>
              </div>
              <div className="p-4 rounded-xl bg-purple-500/10">
                <CreditCard className="h-8 w-8 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accounts List */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <CardTitle className="text-white">Minhas Contas</CardTitle>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-500 hover:bg-emerald-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Conta
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-800">
                <DialogHeader>
                  <DialogTitle className="text-white">Adicionar Conta Bancária</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-2">
                    <Label className="text-white">Banco</Label>
                    <Select
                      value={newAccount.bank_name}
                      onValueChange={(v) => setNewAccount((p) => ({ ...p, bank_name: v }))}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue className='text-white' placeholder="Selecione o banco" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {bankNames.map((bank) => (
                          <SelectItem key={bank} value={bank} className="text-white">
                            {bank}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-white">Tipo de Conta</Label>
                    <Select
                      value={newAccount.account_type}
                      onValueChange={(v) => setNewAccount((p) => ({ ...p, account_type: v }))}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue className='text-white'/>
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {accountTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value} className="text-white">
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label className="text-white">Agência</Label>
                      <Input
                        value={newAccount.agency}
                        onChange={(e) => setNewAccount((p) => ({ ...p, agency: e.target.value }))}
                        className="bg-slate-800 border-slate-700 text-white"
                        placeholder="0001"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-white">Conta</Label>
                      <Input
                        value={newAccount.account_number}
                        onChange={(e) => setNewAccount((p) => ({ ...p, account_number: e.target.value }))}
                        className="bg-slate-800 border-slate-700 text-white"
                        placeholder="12345-6"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-white">Saldo Atual</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newAccount.balance}
                      onChange={(e) => setNewAccount((p) => ({ ...p, balance: e.target.value }))}
                      className="bg-slate-800 border-slate-700 text-white"
                      placeholder="0.00"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600" disabled={isLoading}>
                    {isLoading ? "Salvando..." : "Adicionar Conta"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {accounts.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500">Nenhuma conta bancária cadastrada</p>
                <p className="text-slate-600 text-sm mt-1">
                  Adicione sua primeira conta ou carregue dados de demonstração
                </p>
              </div>
            ) : (
              accounts.map((account) => {
                const Icon = getAccountIcon(account.account_type)
                const isPluggyAccount = !!account.pluggy_account_id
                const isNegativeBalance = account.balance < 0

                return (
                  <div key={account.id} className="p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${getIconBgColor(account.account_type)}`}>
                          <Icon className={`h-5 w-5 ${getIconColor(account.account_type)}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-white">{account.bank_name}</p>
                            {isPluggyAccount && (
                              <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                                <Plug className="h-3 w-3" />
                                Pluggy
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                              {getAccountTypeLabel(account.account_type)}
                            </span>
                            {account.agency && account.account_number && (
                              <span className="text-xs text-slate-500">
                                Ag: {account.agency} | Cc: {account.account_number}
                              </span>
                            )}
                            {!account.agency && account.account_number && (
                              <span className="text-xs text-slate-500">{account.account_number}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-semibold ${isNegativeBalance ? "text-red-400" : "text-white"}`}>
                          {showBalance ? formatCurrency(account.balance) : "••••••"}
                        </p>
                        <p className="text-xs text-slate-500">{account.currency}</p>
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
