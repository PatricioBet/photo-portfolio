export const mockMedia: any[] = [
  {
    id: "test-media-001",
    slug: "test-photo",
    type: "photo" as const,
    status: "published" as const,
    titleEs: "Foto de prueba",
    titleEn: "Test photo",
    descriptionEs: "Descripción de prueba en español",
    descriptionEn: "Test description in English",
    collectionId: "test-collection-001",
    width: 4000,
    height: 3000,
    publishedAt: new Date("2026-01-15"),
  },
  {
    id: "test-media-002",
    slug: "test-video",
    type: "video" as const,
    status: "published" as const,
    titleEs: "Video de prueba",
    titleEn: "Test video",
    descriptionEs: "Descripción de video de prueba",
    descriptionEn: "Test video description",
    width: 1920,
    height: 1080,
    duration: 120,
    publishedAt: new Date("2026-02-20"),
  },
];

export const mockCollections: any[] = [
  {
    id: "test-collection-001",
    slug: "naturaleza",
    titleEs: "Naturaleza",
    titleEn: "Nature",
    descriptionEs: "Fotografías de naturaleza",
    descriptionEn: "Nature photographs",
    sortOrder: 0,
  },
];

export const mockTags: any[] = [
  {
    id: "test-tag-001",
    slug: "paisaje",
    nameEs: "Paisaje",
    nameEn: "Landscape",
  },
];

export const mockJobs: any[] = [
  {
    id: "test-job-001",
    type: "process-photo",
    status: "completed",
    progress: 100,
    createdAt: new Date(),
  },
];

export const mockAuditLog: any[] = [
  {
    id: "test-audit-001",
    action: "media.publish",
    resource: "media",
    resourceId: "test-media-001",
    createdAt: new Date(),
  },
];
