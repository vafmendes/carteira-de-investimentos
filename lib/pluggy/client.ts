// Pluggy API Client
// Documentação: https://docs.pluggy.ai/

const PLUGGY_API_URL = "https://api.pluggy.ai"

// Credenciais do Sandbox - Em produção, use variáveis de ambiente
// Para obter suas credenciais: https://dashboard.pluggy.ai/
const PLUGGY_CLIENT_ID = process.env.PLUGGY_CLIENT_ID || ""
const PLUGGY_CLIENT_SECRET = process.env.PLUGGY_CLIENT_SECRET || ""

export interface PluggyAuthResponse {
  apiKey: string
}

export interface PluggyConnector {
  id: number
  name: string
  institutionUrl: string
  imageUrl: string
  primaryColor: string
  type: string
  country: string
  credentials: PluggyCredential[]
  hasMFA: boolean
  products: string[]
  isSandbox: boolean
}

export interface PluggyCredential {
  name: string
  label: string
  type: string
  placeholder?: string
  validation?: string
  validationMessage?: string
  optional?: boolean
}

export interface PluggyItem {
  id: string
  connector: PluggyConnector
  status: string
  executionStatus: string
  createdAt: string
  updatedAt: string
  lastUpdatedAt: string
  error?: {
    code: string
    message: string
  }
}

export interface PluggyAccount {
  id: string
  itemId: string
  type: string
  subtype: string
  name: string
  balance: number
  currencyCode: string
  number?: string
  marketingName?: string
  owner?: string
  bankData?: {
    transferNumber?: string
    closingBalance?: number
  }
}

export interface PluggyTransaction {
  id: string
  accountId: string
  description: string
  descriptionRaw?: string
  currencyCode: string
  amount: number
  amountInAccountCurrency?: number
  date: string
  balance: number
  category?: string
  categoryId?: string
  type: "DEBIT" | "CREDIT"
  status?: string
  paymentData?: {
    payer?: {
      name?: string
      documentNumber?: string
    }
    receiver?: {
      name?: string
      documentNumber?: string
    }
  }
}

export interface PluggyInvestment {
  id: string
  itemId: string
  name: string
  type: string
  subtype?: string
  number?: string
  balance: number
  currencyCode: string
  value: number
  quantity?: number
  annualRate?: number
  lastMonthRate?: number
  dueDate?: string
  issuer?: string
  issuerCnpj?: string
  institution?: {
    name?: string
    cnpj?: string
  }
}

export interface PluggyIdentity {
  id: string
  itemId: string
  fullName?: string
  cpf?: string
  birthDate?: string
  email?: string
  phoneNumber?: string
  addresses?: Array<{
    fullAddress?: string
    city?: string
    state?: string
    country?: string
    postalCode?: string
  }>
}

class PluggyClient {
  private apiKey: string | null = null
  private apiKeyExpiry: Date | null = null

  // Autentica e obtém API Key (expira em 2 horas)
  async authenticate(): Promise<string> {
    // Verifica se já tem uma API key válida
    if (this.apiKey && this.apiKeyExpiry && new Date() < this.apiKeyExpiry) {
      return this.apiKey
    }

    const response = await fetch(`${PLUGGY_API_URL}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientId: PLUGGY_CLIENT_ID,
        clientSecret: PLUGGY_CLIENT_SECRET,
      }),
    })

    if (!response.ok) {
      throw new Error(`Pluggy authentication failed: ${response.statusText}`)
    }

    const data: PluggyAuthResponse = await response.json()
    this.apiKey = data.apiKey
    // API Key expira em 2 horas
    this.apiKeyExpiry = new Date(Date.now() + 2 * 60 * 60 * 1000)

    return this.apiKey
  }

  // Cria um Connect Token para o widget (expira em 30 minutos)
  async createConnectToken(itemId?: string): Promise<string> {
    const apiKey = await this.authenticate()

    const body: Record<string, string> = {}
    if (itemId) {
      body.itemId = itemId
    }

    const response = await fetch(`${PLUGGY_API_URL}/connect_token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`Failed to create connect token: ${response.statusText}`)
    }

