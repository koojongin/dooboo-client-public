export default (phase, {defaultConfig}) => {
    /**
     * @type {import('next').NextConfig}
     */
    const nextConfig = {
        /* config options here */
        distDir: process.env.BUILD_DIR || '.next',
        reactStrictMode: false,
        typescript: {
            ignoreBuildErrors: true
        }
    }
    return nextConfig
}