import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DemoDataLoader } from "@/components/dashboard/demo-data-loader"
import { Plug, Shield, Bell, Database } from "lucide-react"

export default async function SettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Configurações</h1>
        <p className="text-slate-400 mt-1">Gerencie suas preferências e integrações</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Pluggy Integration Card */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Plug className="h-5 w-5 text-blue-400" />
              Integração Pluggy
            </CardTitle>
            <CardDescription className="text-slate-400">
              Conecte suas contas bancárias através do Open Finance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-slate-900/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-white mb-2">Como funciona:</h4>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>1. Clique em "Conectar Conta"</li>
                  <li>2. Selecione sua instituição financeira</li>
                  <li>3. Autorize o acesso aos dados</li>
                  <li>4. Seus dados serão sincronizados automaticamente</li>
                </ul>
              </div>
              <p className="text-xs text-slate-500">
                Para integração em produção, configure PLUGGY_CLIENT_ID e PLUGGY_CLIENT_SECRET nas variáveis de
                ambiente.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Data Card */}
        <DemoDataLoader />

        {/* Security Card */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-400" />
              Segurança
            </CardTitle>
            <CardDescription className="text-slate-400">Configurações de segurança da sua conta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Autenticação em dois fatores</span>
                <span className="text-xs text-slate-500 bg-slate-700 px-2 py-1 rounded">Em breve</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Sessões ativas</span>
                <span className="text-xs text-emerald-400">1 dispositivo</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Último acesso</span>
                <span className="text-xs text-slate-400">Agora</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Card */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bell className="h-5 w-5 text-yellow-400" />
              Notificações
            </CardTitle>
            <CardDescription className="text-slate-400">Preferências de alertas e notificações</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Alertas de transações</span>
                <span className="text-xs text-slate-500 bg-slate-700 px-2 py-1 rounded">Em breve</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Relatórios semanais</span>
                <span className="text-xs text-slate-500 bg-slate-700 px-2 py-1 rounded">Em breve</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Metas de economia</span>
                <span className="text-xs text-slate-500 bg-slate-700 px-2 py-1 rounded">Em breve</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Info Card */}
        <Card className="bg-slate-800/50 border-slate-700 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Database className="h-5 w-5 text-purple-400" />
              Informações da API Pluggy
            </CardTitle>
            <CardDescription className="text-slate-400">
              Documentação e credenciais para desenvolvimento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-900/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-emerald-400 mb-2">Sandbox (Testes)</h4>
                <div className="text-sm text-slate-300 space-y-1 font-mono">
                  <p>
                    Usuário: <span className="text-white">user-ok</span>
                  </p>
                  <p>
                    Senha: <span className="text-white">password-ok</span>
                  </p>
                  <p>
                    MFA: <span className="text-white">123456</span>
                  </p>
                  <p>
                    CPF Open Finance: <span className="text-white">761.092.776-73</span>
                  </p>
                </div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-400 mb-2">Links Úteis</h4>
                <div className="text-sm space-y-1">
                  <a
                    href="https://docs.pluggy.ai/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 block"
                  >
                    Documentação Pluggy
                  </a>
                  <a
                    href="https://dashboard.pluggy.ai/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 block"
                  >
                    Dashboard Pluggy
                  </a>
                  <a
                    href="https://docs.pluggy.ai/docs/sandbox"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 block"
                  >
                    Guia do Sandbox
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
