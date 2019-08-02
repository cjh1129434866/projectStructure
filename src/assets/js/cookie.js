
export default {
  install (Vue) {
    Vue.prototype._COOKIE = {
      // set cookie
      setCookie (name, value) {
        var exp = new Date()
        exp.setTime(exp.getTime() + 36500 * 24 * 60 * 60 * 1000)
        let domain = '.' + location.host.split('.')[1] + '.' + location.host.split('.')[2]
        if (location.host.split('.')[3]) {
          document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString() + ';path=/'
        } else if (location.host.split('.')[2]) {
          document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString() + ';domain=' + domain + ';path=/'
        } else {
          document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString() + ';path=/'
        }
      },
      // get cookie
      getCookie (name) {
        let arrd = null
        let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
        if (document.cookie.match(reg)) {
          arrd = document.cookie.match(reg)
          return unescape(arrd[2])
        } else {
          return null
        }
      },
      // ɾemove cookie
      removeCookie (name) {
        let domain = '.' + location.host.split('.')[1] + '.' + location.host.split('.')[2]
        if (location.host.split('.')[3]) {
          document.cookie = name + '="";expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/'
        } else if (location.host.split('.')[2]) {
          document.cookie = name + '="";expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=' + domain + ';path=/'
        } else {
          document.cookie = name + '="";expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/'
          // document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString() + ';path=/'
        }
      }
    }
  }
}
