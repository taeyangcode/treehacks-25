import env from "@/utils/env/env";
import { createClient } from "@supabase/supabase-js";

const { NEXT_PUBLIC_SUPABASE_PROJECT_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } = env;

console.log({
    NEXT_PUBLIC_SUPABASE_PROJECT_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY,
});

export default createClient(
    NEXT_PUBLIC_SUPABASE_PROJECT_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
