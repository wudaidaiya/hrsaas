<template>
  <div class="dashboard-container">
    <div class="app-container">
      <upload-excel :beforeUpload="excelSuccess" :onSuccess="onSuccess" />
    </div>
  </div>
</template>

<script>
import { importEmployees } from "../../api/employess";
import employees from "../../constant/employees";
import { formatTime } from "../../filters/index";
const { importMapKeyPath } = employees;
export default {
  data() {
    return {};
  },

  created() {},

  methods: {
    // 控制文件上传类型
    excelSuccess({ name }) {
      if (!name.endsWith(".xlsx")) {
        this.$message.error("请选择xlsx文件");
        return false;
      }
      return true;
    },
    // 拿到表头和内容
    async onSuccess({ header, results }) {
      const newArr = results.map((item) => {
        const obj = {};
        for (let key in importMapKeyPath) {
          if (key === "入职日期" || key === "转正日期") {
            const timestamp = item[key];
            const date = new Date((timestamp - 1) * 24 * 3600000);
            date.setFullYear(date.getFullYear() - 70);
            obj[importMapKeyPath[key]] = formatTime(date);
          } else {
            obj[importMapKeyPath[key]] = item[key];
          }
        }
        return obj;
      });
      await importEmployees(newArr);
      this.$message.success("导入成功");
      this.$router.go(-1);
      console.log(newArr);
    },
  },
};
</script>

<style scoped></style>
