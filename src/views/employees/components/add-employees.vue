<template>
  <el-dialog @close="onClose" title="新增员工" :visible="visible" width="50%">
    <el-form :model="formData" :rules="rules" label-width="120px" ref="form">
      <el-form-item label="姓名" prop="username">
        <el-input
          v-model="formData.username"
          style="width: 50%"
          placeholder="请输入姓名"
        />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input
          v-model="formData.mobile"
          style="width: 50%"
          placeholder="请输入手机号"
        />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker
          v-model="formData.timeOfEntry"
          style="width: 50%"
          placeholder="请选择日期"
        />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select
          v-model="formData.formOfEmployment"
          style="width: 50%"
          placeholder="请选择"
        >
          <el-option
            v-for="item in employees.hireType"
            :key="item.id"
            :lobel="item.value"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input
          v-model="formData.workNumber"
          style="width: 50%"
          placeholder="请输入工号"
        />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <!-- <el-input
          v-model="formData.departmentName"
          style="width: 50%"
          placeholder="请选择部门"
        /> -->
        <el-select
          @focus="getDepts"
          v-model="formData.departmentName"
          placeholder="请选择部门"
          ref="deptSelect"
        >
          <el-option class="treeoption" value="">
            <el-tree
              @node-click="treeNodeClick"
              :data="depts"
              :props="treeProps"
            ></el-tree>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker
          v-model="formData.correctionTime"
          style="width: 50%"
          placeholder="请选择日期"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">取 消</el-button>
      <el-button type="primary" @click="onSave">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import employees from "@/constant/employees";
import {addEmployee} from "../../../api/employess";
import { getDeptsApi} from "../../../api/departments";
import { transListToTree } from "../../../utils";
export default {
  data() {
    return {
      employees,
      value: "",
      treeData: [], // 定义数组接收树形数据
      showTree: false, // 控制树形的显示或者隐藏
      loading: false, // 控制树的显示或者隐藏进度条
      formData: {
        username: "",
        mobile: "",
        formOfEmployment: "",
        workNumber: "",
        departmentName: "",
        timeOfEntry: "",
        correctionTime: "",
      },
      rules: {
        username: [
          { required: true, message: "用户姓名不能为空", trigger: "blur" },
          {
            min: 1,
            max: 4,
            message: "用户姓名为1-4位",
          },
        ],
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "手机号格式不正确",
            trigger: "blur",
          },
        ],
        formOfEmployment: [
          { required: true, message: "聘用形式不能为空", trigger: "change" },
        ],
        workNumber: [
          { required: true, message: "工号不能为空", trigger: "blur" },
        ],
        departmentName: [
          { required: true, message: "部门不能为空", trigger: "change" },
        ],
        timeOfEntry: [
          { required: true, message: "入职时间", trigger: "change" },
        ],
      },
      depts: [],
      treeProps: {
        label: "name",
      },
    };
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },

  created() {
    console.log(this.employees);
  },

  methods: {
    // 关闭对话框
    onClose() {
      this.$emit("update:visible", false);
    },
    async getDepts() {
      this.isTreeLoading = true;
      const { depts } = await getDeptsApi();
      transListToTree(depts, "");
      console.log(depts);
      this.depts = depts;
      this.isTreeLoading = false;
    },
    treeNodeClick(row) {
      this.formData.departmentName = row.name;
      this.$refs.deptSelect.blur();
    },
    onSave() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;
       await addEmployee(this.formData)
       this.$message.success('添加成功')
       this.onClose()
       this.$emit('add-success')
      });
    },
  },
};
</script>

<style scoped lang="scss">
// 树形样式
.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover .el-select-dropdown__item {
  background-color: #fff;
  overflow: unset;
}
.treeoption {
  height: 100px;
}
</style>
