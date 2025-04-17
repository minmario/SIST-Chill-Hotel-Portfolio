import fs from 'fs';
import path from 'path';

let userConfig = {};
const userConfigPath = path.resolve('./v0-user-next.config.js'); // 또는 .mjs

if (fs.existsSync(userConfigPath)) {
  const mod = await import(userConfigPath);
  userConfig = mod.default || {};
}

// 개발 모드에서 모의 API 사용 여부 (true: 모의 API 사용, false: 실제 백엔드 API 사용)
const USE_MOCK_API = false;

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
    // 모의 API 사용 시 리다이렉트 비활성화
    if (USE_MOCK_API) {
      return [];
    }
    
    // 실제 백엔드 API 사용 시 리다이렉트 활성화
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
    ];
  },
};

mergeConfig(nextConfig, userConfig)

function mergeConfig(nextConfig, userConfig) {
  if (!nextConfig) nextConfig = {};
  if (!userConfig) {
    return nextConfig;
  }
  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      };
    } else {
      base[key] = user[key];
    }
  }
  return base;
}

import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const withBundleAnalyzer = (nextConfig = {}) => {
  return {
    ...nextConfig,
    webpack: (typeof nextConfig.webpack === 'function'
      ? (config, options) => {
          config = nextConfig.webpack(config, options);
          if (process.env.ANALYZE === 'true') {
            config.plugins.push(
              new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                reportFilename: './analyze.html',
                openAnalyzer: false,
              })
            );
          }
          config.optimization = {
            ...config.optimization,
            splitChunks: {
              chunks: 'all',
              minSize: 20000,
              maxSize: 240000,
            },
          };
          return config;
        }
      : (config, options) => {
          if (process.env.ANALYZE === 'true') {
            config.plugins.push(
              new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                reportFilename: './analyze.html',
                openAnalyzer: false,
              })
            );
          }
          config.optimization = {
            ...config.optimization,
            splitChunks: {
              chunks: 'all',
              minSize: 20000,
              maxSize: 240000,
            },
          };
          return config;
        }),
  };
};

export default withBundleAnalyzer(mergeConfig(nextConfig, userConfig?.default));
