/*
 * 劫持axios的default config、pre-request、pre-response
 */
import axios from 'axios'

// 配置默认的超时和URL
axios.defaults.timeout = 5000
axios.defaults.baseURL = 'https://app.airoubo.com/roubo/rouboapi/'
// axios.defaults.withCredentials = true
// axios.defaults.headers
// 劫持pre-request
axios.interceptors.request.use(
  config => {
    // 如果有需求可以默认装载信息到request请求头中
    // config.headers.Authorization = xxxxx
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// 劫持pre-response
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      // 可以根据特定返回结果，统一将页面跳到特定页面, 或其他统一处理
      // switch (error.request.status) {
      // }
    }
    return Promise.reject(error.response.data)
  }
)

export default axios
