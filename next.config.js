/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  // assetPrefix: './',
  reactStrictMode: true,
  images: {
    loader: 'akamai',
     path: ' ',
    domains: [
      'ipfs.infura.io',
      'statics-polygon-lens-staging.s3.eu-west-1.amazonaws.com',
      'lens.infura-ipfs.io',
      '4everland.io',
      'ik.imagekit.io'
    ],
  },
}

module.exports = nextConfig
