<template>
  <!-- 关于弹层的组件   包含表单  title计算属性显示-->
  <el-dialog
    :title="dialogDeftName"
    :visible="visible"
    width="50%"
    @close="onClose"
  >
    <el-form
      ref="form"
      label-width="100px"
      :model="formData"
      :rules="formRules"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input
          placeholder="请输入部门名称"
          v-model="formData.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          placeholder="请输入部门编码"
          v-model="formData.code"
        ></el-input>
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          placeholder="请选择部门负责人"
          style="width: 100%"
          v-model="formData.manager"
        >
          <el-option
            v-for="item in employees"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          type="textarea"
          placeholder="请输入部门介绍"
          v-model="formData.introduce"
        ></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <!-- onClose onSave  是自定义的事件，element的组件绑定的是@click设置false -->
      <el-button @click.native="onClose">取 消</el-button>
      <el-button type="primary" @click="onSave">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
// 获取数据、添加部门、编辑部门
import {
  getDeptsApi,
  addDeptApi,
  editDeptApi,
  setEditDeptsApi
} from '@/api/departments'
import { getEmployeesApi } from '@/api/employees'
export default {
  name: 'AddDept',

  data() {
    // 自定义校验规则
    const checkDeptName = async (rule, value, callback) => {
      if (this.formData.id) {
        const { depts } = await getDeptsApi()
        const filtersDepts = depts.filter(
          (item) =>
            item.pid === this.formData.pid && item.id !== this.formData.id
        )
        // 不能是一级其他部门，可以是自己
        const isRepeat = filtersDepts.some((item) => item.name === value)
        isRepeat ? callback(new Error('部门重复')) : callback()
      } else {
        // 对于没有children的组织架构的，，直接调用callback，否则报错
        if (!this.currentNode.children) return callback()
        const isRepeat = this.currentNode.children.some(
          (item) => item.name === value
        )
        isRepeat ? callback(new Error('部门重复')) : callback()
      }
    }

    //编码重复
    const checkDeptCode = async (rule, value, cb) => {
      const { depts } = await getDeptsApi()
      let isRepeat
      if (this.formData.id) {
        // 编辑
        // 先筛选剔除点击的这个id,再添加数据
        isRepeat = depts
          .filter((item) => item.id !== this.formData.id)
          .some((item) => item.code === value)
      } else {
        // 添加
        isRepeat = depts.some((item) => item.code === value)
      }

      isRepeat ? cb(new Error('编码重复')) : cb()
    }
    return {
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      formRules: {
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
          {
            validator: checkDeptName,
            trigger: 'blur'
          }
        ],
        code: [
          { required: true, message: '请输入部门编码', trigger: 'blur' },
          {
            validator: checkDeptCode,
            trigger: 'blur'
          }
        ],
        manager: [
          // trigger: 'change'触发的时机是变化的时候而不是失去焦点的时候
          { required: true, message: '请输入部门负责人', trigger: 'change' }
        ],
        introduce: [
          { required: true, message: '请输入部门介绍', trigger: 'blur' }
        ]
      },
      employees: []
    }
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    // 父传子的变量treenode
    currentNode: {
      type: Object,
      required: true
    }
  },
  created() {
    this.getEmployees()
  },
  computed: {
    dialogDeftName() {
      return this.formData.id ? '编辑部门' : '添加部门'
    }
  },
  methods: {
    // 部门负责人
    async getEmployees() {
      const res = await getEmployeesApi()
      this.employees = res
      // console.log(res)
    },
    onClose() {
      this.$emit('update:visible', false)
      //
      this.$refs.form.resetFields()
      //
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
    },
    // 取消和确定需要单独去写逻辑，删除自带的@click事件
    // 确定按钮
    async onSave() {
      await this.$refs.form.validate()
      if (this.formData.id) {
        // 提交编辑后的数据
        await setEditDeptsApi(this.formData)
        this.$message.success('编辑成功')
        this.onClose()
        this.$emit('add-success')
      } else {
        // 😤😤没有id,,添加的请求方式
        // 点击之前去检验表单
        // 缺少数据  父级部门的id  可以使用currentnode中的
        this.formData.pid = this.currentNode.id
        // console.log(this.formData)
        await addDeptApi(this.formData)
        this.$message.success('新增部门成功')
        this.onClose()
        this.$emit('add-success')
      }
    },
    //弹窗组件===获取编辑数据，用起来比较方便，触发方式是点击编辑的时候
    async getDeptById(id) {
      // 回显数据
      this.formData = await editDeptApi(id)
    }
  }
}
</script>

<style scoped></style>
