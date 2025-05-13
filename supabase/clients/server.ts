import { createServerClient as createSupabaseBrowserClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createReadOnlyServerClient() {
    const cookieStore = cookies()
    return createSupabaseBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
            },
        },
    );
}

export function createServerCliente() {
    const cookieStore = cookies();
    return createSupabaseBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({name, value, options}) => 
                        cookieStore.set(name, value, options),
                    );
                }
            },
        },
    );
}
