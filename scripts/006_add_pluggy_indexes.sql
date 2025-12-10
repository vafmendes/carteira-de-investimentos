-- Adiciona índices para otimizar consultas relacionadas ao Pluggy
-- Execute este script após os scripts anteriores

-- Índice único para pluggy_account_id (para upsert)
CREATE UNIQUE INDEX IF NOT EXISTS idx_bank_accounts_pluggy_id 
ON bank_accounts(pluggy_account_id) 
WHERE pluggy_account_id IS NOT NULL;

-- Índice único para pluggy_transaction_id (para upsert)
CREATE UNIQUE INDEX IF NOT EXISTS idx_transactions_pluggy_id 
ON transactions(pluggy_transaction_id) 
WHERE pluggy_transaction_id IS NOT NULL;

-- Índice único para pluggy_investment_id (para upsert)
CREATE UNIQUE INDEX IF NOT EXISTS idx_investments_pluggy_id 
ON investments(pluggy_investment_id) 
WHERE pluggy_investment_id IS NOT NULL;
