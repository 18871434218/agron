<template>
  <div>
    <div  :id="elId" class="container"></div>
  </div>
</template>

<script>
// 引入基本模板
import echarts from "echarts";
//引入uuid文件
import uuidv1 from "uuid/v1";
export default {
  props: {
    topics: {
      default() {
        return "王先生";
      }
    },
    items: {
      type: Array,
      default() {
        return [];
      }
    },

  },
  data() {
    return {
      elId: ""
    };
  },
  created() {
    this.elId = uuidv1(); //获取随机id
  },
  mounted() {
    let values = [];
    this.items.forEach(el => {
      values.push(el.value);
    });
    const option = {
      tooltip: {
        color: "white",
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },

      color: ["#00fff5", "#ffc028", "#0080ff",  "#00b4f0", "#6300ff"],

      legend: {
        orient: "vertical",
        right: 0,
        data: this.topics,
        textStyle: {
          color: "#ffffff"
        }
      },
      series: [
        {
          name: "机器人状态",
          right:40,
          type: "pie",
          radius: ["50%", "70%"],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: "center"
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "30",
              fontWeight: "bold"
            }
          },
          labelLine: {
            show: false
          },
          data: this.items
        }
      ]
    };
    const chartObj = echarts.init(document.getElementById(this.elId));
    chartObj.setOption(option);
  }
};
</script>
<style scoped>
.container {
  width: 400px;
  height: 378px;
  vertical-align: middle;
  display: inline-block;
}
</style>
