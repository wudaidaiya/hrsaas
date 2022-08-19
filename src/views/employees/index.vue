<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools>
        <span slot="left-tag">共166条记录</span>
        <template slot="right">
          <el-button
            size="small"
            type="warning"
            @click="$router.push('/import')"
            >导入</el-button
          >
          <el-button size="small" type="danger" @click="exportFn"
            >导出</el-button
          >
          <el-button
            size="small"
            type="primary"
            @click="showAddEmployees = true"
            >新增员工</el-button
          >
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card>
        <el-table border :data="employees">
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="员工">
            <template slot-scope="{ row }">
              <img
                v-imgError="require('@/assets/common/head.jpg')"
                :src="row.staffPhoto"
                style="
                  border-radius: 50%;
                  width: 100px;
                  height: 100px;
                  padding: 10px;
                "
                alt=""
                @click="showErCodeDialog(row.staffPhoto)"
              />
            </template>
          </el-table-column>
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column
            label="聘用形式"
            sortable=""
            :formatter="formatFormOfEmployment"
            prop="formOfEmployment"
          />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="">
            <template slot-scope="{ row }">
              {{ row.timeOfEntry | formatTime }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="">
            <template slot-scope="{ row }">
              <el-switch
                :value="row.enableState === 1"
                active-color="#13ce66"
                inactive-color="#ff4949"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{ row }">
              <el-button
                type="text"
                size="small"
                @click="$router.push('/employees/detail/' + row.id)"
                >查看</el-button
              >
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button
                type="text"
                size="small"
                @click="deleteEmployee(row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row
          type="flex"
          justify="center"
          align="middle"
          style="height: 60px"
        >
          <el-pagination
            layout="prev, pager, next"
            :page-size="page.size"
            :current-page="page.page"
            :total="page.total"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
    </div>
    <!-- 添加员工组件 -->
    <AddEmployees :visible.sync="showAddEmployees"></AddEmployees>
    <!-- 弹层 -->
    <el-dialog title='二维码' :visible.sync="ercodeDialog">
      <canvas id="canvas"></canvas>
    </el-dialog>
  </div>
</template>

<script>
import { getEmployeesInfoApi, delEmployee } from "@/api/employess";
import employees from "@/constant/employees";
import AddEmployees from "./components/add-employees.vue";
import QRcode from "qrcode";
const { exportExcelMapPath, hireType } = employees;
export default {
  name: "Employees",
  data() {
    return {
      employees: [],
      page: {
        page: 1,
        size: 5,
        total: 0,
      },
      showAddEmployees: false,
      ercodeDialog: false,
    };
  },

  created() {
    this.getEmplpyessList();
  },

  methods: {
    async getEmplpyessList() {
      const { rows, total } = await getEmployeesInfoApi(this.page);
      console.log(rows);
      this.employees = rows;
      this.page.total = total;
      // console.log(this.employees);
    },
    changePage(val) {
      this.page.page = val;
      this.getEmplpyessList();
    },
    formatFormOfEmployment(row, column, cellValue, index) {
      const findItem = employees.hireType.find((item) => item.id === cellValue);
      return findItem ? findItem.value : "未知";
    },
    // 删除
    async deleteEmployee(id) {
      try {
        await this.$confirm("您确定删除该员工吗");
        await delEmployee(id);
        this.getEmployeeList();
        this.$message.success("删除员工成功");
      } catch (error) {
        console.log(error);
      }
    },
    // 导出
    async exportFn() {
      const { export_json_to_excel } = await import("@/vendor/Export2Excel");
      const { rows } = await getEmployeesInfoApi({
        page: 1,
        size: this.page.total,
      });
      const header = Object.keys(exportExcelMapPath);
      // data数据
      const data = rows.map((item) => {
        return header.map((h) => {
          if (h === "聘用形式") {
            const findItem = hireType.find((hire) => {
              return hire.id === item[exportExcelMapPath[h]];
            });
            return findItem ? findItem.value : "未知";
          } else {
            return item[exportExcelMapPath[h]];
          }
        });
      });
      export_json_to_excel({
        header,
        data, //具体数据 必填
        filename: "员工信息表", //非必填
        autoWidth: true, //非必填
        bookType: "xlsx", //非必填
      });
    },
    // 点击显示弹层
    showErCodeDialog(stoffPhoto) {
      if (!stoffPhoto) return this.$message.error("该用户还未设置头像");
      this.ercodeDialog = true;
      this.$nextTick(() => {
        const canvas = document.getElementById("canvas");
        QRcode.toCanvas(canvas, stoffPhoto);
      });
    },
  },
  components: {
    AddEmployees,
  },
};
</script>

<style scoped lang="less"></style>
