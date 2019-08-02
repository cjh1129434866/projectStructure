import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import login from '@/components/login'

Vue.use(Router)

let myRouter = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'index',
      component: index
    },
    {
      path: '/login',
      name: 'login',
      component: login
    }
  ]
})

myRouter.beforeEach((to, from, next) => {
  let pathName = to.path.split('/')[1]
  let getCookie = (name) => {
    let arrd = null
    let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
    if (document.cookie.match(reg)) {
      arrd = document.cookie.match(reg)
      return unescape(arrd[2])
    } else {
      return null
    }
  }

  let isLogin = getCookie('token')
  // 未登录可以访问的页面,下面数组里面的每一个元素要与routers中的name值匹配
  let arr = ['index']
  // 已登录不可以访问的页面
  let sarr = ['login', 'register']
  // 已经登录过 要跳转login时，跳到首页去
  if (sarr.indexOf(to.name) !== -1 && isLogin) {
    next('/')
    return false
  }

  if (!isLogin) {
    if (arr.indexOf(pathName) === -1) {
      // 如果是登页面 就直接 next
      if (to.path === '/login') {
        next()
      } else {
        next('/login')
      }
    } else {
      next()
    }
    return false
  } else {
    next()
  }
})

export default myRouter
