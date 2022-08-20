import request from '@/utils/request'

/**
   登录请求
 * 
 * @param {Object} data 
 * @returns Promise
 */
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'POST',
    data
  })
}

/**
 *  获取用户基本资料
 * @returns Promise
 */
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}

/**
 *  用户详细信息
 * @param {*} id 
 * @returns 
 */
export function getUserDetail(id) {
  return request({
    url: '/sys/user/' + id,
  })
}
