import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Supabase URL and publishable key are safe for browser use; never expose
  // SUPABASE_SECRET_KEY here.
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY,
  },
};
export default nextConfig;
