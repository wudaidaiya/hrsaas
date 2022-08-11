<template>
  <!-- 灰色弹层是el-dialog组件内部的 -->
  <!-- 组件内部点击灰色遮罩 在修改visible -->
  <el-dialog :title="titlele" :visible="visible" @close="onClose">
    <el-form
      :model="formData"
      :rules="formRules"
      ref="form"
      label-width="100px"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model="formData.name"
          placeholder="请输入部门名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          v-model="formData.code"
          placeholder="请输入部门编码"
        ></el-input>
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          v-model="formData.manager"
          style="width: 100%"
          placeholder="请选择部门负责人"
        >
          <el-option
            v-for="item in employess"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="formData.introduce"
          type="textarea"
          placeholder="请输入部门介绍"
        ></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">取 消</el-button>
      <el-button @click="onSeave" type="primary">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  getDeptsApi,
  addDeptsApi,
  putDeptsApi,
  editDeptsApi,
} from "../../../api/departments";
import { getEmployeesApi } from "../../../api/employess";
export default {
  data() {
    const checkDeptName = async (rule, value, callback) => {
      // 如果id存在那么就是编辑
      if (this.formData.id) {
        // 编辑  depts请求回来的数据
        const { depts } = await getDeptsApi();
        const filtersDepts = depts.filter(
          (item) =>
            item.pid === this.formData.pid && item.id !== this.formData.id
        );
        const isRepeat = filtersDepts.some((item) => item.name === value);
        isRepeat ? callback(new Error("部门重复")) : callback();
      }
      // 如果没有子部门直接返回
      if (!this.currentNode.children) return callback();
      // console.log(this.currentNode);
      // console.log(value);
      const isRepeat = this.currentNode.children.some(
        (item) => item.name === value
      );
      isRepeat ? callback(new Error("部门重复")) : callback();
    };
    const checkDeptCode = async (rule, value, cb) => {
      const { depts } = await getDeptsApi();
      let isRepeat;
      // 如果id存在那么就是编辑 先filter去除自己 再some筛选
      if (this.formData.id) {
        isRepeat = depts
          .filter((item) => item.id !== this.formData.id)
          .some((item) => item.code === value);
      } else {
        isRepeat = depts.some((item) => item.code === value);
      }

      isRepeat ? cb(new Error("部门编码重复")) : cb();
    };
    return {
      formData: {
        name: "", // 部门名称
        code: "", // 部门编码
        manager: "", // 部门管理者
        introduce: "", // 部门介绍
      },
      formRules: {
        name: [
          { required: true, message: "请输入部门名称", trigger: "blur" },
          {
            validator: checkDeptName,
            trigger: "blur",
          },
        ],
        code: [
          { required: true, message: "请输入部门编码", trigger: "blur" },
          {
            validator: checkDeptCode,
            trigger: "blur",
          },
        ],
        manager: [
          { required: true, message: "请输入部门负责人", trigger: "change" },
        ],
        introduce: [
          { required: true, message: "请输入部门介绍", trigger: "blur" },
        ],
      },
      employess: [],
    };
  },
  computed: {
    titlele() {
      return this.formData.id ? "编辑部门" : "添加部门";
    },
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    currentNode: {
      type: Object,
      required: true,
    },
  },
  created() {
    this.getEmployeesApi();
  },

  methods: {
    // 获取用户列表（简单）
    async getEmployeesApi() {
      // console.log(11);
      const res = await getEmployeesApi();
      this.employess = res;
      // console.log(this.employess);
    },
    // 关闭弹出框
    onClose() {
      this.$emit("update:visible", false);
      this.$refs.form.resetFields();
      this.formData = {
        name: "",
        code: "",
        manager: "",
        introduce: "",
      };
    },
    // 点击添加确定
    async onSeave() {
      await this.$refs.form.validate();
      // 如果id存在点击确定就是编辑
      if (this.formData.id) {
        await editDeptsApi(this.formData);
        this.$message.success("编辑成功");
        this.onClose();
        this.$emit("add-success");
      } else {
        this.formData.pid = this.currentNode.id;
        console.log(this.formData);
        console.log("表单校验成功");
        try {
          await addDeptsApi(this.formData);
          this.$message.success("新增部门成功");
          this.onClose();
          this.$emit("add-success");
        } catch (error) {
          this.$message.error("新增部门失败");
        }
      }
    },
    // 点击编辑触发
    async getDeptById(id) {
      this.formData = await putDeptsApi(id);
    },
  },
};
</script>

<style scoped></style>
