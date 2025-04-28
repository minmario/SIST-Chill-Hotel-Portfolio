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
  // 최적화 설정
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  reactStrictMode: true,
  // 코드 분할과 캐싱 최적화
  poweredByHeader: false,
  async rewrites() {
    // 모의 API 사용 시 리다이렉트 비활성화
    if (USE_MOCK_API) {
      return [];
    }
    
    // 실제 백엔드 API 사용 시 리다이렉트 활성화
    return [
      {
        source: '/api/:path*',
        // localhost:8080에서 backend:8080으로 변경
        // destination: 'http://localhost:8080/api/:path*',
        destination: 'http://backend:8080/api/:path*',
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
      nextConfig[key] = userConfig[key];
    }
  }
  return nextConfig;
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
          
          // 최적화 설정 강화
          config.optimization = {
            ...config.optimization,
            splitChunks: {
              chunks: 'all',
              minSize: 20000,
              maxSize: 240000,
              cacheGroups: {
                commons: {
                  test: /[\\/]node_modules[\\/]/,
                  name: 'vendors',
                  chunks: 'all',
                  reuseExistingChunk: true,
                },
                // 자주 사용되는 컴포넌트나 유틸리티 분리
                components: {
                  test: /[\\/]components[\\/]/,
                  name: 'components',
                  chunks: 'all',
                  minChunks: 2,
                  reuseExistingChunk: true,
                },
                // 컨텍스트 분리
                contexts: {
                  test: /[\\/]context[\\/]/,
                  name: 'contexts',
                  chunks: 'all',
                  reuseExistingChunk: true,
                },
              },
            },
            runtimeChunk: {
              name: 'runtime',
            },
          };
          
          // usedExports 제거 (cacheUnaffected 충돌 해결)
          
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
          
          // 최적화 설정 강화
          config.optimization = {
            ...config.optimization,
            splitChunks: {
              chunks: 'all',
              minSize: 20000,
              maxSize: 240000,
              cacheGroups: {
                commons: {
                  test: /[\\/]node_modules[\\/]/,
                  name: 'vendors',
                  chunks: 'all',
                  reuseExistingChunk: true,
                },
                // 자주 사용되는 컴포넌트나 유틸리티 분리
                components: {
                  test: /[\\/]components[\\/]/,
                  name: 'components',
                  chunks: 'all',
                  minChunks: 2,
                  reuseExistingChunk: true,
                },
                // 컨텍스트 분리
                contexts: {
                  test: /[\\/]context[\\/]/,
                  name: 'contexts',
                  chunks: 'all',
                  reuseExistingChunk: true,
                },
              },
            },
            runtimeChunk: {
              name: 'runtime',
            },
          };
          
          // usedExports 제거 (cacheUnaffected 충돌 해결)
          
          return config;
        }),
  };
};

export default withBundleAnalyzer(mergeConfig(nextConfig, userConfig?.default));