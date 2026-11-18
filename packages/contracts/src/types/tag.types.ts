/**
 * Full tag entity.
 */
export interface TagRecord {
  id: string;
  slug: string;
  name_es: string;
  name_en: string;
  created_at: Date;
}

/**
 * Tag with media count.
 */
export interface TagWithCount extends TagRecord {
  media_count: number;
}

/**
 * Paginated tag list response.
 */
export interface TagListResponse {
  items: TagWithCount[];
  total: number;
}
