<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <el-tab-pane label="登录账户设置" name="account">
            <!-- 放置表单 -->
            <el-form
              :model="formData"
              label-width="120px"
              style="margin-left: 120px; margin-top: 30px"
            >
              <el-form-item label="姓名:">
                <el-input style="width: 300px" v-model="formData.username" />
              </el-form-item>
              <el-form-item label="密码:">
                <el-input
                  style="width: 300px"
                  type="password"
                  v-model="formData.password"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSave">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情" name="detail"
            ><userInfo></userInfo
          ></el-tab-pane>
          <el-tab-pane label="岗位信息" name="job">
            <jobInfo />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetail, saveUserDetail } from '@/api/user'
import userInfo from './components/user-info.vue'
import Cookies from 'js-cookie'

import jobInfo from './components/job-info.vue'
export default {
  data() {
    return {
      formData: {},
      activeName: Cookies.get('employeeDetailTab') || 'account'
    }
  },
  components: {
    userInfo,
    jobInfo
  },
  created() {
    this.getUserDetail()
  },

  methods: {
    async getUserDetail() {
      const res = await getUserDetail(this.$route.params.id)
      console.log(res)
      this.formData = res
    },
    async onSave() {
      await saveUserDetail(this.formData, this.$route.params.id)
      this.$message.success('保存成功')
    },
    handleTabClick() {
      Cookies.set('employeeDetailTab', this.activeName)
    }
  }
}
</script>

<style scoped></style>
