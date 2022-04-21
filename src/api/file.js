import request from '@/utils/request'

// export function upload () {
//   return request({
//     method: 'POST',
//     url: '/my/upload'
//   })
// }

export function getFile () {
  return request({
    method: 'GET',
    url: '/my/file'
  })
}

export function deleteFile (filename) {
  return request({
    method: 'DELETE',
    url: '/my/delete',
    data: { filename }
  })
}

export function downloadFile (params, responseType) {
  return request({
    method: 'GET',
    url: `/my/download`,
    params,
    responseType
  })
}

export function previewFile (params) {
  return request({
    method: 'GET',
    url: `/my/preview`,
    params
  })
}

export function shareFile (params) {
  return request({
    method: 'GET',
    url: `/my/share`,
    params
  })
}

export function getShareList (params) {
  return request({
    method: 'GET',
    url: `/api/sharelist`,
    params
  })
}

export function shareDownload (params, responseType) {
  return request({
    method: 'GET',
    url: `/api/sharedownlog`,
    params,
    responseType
  })
}

export function sharePreview (params) {
  return request({
    method: 'GET',
    url: `/api/sharepreview`,
    params
  })
}
