<<<<<<< HEAD
=======
let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
>>>>>>> graz1e
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
<<<<<<< HEAD
    ]
  },
};

let userConfig = undefined;
try {
  userConfig = await import('./v0-user-next.config');
} catch (e) {
  // ignore error
}

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return nextConfig;
=======
    ];
  },
}

mergeConfig(nextConfig, userConfig)

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return
>>>>>>> graz1e
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
<<<<<<< HEAD
      };
    } else {
      nextConfig[key] = userConfig[key];
    }
  }
  return nextConfig;
}

export default mergeConfig(nextConfig, userConfig?.default);
=======
      }
    } else {
      nextConfig[key] = userConfig[key]
    }
  }
}

export default nextConfig
>>>>>>> graz1e
