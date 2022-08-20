<template>
  <!-- 新增部门 -->
  <el-dialog :title="title" :visible="visible" width="50%" @close="onClose">
    <el-form
      ref="form"
      label-width="100px"
      :model="formData"
      :rules="formRules"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input placeholder="1-50个字符" v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input placeholder="1-50个字符" v-model="formData.code"></el-input>
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          placeholder="请选择负责人"
          style="width: 100%"
          v-model="formData.manager"
        >
          <el-option
            :label="item.username"
            :value="item.username"
            v-for="item in employeeList"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          type="textarea"
          placeholder="1-300个字符"
          v-model="formData.introduce"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">取 消</el-button>
      <el-button type="primary" @click="onSave">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getEmployeesListApi } from '@/api/employees'
import {
  getDeptsApi,
  addDept,
  getDeptByIdApi,
  editDeptByIdApi
} from '@/api/departments'
export default {
  components: {},
  data() {
    const checkDeptName = async (rule, value, callback) => {
      // 判断该部门是否有子部门  若没有则直接return
      if (!this.currentDept.children) return callback()
      // 若有id则是编辑
      if (this.formData.id) {
        // 发起获取部门数据
        const { depts } = await getDeptsApi()
        // 筛选除了自己以外的同级部门
        const isRepeat = depts
          .filter(
            (item) =>
              item.pid === this.formData.pid && item.id !== this.formData.pid
          )
          .some((item) => item.name !== value) //不能和同级其他部门重名
        // 重复则提示错误
        isRepeat ? callback(new Error('部门重复')) : callback()
      } else {
        // 判断同级是否有重复
        let isRepeat = this.currentDept.children.some(
          (item) => item.name === value
        )
        // 重复则提示错误
        isRepeat ? callback(new Error('部门重复')) : callback()
      }
    }
    const checkDeptCode = async (rule, value, callback) => {
      const { depts } = await getDeptsApi()
      let isRepeat
      if (this.formData.id) {
        isRepeat = depts
          .filter((item) => item.id !== this.formData.id)
          .some((item) => item.code === value)
      } else {
        // 判断是否编码有重复
        const isRepeat = depts.some((item) => item.code === value)
      }
      // 重复则提示错误
      isRepeat ? callback(new Error('部门编码重复')) : callback()
    }
    return {
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      // 负责人列表
      employeeList: [],
      // 规则
      formRules: {
        name: [
          { required: true, message: '请输入内容', trigger: 'blur' },
          // 自定义校验规则
          {
            trigger: 'change',
            validator: checkDeptName
          }
        ],
        code: [
          { required: true, message: '请输入内容', trigger: 'blur' },
          {
            trigger: 'change',
            validator: checkDeptCode
          }
        ],
        manager: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        introduce: [{ required: true, message: '请输入内容', trigger: 'blur' }]
      }
    }
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    currentDept: {
      type: Object,
      required: true
    }
  },
  created() {
    this.getEmployeesList()
  },
  methods: {
    async getEmployeesList() {
      const res = await getEmployeesListApi()
      this.employeeList = res
    },
    // 关闭事件
    onClose() {
      this.$emit('update:visible', false)
      // 重置校验规则
      this.$refs.form.resetFields()
      // 重置表单数据--清除id---区分添加以及编辑
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
    },
    // 添加部门
    async onSave() {
      // 编辑
      if (this.formData.id) {
        await editDeptByIdApi(this.formData)
        // 关闭弹框
        this.onClose()
        // 调用父组件的方法
        this.$parent.loadDepts()
        this.$message.success('编辑成功')

        // 添加
      } else {
        await this.$refs.form.validate()
        this.formData.pid = this.currentDept.id
        await addDept(this.formData)
        this.$message.success('添加部门成功')
        // 关闭弹框   checkDeptCode for the
        this.onClose()
        // 调用父组件的方法
        this.$parent.loadDepts()
      }
      // this.$message.error('操作部门失败')
    },
    async getDeptsById(id) {
      const res = await getDeptByIdApi(id)
      this.formData = res
    }
  },
  computed: {
    title() {
      return this.formData.id ? '编辑部门' : '添加部门'
    }
  }
}
</script>

<style scoped lang="scss"></style>
