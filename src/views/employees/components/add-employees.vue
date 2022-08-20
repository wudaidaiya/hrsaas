<template>
  <el-dialog title="新增员工" :visible="visible" width="50%" @close="onClose">
    <!-- 表单 -->
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
            v-for="item in hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
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
      <el-form-item label="部门">
        <el-select
          v-model="formData.departmentName"
          style="width: 50%"
          placeholder="请选择"
          @focus="getDepts"
          ref="treeNode"
        >
          <el-option value="" v-loading="isTreeLoading" class="treeOption">
            <el-tree
              :data="data"
              default-expand-all
              :props="treeProps"
              @node-click="treeNodeClick"
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
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="onClose">取消</el-button>
          <el-button type="primary" size="small" @click="onSave"
            >确定</el-button
          >
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import EmployeeEnum from '@/constant/employees'
import { getDeptsApi } from '@/api/departments'
import { transListToTree } from '@/utils/index'
import { addEmployee } from '@/api/employees'
const { hireType } = EmployeeEnum
export default {
  components: {},
  data() {
    return {
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 4,
            message: '用户姓名为1-4位'
          }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '手机号格式不正确',
            trigger: 'blur'
          }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: 'change' }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: 'change' }
        ],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      },
      hireType,
      data: [],
      treeProps: {
        label: 'name'
      },
      isTreeLoading: false
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  created() {},
  methods: {
    // 关闭弹框
    onClose() {
      this.$emit('update:visible', false)
      this.$refs.form.resetFields()
    },
    // 获取新增部门的树状数据
    async getDepts() {
      // 进入加载
      this.isTreeLoading = true
      // 发起请求
      const { depts } = await getDeptsApi()
      // 处理数据变成树桩数据
      transListToTree(depts, '')
      this.data = depts
      this.isTreeLoading = false
    },
    // 点击树状图
    treeNodeClick(val) {
      this.formData.departmentName = val.name
      this.$refs.treeNode.blur()
    },
    // 点击确定
    async onSave() {
      // 点击确认的时候进行表单校验
      await this.$refs.form.validate()
      try {
        await addEmployee(this.formData)
        this.$message.success('添加成功')
        this.onClose()
        this.$parent.getEmployeesInfo()
      } catch (error) {}
    }
  }
}
</script>

<style scoped lang="scss">
.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background-color: #fff;
  overflow: unset;
}
.treeOption {
  height: 200px;
}
</style>
