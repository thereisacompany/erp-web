import { defineConfig, loadEnv } from 'vite'
import Vue from '@vitejs/plugin-vue'
import path from 'path'
// Ant Design Vue
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '') // 环境变量
  console.log('env.VITE_APP_ENV:', env.VITE_APP_ENV)
  return {
    plugins: [
      Vue(),
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: false // css in js
          })
        ]
      }),
    ],
    server: {
      port: 8080,
      proxy: {
        '/jshERP-boot': {
          target: env.VITE_APP_ENV === 'production' ? 'https://ep.jsl.tw/' : 'https://dev-ep.jsl.tw/',
          ws: false,
          changeOrigin: true
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src') // @ alias
      }
    },
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV) // 环境变量
    },
    css: {
      // CSS 配置
      extract: true, // 提取 CSS 到单独的文件
    },
    build: {
      // 生产环境下的其他设置
      sourcemap: env.VITE_APP_ENV === 'production' ? 'inline' : 'eval', // 配置 source map
    }
  }
})
