/** @type {import('next').NextConfig} */
const nextConfig = {
  // Product/category imagery is now bundled locally under /public/images
  // (see lib/images.ts), so no remotePatterns are needed for an external
  // image host. Add one back here if you switch to a CDN in production.
};

module.exports = nextConfig;
