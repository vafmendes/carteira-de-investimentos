import Link from "next/link"
import { ArrowRight, BarChart3, CreditCard, PiggyBank, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg" />
            <span className="text-xl font-bold">Carteira</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
                Entrar
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">Cadastre-se</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Sua carteira de investimentos em um só lugar
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-8 text-pretty">
            Conecte suas contas bancárias, acompanhe seus investimentos e tenha controle total das suas finanças com a
            integração Pluggy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white w-full sm:w-auto">
                Começar agora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                size="lg"
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800 w-full sm:w-auto bg-transparent"
              >
                Já tenho conta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16 border-t border-slate-800">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
              <CreditCard className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Contas Integradas</h3>
            <p className="text-slate-400 text-sm">
              Conecte todas suas contas bancárias via Pluggy e visualize em um único lugar.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
            <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-cyan-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Análise de Gastos</h3>
            <p className="text-slate-400 text-sm">Gráficos detalhados das suas transações e categorias de gastos.</p>
          </div>
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
            <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4">
              <PiggyBank className="h-6 w-6 text-violet-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Investimentos</h3>
            <p className="text-slate-400 text-sm">
              Acompanhe a rentabilidade de todos seus investimentos em tempo real.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
            <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Segurança</h3>
            <p className="text-slate-400 text-sm">Seus dados protegidos com criptografia de ponta a ponta.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2025 Carteira de Investimentos. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
