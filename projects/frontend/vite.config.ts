import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(), // 按需引入 vue 组件
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false // css in js
        })
      ]
    })
  ],
  resolve: {
    alias: {
      // cesium: 'cesium/Source',
      // @ 替代为 src
      '@': resolve(__dirname, 'src'),
      // @component 替代为 src/component
      '@components': resolve(__dirname, 'src/components')
    }
  },
  server: {
    host: '0.0.0.0', // 服务器主机名，如果允许外部访问，可设置为"0.0.0.0"
    open: true,
    port: 6060,
    proxy: {
      '/api': {
        target: '127.0.0.1:6050'
      }
    }
  }
  // // vite 默认使用的是 esbuild 压缩，配置生产环境移除 console
  // esbuild: {
  //   drop: ['console', 'debugger']
  // }
})
