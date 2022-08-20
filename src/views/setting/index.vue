<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- tabs切换 -->
      <el-tabs v-model="activeName">
        <el-tab-pane label="角色管理" name="first">
          <el-button
            type="primary"
            size="small"
            @click="addDialogVisible = true"
            >新增角色</el-button
          >

          <!-- 表格区域 -->
          <el-table :data="tableArr" style="width: 100%">
            <el-table-column prop="date" label="序号" type="index">
            </el-table-column>
            <el-table-column prop="name" label="角色"> </el-table-column>
            <el-table-column prop="description" label="描述"> </el-table-column>
            <el-table-column prop="address" label="操作">
              <!-- 作用域插槽 -->
              <template slot-scope="{ row }">
                <el-button
                  type="success"
                  size="small"
                  @click="showRightsDialog(row.id)"
                  >分配权限</el-button
                >
                <el-button type="primary" size="small">编辑</el-button>
                <el-button type="danger" size="small" @click="delRole(row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <!-- 分配权限对话框 -->
          <el-dialog
            title="分配权限"
            :visible.sync="setDialogVisible"
            width="50%"
            :destroy-on-close="true"
            @close="setRightsClose"
          >
            <el-tree
              ref="perRights"
              v-loading="loading"
              node-key="id"
              show-checkbox
              :data="treeList"
              :props="{ label: 'name' }"
              default-expand-all
              :default-checked-keys="checkedKeys"
            ></el-tree>
            <span slot="footer" class="dialog-footer">
              <el-button @click="setDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="setRights">确 定</el-button>
            </span>
          </el-dialog>
          <!-- 分页区 -->
          <div>
            <el-pagination
              @current-change="changePage"
              @size-change="handleSizeChange"
              :total="tableData.total"
              :page-sizes="[3, 5, 7, 10]"
              :page-size="params.pagesize"
              layout="sizes,prev, pager, next"
            >
            </el-pagination>
          </div>

          <!-- 配置管理 -->
        </el-tab-pane>
        <!-- 公司管理 -->
        <el-tab-pane label="公司信息" name="second">
          <el-alert
            title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            type="info"
            show-icon
            :closable="false"
          >
          </el-alert>
          <el-form ref="form" label-width="80px">
            <el-form-item label="公司名称">
              <el-input disabled v-model="companyInfo.name"></el-input>
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input
                disabled
                v-model="companyInfo.companyAddress"
              ></el-input>
            </el-form-item>
            <el-form-item label="公司邮箱">
              <el-input disabled v-model="companyInfo.mailbox"></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input disabled v-model="companyInfo.remarks"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <!-- 对话框 -->
      <el-dialog
        title="新增角色"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="closeDialog"
      >
        <el-form
          ref="form"
          label-width="80px"
          :model="addRoleForm"
          :rules="addRoleFormRules"
        >
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="addRoleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="addRoleForm.region"></el-input>
          </el-form-item>
        </el-form>
        <center>
          <el-button @click="onClose">取 消</el-button>
          <el-button type="primary" @click="onSave">确 定</el-button>
        </center>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getEmployeeApi,
  addEmployeeApi,
  delEmployeeApi,
  getCompanyInfo,
  getRolesInfo,
  assignPerm
} from '@/api/setting'
import { getPermissionList } from '@/api/permisson'
import { transListToTree } from '@/utils/index'
export default {
  data() {
    return {
      activeName: 'first',
      //添加的表单对象
      addRoleForm: {
        name: '',
        region: ''
      },
      // 新增表单校验规则
      addRoleFormRules: {
        name: [{ required: true, message: '请输入角色名称', target: 'blur' }]
      },
      // 分页参数
      params: {
        page: 1,
        pagesize: 10
      },
      tableArr: [], // 表格数据数组
      tableData: {},
      companyInfo: {},
      addDialogVisible: false,
      setDialogVisible: false,
      treeList: [],
      checkedKeys: [],
      loading: false,
      roleId: ''
    }
  },
  methods: {},

  created() {
    // 初始化调用人员列表
    this.getEmployeeList()
    this.getCompanyInfo()
    this.getPermissions()
  },

  methods: {
    // 获取所有员工列表
    async getEmployeeList() {
      // 发起获取人员列表的请求
      const res = await getEmployeeApi(this.params)
      this.tableArr = res.rows
      this.tableData = res
    },
    // 页码发生变化的事件
    changePage(page) {
      // console.log(page)
      this.params.page = page
      this.getEmployeeList()
    },
    // 切换一页显示的条数时触发
    handleSizeChange(val) {
      this.params.pagesize = val
      this.getEmployeeList()
    },
    // 删除角色
    async delRole(row) {
      try {
        await delEmployeeApi(row.id)
        this.getEmployeeList()
        this.$message.success('删除成功')
      } catch (error) {
        // this.$message.warning(error.message)
      }
    },
    // 关闭新增弹框
    onClose() {
      this.addDialogVisible = false
    },
    // 点击确定新增角色
    async onSave() {
      await this.$refs.form.validate()
      try {
        // 发起新增角色的请求
        const res = await addEmployeeApi(this.addRoleForm)
        console.log(res)
        // 初始化调用人员列表
        this.getEmployeeList()
        this.$message.success('添加角色成功')
        this.addDialogVisible = false
      } catch (error) {}
    },
    // 关闭弹框的时候清空表单
    closeDialog() {
      this.$refs.form.resetFields()
      this.addRoleForm.region = ''
    },
    // 获取公司信息
    async getCompanyInfo() {
      const res = await getCompanyInfo(
        this.$store.state.user.userInfo.companyId
      )
      this.companyInfo = res
    },
    // 分配权限
    async showRightsDialog(id) {
      this.loading = true
      this.setDialogVisible = true
      // 获取角色权限
      const res = await getRolesInfo(id)
      this.roleId = id
      this.loading = false
      this.checkedKeys = res.permIds
    },
    // 获取权限
    async getPermissions() {
      const res = await getPermissionList()
      this.treeList = transListToTree(res, '0')
    },
    // 监听分配权限对话框关闭清空 数组
    setRightsClose() {
      this.checkedKeys = []
    },
    // 确认分配权限
    async setRights() {
      const rightsArr = this.$refs.perRights.getCheckedKeys()
      if (!rightsArr.length) return this.$message.error('至少选择一个权限')
      // 发起更新权限的请求
      await assignPerm({
        id: this.roleId,
        permIds: rightsArr
      })
      this.$message.success('分配权限成功')
      this.setDialogVisible = false
    }
  }
}
</script>

<style scoped lang="scss">
.el-pagination {
  text-align: right;
}
.el-form {
  margin-top: 20px;
}
</style>
