<template>
  <div style="margin: 0 15px">
    <svg-icon
      @click="onFullScreen"
      className="fullscreen"
      iconClass="fullscreen"
    ></svg-icon>
  </div>
</template>
<script>
import screenfull from 'screenfull'
export default {
  name: 'Fullscreen',
  data() {
    return {}
  },
  props: {
    obj: {
      type: Object,
      default: () => {}
    }
  },
  components: {},
  methods: {
    // 第一步下包
    // 引入
    // 配置点击全屏
    onFullScreen() {
      if (screenfull.isEnabled) {
        screenfull.toggle()
      }
    }
  },
  created() {},
  updated() {},
  mounted() {},
  filters: {},
  computed: {},
  watch: {}
}
</script>
<style lang="scss" scoped>
.fullscreen {
  color: #fff;
}
</style>
