<template>
  <div class="dashboard-container">
    <div class="app-container">
      <upload-excel
        :beforeUpload="excelSuccess"
        :onSuccess="onSuccess"
      ></upload-excel>
    </div>
  </div>
</template>

<script>
import employees from '@/constant/employees'
import { importEmployee } from '@/api/employees'
import { formaTime } from '@/filters'
const { importMapKeyPath } = employees
export default {
  data() {
    return {}
  },

  created() {},

  methods: {
    excelSuccess({ name }) {
      if (!name.endsWith('.xlsx')) {
        this.$message.error('请上传xlsx文件')
        return false
      }
      return true
    },
    async onSuccess({ header, results }) {
      const newArr = results.map((item) => {
        let obj = {}
        for (let k in importMapKeyPath) {
          if (k === '入职日期' || k === '转正日期') {
            // exec时间戳
            let timestamp = item[k]
            // 转换
            let data = new Date((timestamp - 1) * 24 * 3600000)

            data.setFullYear(data.getFullYear() - 70)

            obj[importMapKeyPath[k]] = formaTime(data)
          } else {
            obj[importMapKeyPath[k]] = item[k]
          }
        }
        return obj
      })
      await importEmployee(newArr)
      this.$message.success('上传成功')
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="scss"></style>
