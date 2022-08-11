import request from "@/utils/request"
/**
 * 获取角色列表
 * @param {*} params 
 * @returns 
 */
export function getCompanyInfoApi(id){
    return request({
        url:'/company/'+id,
    })
 }