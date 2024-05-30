import axios from 'axios'
import Nprogress from 'nprogress' //Nprogress是一个比较简单的页面加载用进度条
import 'nprogress/nprogress.css' // 导入样式，否则看不到效果
import { ElMessage } from 'element-plus'
//创建axios实例
let request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000
})
//请求拦截器
// 添加请求拦截器
request.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    Nprogress.start()
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

//响应拦截器
request.interceptors.response.use(
  (response) => {
    Nprogress.done() // 关闭进度条
    return response.data
  },
  (error) => {
    Nprogress.done() // 关闭进度条
    //处理网络错误
    let msg = ''
    let status = error.response.status
    switch (status) {
      case 401:
        msg = 'token过期'
        break
      case 403:
        msg = '无权访问'
        break
      case 404:
        msg = '请求地址错误'
        break
      case 500:
        msg = '服务器出现问题'
        break
      default:
        msg = '无网络'
    }
    ElMessage({
      type: 'error',
      message: msg
    })
    return Promise.reject(error)
  }
)
export default request
