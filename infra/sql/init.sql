-- Enable vector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Documents table for storing uploaded files metadata
CREATE TABLE IF NOT EXISTS documents (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  source_id TEXT UNIQUE NOT NULL,
  title TEXT,
  filename TEXT,
  content_type TEXT,
  file_size INTEGER,
  status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chunks table for storing document segments with embeddings
CREATE TABLE IF NOT EXISTS chunks (
  id BIGSERIAL PRIMARY KEY,
  document_id BIGINT REFERENCES documents(id) ON DELETE CASCADE,
  tenant_id TEXT NOT NULL,
  seq INTEGER NOT NULL, -- sequence number within document
  text TEXT NOT NULL,
  tokens INTEGER,
  embedding vector(1536), -- OpenAI embedding dimension
  metadata JSONB, -- additional metadata like page number, section, etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for similarity search
CREATE INDEX IF NOT EXISTS idx_chunks_embedding
  ON chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Index for tenant-based queries
CREATE INDEX IF NOT EXISTS idx_chunks_tenant ON chunks(tenant_id);
CREATE INDEX IF NOT EXISTS idx_documents_tenant ON documents(tenant_id);

-- QA logs for tracking all queries and responses
CREATE TABLE IF NOT EXISTS qa_logs (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  user_id TEXT,
  conversation_id TEXT,
  question TEXT NOT NULL,
  answer TEXT,
  citations JSONB,
  confidence DECIMAL(3,2),
  escalated BOOLEAN DEFAULT FALSE,
  latency_ms INTEGER,
  tokens_used INTEGER,
  model_used TEXT,
  ocr_used BOOLEAN DEFAULT FALSE,
  vision_used BOOLEAN DEFAULT FALSE,
  feedback_rating INTEGER, -- 1-5 star rating
  feedback_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for analytics queries
CREATE INDEX IF NOT EXISTS idx_qa_logs_tenant_date ON qa_logs(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_qa_logs_conversation ON qa_logs(conversation_id);

-- Tenants table for customer management
CREATE TABLE IF NOT EXISTS tenants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  plan TEXT DEFAULT 'starter', -- starter, pro, scale
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  monthly_limit INTEGER DEFAULT 1000,
  white_label_config JSONB,
  settings JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usage tracking for billing
CREATE TABLE IF NOT EXISTS usage_tracking (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  month DATE NOT NULL,
  queries_count INTEGER DEFAULT 0,
  tokens_used INTEGER DEFAULT 0,
  storage_mb INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, month)
);

-- Integration configurations
CREATE TABLE IF NOT EXISTS integrations (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  type TEXT NOT NULL, -- zendesk, intercom, slack, email
  config JSONB NOT NULL, -- encrypted credentials and settings
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, type)
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usage_tracking_updated_at BEFORE UPDATE ON usage_tracking
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integrations_updated_at BEFORE UPDATE ON integrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();