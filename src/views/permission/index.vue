<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :isShowLeft="false">
        <template #right>
          <el-button type="primary" @click="showAddDialog('0', 1)"
            >添加权限</el-button
          >
        </template>
      </page-tools>

      <!-- 表格区域 -->
      <el-table
        :data="permissions"
        style="width: 100%"
        ref="table"
        row-key="id"
      >
        <el-table-column label="名称">
          <template slot-scope="{ row }">
            <i
              v-if="row.children"
              class="el-icon-folder-opened file-icon"
              style="margin-right: 10px"
              @click="expandBtn(row)"
            ></i>
            <!-- <i
              v-if="row.type == 2"
              class="el-icon-document file-icon"
              style="margin-right: 10px"
            ></i> -->
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="标识"> </el-table-column>
        <el-table-column prop="description" label="描述"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-button type="text" @click="showAddDialog(row.id, 2)"
              >添加</el-button
            >
            <el-button type="text">编辑</el-button>
            <el-button type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 放置一个弹层 用来编辑新增节点 -->
      <el-dialog
        :title="`添加权限点`"
        :visible.sync="showDialog"
        @close="btnCancel"
      >
        <!-- 表单 -->
        <el-form
          ref="perForm"
          :model="formData"
          :rules="rules"
          label-width="120px"
        >
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="formData.name" style="width: 90%" />
          </el-form-item>
          <el-form-item label="权限标识" prop="code">
            <el-input v-model="formData.code" style="width: 90%" />
          </el-form-item>
          <el-form-item label="权限描述">
            <el-input v-model="formData.description" style="width: 90%" />
          </el-form-item>
          <el-form-item label="开启">
            <el-switch
              v-model="formData.enVisible"
              active-value="1"
              inactive-value="0"
            />
          </el-form-item>
        </el-form>
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" type="primary" @click="onSaveAdd"
              >确定</el-button
            >
            <el-button size="small" @click="btnCancel">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getPermissionList, setPermission } from '@/api/permisson'
import { transListToTree } from '@/utils'
export default {
  data() {
    return {
      permissions: [],
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [
          { required: true, message: '权限名称不能为空', trigger: 'blur' }
        ],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      },
      showDialog: false
    }
  },

  created() {
    this.getPermissionLists()
  },

  methods: {
    // 获取所有权限列表
    async getPermissionLists() {
      const res = await getPermissionList()
      this.permissions = transListToTree(res, '0')
      console.log(this.permissions)
    },
    // 点击文件展开children
    expandBtn(row) {
      row.isExpand = !row.isExpand
      this.$refs.table.toggleRowExpansion(row, row.isExpand)
    },
    // 关闭弹框事件
    btnCancel() {
      this.showDialog = false
      this.$refs.perForm.resetFields()
      this.formData.description = ''
    },
    // 确认添加事件
    async onSaveAdd() {
      // 表单校验
      await this.$refs.perForm.validate()
      // 发起添加的请求
      await setPermission(this.formData)
      this.$message.success('添加成功')
      this.showDialog = false
      this.getPermissionLists()
    },
    // 点击新增传数据
    showAddDialog(id, type) {
      this.formData.pid = id
      this.formData.type = type
      this.showDialog = true
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-table [class*='el-table__row--level'] .el-table__expand-icon {
  display: none;
}
.file-icon {
  cursor: pointer;
}
</style>
