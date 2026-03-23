import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

type CreateServerClientOptions = {
  supabaseKey?: string;
};

export async function createServerClient(options: CreateServerClientOptions = {}) {
  const cookieStore = await cookies();

  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    options.supabaseKey ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options: cookieOptions }) =>
              cookieStore.set(name, value, cookieOptions),
            );
          } catch {
            // The `setAll` method can be called from a Server Component.
            // This can be ignored if middleware refreshes user sessions.
          }
        },
      },
    },
  );
}

export { createServerClient as createClient };
