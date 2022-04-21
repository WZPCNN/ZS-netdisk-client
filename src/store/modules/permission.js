import { hiRoutes, asyncRoutes, constantRoutes } from '@/router'
import Layout from '@/layout'

// vuex中的permission模块用来存放当前的 静态路由 + 当前用户的 权限路由
const state = {
  routes: constantRoutes // 所有人默认拥有静态路由
}
const mutations = {
  // newRoutes可以认为是 用户登录 通过权限所得到的动态路由的部分
  setRoutes (state, newRoutes) {
    // 下面这么写不对 不是语法不对 是业务不对
    // state.routes = [...state.routes, ...newRoutes]
    // 有一种情况  张三 登录 获取了动态路由 追加到路由上  李四登录 4个动态路由
    // 应该是每次更新 都应该在静态路由的基础上进行追加
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  // 筛选权限路由
  filterRoutes (context, access) {
    var routes = []

    if (access === 0) {
      routes = [
        {
          path: '/',
          component: Layout,
          name: 'Categories',
          redirect: '/all',
          meta: { title: 'Categories', icon: 'dashboard' },
          children: [
            ...asyncRoutes,
            {
              path: '/info',
              name: 'info',
              component: () => import('@/views/info/index'),
              hidden: true,
              meta: {
                title: 'info'
              }
            }
          ]
        }
      ]
    } else {
      routes = [
        {
          path: '/',
          component: Layout,
          name: 'Categories',
          redirect: '/admin',
          meta: { title: 'Categories', icon: 'dashboard' },
          children: [
            ...hiRoutes,
            {
              path: '/info',
              name: 'info',
              component: () => import('@/views/info/index'),
              hidden: true,
              meta: {
                title: 'info'
              }
            }
          ]
        }
      ]
    }
    // 得到的routes是所有模块中满足权限要求的路由数组
    // routes就是当前用户所拥有的 动态路由的权限
    context.commit('setRoutes', routes) // 将动态路由提交给mutations
    return routes // 这里为什么还要return  state数据 是用来 显示左侧菜单用的  return  是给路由addRoutes用的
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
