<template>
  <div>
    <el-upload
       v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
      :file-list="fileList"
      action="#"
      :http-request="onRequest"
      :on-change="onChange"
      :on-remove="onRemove"
      :on-preview="onPreview"
      :before-upload="beforeUpload"
      :limit="1"
      list-type="picture-card"
      class="custom-upload"
      :class="fileList.length ? 'hide' : ''"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <!-- 弹层 -->
    <el-dialog :visible.sync="previewImgDialog">
      <img :src="imgUrl" />
    </el-dialog>
  </div>
</template>
<script>
import COS from "cos-js-sdk-v5";
// id：   AKIDiGZaLq54mDNWO0LSKwIOEo79vRhgQt5z
// key： f3A0YqqZ1C6JFvKSIrABvNZU8VbQyFFz
var cos = new COS({
  SecretId: "AKIDiGZaLq54mDNWO0LSKwIOEo79vRhgQt5z",
  SecretKey: "f3A0YqqZ1C6JFvKSIrABvNZU8VbQyFFz",
});
console.log(cos);
export default {
  name: "UploadImg",
  data() {
    return {
      fileList: [],
      previewImgDialog: false,
      imgUrl: "",
      loading:false
    };
  },
  created() {},
  methods: {
    onRequest({file}) {
        this.loading = true
      cos.putObject(
        {
          Bucket: "hm-dai-1313341664" /* 必须 */,
          Region: "ap-shanghai" /* 存储桶所在地域，必须字段 */,
          Key: file.name /* 必须 */,
          StorageClass: "STANDARD",
          Body: file, // 上传文件对象
          onProgress: function (progressData) {
            console.log(JSON.stringify(progressData));
          },
        },
        // 成功data    err=null失败
       (err, data) => {
        // 如果上传失败
          if(err || data.statusCode !== 200){
            return this.$message.error('上传失败')
          }
          this.$emit('onSuccess',{
            url:'http://'+data.Location,
          })
          this.loading = false
        }
      );
    },
    // 上传
    onChange(file, fileList) {
      this.fileList = fileList;
    },
    // 删除
    onRemove(file, fileList) {
      this.fileList = fileList;
    },
    // 预览
    onPreview(file) {
      this.previewImgDialog = true;
      this.imgUrl = file.url;
    },
    // 上传类型限制
    beforeUpload(file) {
      const types = ["image/jpeg", "image/gif"];
      if (!types.includes(file.type)) {
        this.$message.error("请选择" + types.join("、") + "图片");
        return false;
      }
      console.log("上传前检查", file);
      //   限制上传图片的大小
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        this.$message.error("选择的图片不能超出2mb");
        return false;
      }
    },
  },
};
</script>

<style lang="scss">
.hide .el-upload--picture-card {
  display: none;
}
.custom-upload {
  width: 148px;
  height: 148px;
  overflow: hidden;
}
</style>
