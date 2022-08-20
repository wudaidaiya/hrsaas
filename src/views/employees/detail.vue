<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane name="one" label="登录账户设置">
            <!-- 放置表单 -->
            <el-form
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
          <el-tab-pane name="two" label="个人详情">
            <UserInfo></UserInfo>
          </el-tab-pane>
          <el-tab-pane name="three" label="岗位信息" >
            <JobInfo />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { getUserDetail } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
import UserInfo from '@/views/employees/components/user-info.vue'
import JobInfo from '@/views/employees/components/job-info.vue'
export default {
  components: {},
  data() {
    return {
      activeName: Cookies.get('active') || 'one',
      formData: {}
    }
  },
  components: {
    UserInfo,
    JobInfo
  },
  created() {
    this.loadingUserInfo()
  },
  methods: {
    // 获取用户id发起请求获取详情
    async loadingUserInfo() {
      const res = await getUserDetail(this.$route.params.id)
      this.formData = res
    },
    // 更新数据
    async onSave() {
      await saveUserDetailById(this.formData)
      this.$message.success('更新成功')
      this.$router.go(-1)
    },
    handleClick() {
      Cookies.set('active', this.activeName)
    }
  }
}
</script>

<style scoped lang="scss"></style>
