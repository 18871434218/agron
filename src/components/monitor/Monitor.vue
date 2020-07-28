<template>
  <el-row id="monitor">
    <el-col :lg="24" style="margin-top:54px;margin-left:-15px;">
      <el-row>
        <el-col :lg="15">
          <OlMap @carMoved="moveCar" @carId="changeCar" ref="olMap" style></OlMap>
        </el-col>
        <el-col :lg="7" style="margin-left:28px;margin-top:10px;">
          <el-row style="margin-top:35px">
            <CarId @carId="changeCar" ref="carId" :car_work=car_work></CarId>
          </el-row>
          <el-row>
            <el-col :lg="17"
              style="font-size:20px;margin-left:60px;margin-top:50px;height:33px;"
            >基本状态信息&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </el-col>
          </el-row>
          <el-row style="margin-top:28px;">
            <el-col :lg="5">
              <CarSpeed :speed_value="car_speed" :speed_rad="car_speed_rad" ></CarSpeed>
            </el-col>
            <el-col :lg="14">
              <CarStatus
                :battery_value="car_battery"
                :connection_value="car_connectinState"
                ref="carStatus"
              ></CarStatus>
            </el-col>
          </el-row>
          <el-row style="margin-top:50px;">
            <StateContainer ref="stateContainer"></StateContainer>
          </el-row>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import CarId from "@/components/monitor/parts/CarId.vue";
import CarSpeed from "@/components/monitor/parts/CarSpeed.vue";
import CarStatus from "@/components/monitor/parts/CarStatus.vue";
import StateContainer from "@/components/monitor/parts/StateContainer.vue";
import OlMap from "@/components/monitor/parts/OlMap.vue";
export default {
  inject: ["car_status"],
  components: {
    CarId,
    CarSpeed,
    CarStatus,
    StateContainer,
    OlMap
  },

  data() {
    return {
      selected_index: null
    };
  },
  computed: {
    //得实时计算出的值用computed比较好
    //根据main.js里的数据实时计算出所需数据，会在原数据更新时同步更新
    car_id: function() {
      if (this.selected_index != null) {
        for (var i = 0; i < this.$root.car_status.length; i++) {
          if (this.$root.car_status[i].car_id == this.selected_index) {
            return this.$root.car_status[i].car_id;
            break;
          }
        }
      } else {
        return 0;
      }
    },
    car_speed: function() {
      if (this.selected_index != null) {
        for (var i = 0; i < this.$root.car_status.length; i++) {
          if (this.$root.car_status[i].car_id == this.selected_index) {
            return this.$root.car_status[i].car_speed;
            break;
          }
        }
      } else {
        return 0;
      }
    },
    car_battery: function() {
      if (this.selected_index != null) {
        for (var i = 0; i < this.$root.car_status.length; i++) {
          if (this.$root.car_status[i].car_id == this.selected_index) {
            return this.$root.car_status[i].car_battery;
            break;
          }
        }
      } else {
        return 0;
      }
    },
    car_connectinState: function() {
      if (this.selected_index != null) {
        for (var i = 0; i < this.$root.car_status.length; i++) {
          if (this.$root.car_status[i].car_id == this.selected_index) {
            return this.$root.car_status[i].car_connectinState;
            break;
          }
        }
      } else {
        return 0;
      }
    },
    car_work: function() {
      if (this.selected_index != null) {
        for (var i = 0; i < this.$root.car_status.length; i++) {
          if (this.$root.car_status[i].car_id == this.selected_index) {
            return this.$root.car_status[i].car_work;
            break;
          }
        }
      } else {
        return "等待任务";
      }
    },
    car_speed_rad: function() {
      if (this.selected_index != null) {
        for (var i = 0; i < this.$root.car_status.length; i++) {
          if (this.$root.car_status[i].car_id == this.selected_index) {
            return this.$root.car_status[i].car_speed_rad;
            break;
          }
        }
      } else {
        return 0;
      }
    }
  },
  watch: {
    //涉及操作其他值的用watch比较好
    //本地更新时同时更新子组件内的值
    car_battery(val) {
      this.$refs.carStatus.battery = val;
    },
    car_connectinState(val) {
      this.$refs.carStatus.connection = val;
    }
  },
  methods: {
    moveCar(val) {
      //如果车动了，更新carStatus组件里车的速度和角速度
      this.$refs.carStatus.where_car = val;

      // console.log(this.$refs.carStatus.where_car);
    },
    changeCar(val) {
      //换车时把新的车id更新到子组件里
      this.selected_index = val;
      this.$refs.stateContainer.selected_index = val;
      this.$refs.carId.car_id = val;
      this.$refs.olMap.selected_car = val;
    }
  }
};
</script>

<style scoped>
@import "../SunnyCss.css";
.vLine {
  margin-left: 28px;
  border-left: solid 2px #ccc;
  height: 46px;
  vertical-align: middle;
  display: inline-block;
}
</style>
