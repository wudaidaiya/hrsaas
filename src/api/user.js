import request from '@/utils/request'
/**
 * 登陆情求
 * @param {Object} data password mobilep
 * @returns promise
 */
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'POST',
    data
  })
}

/**
 *获取用户信息
 * @returns Promise
 */
export function getUserInfoApi() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}
/**
 * 获取详细的信息
 * @param {*} id
 * @returns promise
 */
export function getUserDetail(id) {
  return request({
    url: '/sys/user/' + id
  })
}
// /sys/user/{id}

/**
 * 保存员工基本信息
 * @param {*} id
 * @returns promise
 */
export function saveUserDetail(data, id) {
  return request({
    url: '/sys/user/' + id,
    method: 'put',
    data
  })
}
