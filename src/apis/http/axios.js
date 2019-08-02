import axios from 'axios'
import bus from '../bus'

// import md5 from 'js-md5'
let formatTime = (dateTime) => {
  let date = new Date(dateTime)
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hours = date.getHours()
  let minutes = date.getMinutes()
  let seconds = date.getSeconds()
  function s (t) {
    return t < 10 ? '0' + t : t
  }
  return year + '-' + s(month) + '-' + s(day) + ' ' + s(hours) + ':' + s(minutes) + ':' + s(seconds)
}

// 参数
const formatParams = (acParams = {}) => {
  acParams.uaTime = formatTime(new Date().getTime())
  return acParams
}

let getCookie = (name) => {
  let arr = null
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  if (document.cookie.match(reg)) {
    arr = document.cookie.match(reg)
    return unescape(arr[2])
  } else {
    return null
  }
}

// 请求头
const formatHeaders = (acHeaders) => {
  let headers = {}
  headers['token'] = getCookie('token') || ''
  // headers['Content-type'] = 'application/x-www-form-urlencoded'
  if (acHeaders) {
    for (let i in acHeaders) {
      headers[i] = acHeaders[i]
    }
  }
  return headers
}

const http = ({url, headers, params, method, hostType}) => {
  let prefix = ''
  let protocol = location.protocol + '//' || 'https://'
  if (process.env.NODE_ENV === 'development') { // 开发环境接口地址
    // 以下根据实际开发项目的时候做出修改
    switch (hostType) {
      case 'otc':
        prefix = '/otc-api' // 场外
        break
      default:
        prefix = '/vue-api' // 公共地址
    }
  } else if (process.env.NODE_ENV === 'production') { // 生产环境接口地址
    if (window.HOST_API) {
      // 以下名称根据实际开发项目的时候 做出修改
      let EX_API = protocol + window.HOST_API.ex_api
      let OTC_API = protocol + window.HOST_API.otc_api
      if (window.HOST_API.ex_api && window.HOST_API.ex_api.indexOf('http') !== -1) {
        EX_API = protocol + window.HOST_API.ex_api.split('//')[1]
      }
      if (window.HOST_API.otc_api && window.HOST_API.otc_api.indexOf('http') !== -1) {
        OTC_API = protocol + window.HOST_API.otc_api.split('//')[1]
      }
      switch (hostType) {
        case 'otc':
          prefix = OTC_API
          break
        default: prefix = EX_API
      }
    }
  }
  return new Promise((resolve, reject) => {
    axios({
      url: `${prefix}/${url}`,
      headers: formatHeaders(headers),
      data: formatParams(params),
      method: method || 'post'
    }).then((data) => {
      // 下面的这个判断 依据实际情况来，如果不需要可以删除
      if (data.data.code === '10002') {
        bus.$emit('loginOut')
        localStorage.removeItem('token')
      }
      resolve(data.data)
    }).catch((err) => {
      reject(err)
      throw new Error(`Error:${err}`)
    })
  })
}

export default http
