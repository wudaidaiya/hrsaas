<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="box-card">
        <!-- 头部 -->
        <TreeTools :isRoot="true" :treeNode="company"></TreeTools>
        <!-- 树形 -->
        <el-tree :data="treeData" :props="defaultProps" default-expand-all>
          <template v-slot="{ data }">
            <TreeTools :treeNode="data" />
          </template>
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
import TreeTools from "./commponents/tree-tools.vue";
import { getDeptsApi } from "../../api/departments";
import { transListToTree } from "../../utils/index"
export default {
  data() {
    return {
      treeData: [
        { name: "总裁办", children: [{ name: "董事会" }] },
        { name: "行政部" },
        { name: "人事部" },
      ],
      defaultProps: {
        label: "name", //将data中那个数据名显示到树形页面中
        // children:'child' //树形默认查找子节点通过children
      },
      company: { name: "传智播客", manager: "负责人" },
    };
  },
  components: {
    TreeTools,
  },

  created() {
    this.loadDepts();
  },

  methods: {
    async loadDepts() {
      const res = await getDeptsApi();
      console.log(res);
      this.treeData = transListToTree(res.depts,'')
    },
  },
};
</script>

<style scoped lang="less"></style>
