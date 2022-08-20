<template>
  <el-row type="flex" style="width: 100%">
    <el-col>{{ treeNode.name }}</el-col>
    <el-col :span="4">
      <el-row type="flex">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <el-dropdown>
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <!-- 将数据传到父组件 -->
              <el-dropdown-item @click.native="$emit('add', treeNode)"
                >添加部门</el-dropdown-item
              >
              <!-- 头部公司不用 -->
              <template v-if="!isRoot">
                <el-dropdown-item @click.native="$emit('edit',treeNode)"
                  >编辑部门</el-dropdown-item
                >
                <el-dropdown-item @click.native="removeBtn"
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
import { delDeptsInfoApi } from '@/api/departments'
export default {
  name: 'Tree',
  components: {},
  data() {
    return {}
  },
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
  created() {},
  methods: {
    // 删除部门
    async removeBtn() {
      try {
        await this.$confirm('是否删除该部门?', '提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await delDeptsInfoApi(this.treeNode.id)
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        // this.$parent.loadDepts()
        this.$emit('delDepts')
      } catch (error) {}
    },

  }
}
</script>

<style scoped lang="scss"></style>
