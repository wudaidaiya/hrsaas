import PageTools from "@/components/PageTools";
const components = [PageTools];
export default {
  install(Vue) {
    // 1.组件名为"conter"; 2.data 写函数; 3.template 写组件的内容(元素和触发的事件)
    // Vue.component('PageTools',PageTools)
    components.forEach((component) => {
      Vue.component(component.name, component);
    });
  },
};
