import request from '@/utils/request'

export function login (data) {
  return request({
    method: 'POST',
    url: '/api/login',
    data
  })
}

export function register (data) {
  return request({
    method: 'POST',
    url: '/api/reguser',
    data
  })
}

export function getUserInfo () {
  return request({
    method: 'GET',
    url: '/my/userinfo'
  })
}

export function updateUserInfo (data) {
  return request({
    method: 'PUT',
    url: '/my/userinfo',
    data
  })
}

export function updatePassword (data) {
  return request({
    method: 'PUT',
    url: '/my/updatepwd',
    data
  })
}

export function updateAvatar (avatar) {
  return request({
    method: 'PUT',
    url: '/my/update/avatar',
    data: {
      avatar
    }
  })
}
