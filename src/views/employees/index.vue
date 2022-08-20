<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools>
        <span slot="left-tag">共{{ total }}条记录</span>
        <template slot="right">
          <el-button type="danger" @click="Excelimport"
            >普通excel导出</el-button
          >
          <el-button type="info">复杂表头excel导出</el-button>
          <el-button type="success" @click="$router.push('/import')"
            >excel导入</el-button
          >
          <el-button type="primary" @click="showAddEmployees = true"
            >新增员工</el-button
          >
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card>
        <el-table border :data="employeesList">
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="员工">
            <template slot-scope="{ row }">
              <img
                v-imgError="require('@/assets/common/head.jpg')"
                :src="row.staffPhoto"
                alt=""
                style="
                  border-radius: 50%;
                  width: 100px;
                  height: 100px;
                  padding: 10px;
                "
                @click="showErCodeDialog(row.staffPhoto)"
              />
            </template>
          </el-table-column>
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column
            label="聘用形式"
            sortable=""
            :formatter="formOfEmployment"
            prop="formOfEmployment"
          />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间">
            <template slot-scope="{ row }">
              {{ row.timeOfEntry | formaTime }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="">
            <template slot-scope="{ row }">
              <el-switch
                :value="row.enableState === 1"
                active-color="#dcdfe6"
                inactive-color="#ff4949"
              >
              </el-switch>
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
              <el-button
                type="text"
                size="small"
                @click="showAssignRoleDialog(row)"
                >角色</el-button
              >
              <el-button type="text" size="small" @click="onRemove(row)">
                删除
              </el-button>
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
            :page-size="params.size"
            :total="total"
            @current-change="currentChange"
          />
        </el-row>
      </el-card>
    </div>
    <Addemployees :visible.sync="showAddEmployees"></Addemployees>
    <!-- 二维码弹框 -->
    <el-dialog :visible.sync="erCodeDialog" title="头像">
      <center>
        <canvas id="canvas"></canvas>
      </center>
    </el-dialog>
    <!-- 分配角色弹框 -->
    <AssignRole
      :visible.sync="showDialog"
      :currentId="currentId"
      ref="assign"
    />
  </div>
</template>

<script>
import Addemployees from '@/views/employees/components/add-employees.vue'
import AssignRole from './components/assign-role.vue'
import employees from '@/constant/employees'
import QRCode from 'qrcode'
const { exportExcelMapPath, hireType } = employees
import { delEmployee, getEmployeesInfoApi } from '@/api/employees'
export default {
  name: 'Employees',
  data() {
    return {
      params: {
        page: 1,
        size: 5
      },
      total: 0,
      employeesList: [],
      showAddEmployees: false,
      erCodeDialog: false,
      showDialog: false,
      currentId: ''
    }
  },
  components: {
    Addemployees,
    AssignRole
  },
  created() {
    this.getEmployeesInfo()
  },

  methods: {
    // 员工详情列表请求
    async getEmployeesInfo() {
      const { rows, total } = await getEmployeesInfoApi(this.params)
      this.employeesList = rows
      this.total = total
    },
    // 点击页数时调用
    currentChange(val) {
      this.params.page = val
      this.getEmployeesInfo()
    },
    // 格式化
    formOfEmployment(row, column, cellValue, index) {
      const findItem = employees.hireType.find((item) => item.id == cellValue)
      return findItem ? findItem.value : '未知'
    },
    // 删除员工功能
    async onRemove(row) {
      try {
        await this.$confirm('是否删除该员工')
        await delEmployee(row.id)
        this.$message.success('删除成功')
        this.getEmployeesInfo()
      } catch (error) {}
    },
    // 导出
    async Excelimport() {
      const { export_json_to_excel } = await import('@/vendor/Export2Excel')
      const { rows } = await getEmployeesInfoApi({
        page: 1,
        size: this.total
      })
      // 转换成表头数组
      const header = Object.keys(exportExcelMapPath)
      // 二维数组转换
      const data = rows.map((item) => {
        return header.map((h) => {
          if (h === '聘用形式') {
            const hire = hireType.find(
              (hire) => hire.id === item[exportExcelMapPath[h]]
            )
            return hire ? hire.value : '未知'
          } else {
            return item[exportExcelMapPath[h]]
          }
        })
      })
      export_json_to_excel({
        header, //表头 必填
        data, //具体数据 必填
        filename: '人员资料', //非必填
        autoWidth: true, //非必填
        bookType: 'xlsx' //非必填
      })
    },
    // 显示二维码
    showErCodeDialog(staffPhoto) {
      if (!staffPhoto) return this.$message.error('该用户还未设置头像')
      this.erCodeDialog = true
      this.$nextTick(() => {
        var canvas = document.getElementById('canvas')

        QRCode.toCanvas(canvas, staffPhoto)
      })
    },
    // 角色弹框功能
    showAssignRoleDialog(row) {
      this.showDialog = true
      this.currentId = row.id
      // this.$refs.assign.getEmployeesRoles(row.id)
    }
  }
}
</script>

<style scoped lang="less"></style>
