const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.userInfo.username, // 建立用户名称的映射
  nickname: state => state.user.userInfo.nickname,
  userId: state => state.user.userInfo.u_id, // 建立用户id的映射
  avatar: state => state.user.userInfo.user_pic,
  used: state => state.user.userInfo.used,
  space: state => state.user.userInfo.space,
  access: state => state.user.userInfo.access,
  routes: state => state.permission.routes // 导出当前的路由
}
export default getters

