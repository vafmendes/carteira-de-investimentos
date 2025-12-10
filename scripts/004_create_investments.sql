-- Tabela de investimentos
CREATE TABLE IF NOT EXISTS public.investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pluggy_investment_id TEXT,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  institution TEXT,
  balance DECIMAL(15, 2) DEFAULT 0,
  initial_value DECIMAL(15, 2) DEFAULT 0,
  current_value DECIMAL(15, 2) DEFAULT 0,
  profit_loss DECIMAL(15, 2) DEFAULT 0,
  profit_loss_percentage DECIMAL(8, 4) DEFAULT 0,
  currency TEXT DEFAULT 'BRL',
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "investments_select_own" ON public.investments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "investments_insert_own" ON public.investments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "investments_update_own" ON public.investments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "investments_delete_own" ON public.investments FOR DELETE USING (auth.uid() = user_id);
