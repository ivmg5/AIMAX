/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        DATABASE_URL: process.env.DATABASE_URL,
        AUTH_SECRET: process.env.AUTH_SECRET,
        AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
        AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        OPENAI_ORGANIZATION_ID: process.env.OPENAI_ORGANIZATION_ID,
        OPENAI_PROJECT_ID: process.env.OPENAI_PROJECT_ID
    }
};

export default nextConfig;
