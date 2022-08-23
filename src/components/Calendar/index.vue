<template>
  <div>
    <el-row type="flex" justify="end">
      <el-col :span="5">
        <el-select
          @change="updateCalendar"
          v-model="currentYear"
          placeholder="请选择"
        >
          <el-option
            v-for="item in years"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select
          @change="updateCalendar"
          v-model="currentMonth"
          placeholder="请选择"
        >
          <el-option v-for="item in 12" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <!-- 日历 -->
    <el-calendar v-model="currentDate">
      <template v-slot:dateCell="{ date }">
        <div class="cell-box">
          {{ date.getDate() }}
          <span v-if="isWeek(date)">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>
<script>
export default {
  name: 'Calendar',
  data() {
    return {
      currentYear: '',
      currentMonth: '',
      years: [], //当年的时间+前5年+后5年
      currentDate: ''
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
    initCaldndar() {
      const date = new Date()
      this.currentYear = date.getFullYear() //当前年
      this.currentMonth = date.getMonth() + 1
      this.years = Array(11)
        .fill(this.currentYear - 5)
        .map((item, i) => item + i)
    },
    isWeek(date) {
      return date.getDay() === 6 || date.getDay() === 0
    },
    updateCalendar() {
      this.currentDate = this.currentYear + '-' + this.currentMonth //把当前年月赋值给输入框
    }
  },
  created() {
    this.initCaldndar()
  },
  updated() {},
  mounted() {},
  filters: {},
  computed: {},
  watch: {}
}
</script>
<style lang="scss" scoped>
::v-deep .el-calendar {
  .el-calendar__header {
    display: none;
  }
  .el-calendar-table td {
    border: none !important;
  }
  .cell-box {
    color: blueviolet;
    display: flex;
    justify-content: center;
    height: 100%;
    align-items: center;
  }
  span {
    width: 25px;
    height: 25px;
    line-height: 25px;
    border-radius: 50%;
    text-align: center;
    background-color: #fa7c4d;
    margin-left: 5px;
    color: #fff;
  }
}
</style>
