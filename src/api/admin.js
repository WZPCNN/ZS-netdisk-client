import request from '@/utils/request'

export function getAllUsers () {
  return request({
    method: 'GET',
    url: '/ad/allusers'
  })
}

export function changeSpace (data) {
  return request({
    method: 'PUT',
    url: '/ad/changespace',
    data
  })
}

export function closeUser (data) {
  return request({
    method: 'DELETE',
    url: '/ad/closeuser',
    data
  })
}
