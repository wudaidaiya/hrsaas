import PageTools from '@/components/PageTools'
import UploadExcel from '@/components/UploadExcel'
import UploadImage from '@/components/UploadImage'

// export default {
//   install(Vue) {
//     Vue.component('PageTools', PageTools)
//   }
// }
// console.log(PageTools.name)

const components = [PageTools, UploadExcel, UploadImage]
export default {
  install(Vue) {
    components.forEach((component) => {
      Vue.component(component.name, component)
    })
  }
}
