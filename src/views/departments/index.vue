<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="box-card">
        <!-- 头部 -->
        <TreeTools
          @add="dialogVisible = true"
          :isRoot="true"
          :treeNode="company"
        ></TreeTools>
        <!-- 树形 -->
        <el-tree  v-loading="loading" :data="treeData" :props="defaultProps" default-expand-all>
          <template v-slot="{ data }">
            <TreeTools
              @add="showAddDept"
              @remove="loadDepts"
               @emid='showEdit'
              :treeNode="data"
            />
          </template>
        </el-tree>
      </el-card>
    </div>
    <!-- 添加部门 -->
    <add-dept ref='addDept' @add-success='loadDepts' :visible.sync="dialogVisible" :currentNode='currentNode' />
  </div>
</template>

<script>
import TreeTools from "./commponents/tree-tools.vue";
import { getDeptsApi } from "../../api/departments";
import { transListToTree } from "../../utils/index";
import AddDept from "./commponents/add-dept.vue";
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
      dialogVisible: false,
      currentNode:{},
      loading:false,
    };
  },
  components: {
    TreeTools,
    AddDept,
  },

  created() {
    this.loadDepts();
  },

  methods: {
    // 树形列表
    async loadDepts() {
      this.loading= true
      const res = await getDeptsApi();
      // console.log(res);
      this.treeData = transListToTree(res.depts, "");
      this.loading= false
    },
    // 弹框
    showAddDept(val) {
      this.dialogVisible = true;
      this.currentNode = val

    },
    // 编辑触发
    showEdit(val){
      this.dialogVisible = true;
      this.$refs.addDept.getDeptById(val.id)
    }
  },
};
</script>

<style scoped lang="less"></style>
