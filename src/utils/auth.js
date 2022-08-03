import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
// 存登录token时间戳 
export function setTokenTime(){
 Cookies.set('tokenTime',Date.now())
}
// 取登录token时间戳 
export function getTokenTime(){
 return Cookies.get('tokenTime')
 }