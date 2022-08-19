<template>
  <div>
    <upload-excel
      :beforeUpload="excelSuccess"
      :onSuccess="onSuccess"
    ></upload-excel>
  </div>
</template>

<script>
import employees from '@/constant/employees'
const { mapKeyPath } = employees
import { importEmployees } from '@/api/employees'
import { formatTime } from '@/filters'

export default {
  data() {
    return {}
  },

  created() {},

  methods: {
    // 上传之前
    excelSuccess({ name }) {
      if (!name.endsWith('.xlsx')) {
        this.$message.error('请选择xlsx文件')
        return false
      }
      return true
    },
    // 上传成功
    async onSuccess({ header, results }) {
      const newArr = results.map((item) => {
        const obj = {}
        for (let key in mapKeyPath) {
          if (key === '入职日期' || key === '转正日期') {
            const timeStamp = item[key]
            const date = new Date((timeStamp - 1) * 24 * 60 * 60 * 1000)
            date.setFullYear(date.getFullYear() - 70)
            obj[mapKeyPath[key]] = formatTime(date)
          } else {
            obj[mapKeyPath[key]] = item[key]
          }
        }
        return obj
      })
      await importEmployees(newArr)
      this.$message.success('导入成功')
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped></style>
