/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    reactStrictMode: true,
    env: {
        NEXT_PUBLIC_API_BASE: 'http://localhost:5248'
    }
};

export default nextConfig;
