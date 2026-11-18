/**
 * Full collection entity.
 */
export interface CollectionRecord {
  id: string;
  slug: string;
  title_es: string;
  title_en: string;
  description_es: string;
  description_en: string;
  cover_id: string | null;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * Paginated collection list response.
 */
export interface CollectionListResponse {
  items: CollectionRecord[];
  total: number;
}
