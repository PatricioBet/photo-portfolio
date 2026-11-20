import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  real,
  boolean,
  jsonb,
  primaryKey,
  pgEnum,
} from "drizzle-orm/pg-core";
import { index } from "drizzle-orm/pg-core";

// ── Enums ──────────────────────────────────────────────────────────

export const mediaTypeEnum = pgEnum("media_type", ["photo", "video"]);
export const mediaStatusEnum = pgEnum("media_status", [
  "draft",
  "published",
  "archived",
  "trashed",
]);
export const variantFormatEnum = pgEnum("variant_format", [
  "avif",
  "webp",
  "jpeg",
  "original",
]);
export const jobTypeEnum = pgEnum("job_type", [
  "process-photo",
  "process-video",
  "generate-variants",
  "generate-sitemap",
  "send-contact-email",
]);
export const jobStatusEnum = pgEnum("job_status", [
  "pending",
  "processing",
  "completed",
  "failed",
]);

// ── Tables ─────────────────────────────────────────────────────────

export const user = pgTable(
  "user",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull().unique(),
    passkeyHandle: text("passkey_handle"),
    passkeyPublicKey: text("passkey_public_key"),
    passkeyCounter: integer("passkey_counter").default(0),
    role: text("role").notNull().default("admin"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }
);
export const idxUserEmail = index("idx_user_email").on(user.email);

export const session = pgTable(
  "session",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  }
);
export const idxSessionUser = index("idx_session_user").on(session.userId);
export const idxSessionExpires = index("idx_session_expires").on(session.expiresAt);

// @ts-expect-error Circular reference between collection and media tables
export const collection = pgTable("collection", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  titleEs: text("title_es").notNull(),
  titleEn: text("title_en").notNull(),
  descriptionEs: text("description_es").notNull(),
  descriptionEn: text("description_en").notNull(),
  // @ts-expect-error Callback function implicitly has return type any
  coverId: uuid("cover_id").references(() => media.id),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}) as const;

export const idxCollectionSort = index("idx_collection_sort").on(
  collection.sortOrder
);

// @ts-expect-error Circular reference between collection and media tables
export const media = pgTable("media", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  type: mediaTypeEnum("type").notNull(),
  status: mediaStatusEnum("status").notNull().default("draft"),
  titleEs: text("title_es").notNull(),
  titleEn: text("title_en").notNull(),
  descriptionEs: text("description_es").notNull(),
  descriptionEn: text("description_en").notNull(),
  // @ts-expect-error Callback function implicitly has return type any
  collectionId: uuid("collection_id").references(() => collection.id),
  focalPointX: real("focal_point_x"),
  focalPointY: real("focal_point_y"),
  duration: integer("duration"),
  width: integer("width"),
  height: integer("height"),
  originalHash: text("original_hash").unique(),
  isDemo: boolean("is_demo").notNull().default(false),
  isDemoSource: text("is_demo_source"),
  demoManifestRef: text("demo_manifest_ref"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  publishedAt: timestamp("published_at"),
  trashedAt: timestamp("trashed_at"),
}) as const;

export const idxMediaType = index("idx_media_type").on(media.type);
export const idxMediaStatus = index("idx_media_status").on(media.status);
export const idxMediaCollection = index("idx_media_collection").on(
  media.collectionId
);
export const idxMediaPublished = index("idx_media_published").on(media.publishedAt);
export const idxMediaSlug = index("idx_media_slug").on(media.slug);

export const mediaVariant = pgTable(
  "media_variant",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    mediaId: uuid("media_id")
      .notNull()
      .references(() => media.id, { onDelete: "cascade" }),
    format: variantFormatEnum("format").notNull(),
    width: integer("width").notNull(),
    height: integer("height").notNull(),
    url: text("url").notNull(),
    size: integer("size").notNull(),
    quality: integer("quality").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  }
);
export const idxVariantMedia = index("idx_variant_media").on(mediaVariant.mediaId);

export const tag = pgTable(
  "tag",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull().unique(),
    nameEs: text("name_es").notNull(),
    nameEn: text("name_en").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  }
);

export const mediaTag = pgTable(
  "media_tag",
  {
    mediaId: uuid("media_id")
      .notNull()
      .references(() => media.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tag.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.mediaId, t.tagId] })]
);
export const idxMediaTagMedia = index("idx_mediatag_media").on(mediaTag.mediaId);
export const idxMediaTagTag = index("idx_mediatag_tag").on(mediaTag.tagId);

export const contactMessage = pgTable(
  "contact_message",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    message: text("message").notNull(),
    consent: boolean("consent").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  }
);

export const auditLog = pgTable(
  "audit_log",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => user.id, { onDelete: "set null" }),
    action: text("action").notNull(),
    resource: text("resource").notNull(),
    resourceId: uuid("resource_id"),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  }
);
export const idxAuditAction = index("idx_audit_action").on(auditLog.action);
export const idxAuditResource = index("idx_audit_resource").on(auditLog.resource);
export const idxAuditCreated = index("idx_audit_created").on(auditLog.createdAt);

export const job = pgTable(
  "job",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    type: jobTypeEnum("type").notNull(),
    status: jobStatusEnum("status").notNull().default("pending"),
    payload: jsonb("payload").notNull(),
    result: jsonb("result"),
    error: text("error"),
    progress: integer("progress").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    startedAt: timestamp("started_at"),
    finishedAt: timestamp("finished_at"),
  }
);
export const idxJobTypeStatus = index("idx_job_type_status").on(job.type, job.status);
export const idxJobCreated = index("idx_job_created").on(job.createdAt);

// ── Exports ────────────────────────────────────────────────────────

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type Session = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;
export type Collection = typeof collection.$inferSelect;
export type NewCollection = typeof collection.$inferInsert;
export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;
export type MediaVariant = typeof mediaVariant.$inferSelect;
export type NewMediaVariant = typeof mediaVariant.$inferInsert;
export type Tag = typeof tag.$inferSelect;
export type NewTag = typeof tag.$inferInsert;
export type MediaTag = typeof mediaTag.$inferSelect;
export type NewMediaTag = typeof mediaTag.$inferInsert;
export type ContactMessage = typeof contactMessage.$inferSelect;
export type NewContactMessage = typeof contactMessage.$inferInsert;
export type AuditLog = typeof auditLog.$inferSelect;
export type NewAuditLog = typeof auditLog.$inferInsert;
export type Job = typeof job.$inferSelect;
export type NewJob = typeof job.$inferInsert;
