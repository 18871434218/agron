<template>
  <div>
    <div :id="elId" class="container"></div>
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
    }
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
        trigger: 'axis',      
        color: "white",

        formatter: "{b}时 <br/>故障次数:{c}"
    
    },
      title: {
        text: this.title,
        top: 20,
        left: 20,
        textStyle: {
          color: "#ffffff",
          fontSize: 22,
          fontFamily: "Microsoft YaHei Regular",
          fontWeight: "normal"
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
      yAxis: {
        type: "value",
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
          data: this.items,
          type: "line",
          smooth: true,
          symbolSize:8,
          itemStyle: {
            normal: {
              color: "#00b4f0", //改变折线点的颜色
              lineStyle: {
                color: "#0080ff" //改变折线颜色
              }
            }
          }
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
  width: 730px;
  height: 338px;
  vertical-align: middle;
  display: inline-block;
}
</style>