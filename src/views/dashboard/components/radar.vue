<template>
  <div class="redar" ref="main">雷达图</div>
</template>
<script>
import * as echarts from 'echarts'
export default {
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
    initRader() {
      // 使用刚指定的配置项和数据显示图表。
      var myChart = echarts.init(this.$refs.main)
      myChart.setOption({
        title: {
          text: '基础雷达图'
        },
        tooltip: {},
        legend: {
          data: ['张三', '李四']
        },
        radar: {
          // shape: 'circle',
          name: {
            textStyle: {
              color: '#fff',
              backgroundColor: '#999',
              borderRadius: 3,
              padding: [3, 5]
            }
          },
          // 每个区域的最高值
          indicator: [
            { name: '工作效率', max: 100 },
            { name: '考勤', max: 100 },
            { name: '积极性', max: 100 },
            { name: '帮助同事', max: 100 },
            { name: '自主学习', max: 100 },
            { name: '正确率', max: 100 }
          ]
        },
        series: [
          {
            name: '预算 vs 开销（Budget vs spending）',
            type: 'radar',
            // areaStyle: {normal: {}},
            data: [
              {
                value: [10, 1, 100, 5, 100, 0],
                name: '张三'
              },
              {
                value: [50, 50, 50, 50, 50, 10],
                name: '李四'
              }
            ]
          }
        ]
      })
    }
  },
  created() {},
  updated() {},
  mounted() {
    this.initRader()
  },
  filters: {},
  computed: {},
  watch: {}
}
</script>
<style lang="scss" scoped>
.redar {
  width: 500px;
  height: 500px;
}
</style>
