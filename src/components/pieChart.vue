<template>
  <div ref="pieChart" id="pieChart" style="width: 100%; height: 100%;" class="mychart"></div>
</template>

<script>
import { onMounted, reactive, toRefs, getCurrentInstance } from "vue";
export default {
  props:[
    'data'
  ],
  setup(props,context) {
    onMounted(() => {
      // 渲染图表
      console.log(props.data);
      state.option.series[0].data = props.data;
      const pieChart = proxy.$echarts.init(document.getElementById('pieChart'));
      pieChart.setOption(state.option);
      window.onresize = () => {
        pieChart.resize()
      }
      context.emit('pieChartLoadingClose');
    });
    const { proxy } = getCurrentInstance() // proxy是组件实例化对象
    const state = reactive({
      option: {
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['30%', '80%'],
            center: ['30%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 5,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: []
          }
        ],
        tooltip: {
            trigger: 'item'
        },
        legend: {
          show: true,
          type: 'scroll',
          top: '1%',
          orient: 'vertical',
          right: 10,
          bottom: 20,
        },
        // grid: [{ bottom: '15%' }, { top: '55%' }],
      },
    });
    
    return {
      ...toRefs(state), proxy
    };
  },
};
</script>

<style lang="scss" scoped>
.mychart{
  margin: -10px 0 -35px 0;
}
</style>