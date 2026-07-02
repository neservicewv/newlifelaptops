/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Proxy images from the original GitHub location
      {
        source: '/images/:path*',
        destination: 'https://raw.githubusercontent.com/neservicewv/newlifelaptops/main/images/:path*',
      },
      // Website static pages
      { source: '/',         destination: '/website/index.html' },
      { source: '/about',    destination: '/website/about.html' },
      { source: '/about/',   destination: '/website/about.html' },
      { source: '/shop',     destination: '/website/shop.html' },
      { source: '/shop/',    destination: '/website/shop.html' },
      { source: '/contact',  destination: '/website/contact.html' },
      { source: '/contact/', destination: '/website/contact.html' },
      { source: '/terms',    destination: '/website/terms.html' },
      { source: '/terms/',   destination: '/website/terms.html' },
      { source: '/privacy',  destination: '/website/privacy.html' },
      { source: '/privacy/', destination: '/website/privacy.html' },
      { source: '/refund',   destination: '/website/refund.html' },
      { source: '/refund/',  destination: '/website/refund.html' },
    ];
  },
};

module.exports = nextConfig;
