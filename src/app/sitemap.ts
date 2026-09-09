import type { MetadataRoute } from 'next';
import { examGuides, levels, resources, textbooks } from '@/data';
import { absoluteSiteUrl } from '@/lib/site';

export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['/', '/plans', '/exams', '/textbooks', '/resources'];
  return [...routes, ...levels.map((item) => `/plans/${item.slug}`), ...examGuides.map((item) => `/exams/${item.slug}`), ...textbooks.map((item) => `/textbooks/${item.slug}`), ...resources.map((item) => `/resources/${item.slug}`)].map((path) => ({ url: absoluteSiteUrl(path), lastModified: new Date('2026-08-13'), changeFrequency: 'monthly', priority: path === '/' ? 1 : 0.7 }));
}
