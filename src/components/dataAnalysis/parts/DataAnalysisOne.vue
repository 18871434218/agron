<template>
  <div style="margin-left:25px">
    <el-row :gutter="20">
      <el-col :lg="12">
        <el-row style="height: 378px; background:rgba(255, 255, 255, 0.1);">
          <el-col :lg="24" style="margin-top:10px;">
            <BarChartAll
              :topics="car_mission_time.topics"
              :items="car_mission_time.missions"
              title="机器人执行任务时间统计"
              :unit="car_mission_time.unit"
            ></BarChartAll>
          </el-col>
          <el-col :lg="24" style="margin-top:10px;">
            <div style="color:#ffffff;font-size:20px;margin-left:22px">图表分析</div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :lg="12">
        <el-row style="height: 378px; background:rgba(255, 255, 255, 0.1);">
          <div style="position:absolute;right:20px;top:20px;z-index:3;">
            <el-radio-group v-model="dur" size="mini">
              <el-radio-button label="周"></el-radio-button>
              <el-radio-button label="月"></el-radio-button>
              <el-radio-button label="年"></el-radio-button>
            </el-radio-group>
          </div>
          <el-col :lg="24" style="margin-top:10px;">
            <BarChartHo
              :topics="selected_source.topics"
              :items="selected_source.missions"
              title="机器人运行时间统计"
              :unit="selected_source.unit"
            ></BarChartHo>
          </el-col>

          <el-col :lg="24" style="margin-top:10px;">
            <div style="color:#ffffff;font-size:20px;margin-left:22px">图表分析</div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :lg="24">
        <div style="height: 22px;"></div>
      </el-col>
      <el-col :lg="12">
        <el-row style="height: 378px; background:rgba(255, 255, 255, 0.1);">
          <el-col :lg="11">
            <div style="margin-top:30px;margin-left:30px;">
              <div style="color:#ffffff;font-size:22px;">机器人故障率统计</div>
              <div style="color:#ffffff;font-size:20px;margin-top:22px">图表分析</div>
            </div>
          </el-col>
          <el-col :lg="13" style="margin-top:10px;">
            <DoughnutChartAll
              :topics="cars_status.topics"
              :items="cars_status.data"
              title="机器人故障率统计"
            ></DoughnutChartAll>
          </el-col>
        </el-row>
      </el-col>
      <el-col :lg="12">
        <el-row style="height: 378px; background:rgba(255, 255, 255, 0.1);">
          <el-col :lg="11">
            <div style="margin-top:30px;margin-left:30px;">
              <div style="color:#ffffff;font-size:22px;">机器人故障原因统计</div>
              <div style="color:#ffffff;font-size:20px;margin-top:22px">图表分析</div>
            </div>
          </el-col>
          <el-col :lg="13" style="margin-top:10px;">
            <DoughnutChartAll
              :topics="cars_problems_why.topics"
              :items="cars_problems_why.data"
              title="机器人故障原因统计"
            ></DoughnutChartAll>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import DoughnutChartAll from "@/components/dataAnalysis/parts/DoughnutChartAll.vue";
import BarChartAll from "@/components/dataAnalysis/parts/BarChartAll.vue";
import BarChartHo from "@/components/dataAnalysis/parts/BarChartHo.vue";

export default {
  components: { DoughnutChartAll, BarChartAll, BarChartHo },
  watch: {},
  computed: {
    selected_source() {
      return this.car_work_time[this.dur];
    }
  },
  data() {
    return {
      dur: "周",
      cars_status: {
        topics: ["在线", "故障"],
        data: [
          { value: 8, name: "在线" },
          { value: 1, name: "故障" }
        ]
      },
      cars_problems_why: {
        topics: ["信号", "电池", "电路", "摄像头", "其它"],
        data: [
          { value: 8, name: "信号" },
          { value: 10, name: "电池" },
          { value: 1, name: "电路" },
          { value: 10, name: "摄像头" },
          { value: 10, name: "其它" }
        ]
      },
      car_mission_time: {
        topics: ["等待", "巡检", "消杀", "喷洒", "清扫"],
        missions: [1, 3, 9, 10, 6],
        unit: "小时"
      },
      car_work_time: {
        周: {
          topics: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
          missions: [10, 13, 9, 16, 8, 10, 11],
          unit: "小时"
        },
        月: {
          topics: [
            "第一周",
            "第二周",
            "第三周",
            "第四周",
            "第五周",
            "第六周",
            "第七周"
          ],
          missions: [80, 93, 79, 96, 81, 95, 73],
          unit: "小时"
        },
        年: {
          topics: ["一月", "二月", "三月", "四月", "五月", "六月", "七月"],
          missions: [600, 752, 695, 734, 698, 710, 771],
          unit: "小时"
        }
      }
    };
  }
};
</script>

<style scoped>
</style>