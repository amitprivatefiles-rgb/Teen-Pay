/*
  # Add Performance Indexes for Optimization
  
  1. Purpose
    - Add critical indexes to improve query performance
    - Optimize admin dashboard queries
    - Speed up submission and withdrawal management
    - Reduce load times across the application
  
  2. New Indexes
    - `withdrawals`: status, user_id, created_at
    - `task_submissions`: company_id, status + submitted_at composite
    - `task_completions`: user_id, task_id
    - `wallet_transactions`: user_id, transaction_type
  
  3. Performance Impact
    - Faster admin dashboard stats loading
    - Faster submission filtering and sorting
    - Faster withdrawal request queries
    - Improved real-time query performance
  
  4. Notes
    - All indexes use IF NOT EXISTS for safety
    - Composite indexes for common query patterns
    - Partial indexes for filtered queries
*/

-- Withdrawals indexes
CREATE INDEX IF NOT EXISTS idx_withdrawals_status 
ON withdrawals(status);

CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id 
ON withdrawals(user_id);

CREATE INDEX IF NOT EXISTS idx_withdrawals_created_at 
ON withdrawals(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_withdrawals_status_created 
ON withdrawals(status, created_at DESC);

-- Task submissions composite indexes for admin queries
CREATE INDEX IF NOT EXISTS idx_task_submissions_company_id 
ON task_submissions(company_id);

CREATE INDEX IF NOT EXISTS idx_task_submissions_status_submitted 
ON task_submissions(status, submitted_at DESC);

CREATE INDEX IF NOT EXISTS idx_task_submissions_reviewed 
ON task_submissions(reviewed_at DESC) 
WHERE reviewed_at IS NOT NULL;

-- Task completions indexes
CREATE INDEX IF NOT EXISTS idx_task_completions_user_id 
ON task_completions(user_id);

CREATE INDEX IF NOT EXISTS idx_task_completions_task_id 
ON task_completions(task_id);

CREATE INDEX IF NOT EXISTS idx_task_completions_created 
ON task_completions(completed_at DESC);

-- Wallet transactions indexes
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user_id 
ON wallet_transactions(user_id);

CREATE INDEX IF NOT EXISTS idx_wallet_transactions_type 
ON wallet_transactions(transaction_type);

CREATE INDEX IF NOT EXISTS idx_wallet_transactions_created 
ON wallet_transactions(created_at DESC);

-- Company users index
CREATE INDEX IF NOT EXISTS idx_company_users_company_id 
ON company_users(company_id);

CREATE INDEX IF NOT EXISTS idx_company_users_auth_user 
ON company_users(auth_user_id) 
WHERE auth_user_id IS NOT NULL;