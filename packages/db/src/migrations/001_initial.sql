-- Drizzle migration 001_initial

CREATE TABLE IF NOT EXISTS "user" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  passkey_handle TEXT,
  passkey_public_key TEXT,
  passkey_counter INTEGER DEFAULT 0,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_email ON "user"(email);

CREATE TABLE IF NOT EXISTS "session" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_session_user ON "session"(user_id);
CREATE INDEX IF NOT EXISTS idx_session_expires ON "session"(expires_at);

CREATE TABLE IF NOT EXISTS "media" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('photo', 'video')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived', 'trashed')),
  title_es TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_es TEXT NOT NULL,
  description_en TEXT NOT NULL,
  collection_id UUID,
  focal_point_x REAL,
  focal_point_y REAL,
  duration INTEGER,
  width INTEGER,
  height INTEGER,
  original_hash TEXT UNIQUE,
  is_demo BOOLEAN NOT NULL DEFAULT false,
  is_demo_source TEXT,
  demo_manifest_ref TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  published_at TIMESTAMP,
  trashed_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_media_type ON "media"(type);
CREATE INDEX IF NOT EXISTS idx_media_status ON "media"(status);
CREATE INDEX IF NOT EXISTS idx_media_collection ON "media"(collection_id);
CREATE INDEX IF NOT EXISTS idx_media_published ON "media"(published_at);
CREATE INDEX IF NOT EXISTS idx_media_slug ON "media"(slug);

CREATE TABLE IF NOT EXISTS "media_variant" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id UUID NOT NULL REFERENCES "media"(id) ON DELETE CASCADE,
  format TEXT NOT NULL CHECK (format IN ('avif', 'webp', 'jpeg', 'original')),
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  url TEXT NOT NULL,
  size INTEGER NOT NULL,
  quality INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_variant_media ON "media_variant"(media_id);

CREATE TABLE IF NOT EXISTS "collection" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title_es TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_es TEXT NOT NULL,
  description_en TEXT NOT NULL,
  cover_id UUID,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_collection_sort ON "collection"(sort_order);

-- Circular FK constraints (media <-> collection) added after both tables exist
ALTER TABLE "media" ADD CONSTRAINT fk_media_collection FOREIGN KEY (collection_id) REFERENCES "collection"(id);
ALTER TABLE "collection" ADD CONSTRAINT fk_collection_cover FOREIGN KEY (cover_id) REFERENCES "media"(id);

CREATE TABLE IF NOT EXISTS "tag" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name_es TEXT NOT NULL,
  name_en TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "media_tag" (
  media_id UUID NOT NULL REFERENCES "media"(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES "tag"(id) ON DELETE CASCADE,
  PRIMARY KEY (media_id, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_mediatag_media ON "media_tag"(media_id);
CREATE INDEX IF NOT EXISTS idx_mediatag_tag ON "media_tag"(tag_id);

CREATE TABLE IF NOT EXISTS "contact_message" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  consent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "audit_log" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES "user"(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  resource_id UUID,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_action ON "audit_log"(action);
CREATE INDEX IF NOT EXISTS idx_audit_resource ON "audit_log"(resource);
CREATE INDEX IF NOT EXISTS idx_audit_created ON "audit_log"(created_at);

CREATE TABLE IF NOT EXISTS "job" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('process-photo', 'process-video', 'generate-variants', 'generate-sitemap', 'send-contact-email')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  payload JSONB NOT NULL,
  result JSONB,
  error TEXT,
  progress INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  started_at TIMESTAMP,
  finished_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_job_type_status ON "job"(type, status);
CREATE INDEX IF NOT EXISTS idx_job_created ON "job"(created_at);
