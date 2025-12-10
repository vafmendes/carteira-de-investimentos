import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { pluggyClient } from "@/lib/pluggy/client"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { itemId } = await request.json()

    if (!itemId) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 })
    }

    // Busca dados do Pluggy
    const [accounts, investments] = await Promise.all([
      pluggyClient.getAccounts(itemId),
      pluggyClient.getInvestments(itemId),
    ])

    // Sincroniza contas bancárias
    for (const account of accounts) {
      const accountType =
        account.type === "CREDIT" ? "credit_card" : account.subtype === "SAVINGS_ACCOUNT" ? "savings" : "checking"

      await supabase.from("bank_accounts").upsert(
        {
          user_id: user.id,
          pluggy_account_id: account.id,
          bank_name: account.marketingName || account.name,
          account_type: accountType,
          account_number: account.number,
          balance: account.balance,
          currency: account.currencyCode,
        },
        { onConflict: "pluggy_account_id" },
      )

      // Busca e sincroniza transações da conta
      const { results: transactions } = await pluggyClient.getTransactions(account.id, {
        pageSize: 100,
      })

      for (const txn of transactions) {
        await supabase.from("transactions").upsert(
          {
            user_id: user.id,
            bank_account_id: null, // Será atualizado após insert da conta
            pluggy_transaction_id: txn.id,
            description: txn.description,
            amount: txn.amount,
            transaction_type: txn.type === "CREDIT" ? "credit" : "debit",
            category: txn.category,
            transaction_date: txn.date,
          },
          { onConflict: "pluggy_transaction_id" },
        )
      }
    }

    // Sincroniza investimentos
    for (const inv of investments) {
      const profitLoss = inv.value - inv.balance
      const profitLossPercentage = inv.balance > 0 ? (profitLoss / inv.balance) * 100 : 0

      await supabase.from("investments").upsert(
        {
          user_id: user.id,
          pluggy_investment_id: inv.id,
          name: inv.name,
          type: inv.type,
          institution: inv.institution?.name,
          balance: inv.balance,
          initial_value: inv.balance,
          current_value: inv.value,
          profit_loss: profitLoss,
          profit_loss_percentage: profitLossPercentage,
          currency: inv.currencyCode,
          due_date: inv.dueDate,
        },
        { onConflict: "pluggy_investment_id" },
      )
    }

    return NextResponse.json({
      success: true,
      synced: {
        accounts: accounts.length,
        investments: investments.length,
      },
    })
  } catch (error) {
    console.error("Error syncing Pluggy data:", error)
    return NextResponse.json({ error: "Failed to sync data" }, { status: 500 })
  }
}
