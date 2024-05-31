export default (phase, {defaultConfig}) => {
    /**
     * @type {import('next').NextConfig}
     */
    const nextConfig = {
        /* config options here */
        distDir: process.env.BUILD_DIR || '.next',
        reactStrictMode: false,
        typescript: {
            ignoreBuildErrors: true,
        },
        eslint: {
            // Warning: This allows production builds to successfully complete even if
            // your project has ESLint errors.
            ignoreDuringBuilds: true,
        },
    }
    return nextConfig
}