    const data = await response.json()
    return data.accessToken
  }

  // Lista conectores disponíveis
  async getConnectors(sandbox = true): Promise<PluggyConnector[]> {
    const apiKey = await this.authenticate()

    const params = new URLSearchParams()
    if (sandbox) {
      params.append("sandbox", "true")
    }

    const response = await fetch(`${PLUGGY_API_URL}/connectors?${params}`, {
      headers: {
        "X-API-KEY": apiKey,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to get connectors: ${response.statusText}`)
    }

    const data = await response.json()
    return data.results
  }

  // Cria um Item (conexão com instituição financeira)
  async createItem(connectorId: number, credentials: Record<string, string>): Promise<PluggyItem> {
    const apiKey = await this.authenticate()

    const response = await fetch(`${PLUGGY_API_URL}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify({
        connectorId,
        parameters: credentials,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to create item: ${error.message || response.statusText}`)
    }

    return response.json()
  }

  // Obtém um Item
  async getItem(itemId: string): Promise<PluggyItem> {
    const apiKey = await this.authenticate()

    const response = await fetch(`${PLUGGY_API_URL}/items/${itemId}`, {
      headers: {
        "X-API-KEY": apiKey,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to get item: ${response.statusText}`)
    }

    return response.json()
  }

  // Atualiza um Item
  async updateItem(itemId: string): Promise<PluggyItem> {
    const apiKey = await this.authenticate()

    const response = await fetch(`${PLUGGY_API_URL}/items/${itemId}`, {
      method: "PATCH",
      headers: {
        "X-API-KEY": apiKey,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to update item: ${response.statusText}`)
    }

    return response.json()
  }

  // Deleta um Item
  async deleteItem(itemId: string): Promise<void> {
    const apiKey = await this.authenticate()

    const response = await fetch(`${PLUGGY_API_URL}/items/${itemId}`, {
      method: "DELETE",
      headers: {
        "X-API-KEY": apiKey,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to delete item: ${response.statusText}`)
    }
  }

  // Lista contas de um Item
  async getAccounts(itemId: string): Promise<PluggyAccount[]> {
    const apiKey = await this.authenticate()

    const response = await fetch(`${PLUGGY_API_URL}/accounts?itemId=${itemId}`, {
      headers: {
        "X-API-KEY": apiKey,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to get accounts: ${response.statusText}`)
    }

    const data = await response.json()
    return data.results
  }

  // Lista transações de uma conta
  async getTransactions(
    accountId: string,
    options?: {
      from?: string
      to?: string
      pageSize?: number
      page?: number
    },
  ): Promise<{ results: PluggyTransaction[]; total: number }> {
    const apiKey = await this.authenticate()

    const params = new URLSearchParams()
    params.append("accountId", accountId)
    if (options?.from) params.append("from", options.from)
    if (options?.to) params.append("to", options.to)
    if (options?.pageSize) params.append("pageSize", options.pageSize.toString())
    if (options?.page) params.append("page", options.page.toString())

    const response = await fetch(`${PLUGGY_API_URL}/transactions?${params}`, {
      headers: {
        "X-API-KEY": apiKey,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to get transactions: ${response.statusText}`)
    }

    return response.json()
  }

  // Lista investimentos de um Item
  async getInvestments(itemId: string): Promise<PluggyInvestment[]> {
    const apiKey = await this.authenticate()

    const response = await fetch(`${PLUGGY_API_URL}/investments?itemId=${itemId}`, {
      headers: {
        "X-API-KEY": apiKey,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to get investments: ${response.statusText}`)
    }

    const data = await response.json()
    return data.results
  }

  // Obtém identidade do usuário
  async getIdentity(itemId: string): Promise<PluggyIdentity> {
    const apiKey = await this.authenticate()

    const response = await fetch(`${PLUGGY_API_URL}/identity?itemId=${itemId}`, {
      headers: {
        "X-API-KEY": apiKey,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to get identity: ${response.statusText}`)
    }

    return response.json()
  }
}

export const pluggyClient = new PluggyClient()

// Dados do Sandbox para testes
// Credenciais de teste: user-ok / password-ok
export const PLUGGY_SANDBOX = {
  CONNECTOR_ID: 0, // Sandbox connector
  CREDENTIALS: {
    user: "user-ok",
    password: "password-ok",
  },
  MFA_TOKEN: "123456",
  // CPF para Open Finance flow
  OPEN_FINANCE_CPF: "761.092.776-73",
}
