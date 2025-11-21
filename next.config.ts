import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  turbopack: {
    rules: {
      '**/node_modules/playwright/.local-browsers/**': {
        loaders: ['ignore'] // 告诉 Turbopack 忽略这些文件
      }
    }
  }
}

export default nextConfig
