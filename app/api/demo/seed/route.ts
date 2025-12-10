import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { demoAccounts, demoTransactions, demoInvestments } from "@/lib/pluggy/demo-data"

// Endpoint para popular dados de demonstração (Pluggy Sandbox)
export async function POST() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Limpa dados existentes do usuário
    await supabase.from("transactions").delete().eq("user_id", user.id)
    await supabase.from("investments").delete().eq("user_id", user.id)
    await supabase.from("bank_accounts").delete().eq("user_id", user.id)

    // Insere contas bancárias de demonstração
    const accountsToInsert = demoAccounts.map((acc) => ({
      user_id: user.id,
      pluggy_account_id: acc.id,
      bank_name: acc.marketingName || acc.name,
      account_type: acc.type === "CREDIT" ? "credit_card" : acc.subtype === "SAVINGS_ACCOUNT" ? "savings" : "checking",
      account_number: acc.number,
      balance: acc.balance,
      currency: acc.currencyCode,
    }))

    const { data: insertedAccounts, error: accountsError } = await supabase
      .from("bank_accounts")
      .insert(accountsToInsert)
      .select()

    if (accountsError) {
      console.error("Error inserting accounts:", accountsError)
      return NextResponse.json({ error: "Failed to insert accounts" }, { status: 500 })
    }

    // Mapeia IDs das contas Pluggy para IDs do banco
    const accountIdMap = new Map<string, string>()
    insertedAccounts?.forEach((acc, index) => {
      accountIdMap.set(demoAccounts[index].id, acc.id)
    })

    // Insere transações de demonstração
    const transactionsToInsert = demoTransactions.map((txn) => ({
      user_id: user.id,
      bank_account_id: accountIdMap.get(txn.accountId) || null,
      pluggy_transaction_id: txn.id,
      description: txn.description,
      amount: txn.amount,
      transaction_type: txn.type === "CREDIT" ? "credit" : "debit",
      category: txn.category,
      transaction_date: txn.date,
    }))

    const { error: txnError } = await supabase.from("transactions").insert(transactionsToInsert)

    if (txnError) {
      console.error("Error inserting transactions:", txnError)
      return NextResponse.json({ error: "Failed to insert transactions" }, { status: 500 })
    }

    // Insere investimentos de demonstração
    const investmentsToInsert = demoInvestments.map((inv) => {
      const profitLoss = inv.value - inv.balance
      const profitLossPercentage = inv.balance > 0 ? (profitLoss / inv.balance) * 100 : 0

      return {
        user_id: user.id,
        pluggy_investment_id: inv.id,
        name: inv.name,
        type: inv.type,
        institution: inv.institution?.name || null,
        balance: inv.balance,
        initial_value: inv.balance,
        current_value: inv.value,
        profit_loss: profitLoss,
        profit_loss_percentage: profitLossPercentage,
        currency: inv.currencyCode,
        due_date: inv.dueDate || null,
      }
    })

    const { error: invError } = await supabase.from("investments").insert(investmentsToInsert)

    if (invError) {
      console.error("Error inserting investments:", invError)
      return NextResponse.json({ error: "Failed to insert investments" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Dados de demonstração Pluggy inseridos com sucesso!",
      data: {
        accounts: insertedAccounts?.length || 0,
        transactions: transactionsToInsert.length,
        investments: investmentsToInsert.length,
      },
    })
  } catch (error) {
    console.error("Error seeding demo data:", error)
    return NextResponse.json({ error: "Failed to seed demo data" }, { status: 500 })
  }
}
