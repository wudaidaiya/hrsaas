<template>
  <el-dialog
    title="分配角色"
    :visible="visible"
    @close="onClose"
    @open="onOpen"
  >
    <!-- 多选框 -->
    <el-checkbox-group v-model="checkList">
      <el-checkbox v-for="item in roles" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <span slot="footer" class="dialog-footer">
      <center>
        <el-button @click="onClose">取 消</el-button>
        <el-button type="primary" @click="assignRoles">确 定</el-button>
      </center>
    </span>
  </el-dialog>
</template>

<script>
import { getEmployeeApi } from '@/api/setting'
import { getUserDetail } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  data() {
    return {
      checkList: [],
      roles: []
    }
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    currentId: {
      type: String
    }
  },
  created() {},
  methods: {
    onClose() {
      this.$emit('update:visible', false)
    },
    // 获取多选数据
    async getRolesList() {
      const { rows } = await getEmployeeApi()
      this.roles = rows
    },
    // 获取员工角色
    async getEmployeesRoles() {
      const { roleIds } = await getUserDetail(this.currentId)
      this.checkList = roleIds
    },
    onOpen() {
      this.getRolesList()
      this.getEmployeesRoles()
    },
    // 确认分配角色
    async assignRoles() {
        // 若数组长度为0 则未分配
      if (!this.checkList.length) return this.$message.error('至少分配一个角色')
    //   发起请求
      await assignRoles({
        id: this.currentId,
        roleIds: this.checkList
      })
      this.$message.success('分配成功')
      this.onClose()
    }
  }
}
</script>
