import dotenv from "dotenv";

dotenv.config();

export default {
    NEXT_PUBLIC_SUPABASE_PROJECT_URL: process.env
        .NEXT_PUBLIC_SUPABASE_PROJECT_URL!,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
    SCRAPYBARA_API_KEY: process.env.SCRAPYBARA_API_KEY!,
    GROQ_API_KEY: process.env.GROQ_API_KEY!,
};
