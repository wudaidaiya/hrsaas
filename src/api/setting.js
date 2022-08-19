import request from '@/utils/request'
export function getCompanyIdApi(id) {
  return request({
    url: '/company/' + id,
    method: 'get'
  })
}
