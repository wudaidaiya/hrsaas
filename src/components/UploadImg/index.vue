<template>
  <div>
    <el-upload
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      action="#"
      list-type="picture-card"
      :http-request="upImg"
      :file-list="fileList"
      :on-change="onChange"
      :on-remove="onRemove"
      :on-preview="onPreview"
      :limit="1"
      :class="fileList.length ? 'hide' : ''"
      class="upCard"
      :before-upload="beforeUpload"
    >
      <i class="el-icon-plus"></i>
    </el-upload>

    <el-dialog :visible.sync="showImg">
      <img :src="imgSrc" style="width: 100%" />
    </el-dialog>
  </div>
</template>

<script>
// id:AKIDd6IDsGNDm45pJWT9droUs0rRknY2FCsH
// key:91cx1oKZXEenfGadPu86nDMEo79uPebH

import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDd6IDsGNDm45pJWT9droUs0rRknY2FCsH',
  SecretKey: '91cx1oKZXEenfGadPu86nDMEo79uPebH'
})
console.log(cos)
export default {
  name: 'UploadImg',
  components: {},
  data() {
    return {
      fileList: [],
      imgSrc: '',
      showImg: false,
      loading: false
    }
  },
  created() {},
  methods: {
    upImg({ file }) {
      this.loading = true
      // console.log(111);
      cos.putObject(
        {
          Bucket: 'rz-31-1313341602' /* 填入您自己的存储桶，必须字段 */,
          Region: 'ap-shanghai' /* 存储桶所在地域，例如ap-beijing，必须字段 */,
          Key: file.name,
          StorageClass: 'STANDARD',
          Body: file, // 上传文件对象
          onProgress: function (progressData) {
            console.log(JSON.stringify(progressData))
          }
        },
        (err, data) => {
          this.loading = false
          if (err || data.statusCode !== 200) {
            return this.$message.error('上传失败，请重试！！')
          }
          //   console.log(data)
          this.$emit('onSuccess', {
            url: 'http://' + data.Location
          })
        }
      )
    },
    onChange(file, fileList) {
      this.fileList = fileList
    },
    onRemove(file, fileList) {
      this.fileList = fileList
    },
    onPreview(file) {
      this.showImg = true
      this.imgSrc = file.url
    },
    beforeUpload(file) {
      const types = ['image/jpeg', 'image/gif', 'image/png']
      //   判断是否存在规则数组中
      if (!types.includes(file.type)) {
        this.$message.error(`请选择${types.join('或')}格式的图片`)
        return false
      }
      //   限制图片上传大小
      const maxSize = 2 * 1024 * 1024

      if (file.size > maxSize) {
        this.$message.error(`上传图片不能大于2mb`)
        return false
      }
    }
  }
}
</script>

<style lang="scss">
.hide .el-upload--picture-card {
  display: none;
}
.upCard {
  width: 148px;
  height: 148px;
  overflow: hidden;
}
</style>
