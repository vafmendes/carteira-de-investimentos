import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

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
            <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
            <CardTitle className="text-2xl text-white">Ops! Algo deu errado</CardTitle>
            <CardDescription className="text-slate-400">Ocorreu um erro durante a autenticação</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {params?.error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-red-400">Código do erro: {params.error}</p>
              </div>
            )}
            <div className="flex gap-3">
              <Link href="/auth/login" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
                >
                  Voltar ao login
                </Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">Página inicial</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
