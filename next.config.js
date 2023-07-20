/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  assetPrefix: './',
  reactStrictMode: true,
  images: {
    loader: 'akamai',
    domains: ['ik.imagekit.io'], // Add 'ik.imagekit.io' to the array
    path: ' ',
  },
  domains: [
      'ipfs.infura.io',
      'statics-polygon-lens-staging.s3.eu-west-1.amazonaws.com',
      'lens.infura-ipfs.io',
      '4everland.io',
      ""
    ],
}

module.exports = nextConfig
