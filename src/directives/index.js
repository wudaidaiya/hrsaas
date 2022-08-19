export const imgError = {
  // inserted: function (el, { value }) {
  //   // 参数1：el为自定义指令的名字
  //   // 参数2：配置对象
  //   // 监听DOM加载失败的事件
  //   // console.log(el)
  //   if (!el.src) {
  //     el.src = value
  //   } else {
  //     el.onerror = function () {
  //       el.src = value
  //     }
  //   }
  // }
  inserted(el, { value }) {
    // 参数1：el为自定义指令的名字
    // 参数2：配置对象
    // 监听DOM加载失败的事件
    // console.log(el)
    if (!el.src) {
      el.src = value
    } else {
      el.onerror = function () {
        el.src = value
      }
    }
  },
  // 指令所绑定的元素更新时候触发
  update(el, { value }) {
    if (!el.src) {
      el.src = value
    }
  }
}
