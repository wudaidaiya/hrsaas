export const imgError = {
  // 当被绑定的元素插入到Dom中时
  inserted: function (el, { value }) {
    // 监听dom img 同一片加载失败事件
    if (!el.src) {
      el.src = value;
    } else {
      el.onerror = function () {
        el.src = value;
      };
    }
  },
  // 指令绑定的元素更新时触发
  update(el, { value }) {
    if (!el.src) {
      el.src = value;
    }
  },
};
