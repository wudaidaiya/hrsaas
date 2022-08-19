import request from '@/utils/request'
/**
 * 获取组织架构
 * @returns promise
 */
export function getDeptsApi() {
  return request({
    url: '/company/department'
  })
}
/**
 *删除部门
 * @param {*} id 要删除部门的id
 * @returns promise
 */
export function delDeptsApi(id) {
  return request({
    url: '/company/department/' + id,
    method: 'DELETE'
  })
}
/**
 * 添加子部门
 * @param {*} data  对象
 * @returns promise
 */
export function addDeptApi(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}

/**
 * 编辑部门
 * @param {*} id 部门id
 * @returns promise
 */
export function editDeptApi(id) {
  return request({
    url: '/company/department/' + id,
    method: 'get'
  })
}

//  /company/department/{id}
export function setEditDeptsApi(data) {
  return request({
    url: '/company/department/' + data.id,
    method: 'put',
    data
  })
}
