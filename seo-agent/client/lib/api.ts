import { Site, Post, Category, Tag, Media, PostSEO, PaginatedResponse } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    let errorDetail = `Request failed: ${res.status} ${res.statusText}`;
    try {
      const errorJson = await res.json();
      errorDetail = errorJson.detail || JSON.stringify(errorJson);
    } catch {
      // ignore
    }
    throw new Error(errorDetail);
  }

  return res.json();
}

export const api = {
  // Sites
  sites: {
    list: () => fetchJson<PaginatedResponse<Site> | Site[]>(`${API_BASE}/sites/`),
    get: (id: string) => fetchJson<Site>(`${API_BASE}/sites/${id}/`),
    create: (data: Partial<Site>) => fetchJson<Site>(`${API_BASE}/sites/`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: string, data: Partial<Site>) => fetchJson<Site>(`${API_BASE}/sites/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
    delete: (id: string) => fetch(`${API_BASE}/sites/${id}/`, { method: 'DELETE' }),
  },

  // Posts
  posts: {
    list: (params?: { site?: string; status?: string; search?: string }) => {
      const q = new URLSearchParams();
      if (params?.site) q.append('site', params.site);
      if (params?.status) q.append('status', params.status);
      if (params?.search) q.append('search', params.search);
      return fetchJson<PaginatedResponse<Post> | Post[]>(`${API_BASE}/posts/?${q.toString()}`);
    },
    get: (id: string) => fetchJson<Post>(`${API_BASE}/posts/${id}/`),
    create: (data: Partial<Post>) => fetchJson<Post>(`${API_BASE}/posts/`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: string, data: Partial<Post>) => fetchJson<Post>(`${API_BASE}/posts/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
    delete: (id: string) => fetch(`${API_BASE}/posts/${id}/`, { method: 'DELETE' }),
    // Public post by slug (draft posts return 404)
    getPublic: (slug: string, site?: string) => {
      const q = site ? `?site=${encodeURIComponent(site)}` : '';
      return fetchJson<Post>(`${API_BASE}/posts/public/${slug}/${q}`);
    },
    listPublic: (site?: string) => {
      const q = site ? `?site=${encodeURIComponent(site)}` : '';
      return fetchJson<PaginatedResponse<Post> | Post[]>(`${API_BASE}/posts/public/${q}`);
    },
  },

  // Categories
  categories: {
    list: (siteId?: string) => {
      const q = siteId ? `?site=${siteId}` : '';
      return fetchJson<PaginatedResponse<Category> | Category[]>(`${API_BASE}/categories/${q}`);
    },
    create: (data: Partial<Category>) => fetchJson<Category>(`${API_BASE}/categories/`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  },

  // Tags
  tags: {
    list: (siteId?: string) => {
      const q = siteId ? `?site=${siteId}` : '';
      return fetchJson<PaginatedResponse<Tag> | Tag[]>(`${API_BASE}/tags/${q}`);
    },
    create: (data: Partial<Tag>) => fetchJson<Tag>(`${API_BASE}/tags/`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  },

  // Media
  media: {
    list: (siteId?: string) => {
      const q = siteId ? `?site=${siteId}` : '';
      return fetchJson<PaginatedResponse<Media> | Media[]>(`${API_BASE}/media/${q}`);
    },
    create: (data: Partial<Media>) => fetchJson<Media>(`${API_BASE}/media/`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  },

  // Post SEO
  seo: {
    get: (postId: string) => fetchJson<PostSEO>(`${API_BASE}/posts/${postId}/seo/`),
    update: (postId: string, data: Partial<PostSEO>) => fetchJson<PostSEO>(`${API_BASE}/posts/${postId}/seo/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  },
};
