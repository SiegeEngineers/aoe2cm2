module.exports = {
  env: {
    PUBLIC_URL: ''
  },
  experimental: {
    craCompat: true,
  },
  // Remove this to leverage Next.js' static image handling
  // read more here: https://nextjs.org/docs/api-reference/next/image
  images: {
    disableStaticImages: true
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },
}
