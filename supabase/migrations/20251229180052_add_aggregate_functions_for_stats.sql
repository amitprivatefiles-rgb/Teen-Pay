/*
  # Add Aggregate Functions for Dashboard Stats
  
  1. Purpose
    - Create database functions for efficient stats calculation
    - Avoid fetching all records for simple aggregates
    - Improve admin dashboard performance
  
  2. New Functions
    - `get_total_user_earnings()`: Returns sum of all user earnings
    - `get_pending_withdrawals_sum()`: Returns sum of pending withdrawal amounts
  
  3. Performance Impact
    - Drastically reduces data transfer
    - Calculations done in database instead of JavaScript
    - Faster dashboard load times
  
  4. Notes
    - Functions use COALESCE to handle NULL values
    - Returns 0 if no records found
    - Optimized with proper indexes
*/

-- Function to get total user earnings
CREATE OR REPLACE FUNCTION get_total_user_earnings()
RETURNS NUMERIC AS $$
BEGIN
  RETURN COALESCE(
    (SELECT SUM(total_earnings) FROM profiles WHERE role = 'user'),
    0
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get pending withdrawals sum
CREATE OR REPLACE FUNCTION get_pending_withdrawals_sum()
RETURNS NUMERIC AS $$
BEGIN
  RETURN COALESCE(
    (SELECT SUM(amount) FROM withdrawals WHERE status = 'pending'),
    0
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;