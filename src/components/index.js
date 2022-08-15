import PageTools from "@/components/PageTools";
import UploadExcel from "@/components/UploadExcel";
import UploadImg from "@/components/UploadImg";
const components = [PageTools,UploadExcel,UploadImg];
export default {
  install(Vue) {
    // 1.组件名为"conter"; 2.data 写函数; 3.template 写组件的内容(元素和触发的事件)
    // Vue.component('PageTools',PageTools)
    components.forEach((component) => {
      Vue.component(component.name, component);
    });
  },
};
