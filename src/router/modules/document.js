export default {
  path: '/document', // 路径
  name: 'document', // 给路由规则加一个name
  component: () => import('@/views/document'),
  meta: {
    title: '文档',
    icon: 'document' // meta属性的里面的属性 随意定义 但是这里为什么要用title呢， 因为左侧导航会读取我们的路由里的meta里面的title作为显示菜单名称
  } // 组件
  // 配置二级路的路由表
}
