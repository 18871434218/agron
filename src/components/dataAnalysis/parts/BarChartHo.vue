<template>
<!-- 就这个动态加载数据，其他的图表都不是动态的 -->
  <div>
    <div div :id="elId" class="container"></div>
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
    title: {
      type: String
    },
    unit: {
      type: String,
      default() {
        return "";
      }
    }
  },
  data() {
    return {
      elId: "",
      option: null,
      chartObj:null
    };
  },
  watch: {
    items: {
      handler(val) {
        this.option.series[0].data = val;
        this.chartObj.setOption(this.option);
      },
      deep: true
    },
    unit: {
      handler(val) {
        this.option.yAxis.formatter = "{b}:{c}" + val;
        this.chartObj.setOption(this.option);
      },
      deep: true
    }
  },
  created() {
    this.elId = uuidv1(); //获取随机id
  },
  mounted() {
    this.option = {
      color: new echarts.graphic.LinearGradient(
        0,
        0,
        0,
        1, //4个参数用于配置渐变色的起止位置, 这4个参数依次对应右/下/左/上四个方位. 而0 0 0 1则代表渐变色从正上方开始
        [
          { offset: 0, color: "#00fff5" },
          { offset: 1, color: "#00b4f0" }
        ] //数组, 用于配置颜色的渐变过程. 每一项为一个对象, 包含offset和color两个参数. offset的范围是0 ~ 1, 用于表示位置
      ),
      title: {
        text: this.title,
        left: 20,
        top: 20,
        textStyle: {
          color: "#ffffff",
          fontSize: 22,
          fontFamily: "Microsoft YaHei Regular",
          fontWeight: "normal"
        }
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        },
        formatter: "{b}:{c}" + this.unit
      },

      grid: {
        left: "3%",
        right: "6%",
        bottom: "0%",
        top: "30%",
        containLabel: true
      },
      yAxis: {
        name: this.unit,
        type: "value",
        boundaryGap: [0, 0.01],
        axisLine: {
          lineStyle: {
            color: "#ffffff",
            fontSize: 12,
            fontFamily: "Microsoft YaHei Regular",
            fontWeight: "normal"
          }
        }
      },
      xAxis: {
        type: "category",
        data: this.topics,
        axisLine: {
          lineStyle: {
            color: "#ffffff",
            fontSize: 12,
            fontFamily: "Microsoft YaHei Regular",
            fontWeight: "normal"
          }
        }
      },
      series: [
        {
          type: "bar",
          data: this.items
        }
      ]
    };
    this.chartObj = echarts.init(document.getElementById(this.elId));
    this.chartObj.setOption(this.option);
  }
};
</script>
<style scoped>
.container {
  width: 700px;
  height: 308px;
  vertical-align: middle;
  display: inline-block;
}
</style>