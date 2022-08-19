<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-tabs v-model="activeName">
        <el-tab-pane label="角色管理" name="first">
          <el-button type="primary" @click="addDialogVisible = true"
            >新增角色</el-button
          >
          <!-- table -->

          <el-table :data="tableData" style="width: 100%">
            <el-table-column type="index" label="序号"> </el-table-column>
            <el-table-column prop="name" label="角色"> </el-table-column>
            <el-table-column prop="description" label="描述"> </el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button size="small" type="success" @click="showRightDialog"
                  >分配权限</el-button
                >
                <el-button size="small" type="primary">编辑</el-button>
                <el-button
                  size="small"
                  type="danger"
                  @click="deleteRole(scope.row.id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            :page-size="pageSize"
            :page-sizes="[3, 5, 10, 20]"
            layout="sizes,prev, pager, next"
            :total="total"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          >
          </el-pagination>
        </el-tab-pane>

        <el-tab-pane label="公司信息" name="second"
          ><el-alert
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
              <el-input disabled v-model="companyInfo.companyAddress">
              </el-input>
            </el-form-item>
            <el-form-item label="公司邮箱">
              <el-input disabled v-model="companyInfo.mailbox"></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input disabled v-model="companyInfo.remarks"></el-input>
            </el-form-item> </el-form
        ></el-tab-pane>
      </el-tabs>
      <!-- 对话框 -->
      <el-dialog
        title="提示"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="dialogClose"
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
            <el-input v-model="addRoleForm.description"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="onClose">取 消</el-button>
          <el-button type="primary" @click="onAddRole">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 给角色分配权限 -->
      <el-dialog
        title="给角色分配权限"
        :visible.sync="setRightDialog"
        width="50%"
      >
        <el-tree
        default-expand-all
        show-checkbox
        node-key='id'
          :data="permissions"
          :props="{ label: 'name' }"
          :default-checked-keys='defaultCheckKeys'
        ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialog = false">取 消</el-button>
          <el-button type="primary">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getRolesApi, addRoleApi, removeRoleApi } from '@/api/role'
import { getCompanyIdApi } from '@/api/setting'
import { getPermissionList } from '@/api/permission'
import { transListToTree } from '@/utils'

export default {
  data() {
    return {
      activeName: 'first',
      tableData: [],
      total: 0,
      // 一页2条
      pageSize: 10,
      // 当前页码
      page: 1,
      addDialogVisible: false,
      addRoleForm: {
        name: '',
        description: ''
      },
      addRoleFormRules: {
        name: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      companyInfo: {
        name: '',
        companyAddress: '',
        mailbox: '',
        remarks: ''
      },
      //权限
      setRightDialog: false,
      permissions: [],
      defaultCheckKeys:['1', '1063315016368918528'] 
    }
  },

  created() {
    this.getRoles()
    this.getCompanyIdApi()
    this.getPermissionList()
  },

  methods: {
    async getRoles() {
      const { rows, total } = await getRolesApi({
        page: this.page,
        pagesize: this.pageSize
      })
      this.tableData = rows
      this.total = total
      console.log(this.tableData)
    },
    handleCurrentChange(val) {
      this.page = val
      this.getRoles()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getRoles()
    },

    onClose() {
      this.addDialogVisible = false
    },
    async onAddRole() {
      await this.$refs.form.validate()
      await addRoleApi(this.addRoleForm)
      this.$message.success('添加成功')
      this.addDialogVisible = false
      this.getRoles()
    },
    dialogClose() {
      this.$refs.form.resetFields()
      this.addRoleForm.description = ''
    },
    async deleteRole(id) {
      console.log(id)
      await removeRoleApi(id)
      console.log('删除成功')
      this.getRoles()
    },
    //
    async getCompanyIdApi() {
      const res = await getCompanyIdApi(
        this.$store.state.user.userInfo.companyId
      )
      console.log(res)
      this.companyInfo = {
        name: res.name,
        companyAddress: res.companyAddress,
        mailbox: res.mailbox,
        remarks: res.remarks
      }
    },
    // 点击弹出对话框
    showRightDialog() {
      this.setRightDialog = true
    },
    // 获取权限
    async getPermissionList() {
      const res = await getPermissionList()
      const treePermission = transListToTree(res, '0')
      this.permissions = treePermission
    }
  }
}
</script>

<style scoped lang="less"></style>
