// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       { protocol: 'https', hostname: 'images.unsplash.com' },
//       { protocol: 'https', hostname: 'res.cloudinary.com' },
//       { protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '/**' },
//       { protocol: 'https', hostname: 'placehold.co' }
//     ],
//   },
//   async rewrites() {
//     return [
//       {
//         source: '/api/admin/:path*', 
//         destination: 'http://localhost:4000/api/v1/admin/:path*', 
//       },
//       {
//         // Also send the seed route
//         source: '/api/seed',
//         destination: 'http://localhost:4000/api/v1/seed',
//       },
//       {
//         source: '/api/admin/finance',
//         destination: 'http://localhost:4000/api/v1/admin/finance',
//       },
//       {
//         source: '/api/admin/profile',
//         destination: 'http://localhost:4000/api/v1/admin/profile',
//       },
//       {
//       source: '/api/my-orders',
//       destination: 'http://localhost:4000/api/v1/my-orders',
//     },
//     {
//       source: '/api/order/new',
//       destination: 'http://localhost:4000/api/v1/order/new',
//     },
//     ];
//   },
// };

// export default nextConfig;




/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com'  },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '/**' },
      { protocol: 'https', hostname: 'placehold.co' }
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },



  async rewrites() {
    // 1. Define the API URL
    // If 'NEXT_PUBLIC_API_URL' exists (Live), use it. Otherwise, use localhost (Dev).
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    return [
      {
        source: '/api/admin/:path*', 
        destination: `${API_URL}/api/v1/admin/:path*`, 
      },
      {
        source: '/api/seed',
        destination: `${API_URL}/api/v1/seed`,
      },
      {
        source: '/api/admin/finance',
        destination: `${API_URL}/api/v1/admin/finance`,
      },
      {
        source: '/api/admin/profile',
        destination: `${API_URL}/api/v1/admin/profile`,
      },
      {
        source: '/api/my-orders',
        destination: `${API_URL}/api/v1/my-orders`,
      },
      {
        source: '/api/order/new',
        destination: `${API_URL}/api/v1/order/new`,
      },
    ];
  },
};

export default nextConfig;