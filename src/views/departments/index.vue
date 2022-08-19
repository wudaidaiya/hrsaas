<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="box-card">
        <!-- 1 封装的组件-->
        <tree-tools @add="showAddDept" :treeNode="company" :isRoot="true" />
        <!-- 2 el-tree   element组件-->
        <el-tree
          :data="treeData"
          :props="defaultProps"
          default-expand-all
          v-loading="loading"
        >
          <!-- { name: '总裁办', manager: '张三' } -->
          <!-- <template v-slot="scope.data"> -->
          <template v-slot="{ data }">
            <tree-tools
              @add="showAddDept"
              :treeNode="data"
              @remove="getDepts"
              @edit="showEdit"
            >
            </tree-tools>
          </template>
        </el-tree>
      </el-card>
    </div>
    <!-- 将点击的treeNode传递给add组件 -->
    <!-- 添加部门的弹层 -->
    <!--    :visible.sync="dialogVisible"  应用的。 -->
    <add-dept
      ref="addDept"
      @add-success="getDepts"
      :visible.sync="dialogVisible"
      :currentNode="currentNode"
    ></add-dept>
  </div>
</template>

<script>
import treeTools from './components/tree-tools'
import { getDeptsApi } from '@/api/departments'
import { transListToTree } from '@/utils/index'
import AddDept from './components/add-dept.vue'
export default {
  components: {
    treeTools,
    AddDept
  },
  data() {
    return {
      treeData: [
        { name: '总裁办', children: [{ name: '董事会' }] },
        { name: '行政部' },
        { name: '人事部' }
      ],
      defaultProps: { label: 'name' },
      company: { name: '传智教育', manager: '负责人' },
      // 弹层
      dialogVisible: false,
      // 穿递给add   treenode
      currentNode: {},
      loading: false
    }
  },

  created() {
    this.getDepts()
  },

  methods: {
    // 数据,页面重新渲染
    async getDepts() {
      this.loading = true
      const res = await getDeptsApi()
      // console.log(res)
      this.treeData = transListToTree(res.depts, '')
      // console.log(this.treeData)
      this.loading = false
    },
    // 点击显示弹层
    showAddDept(val) {
      this.currentNode = val
      this.dialogVisible = true
    },
    // 发送请求需要id,需要从tree===>传点击的那个部门给index父组件中====传给add
    showEdit(val) {
      this.dialogVisible = true
      this.$refs.addDept.getDeptById(val.id)
    }
  }
}
</script>

<style scoped lang="less"></style>
