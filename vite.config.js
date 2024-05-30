import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// 配置文件中访问环境变量
export default defineConfig(({ command, mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // dev 独有配置
    plugins: [
      vue(),
      // 自动导入组件
      AutoImport({
        //预设名称或自定义导入映射: 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        imports: [
          //这里相关的模块是可以自动更新到.eslintrc-auto-import.json，第三方的好像不行
          'vue',
          'vue-router',
          // 详细配置
          {
            // '@vueuse/core': [
            //   // named imports
            //   'useMouse', // import { useMouse } from '@vueuse/core',
            //   // alias
            //   ['useFetch', 'useMyFetch'] // import { useFetch as useMyFetch } from '@vueuse/core',
            // ],
            axios: [
              // default imports
              ['default', 'axios'] // import { default as axios } from 'axios',
            ]
          }
        ],
        // 要自动导入的目录的路径,这里自动导入的是js文件，里面例如 可以
        // 可以省略这个引入：// import { getDay } from './util/util.js'
        // 直接调用getDay()
        dirs: ['./src/util/**'],

        // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
        resolvers: [ElementPlusResolver()],
        // dts: './auto-import.d.ts', // 输出一个auto-imports.d.ts他的作用就是解决ts找不到变量的报错
        // 兼容eslintrc规则对自动导入变量未定义的错误提示
        eslintrc: {
          enabled: true, // 默认false, true启用。生成一次就可以，避免每次工程启动都生成
          filepath: './.eslintrc-auto-import.json', // 生成json文件
          globalsPropValue: true
        }
      }),
      // 自动注册组件
      Components({
        resolvers: [
          // Auto register Element Plus components
          // 自动导入 Element Plus 组件
          ElementPlusResolver(),
          // Auto register icon components
          // 自动注册图标组件
          IconsResolver({
            prefix: 'i', //<!-- i 是修改的路径-ep是图标集合-search是图标名称 -->
            enabledCollections: ['ep']
          })
        ],
        // dirs:这里引入并注册了组件
        // 要自动导入的目录的路径 :这里的默认值也是：'./src/components'
        dirs: ['./src/components']
      }),
      Icons({
        autoInstall: true
      })
    ],
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
