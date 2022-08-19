<template>
  <div>
    <el-upload
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      action="#"
      list-type="picture-card"
      :http-request="onRequest"
      :file-list="fileList"
      :on-change="onChange"
      :on-remove="onRemove"
      :on-preview="onPreview"
      :before-upload="beforeUpload"
      :limit="1"
      class="custom-upload"
      :class="fileList.list ? 'hide' : ''"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="visible"><img :src="imgUrl" alt="" /></el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
var cos = new COS({
  SecretId: 'AKIDPefS1LQIvKURggRxGKamqlU0NaP1PaWD',
  SecretKey: 'VmpdDZgYCdkfLnbHjy0qTt68wXu5we9R'
})
console.log(cos)

export default {
  name: 'UploadImage',
  data() {
    return {
      fileList: [],
      imgUrl: '',
      visible: false,
      loading: false
    }
  },

  created() {},

  methods: {
    onRequest({ file }) {
      // console.log('fasong')
      this.loading = true
      cos.putObject(
        {
          Bucket: 'laying-1313341590' /* 必须 */,
          Region: 'ap-nanjing' /* 存储桶所在地域，必须字段 */,
          Key: file.name /* 必须 */,
          StorageClass: 'STANDARD',
          Body: file, // 上传文件对象
          onProgress: function (progressData) {
            console.log(JSON.stringify(progressData))
          }
        },
        (err, data) => {
          this.loading = false
          if (err || data.statusCode !== 200) {
            return this.$message.error('上传失败，请重试')
          }
          this.$emit('onSuccess', { url: 'http://' + data.Location })
        }
      )
    },
    // 文件存下来
    onChange(file, fileList) {
      this.fileList = fileList
      //   console.log(this.fileList)
    },
    // 删除
    onRemove(file, fileList) {
      this.fileList = fileList
    },
    // 预览图片
    onPreview(file, fileList) {
      //   console.log(file)
      this.imgUrl = file.url
      this.visible = true
    },
    // 一般进行校验图片的格式
    beforeUpload(file) {
      const types = ['image/jpeg', 'image/gif', 'image/jpg']
      if (!types.includes(file.type)) {
        this.$message.error('请上传' + types.join('、') + '格式')
        // return false  返回false不会上传
        return false
      }

      //   图片大小
      const maxSize = 2 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('选择的图片不能超过2MB')
        return false
      }
      //   console.log(file)
    }
  }
}
</script>

<style scoped lang="scss">
.hide .el-upload--picture-card {
  display: none;
}
.custom-upload {
  width: 148px;
  height: 148px;
  overflow: hidden;
}
</style>
