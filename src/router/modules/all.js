export default {
  path: '/all', // 路径
  name: 'all', // 给路由规则加一个name
  component: () => import('@/views/all'),
  meta: {
    title: '全部文件',
    icon: 'all' // meta属性的里面的属性 随意定义 但是这里为什么要用title呢， 因为左侧导航会读取我们的路由里的meta里面的title作为显示菜单名称
  } // 组件
  // 配置二级路的路由表
}
