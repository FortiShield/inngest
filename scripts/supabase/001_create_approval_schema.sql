-- Approval Prompt Integration Schema
-- Tables: approval_prompts, approval_reviews, approval_decisions, audit_logs

-- Create profiles table (for RBAC later)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT,
  role TEXT DEFAULT 'developer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create approval_prompts table
CREATE TABLE IF NOT EXISTS approval_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Prompt details
  title TEXT NOT NULL,
  description TEXT,
  prompt_text TEXT NOT NULL,
  
  -- Code context
  code_before TEXT,
  code_after TEXT,
  file_path TEXT,
  
  -- Plan details
  plan_id TEXT,
  plan_steps JSONB,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'revised')),
  
  -- Metadata
  context_items JSONB,
  metadata JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create approval_reviews table
CREATE TABLE IF NOT EXISTS approval_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  approval_prompt_id UUID NOT NULL REFERENCES approval_prompts(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Review details
  status TEXT NOT NULL CHECK (status IN ('approved', 'rejected', 'needs_revision')),
  feedback TEXT,
  
  -- Line-level comments
  comments JSONB,
  
  -- Suggestions
  suggestions JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create approval_decisions table
CREATE TABLE IF NOT EXISTS approval_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  approval_prompt_id UUID NOT NULL REFERENCES approval_prompts(id) ON DELETE CASCADE,
  
  -- Decision
  decision TEXT NOT NULL CHECK (decision IN ('approved', 'rejected')),
  final_feedback TEXT,
  
  -- Execution details
  executed_at TIMESTAMP WITH TIME ZONE,
  execution_result JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Event details
  event_type TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  action TEXT NOT NULL,
  
  -- Details
  old_values JSONB,
  new_values JSONB,
  metadata JSONB,
  
  ip_address TEXT,
  user_agent TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_approval_prompts_user_id ON approval_prompts(user_id);
CREATE INDEX idx_approval_prompts_session_id ON approval_prompts(session_id);
CREATE INDEX idx_approval_prompts_status ON approval_prompts(status);
CREATE INDEX idx_approval_reviews_approval_prompt_id ON approval_reviews(approval_prompt_id);
CREATE INDEX idx_approval_reviews_reviewer_id ON approval_reviews(reviewer_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_event_type ON audit_logs(event_type);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for approval_prompts
CREATE POLICY "Users can view their own approval prompts"
  ON approval_prompts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create approval prompts"
  ON approval_prompts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own approval prompts"
  ON approval_prompts FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for approval_reviews
CREATE POLICY "Reviewers can view reviews they created"
  ON approval_reviews FOR SELECT
  USING (auth.uid() = reviewer_id);

CREATE POLICY "Reviewers can create reviews"
  ON approval_reviews FOR INSERT
  WITH CHECK (auth.uid() = reviewer_id);

-- Audit log function
CREATE OR REPLACE FUNCTION audit_log_trigger()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (user_id, event_type, resource_type, resource_id, action, old_values, new_values)
  VALUES (
    auth.uid(),
    TG_TABLE_NAME,
    TG_TABLE_NAME,
    NEW.id,
    TG_OP,
    to_jsonb(OLD),
    to_jsonb(NEW)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Audit triggers
CREATE TRIGGER audit_approval_prompts
AFTER INSERT OR UPDATE ON approval_prompts
FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

CREATE TRIGGER audit_approval_reviews
AFTER INSERT OR UPDATE ON approval_reviews
FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

CREATE TRIGGER audit_approval_decisions
AFTER INSERT OR UPDATE ON approval_decisions
FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();
