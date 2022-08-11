import request from "@/utils/request"
/**
 * 获取角色列表
 * @param {*} params 
 * @returns 
 */
export function gerRolesApi(params){
    return request({
        url:'/sys/role',
        params,
    })
 }
/**
 * 添加角色
 * @param {*} data 
 * @returns 
 */
 export function addRoleApi(data){
    return request({
        url:'/sys/role',
        method: 'POST',
        data,
    })
 }