<template>
  <el-dropdown style="margin: 0 5px" @command="Oncommand">
    <span class="el-dropdown-link">
      <svg-icon style="color: #fff; font-size: 20px" icon-class="language" />
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        :disabled="key === $i18n.locale"
        v-for="(value, key) in messages"
        :key="key"
        :command="key"
        >{{ value.name }}</el-dropdown-item
      >
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
import { messages } from '@/i18n'
import Cookie from 'js-cookie'
export default {
  name: 'ToggleLang',
  data() {
    return {
      messages
    }
  },
  props: {
    obj: {
      type: Object,
      default: () => {}
    }
  },
  components: {},
  methods: {
    Oncommand(val) {
      console.log(val)
      this.$root.$i18n.locale = val
      this.$router.go(0)
      Cookie.set('lang', val)
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
<style lang="less" scoped></style>
