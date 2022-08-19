<template>
  <div>
    <el-dialog
      title="分配角色"
      :visible="visible"
      @close="close"
      @open="onOpen"
    >
      <el-checkbox-group v-model="checkedList">
        <el-checkbox :label="item.id" v-for="item in rows" :key="item.id">
          {{ item.name }}
        </el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="assignRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRolesApi } from '@/api/role'
import { getUserDetail } from '@/api/user'
import { assignRoles } from '@/api/employees'

export default {
  name: 'AssignRoleDialog',

  data() {
    return {
      checkedList: [],
      //   员工列表
      rows: []
    }
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    currentEmployeesId: {
      type: String,
      required: true
    }
  },
  created() {},

  methods: {
    close() {
      this.$emit('update:visible', false)
    },

    // 对话框打开的时候触发，if/open
    async onOpen() {
      this.getRolesApi() //总的角色列表
      this.getUserDetail() //获取原有的选中角色
    },
    //总的弹层---角色列表
    async getRolesApi() {
      const res = await getRolesApi()
      this.rows = res.rows
    },
    // 获取已有的角色
    async getUserDetail() {
      const res = await getUserDetail(this.currentEmployeesId)
      // 获取已有的角色给checkedList----element默认的选中的数组
      this.checkedList = res.roleIds
    },

    async assignRole() {
      if (!this.checkedList.length) return this.$message.error('请选择角色')
      await assignRoles({
        id: this.currentEmployeesId,
        roleIds: this.checkedList
      })
      this.$message.success('分配角色成功')
      this.close()
    }
  }
}
</script>

<style scoped></style>
