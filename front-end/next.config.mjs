import fs from 'fs';
import path from 'path';

let userConfig = {};
const userConfigPath = path.resolve('./v0-user-next.config.js'); // 또는 .mjs

if (fs.existsSync(userConfigPath)) {
  const mod = await import(userConfigPath);
  userConfig = mod.default || {};
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
    ];
  },
};

function mergeConfig(base, user) {
  for (const key in user) {
    if (typeof base[key] === 'object' && !Array.isArray(base[key])) {
      base[key] = {
        ...base[key],
        ...user[key],
      };
    } else {
      base[key] = user[key];
    }
  }
  return base;
}

export default mergeConfig(nextConfig, userConfig);