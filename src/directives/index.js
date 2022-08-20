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
  }
}
