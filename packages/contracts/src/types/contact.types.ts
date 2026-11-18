/**
 * Contact message entity.
 */
export interface ContactMessageRecord {
  id: string;
  name: string;
  email: string;
  message: string;
  consent: boolean;
  created_at: Date;
}

/**
 * Contact form submission DTO.
 */
export interface ContactSubmission {
  name: string;
  email: string;
  message: string;
  consent: boolean;
}
