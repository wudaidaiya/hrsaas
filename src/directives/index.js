import store from "@/store"
// 默认图片
export const imgError = {
  inserted(el, { value }) {
    if (!el.src) {
      el.src = value
    } else {
      el.addEventListener('error', () => {
        el.src = value
      })
    }
  },
  // 更新时触发
  update(el, { value }) {
    if (!el.src) {
      el.src = value
    }
  },

}
export const isHas = {
  inserted(el,binding){
    const has  = store.state.permission.points.includes(binding.value)
    if(!has) {
      el.remove()
    }
  }
}