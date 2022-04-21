import Cookies from 'js-cookie'

const TokenKey = 'ZSWP_Token'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}

const timeKey = 'TokenTime_key' // 设置一个独一无二的key

// 获取时间戳
export function getTimeStamp () {
  return Cookies.get(timeKey)
}
// 设置时间戳
export function setTimeStamp () {
  Cookies.set(timeKey, Date.now())
}

