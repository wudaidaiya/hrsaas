<template>
  <!-- 删除 :visible="visible"  里的sync-->
  <el-dialog title="新增员工" :visible="visible" width="50%" @close="onClose">
    <el-form ref="form" :model="formData" :rules="rules" label-width="120px">
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
          </el-option
        ></el-select>
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
          placeholder="请选择"
          ref="deptSelect"
        >
          <el-option value="" v-loading="loading" class="treeOption">
            <el-tree
              :data="depts"
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
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">取 消</el-button>
      <el-button type="primary" @click="onSave">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import employees from '@/constant/employees'
const { hireType } = employees
import { getDeptsApi } from '@/api/departments'
import { transListToTree } from '@/utils/index'
import { addEmployee } from '@/api/employees'
export default {
  name: 'Employees',
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
      depts: [],
      treeProps: { label: 'name' },
      loading: false
    }
  },
  props: {
    visible: { type: Boolean, required: true }
  },
  created() {},

  methods: {
    // 点击取消，确定关闭，清空
    onClose() {
      this.$emit('update:visible', false)
      // 清空form-resetFields
      this.$refs.form.resetFields()
    },
    async getDepts() {
      this.loading = true
      const { depts } = await getDeptsApi()
      // console.log(depts)
      this.depts = transListToTree(depts, '')
      this.loading = false
    },
    // el-tree   @node-click="treeNodeClick"
    treeNodeClick(row) {
      this.formData.departmentName = row.name
      // 让select关闭 通过blur,点击节点，触发下面的事件
      this.$refs.deptSelect.blur()
    },
    onSave() {
      // validate参数回调
      this.$refs.form.validate(async (valid) => {
        if (!valid) return
        await addEmployee(this.formData)
        this.$message.success('添加成功')
        this.onClose()
        this.$emit('add-success')
      })
    }
  }
}
</script>

<style scoped>
.treeOption {
  background-color: #fff;
  overflow: unset;
  height: 100px;
}
</style>
