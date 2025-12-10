"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import type { Profile } from "@/lib/types"
import { useRouter } from "next/navigation"
import { User, Mail, FileText, Calendar, CreditCard, Check } from "lucide-react"

interface ProfileFormProps {
  profile: Profile | null
  userEmail: string
}

export function ProfileForm({ profile, userEmail }: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    document: profile?.document || "",
    birth_date: profile?.birth_date || "",
    credit_card: profile?.credit_card || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccess(false)

    const supabase = createClient()
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: formData.full_name,
        document: formData.document || null,
        birth_date: formData.birth_date || null,
        credit_card: formData.credit_card || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile?.id)

    if (!error) {
      setSuccess(true)
      setIsEditing(false)
      router.refresh()
      setTimeout(() => setSuccess(false), 3000)
    }

    setIsLoading(false)
  }

  const formatDate = (date: string | null) => {
    if (!date) return "Não informado"
    return new Date(date).toLocaleDateString("pt-BR")
  }

  const maskCreditCard = (card: string | null) => {
    if (!card) return "Não informado"
    return `•••• •••• •••• ${card.slice(-4)}`
  }

  return (
    <div className="grid gap-6">
      {/* Profile Card */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Informações Pessoais</CardTitle>
              <CardDescription className="text-slate-400">Seus dados cadastrados na plataforma</CardDescription>
            </div>
            {!isEditing && (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
              >
                Editar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label className="text-slate-300">Nome Completo</Label>
                <Input
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="bg-slate-800 border-slate-700 text-white"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-slate-300">Email</Label>
                <Input value={userEmail} disabled className="bg-slate-800 border-slate-700 text-slate-500" />
                <p className="text-xs text-slate-500">O email não pode ser alterado</p>
              </div>
              <div className="grid gap-2">
                <Label className="text-slate-300">CPF</Label>
                <Input
                  name="document"
                  value={formData.document}
                  onChange={handleChange}
                  placeholder="000.000.000-00"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-slate-300">Data de Nascimento</Label>
                <Input
                  name="birth_date"
                  type="date"
                  value={formData.birth_date}
                  onChange={handleChange}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-slate-300">Cartão de Crédito</Label>
                <Input
                  name="credit_card"
                  value={formData.credit_card}
                  onChange={handleChange}
                  placeholder="**** **** **** ****"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 bg-emerald-500 hover:bg-emerald-600" disabled={isLoading}>
                  {isLoading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {success && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Check className="h-4 w-4" />
                  <span className="text-sm">Perfil atualizado com sucesso!</span>
                </div>
              )}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-800/50">
                <div className="p-3 rounded-lg bg-emerald-500/10">
                  <User className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Nome Completo</p>
                  <p className="text-white font-medium">{profile?.full_name || "Não informado"}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-800/50">
                <div className="p-3 rounded-lg bg-cyan-500/10">
                  <Mail className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="text-white font-medium">{userEmail}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-800/50">
                <div className="p-3 rounded-lg bg-violet-500/10">
                  <FileText className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">CPF</p>
                  <p className="text-white font-medium">{profile?.document || "Não informado"}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-800/50">
                <div className="p-3 rounded-lg bg-amber-500/10">
                  <Calendar className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Data de Nascimento</p>
                  <p className="text-white font-medium">{formatDate(profile?.birth_date || null)}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-800/50">
                <div className="p-3 rounded-lg bg-rose-500/10">
                  <CreditCard className="h-5 w-5 text-rose-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Cartão de Crédito</p>
                  <p className="text-white font-medium">{maskCreditCard(profile?.credit_card || null)}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
