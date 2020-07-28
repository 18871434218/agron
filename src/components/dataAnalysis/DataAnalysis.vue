<template>
  <div>
    <el-row id="dataAnalysis">
      <el-col :lg="24">
        <div style="height: 10px;"></div>
      </el-col>
      <el-col :lg="24">
        <div style="font-size:20px;float:right;white-space:nowrap;">
          ID:
          <el-select
            v-model="selected_car"
            filterable
            placeholder="请选择车辆id"
            size="mini"
            style="width:85%"
          >
            <el-option
              v-for="item in which_analysis"
              :key="item.car_id"
              :label="item.car_id"
              :value="item.car_id"
            ></el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :lg="24">
        <div style="height: 20px;"></div>
      </el-col>
    </el-row>
    <DataAnalysisAll v-if="selected_car=='整体状况'"></DataAnalysisAll>
    <DataAnalysisOne v-if="selected_car!='整体状况'"></DataAnalysisOne>
  </div>
</template>

<script>
import DataAnalysisAll from "@/components/dataAnalysis/parts/DataAnalysisAll.vue";
import DataAnalysisOne from "@/components/dataAnalysis/parts/DataAnalysisOne.vue";

export default {
  inject: ["the_cars"],
  components: { DataAnalysisOne,DataAnalysisAll },
  data() {
    return {
      selected_car: "整体状况",
    };
  },
  computed: {
    which_analysis() {
      return [{ car_id: "整体状况" }].concat(this.the_cars);
    }
  }
};
</script>

<style scoped>
@import "../SunnyCss.css";
</style>