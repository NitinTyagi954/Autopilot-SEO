export interface Site {
  id: string;
  name: string;
  slug: string;
  domain: string;
  description: string;
  posts_count?: number;
  created_at: string;
  updated_at: string;
}

export type PostStatus = 'draft' | 'published' | 'archived';

export interface Category {
  id: string;
  site: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  site: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface Media {
  id: string;
  site?: string | null;
  file?: string | null;
  url?: string;
  file_url?: string;
  filename: string;
  mime_type: string;
  file_size: number;
  alt_text?: string;
  storage_provider: 'local' | 's3' | 'r2';
  created_at: string;
  updated_at: string;
}

export interface PostSEO {
  id?: string;
  post?: string;
  focus_keyword: string;
  seo_title: string;
  meta_description: string;
  canonical_url: string;
  robots_index: boolean;
  robots_follow: boolean;
  og_title: string;
  og_description: string;
  og_image: string;
  created_at?: string;
  updated_at?: string;
}

export interface Post {
  id: string;
  site: string;
  site_name?: string;
  title: string;
  slug: string;
  content: any; // TipTap JSON
  content_html?: string;
  excerpt?: string;
  status: PostStatus;
  author: string;
  featured_image?: string | null;
  featured_image_detail?: Media | null;
  category?: string | null;
  category_detail?: Category | null;
  tags?: string[];
  tags_detail?: Tag[];
  seo?: PostSEO | null;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
