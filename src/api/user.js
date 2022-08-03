import request from "@/utils/request";
/**
 * 登录亲求
 * @param {object} data  password mobile
 * @returns promise
 */
export function login(data) {
  return request({
    url: "/sys/login",
    method: "POST",
    data,
  });
}
/**
 * 获取用户信息
 * @returns promise
 */
export function getUserInfoApi() {
  return request({
    url: "/sys/profile",
    method: "POST",
  });
}
/**
 * 根据用户id获取员工详情数据
 * @param {String} id  用户id
 * @returns promise
 */
export function getUserDetail(id) {
  return request({
    url: "/sys/user/" + id,
  });
}
