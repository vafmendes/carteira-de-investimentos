import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Mail } from "lucide-react"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg" />
            <span className="text-xl font-bold text-white">Carteira</span>
          </Link>
        </div>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-emerald-400" />
            </div>
            <CardTitle className="text-2xl text-white">Conta criada com sucesso!</CardTitle>
            <CardDescription className="text-slate-400">Enviamos um email de confirmação para você</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-slate-800 border border-slate-700 flex items-start gap-3">
              <Mail className="h-5 w-5 text-emerald-400 mt-0.5" />
              <div>
                <p className="text-sm text-slate-300">
                  Verifique sua caixa de entrada e clique no link de confirmação para ativar sua conta.
                </p>
                <p className="text-xs text-slate-500 mt-2">Não recebeu? Verifique a pasta de spam.</p>
              </div>
            </div>
            <Link href="/auth/login" className="block">
              <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">Ir para o login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
