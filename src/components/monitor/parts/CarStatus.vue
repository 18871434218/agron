<template>
  <el-col>
    <div style="margin-left:60px;margin-top:10px;">
      <el-row>
        <el-col :lg="12">
          <el-row style="text-align:center">
            <el-image :src="barSrc"></el-image>
          </el-row>
          <el-row style="text-align:center">
            <div>{{battery_title}}</div>
          </el-row>
          <el-row style="text-align:center">
            <div id="battery">{{battery}}%</div>
          </el-row>
        </el-col>
        <el-col :lg="12">
          <el-row style="text-align:center">
            <el-image :src="StateSrc"></el-image>
          </el-row>
          <el-row style="text-align:center">
            <div>{{connection_title}}</div>
          </el-row>
          <el-row style="text-align:center">
            <div id="connectionState">{{StateStr}}</div>
          </el-row>
        </el-col>

      </el-row>

      <!-- <div style="width:50%;height:100%;float:left">
        <div class="batteryIcon icon hidden-xs-only" style="position:relative;">
          <div>
            <img id="batteryIconInner" :style="{ height: batteryPercent+'vh' }" :src="barSrc" />
          </div>
          <img id="batteryIcon" src="../../../assets/img/icon/batteryBackground.png" />
        </div>
        <div class="iconContent iconFixPadding">
          <p>{{battery_title}}</p>
          <p id="battery">{{battery}}%</p>
        </div>
      </div>
      <div style="width:50%;height:100%;float:right">
        <div class="icon hidden-xs-only">
          <img id="connectionIcon" :src="StateSrc" class="stateIcon" />
        </div>
        <div class="iconContent iconFixPadding">
          <p>{{connection_title}}</p>
          <p id="connectionState">{{StateStr}}</p>
        </div>
      </div>-->
    </div>
  </el-col>
</template>

<script>
export default {
  props: {
    // car_work: {
    //   type: String,
    //   default() {
    //     return "等待任务";
    //   }
    // },
    battery_title: {
      type: String,
      default() {
        return "电量";
      }
    },
    connection_title: {
      type: String,
      default() {
        return "信号";
      }
    },
    battery_value: {
      type: Number,
      default() {
        return 0;
      }
    },
    connection_value: {
      type: Number,
      default() {
        return 0;
      }
    }
  },
  data() {
    return {
      battery: this.battery_value,
      connection: this.connection_value
    };
  },
  computed: {
    batteryPercent: function() {
      return this.battery / 10;
    },
    barSrc: function() {
      if (this.battery > 75) {
        return require("../../../assets/img/monitor/icon-34.png");
      } else if (this.battery > 0) {
        return require("../../../assets/img/monitor/icon-35.png");
      } else {
        return require("../../../assets/img/monitor/icon-36.png");
      }
    },

    StateSrc: function() {
      if (this.connection > 0.75) {
        return require("../../../assets/img/monitor/icon-27.png");
      } else if (this.connection > 0.5) {
        return require("../../../assets/img/monitor/icon-28.png");
      } else if (this.connection > 0.25) {
        return require("../../../assets/img/monitor/icon-29.png");
      } else if (this.connection > 0) {
        return require("../../../assets/img/monitor/icon-30.png");
      } else {
        return require("../../../assets/img/monitor/icon-31.png");
      }
    },

    StateStr: function() {
      if (this.connection > 0.75) {
        return "很好";
      } else if (this.connection > 0.5) {
        return "较好";
      } else if (this.connection > 0.25) {
        return "一般";
      } else if (this.connection > 0) {
        return "较差";
      } else {
        return "无信号";
      }
    }
  }
};
</script>

<style scoped>
@import "../../SunnyCss.css";
@import "element-ui/lib/theme-chalk/display.css";
</style>