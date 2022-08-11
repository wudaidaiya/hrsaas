<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-tabs v-model="activeName">
        <el-tab-pane label="用户管理" name="first">
          <el-button type="primary" @click="addFn">新增角色</el-button>
          <!-- 列表 -->
          <el-table :data="tableData" style="width: 100%">
            <el-table-column type="index" label="序号"> </el-table-column>
            <el-table-column prop="name" label="角色"> </el-table-column>
            <el-table-column prop="description" label="描述"> </el-table-column>
            <el-table-column prop="address" label="操作">
              <template>
                <el-button size="small" type="success">分配权限</el-button>
                <el-button size="small" type="primary">编辑</el-button>
                <el-button size="small" type="danger">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            :page-size="pageSize"
            :page-sizes="[3, 5, 10, 20]"
            layout="sizes,prev, pager, next"
            :total="total"
            @current-change="currentChange"
            @size-change="handleSizeChange"
          >
          </el-pagination>
        </el-tab-pane>
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
              <el-input  v-model="datas[0].name" disabled></el-input>
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input v-model="datas[0].companyAddress" disabled></el-input>
            </el-form-item>
            <el-form-item label="公司邮箱">
              <el-input v-model="datas[0].mailbox" disabled></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="datas[0].remarks" disabled></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 添加角色对话框 -->
    <el-dialog @close='dialogClose' title="新增角色" :visible.sync="dialogFormVisible">
      <el-form
        :model="addRoleForm"
        :rules="addRoleFormRules"
        ref="form"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop='name'>
          <el-input v-model="addRoleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRoleForm.region"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onClose">取 消</el-button>
        <el-button @click="onAddRole" type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { gerRolesApi,addRoleApi } from "@/api/role.js";
import { getCompanyInfoApi } from "@/api/setting.js";
 export default {
  data() {
    return {
      activeName: "first",
      tableData: [],
      pageSize: 3,
      total: 0,
      page: 1,
      dialogFormVisible: false,
      addRoleForm: {
        name: "",
        region: "",
      },
      addRoleFormRules: {
        name: [{ required: true, message: '请输入', trigger: 'blur'},],
      },
      datas:[]
    };
  },
  created() {
    this.getrRoles();
    this.getCompanyInfo()
  },
  methods: {
    async getrRoles() {
      const { rows, total } = await gerRolesApi({
        page: this.page,
        pagesize: this.pageSize,
      });
      this.tableData = rows;
      this.total = total;
    },
    currentChange(val) {
      this.page = val;
      this.getrRoles();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getrRoles();
    },
    addFn() {
      this.dialogFormVisible = true;
    },
    onClose() {
      this.dialogFormVisible = false;
    },
    // 确定
    async onAddRole() {
      await this.$refs.form.validate();
      await addRoleApi(this.addRoleForm)
      this.$message.success('添加成功')
      this.dialogFormVisible = false;
      this.getrRoles();

    },
    // 监听对话框关闭
    dialogClose(){
      this.$refs.form.resetFields()
      this.addRoleForm.region = ''
    },
    // async onRemove(id){
   
    // },
    async getCompanyInfo(){
      const res = await getCompanyInfoApi(this.$store.state.user.userInfo.companyId)
       console.log(res);
       this.datas = res
    }
   
  },
};
</script>

<style scoped lang="less"></style>
