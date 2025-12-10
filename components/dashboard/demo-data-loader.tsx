"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Database, CheckCircle, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export function DemoDataLoader() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const router = useRouter()

  const loadDemoData = async () => {
    setLoading(true)
    setStatus("idle")

    try {
      const response = await fetch("/api/demo/seed", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setMessage(
          `Carregados: ${data.data.accounts} contas, ${data.data.transactions} transações, ${data.data.investments} investimentos`,
        )
        // Recarrega a página para mostrar os novos dados
        setTimeout(() => {
          router.refresh()
        }, 1500)
      } else {
        setStatus("error")
        setMessage(data.error || "Erro ao carregar dados")
      }
    } catch {
      setStatus("error")
      setMessage("Erro de conexão. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Database className="h-5 w-5 text-emerald-400" />
          Dados de Demonstração Pluggy
        </CardTitle>
        <CardDescription className="text-slate-400">
          Carregue dados de teste simulando a integração com a API Pluggy Sandbox. Inclui contas bancárias, transações e
          investimentos fictícios.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-slate-900/50 rounded-lg p-4 text-sm text-slate-300">
          <p className="font-medium text-emerald-400 mb-2">Credenciais Sandbox Pluggy:</p>
          <ul className="space-y-1">
            <li>
              <span className="text-slate-500">Usuário:</span> user-ok
            </li>
            <li>
              <span className="text-slate-500">Senha:</span> password-ok
            </li>
            <li>
              <span className="text-slate-500">MFA Token:</span> 123456
            </li>
          </ul>
        </div>

        {status === "success" && (
          <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 p-3 rounded-lg">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm">{message}</span>
          </div>
        )}

        {status === "error" && (
          <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-3 rounded-lg">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm">{message}</span>
          </div>
        )}

        <Button
          onClick={loadDemoData}
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Carregando dados...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Carregar Dados de Demonstração
            </>
          )}
        </Button>

        <p className="text-xs text-slate-500 text-center">
          Os dados serão associados à sua conta atual e substituirão dados existentes.
        </p>
      </CardContent>
    </Card>
  )
}
