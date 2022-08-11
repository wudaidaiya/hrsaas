import request from "@/utils/request";
/**
 * 获取组织架构信息
 * @returns promise
 */
export function getDeptsApi() {
  return request({
    url: "/company/department",
  });
}

/**
 * 删除部门
 * @param {*} id 要删除的id
 * @returns promise
 */
export function delDeptsApi(id) {
  return request({
    url: "/company/department/" + id,
    method: "DELETE",
  });
}
// 添加部门
export function addDeptsApi(data) {
  return request({
    url: "/company/department",
    method: "POST",
    data,
  });
}
// 根据id获取部门详情
export function putDeptsApi(id) {
  return request({
    url: "/company/department/" + id,
  });
}
// 根据id修改部门详情
export function editDeptsApi(data){
  return request({
    url:'/company/department/' + data.id,
    method:'PUT',
    data,
  })
}