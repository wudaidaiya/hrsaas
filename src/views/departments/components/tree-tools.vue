<template>
  <el-row type="flex" style="width: 100%">
    <!-- 左侧 -->
    <el-col>{{ treeNode.name }}</el-col>
    <!-- 右侧 -->
    <el-col :span="5">
      <el-row type="flex">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <el-dropdown>
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="$emit('add', treeNode)"
                >添加子部门</el-dropdown-item
              >
              <template v-if="!isRoot">
                <el-dropdown-item @click.native="$emit('edit', treeNode)"
                  >编辑部门</el-dropdown-item
                >
                <el-dropdown-item @click.native="onRemove"
                  >删除部门</el-dropdown-item
                >
              </template>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDeptsApi } from '@/api/departments'
export default {
  name: 'treeTools',
  props: {
    treeNode: {
      type: Object,
      required: true
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },

  created() {},

  methods: {
    // 操作下的    删除部门
    // delDeptsApi（）重新渲染页面
    async onRemove() {
      try {
        await this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await delDeptsApi(this.treeNode.id)
        // 重新渲染页面
        this.$message.success('删除成功')
        this.$emit('remove') //调用父组件的树形结构渲染
        // console.log(this.treeNode.id)
      } catch (e) {}
    }
  }
}
</script>

<style scoped></style>
