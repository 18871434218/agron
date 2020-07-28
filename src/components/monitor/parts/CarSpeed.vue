<template>
  <el-col>
    <div style="margin-left:60px;margin-top:10px;">
      <el-row>
        <el-col :lg="24" style="text-align:center">
          <el-image :src="require('../../../assets/img/monitor/icon-33.png')"></el-image>
        </el-col>
      </el-row>
      <el-row>
        <el-col :lg="24" style="text-align:center">
          <div>{{speed_title}}</div>
        </el-col>

        <!-- <el-col :lg="4">
          <div>角速度:</div>
        </el-col>
        <el-col :lg="4">{{speed_rad}}rad/s</el-col>-->
      </el-row>
      <el-row>
        <el-col :lg="24" style="text-align:center">
          <div id="clientId">{{speed_value}}m/s</div>
        </el-col>
      </el-row>
    </div>

    <div>
      <!-- <i :class="['main-icon hidden-xs-only', speed_icon]"></i> -->
    </div>
  </el-col>
</template>

<script>
export default {
  props: {
    speed_title: {
      type: String,
      default() {
        return "速度";
      }
    },
    speed_value: {
      type: Number,
      default() {
        return 0;
      }
    },
    speed_icon: {
      type: String,
      default() {
        return "el-icon-odometer";
      }
    },
    speed_rad: {
      type: Number,
      default() {
        return 0;
      }
    }
  },
  data() {
    return {};
  }
};
</script>

<style scoped>
@import "../../SunnyCss.css";
@import "element-ui/lib/theme-chalk/display.css";
</style>