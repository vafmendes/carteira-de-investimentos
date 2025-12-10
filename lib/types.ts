export interface Profile {
  id: string
  full_name: string
  email: string
  document: string | null
  birth_date: string | null
  credit_card: string | null
  created_at: string
  updated_at: string
}

export interface BankAccount {
  id: string
  user_id: string
  pluggy_account_id: string | null
  bank_name: string
  account_type: string
  account_number: string | null
  agency: string | null
  balance: number
  currency: string
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  user_id: string
  bank_account_id: string | null
  pluggy_transaction_id: string | null
  description: string
  amount: number
  transaction_type: "credit" | "debit"
  category: string | null
  transaction_date: string
  created_at: string
}

export interface Investment {
  id: string
  user_id: string
  pluggy_investment_id: string | null
  name: string
  type: string
  institution: string | null
  balance: number
  initial_value: number
  current_value: number
  profit_loss: number
  profit_loss_percentage: number
  currency: string
  due_date: string | null
  created_at: string
  updated_at: string
}
