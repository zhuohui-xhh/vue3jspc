import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
// npm i  terser   -D  剔除console.log
// npm i vite-plugin-imagemin -D
import viteImagemin from 'vite-plugin-imagemin'
// npm i vite-plugin-compression -D
import viteCompression from 'vite-plugin-compression'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { viteMockServe } from 'vite-plugin-mock'

// 配置文件中访问环境变量
export default defineConfig(({ command, mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const env = loadEnv(mode, process.cwd(), '')
  const isProduction = mode === 'production'
  return {
    plugins: [
      vue(),
      // 数据模拟
      viteMockServe({
        // default
        mockPath: 'mock',
        localEnabled: command === 'serve'
      }),
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
        dirs: ['./src/util/**', './src/api/**'],

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
      }),
      //代码体积压缩--生成的gizp压缩文件需要nginx配置一个操作才可以正常访问
      viteCompression({
        algorithm: 'gzip',
        threshold: 10240,
        verbose: false,
        // 配置：是否删除源文件，如果是npm run build:test 不删除源文件方便做本地预览npm run preview;
        // 如果是npm run build:pro ;这删除压缩后的源文件，减小包体积，方便做部署；
        deleteOriginFile: isProduction
      }),
      // 图片压缩 https://www.jianshu.com/p/8ce0a7769f6e
      viteImagemin({
        // gif图片压缩
        gifsicle: {
          optimizationLevel: 3, // 选择1到3之间的优化级别
          interlaced: false // 隔行扫描gif进行渐进式渲染
          // colors: 2 // 将每个输出GIF中不同颜色的数量减少到num或更少。数字必须介于2和256之间。
        },
        // png
        optipng: {
          optimizationLevel: 7 // 选择0到7之间的优化级别
        },
        // jpeg
        mozjpeg: {
          quality: 20 // 压缩质量，范围从0(最差)到100(最佳)。
        },
        // png
        pngquant: {
          quality: [0.8, 0.9], // Min和max是介于0(最差)到1(最佳)之间的数字，类似于JPEG。达到或超过最高质量所需的最少量的颜色。如果转换导致质量低于最低质量，图像将不会被保存。
          speed: 4 // 压缩速度，1(强力)到11(最快)
        },
        // svg压缩
        svgo: {
          plugins: [
            {
              name: 'removeViewBox'
            },
            {
              name: 'removeEmptyAttrs',
              active: false
            }
          ]
        }
      })
    ],
    resolve: {
      alias: {
        // 配置scr路径别名
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },

    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/style/variable.scss";'
        }
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
      hmr: true, // 是否开启自动刷新
      open: true, // 是否开启自动打开浏览器
      cors: true, //为开发服务器配置 CORS , 默认启用并允许任何源

      // 反向代理配置
      proxy: {
        // 带选项写法：http://localhost:5173/api/bar
        //        -> http://jsonplaceholder.typicode.com/bar
        '/api': {
          target: 'http://jsonplaceholder.typicode.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },

    //打包配置 默认这里是生产环境运行
    build: {
      //浏览器兼容性  "esnext"|"modules"
      target: 'modules',
      //指定输出路径
      outDir: 'dist',
      //生成静态资源的存放路径
      assetsDir: 'assets',
      //小于此阈值的导入或引用资源将内联为 base64 编码，以避免额外的 http 请求。设置为 0 可以完全禁用此项
      assetsInlineLimit: 4096,
      //启用/禁用 CSS 代码拆分
      cssCodeSplit: true,
      //构建后是否生成 source map 文件
      sourcemap: false,
      //自定义底层的 Rollup 打包配置
      rollupOptions: {
        // 代码分割，配合组件的按需引入
        output: {
          entryFileNames: `assets/[name].[hash].js`,
          chunkFileNames: `assets/[name].[hash].js`,
          assetFileNames: `assets/[name].[hash].[ext]`
        }
      },
      //@rollup/plugin-commonjs 插件的选项
      commonjsOptions: {},
      //构建的库
      // lib: {},
      //当设置为 true，构建后将会生成 manifest.json 文件
      manifest: false,
      // 设置为 false 可以禁用最小化混淆，
      // 或是用来指定使用哪种混淆器
      // boolean | 'terser' | 'esbuild'
      minify: 'terser', //terser 构建后文件体积更小
      //传递给 Terser 的更多 minify 选项。
      terserOptions: {
        //生产环境不要日志，去掉console,debugger
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      //设置为 false 来禁用将构建后的文件写入磁盘
      write: true,
      //默认情况下，若 outDir 在 root 目录下，则 Vite 会在构建时清空该目录。
      emptyOutDir: true,
      //启用/禁用 brotli 压缩大小报告
      // brotliSize: true,
      //chunk 大小警告的限制
      chunkSizeWarningLimit: 500
    }
  }
})
