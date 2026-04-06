import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient({
    supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });

  const { data: packages } = await supabase
    .from('package')
    .select('slug, flat_type, updated_at')
    .eq('status', 'active')
    .eq('package_type', 'bto')
    .is('deleted_at', null)
    .not('slug', 'is', null);

  const { data: firms } = await supabase
    .from('id_firm')
    .select('slug, updated_at')
    .not('slug', 'is', null);

  const packageUrls = (packages ?? []).map((p) => ({
    url: `https://www.btopackage.sg/packages/${p.flat_type}/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const firmUrls = (firms ?? []).map((f) => ({
    url: `https://www.btopackage.sg/firms/${f.slug}`,
    lastModified: f.updated_at ? new Date(f.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    { url: 'https://www.btopackage.sg', changeFrequency: 'daily', priority: 1.0 },
    { url: 'https://www.btopackage.sg/price-guide', changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://www.btopackage.sg/directory', changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://www.btopackage.sg/about', changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://www.btopackage.sg/submit', changeFrequency: 'monthly', priority: 0.6 },
    ...packageUrls,
    ...firmUrls,
  ];
}
