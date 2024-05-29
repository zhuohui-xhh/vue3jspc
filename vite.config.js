import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
// 如下是默认方式配置
// export default defineConfig({
//   plugins: [vue()],
//   resolve: {
//     alias: {
//       // 配置scr路径别名
//       '@': fileURLToPath(new URL('./src', import.meta.url))
//     }
//   }
// })

// 配置文件中访问环境变量
export default defineConfig(({ command, mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // dev 独有配置
    plugins: [vue()],
    resolve: {
      alias: {
        // 配置scr路径别名
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    // vite 配置 - 添加全局环境变量，可以在js代码中直接访问到
    // 当前功能可以使用-import.meta.env代替
    // define: {
    //   __APP_VERSION__: '3000'
    // },
    server: {
      port: env.VITE_APP_PORT, // 端口:使用的是，环境变量中的配置
      https: false, // 是否开启 https
      hmr: true // 是否开启自动刷新
      // open: true // 是否开启自动打开浏览器
    }
  }
})
