import request from '@/utils/request'
/**
 * 获取角色列表
 * @param {*} params
 * @returns
 */
export function getRolesApi(params) {
  return request({
    url: '/sys/role',
    params
  })
}
/**
 *添加角色
 * @param {*} data
 * @returns
 */
export function addRoleApi(data) {
  return request({
    url: '/sys/role',
    method: 'POST',
    data
  })
}

export function removeRoleApi(id) {
  return request({
    url: '/sys/role/' + id,
    method: 'delete'
  })
}
// 根据id获取角色信息
export function getRolesInfo(id) {
  return request({
    url: '/sys/role/' + id,
  })
}

/**
 * // 给角色分配权限
 * @param {*} data {id ,permIds}
 * @returns 
 */
export function assignPerm(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}