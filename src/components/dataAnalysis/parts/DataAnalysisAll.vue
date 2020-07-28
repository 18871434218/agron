<template>
  <div style="margin-left:25px">
    <el-row :gutter="20">
      <el-col :lg="12">
        <el-row style="height: 378px; background:rgba(255, 255, 255, 0.1);">
          <el-col :lg="11">
            <div style="margin-top:30px;margin-left:30px;">
              <div style="color:#ffffff;font-size:22px;">机器人实时状况</div>
              <div style="color:#ffffff;font-size:20px;margin-top:22px">图表分析</div>
            </div>
          </el-col>
          <el-col :lg="13" style="margin-top:10px;">
            <DoughnutChartAll :topics="cars_status.topics" :items="cars_status.data" title="机器人实时状况"></DoughnutChartAll>
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
      <el-col :lg="24">
        <div style="height: 22px;"></div>
      </el-col>
      <el-col :lg="12">
        <el-row style="height: 378px; background:rgba(255, 255, 255, 0.1);">
          <el-col :lg="24" style="margin-top:10px;">
            <BarChartAll
              :topics="cars_mission_current.topics"
              :items="cars_mission_current.missions"
              title="机器人实时任务统计"
              :unit="cars_mission_current.unit"
            ></BarChartAll>
          </el-col>
          <el-col :lg="24" style="margin-top:10px;">
            <div style="color:#ffffff;font-size:20px;margin-left:22px">图表分析</div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :lg="12">
        <el-row style="height: 378px; background:rgba(255, 255, 255, 0.1);">
          <el-col :lg="24" style="margin-top:10px;">
            <LineSimpleAll
              :topics="cars_problems_when.time"
              :items="cars_problems_when.errors"
              title="全天机器人故障统计"
            ></LineSimpleAll>
          </el-col>
          <el-col :lg="24" style="margin-top:-20px;">
            <div style="color:#ffffff;font-size:20px;margin-left:22px">图表分析</div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import DoughnutChartAll from "@/components/dataAnalysis/parts/DoughnutChartAll.vue";
import BarChartAll from "@/components/dataAnalysis/parts/BarChartAll.vue";
import LineSimpleAll from "@/components/dataAnalysis/parts/LineSimpleAll.vue";

export default {
  components: { DoughnutChartAll, BarChartAll, LineSimpleAll },
  data() {
    return {
      cars_status: {
        topics: ["在线", "等待", "故障"],
        data: [
          { value: 8, name: "在线" },
          { value: 10, name: "等待" },
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
      cars_mission_current: {
        topics: ["等待", "巡检", "消杀", "喷洒", "清扫"],
        missions: [18, 23, 29, 10, 6],
        unit:""
      },
      cars_problems_when: {
        time: [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
          20,
          21,
          22,
          23,
          24
        ],
        errors: [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          11,
          10,
          9,
          8,
          7,
          6,
          5,
          4,
          3,
          2,
          1,
          0
        ]
      }
    };
  }
};
</script>

<style scoped>
</style>