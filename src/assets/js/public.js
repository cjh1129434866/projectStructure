
// 价格、数量的精度、科学计数法格式化
export default {
  // 汇率计算
  install (Vue) {
    Vue.prototype._P = {
      fixRate: function (price, exrate, market) {
        let lang = localStorage.getItem('lan') || 'en_US'
        // if (lang === 'el_GR') { lang = 'zh_CN' }
        let larate = exrate[lang] || exrate['en_US']
        if (!larate) {
          return '--'
        }
        let pric = larate[market] * price
        if (parseFloat(pric) + '' !== 'NaN') {
          return larate['lang_logo'] + pric.toFixed(larate['coin_precision'])
        } else {
          return '--'
        }
      },
      formatTime: function (dateTime) {
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
      },
      fixD: function (num, precision) {
        // num初始化
        if (num + '' === '0') { return '0.'.padEnd(precision + 2, '0') }
        if (!num) { return '--' }
        let newnum = parseFloat(num) + ''
        if (newnum === 'NaN') { return '--' }
        let fixNum = newnum
        // 科学计数法计算
        if (newnum.toLowerCase().indexOf('e') > -1) {
          let a = newnum.toLowerCase().split('e')
          let b = a[0]
          let c = Math.abs(parseFloat(a[1]))
          let d = ''
          let h = b.length
          let i
          if (a[0].split('.')[1]) {
            b = a[0].split('.')[0] + a[0].split('.')[1]
            h = a[0].split('.')[0].length
          }
          for (i = 0; i < c - h; i++) {
            d = d + '0'
          }
          fixNum = '0.' + d + b
        }
        // 精度格式化
        // precision初始化
        if (precision + '' !== '0' && !precision) { return fixNum }
        if (parseFloat(num) + '' === 'NaN') { return fixNum }
        let fNum = fixNum.split('.')
        if (precision === 0) {
          fixNum = parseInt(fixNum)
        } else if (precision > 0 && fNum[1]) {
          if (fNum[1].length > precision) {
            if (fNum[1].indexOf('999999999') > -1) {
              let s = parseFloat(fixNum).toFixed(precision + 1)
              fixNum = s.slice(0, s.length - 1)
            } else {
              fixNum = fNum[0] + '.' + fNum[1].slice(0, precision)
            }
          } else {
            fixNum = parseFloat(fixNum).toFixed(precision)
          }
        } else {
          fixNum = parseFloat(fixNum).toFixed(precision)
        }
        return fixNum
      },
      // 删除小数点最后面的0
      lastD: function (num) {
        if (!num) return num
        let newNum = num + ''
        let str = newNum.split('.')[1]
        if (!str) return newNum
        function substring (str) {
          let arr = str.split('')
          for (let i = arr.length - 1; i >= 0; i--) {
            if (!arr[i]) return newNum.split('.')[0]
            if (arr[i] === '0') {
              arr.splice(i)
            } else {
              break
            }
          }
          if (!arr.length) return newNum.split('.')[0]
          return newNum.split('.')[0] + '.' + arr.join('')
        }
        return substring(str)
      },
      // 获取url里的参数
      fixUrl (name) {
        let text = location.search.substring(1).split('&')
        let v = null
        for (let i = text.length - 1; i >= 0; i--) {
          let key = text[i].split('=')[0]
          let value = text[i].split('=')[1]
          if (key === name) {
            v = value
            break
          }
        }
        return v
      },
      // 输入框
      fixInput (v, fix) {
        fix = fix || 10 // 精度如果不传 则按10走
        // 操作1
        // 用户行为 直接上来打个.
        // 解决方案 置换成0.
        if (v.charAt(0) === '.') { v = '0' + '.' }
        // 操作2
        // 用户行为 打多个点.
        // 解决方案 保留第二个点以前的数值
        let strArr = [...v].reduce((res, c) => {
          res[c] ? res[c]++ : res[c] = 1
          return res
        }, {})
        if (strArr['.'] === 2) {
          let arr = v.split('.')
          v = arr[0] + '.' + arr[1]
        }
        // 操作3
        // 用户行为 小数点后输入超过该币种精度限制
        // 解决方案 保留该精度之前的数值
        if (v.indexOf('.') !== -1) {
          let integer = v.split('.')[0] // 整数
          let decimal = v.split('.')[1] // 小数
          if (decimal.length > fix) {
            decimal = decimal.substring(0, fix)
            v = integer + '.' + decimal
          }
        }
        // 操作4
        // 用户行为 转成汉语拼音后可输入汉字字母等字符
        // 解决方案 干掉写入的文字
        for (let c in strArr) {
          if ('01234567890.'.indexOf(c) === -1) {
            v = v.split(c)[0] + (v.split(c)[1] || '')
          }
        }
        /*
        * 操作5
        * 用户行为 输入总长度超过18位 包括.
        * 解决方案 截取前18位
        * */
        if (v.length > 18) {
          v = v.substring(0, 18)
        }
        return v
      },
      fixDUp: function (num, precision) { // 只入不舍
        // num初始化
        if (num + '' === '0') { return '0.'.padEnd(precision + 2, '0') }
        if (!num) { return '--' }
        let newnum = parseFloat(num) + ''
        if (newnum === 'NaN') { return '--' }
        let fixNum = newnum
        // 科学计数法计算
        if (newnum.toLowerCase().indexOf('e') > -1) {
          let a = newnum.toLowerCase().split('e')
          let b = a[0]
          let c = Math.abs(parseFloat(a[1]))
          let d = ''
          let h = b.length
          let i
          if (a[0].split('.')[1]) {
            b = a[0].split('.')[0] + a[0].split('.')[1]
            h = a[0].split('.')[0].length
          }
          for (i = 0; i < c - h; i++) {
            d = d + '0'
          }
          fixNum = '0.' + d + b
        }
        // 精度格式化
        // precision初始化
        if (precision + '' !== '0' && !precision) { return fixNum }
        if (parseFloat(num) + '' === 'NaN') { return fixNum }
        let fNum = fixNum.split('.')
        if (precision === 0) {
          fixNum = parseInt(fixNum)
        } else if (precision > 0 && fNum[1]) {
          if (fNum[1].length > precision) {
            if (fNum[1].indexOf('999999999') > -1) {
              let s = parseFloat(fixNum).toFixed(precision + 1)
              fixNum = s.slice(0, s.length - 1)
            } else {
              fixNum = fNum[0] + '.' + fNum[1].slice(0, precision)
            }
          } else {
            fixNum = parseFloat(fixNum).toFixed(precision)
          }
        } else {
          fixNum = parseFloat(fixNum).toFixed(precision)
        }
        if (String(num).split('.')[1] && Number(String(num).split('.')[1]) !== 0 && String(num).split('.')[1].length > precision) {
          fixNum = (Number(fixNum) + Number('0.'.padEnd(precision + 1, '0') + '1')).toFixed(precision)
        }
        return fixNum
      },
      sortByKey (array, key) { // 排序
        return array.sort((a, b) => {
          let x = a[key]
          let y = b[key]
          return ((x < y) ? -1 : ((x > y) ? 1 : 0)) // 升序
        })
      },
      copyObject (obj, deep) { // 浅拷贝与深拷贝
        let o = obj instanceof Array ? [] : {}
        for (let k in obj) {
          let val = obj[k]
          o[k] = (deep && typeof val === 'object') ? Vue.prototype._P.copyObject(val, deep) : val
        }
        return o
      },
      // 除法函数，用来得到精确的除法结果
      // 说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
      // 调用：accDiv(arg1,arg2)
      // 返回值：arg1除以arg2的精确结果
      // str 要截断的数字， n为精度位数
      cutStrTo (str, n) {
        n = n || 16
        str = str + ''
        if (str.indexOf('e') > -1) {
          str = this.eToNum(str) + ''
        }
        if (str.indexOf('.') < 0) {
          // 没有小数点，全取
          return str
        } else {
          // 有小数点
          str = str.substring(0, n + 2)
          return str
        }
      },
      // 除法
      accDiv (arg1, arg2) {
        let t1 = 0
        let t2 = 0
        let r1, r2
        try {
          arg1 = this.cutStrTo(arg1.toString())
          arg2 = this.cutStrTo(arg2.toString())
        } catch (e) {
          arg1 = ''
          arg2 = ''
        }
        try {
          t1 = arg1.split('.')[1].length
        } catch (e) {
        }
        try {
          t2 = arg2.split('.')[1].length
        } catch (e) {
        }
        r1 = Number(arg1.replace('.', ''))
        r2 = Number(arg2.replace('.', ''))
        return (r1 / r2) * Math.pow(10, t2 - t1) || 0
      },
      // 乘法函数，用来得到精确的乘法结果
      // 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
      // 调用：accMul(arg1,arg2)
      // 返回值：arg1乘以arg2的精确结果
      accMul (arg1, arg2) {
        arg1 = Number(arg1)
        arg2 = Number(arg2)
        let result
        let resultStr
        let m = 0
        let s1
        let s2
        try {
          s1 = this.cutStrTo(this.eToNum(arg1).toString())
          s2 = this.cutStrTo(this.eToNum(arg2).toString())
        } catch (e) {
          s1 = ''
          s2 = ''
        }
        try {
          m += s1.split('.')[1].length
        } catch (e) {
        }
        try {
          m += s2.split('.')[1].length
        } catch (e) {
        }
        result = Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
        resultStr = result.toString().toLocaleString()
        result = this.eToNum(resultStr)
        return result
      },
      eToNum (num) {
        num = num + ''
        if (num.indexOf('e') > -1) {
          let arr = num.split('e')
          arr[0] = arr[0].replace('.', '')
          if (arr[1] < 0) {
            let pre = ''
            for (let i = 0; i < Math.abs(parseInt(arr[1])); i++) {
              pre = pre + '0'
              if (i === 0) {
                pre += '.'
              }
            }
            return pre + arr[0]
          } else {
            let pre = ''
            for (let i = 0; i < parseInt(arr[1]) - arr[0].length - 1; i++) {
              pre = pre + '0'
            }
            return arr[0] + pre
          }
        } else {
          return Number(num)
        }
      },
      // 加法函数，用来得到精确的加法结果
      // 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
      // 调用：accAdd(arg1,arg2)
      // 返回值：arg1加上arg2的精确结果
      accAdd (arg1, arg2) {
        let r1, r2, m
        arg1 = arg1 - 0
        arg2 = arg2 - 0
        try {
          arg1 = this.cutStrTo(arg1)
          r1 = arg1.toString().split('.')[1].length
        } catch (e) {
          r1 = 0
        }
        try {
          arg2 = this.cutStrTo(arg2)
          r2 = arg2.toString().split('.')[1].length
        } catch (e) {
          r2 = 0
        }
        m = Math.pow(10, Math.max(r1, r2))
        arg1 = this.accMul(arg1, m)
        arg2 = this.accMul(arg2, m)
        return (arg1 + arg2) / m
      },
      // 减法函数
      accSub (arg1, arg2) {
        let r1, r2, m, n
        try {
          arg1 = this.cutStrTo(arg1)
          r1 = arg1.toString().split('.')[1].length
        } catch (e) {
          r1 = 0
        }
        try {
          arg2 = this.cutStrTo(arg2)
          r2 = arg2.toString().split('.')[1].length
        } catch (e) {
          r2 = 0
        }
        m = Math.pow(10, Math.max(r1, r2))
        // 动态控制精度长度
        n = (r1 >= r2) ? r1 : r2
        return ((arg1 * m - arg2 * m) / m).toFixed(n)
      },
      // 百分比
      toPercentFilter (value, num) { // 参数1 string; 参数2 小数 的 字符个数
        if (!isNaN(Number(value))) {
          return this.lastD(this.fixD(this.accMul(value, 100), num)) + '%'
        } else {
          return value
        }
      },
      // 年月日 传 时间戳
      dateFilter (value) {
        if (value) {
          let date = new Date(value)
          let y = date.getFullYear()
          let m = date.getMonth() + 1
          let d = date.getDate()
          m = m < 10 ? '0' + m : m
          d = d < 10 ? '0' + d : d
          return y + '-' + m + '-' + d
        }
      },
      // 截取字符串 + '...'
      subStrFn (str, from, to) {
        // from to  都是数字
        if (!str || typeof str !== 'string') return false
        if (!from) from = 0
        if (!to) to = str.length
        let getStr = str.substring(from, to)
        return str.length >= to ? getStr + '...' : getStr
      },
      // 09-01 15:00'
      timeFilter (value) {
        if (value) {
          let date = new Date(value)
          let m = date.getMonth() + 1
          let d = date.getDate()
          let h = date.getHours()
          let mi = date.getMinutes()
          m = m < 10 ? '0' + m : m
          d = d < 10 ? '0' + d : d
          h = h < 10 ? '0' + h : h
          mi = mi < 10 ? '0' + mi : mi
          return m + '-' + d + ' ' + h + ':' + mi
        }
      },
      // 09-01
      mAndDay (value) {
        if (value) {
          let date = new Date(value)
          let m = date.getMonth() + 1
          let d = date.getDate()
          m = m < 10 ? '0' + m : m
          d = d < 10 ? '0' + d : d
          return m + '-' + d
        }
      },
      // 2019-04
      yAndM (value) {
        let date = new Date(value)
        let m = date.getMonth() + 1
        let y = date.getFullYear()
        m = m < 10 ? '0' + m : m
        y = y < 10 ? '0' + y : y
        return y + '-' + m
      }
    }
  }
}
