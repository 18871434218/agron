<template>
  <div id="home">
    <!-- 界面主体 -->
    <LeftNav
      key="0"
      v-if="system_code=='调度平台'"
      @system="changeSys"
      :left_nav_details="nav_systems[0].nav_details"
    ></LeftNav>
    <LeftNav
      key="1"
      v-if="system_code=='待定'"
      @system="changeSys"
      :left_nav_details="nav_systems[1].nav_details"
    ></LeftNav>

    <div id="page_content_wrapper" style="margin-left:9vh" class="container-add">
      <el-row>
        <el-col :lg="24">
          <div style="width:454px;margin-left:10px;margin-top:72px">
            <el-row>
              <el-col :lg="17">
                <img class="logo" src="../assets/img/登录页logo-18.png" style="padding-top:5px" />
              </el-col>
              <el-col :lg="3">
                <div style="margin-left:23px;width: 2px;height: 62px; background: white"></div>
              </el-col>
              <el-col :lg="4">
                <el-image
                  style="height:62px;width:100px;margin-top:-5px"
                  :src="require('../assets/img/登录页logo-19.png') "
                ></el-image>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <router-view />
    </div>
  </div>
</template>

<script>
import mqtt from "mqtt";

import LeftNav from "@/components/nav/LeftNav.vue";

import Alldata from "../assets/data/test.js";

export default {
  name: "HelloWorld",
  data() {
    return {
      system_code: "调度平台",
      data: "",
      left_open: true,
      page: "Monitor",
      nav_details: Alldata.nav_details,

      nav_systems: Alldata.nav_systems,
      client: null
    };
  },
  components: {
    LeftNav
  },
  watch: {
    // messsageMQTT: {
    //   handler(val) {
    //     console.log(val);
    //     this.mqttPublish(val);
    //     console.log("我发了");
    //   },
    //   deep: true
    // },
    data: {
      //将接受到的json信息转换为本地能用的格式
      handler(val) {
        var had_car = false;
        var index;
        var errors = [];
        for (var i = 1; i < val.errorInfo.length; i++) {
          if (val.errorInfo[i] == 0) {
            errors.push(require("assets/img/monitor/icon-24.png"));
          }
          if (val.errorInfo[i] == 1) {
            errors.push(require("assets/img/monitor/icon-26.png"));
          }
          if (val.errorInfo[i] == 2) {
            errors.push(require("assets/img/monitor/icon-25.png"));
          }
        }
        for (i = 0; i < this.$root.the_cars.length; i++) {
          if (this.$root.the_cars[i].car_id == val.vehicleInfo[1]) {
            had_car = true;
            index = i;
            break;
          }
        }
        var id = val.vehicleInfo[1];
        if (had_car == false) {
          this.$root.the_cars.push({ car_id: val.vehicleInfo[1] });
          var temp = "";
          if (val.baseState[0] == 1) {
            temp = {
              car_id: id,
              car_speed: 0,
              car_battery: val.baseState[1],
              car_connectinState: val.baseState[2],
              car_speed_rad: 0,
              car_work:"等待任务",
              state_items: [
                {
                  state_id1: "locationInfoImg",
                  state_name1: "位置信息",
                  state_src1: "/monitor/icon-26.png",
                  state_id2: "cameraInfoImg",
                  state_name2: "相机",
                  state_src2: "/monitor/icon-26.png"
                },
                {
                  state_id1: "lidarInfoImg",
                  state_name1: "激光雷达",
                  state_src1: "/monitor/icon-26.png",
                  state_id2: "MMWRInfoImg",
                  state_name2: "任务执行",
                  state_src2: "/monitor/icon-26.png"
                },
                {
                  state_id1: "MMWRInfoImg",
                  state_name1: "毫米波雷达",
                  state_src1: "/monitor/icon-26.png",
                  state_id2: "controllerInfoImg",
                  state_name2: "控制器",
                  state_src2: "/monitor/icon-26.png"
                },
                {
                  state_id1: "ultrasonicRadarInfoImg",
                  state_name1: "超声波雷达",
                  state_src1: "/monitor/icon-26.png"
                }
              ]
            };
          }
          if (val.vehicleInfo[0] == 1) {
            this.$root.map_status.where_car.push({
              car_id: id,
              where: [val.vehicleInfo[3], val.vehicleInfo[4]],
              direction: val.vehicleInfo[5],
              current_mission: ""
            });
            temp.car_speed = val.vehicleInfo[6];
            temp.car_speed_rad = val.vehicleInfo[7];
            if(val.vehicleInfo[8]==0){
              temp.car_work="等待任务";

            }
            else if(val.vehicleInfo[8]==1){
              temp.car_work="任务进行中";

            }else if(val.vehicleInfo[8]==2){
              temp.car_work="绕障中";

            }else if(val.vehicleInfo[8]==3){
              temp.car_work="因障停车";

            }else if(val.vehicleInfo[8]==4){
              temp.car_work="任务完成";

            }
          }
          if (val.errorInfo[0] == 1) {
            temp.state_items[0].state_src1 = errors[0];
            temp.state_items[0].state_src2 = errors[4];
            temp.state_items[1].state_src1 = errors[1];
            temp.state_items[1].state_src2 = errors[5];
            temp.state_items[2].state_src1 = errors[2];
            temp.state_items[2].state_src2 = errors[6];
            temp.state_items[3].state_src1 = errors[3];
          }
          this.$root.car_status.push(temp);
          console.log(temp);
        } else if (had_car == true) {
          if (val.baseState[0] == 1) {
            this.updateBaseState(id, index, val.baseState);
          }
          if (val.vehicleInfo[0] == 1) {
            this.updateVehicleInfo(id, index, val.vehicleInfo);
          }
          if (val.errorInfo[0] == 1) {
            this.updateErrorInfo(id, index, errors);
          }
        }
      },
      deep: true
    }
  },
  beforeDestroy() {
    this.client.end();
  },
  mounted() {
    const options = {
      connectTimeout: 40000,
      clientId: "mqtitId-_client",
      clean: true,
      keepAliveInterval: 100
    };
    this.client = mqtt.connect("wss://www.sunnyiov.com/mqtt", options);
    this.client.on("connect", e => {
      console.log("连接成功:");
      this.client.subscribe(
        "testProject/clientSub/baseState",
        { qos: 1 },
        error => {
          if (!error) {
            console.log("订阅b成功");
          } else {
            console.log("订阅失败");
          }
        }
      );
      this.client.subscribe(
        "testProject/clientSub/missionReturn",
        { qos: 1 },
        error => {
          if (!error) {
            console.log("订阅m成功");
          } else {
            console.log("订阅失败");
          }
        }
      );
      this.client.subscribe(
        "testProject/" + this.$root.user.name,
        { qos: 1 },
        error => {
          if (!error) {
            console.log("订阅" + this.$root.user.name + "成功");
          } else {
            console.log("订阅失败");
          }
        }
      );
    });
    // 接收消息处理
    this.client.on("message", (topic, message) => {
      // console.log("收到来自", topic, "的消息", JSON.parse(message.toString()));
      if (topic == "testProject/clientSub/baseState") {
        // console.log(JSON.parse(message.toString()))
        this.data = JSON.parse(message.toString());
      } else if (topic == "testProject/" + this.$root.user.name) {
        if (message.toString() != this.$root.login_time) {
          this.$root.can_login = false;
        }
      } else {
        console.log(JSON.parse(message.toString()));
      }
    });
    // 断开发起重连
    this.client.on("reconnect", error => {
      console.log("正在重连:", error);
    });
    // 链接异常处理
    this.client.on("error", error => {
      console.log("连接失败:", error);
    });

    //this.$root.the_cars.push({ "car_id": "002" });
  },

  methods: {
    pageMargin(data) {
      //让页面跟着导航菜单一起左右伸缩，因为看起来太烦就注释掉了
      // if (data == true) {
      //   document.getElementById("page_content_wrapper").style.marginLeft =
      //     "30vh";
      // } else {
      //   document.getElementById("page_content_wrapper").style.marginLeft =
      //     "5vh";
      // }
    },
    changeSys(data) {
      this.system_code = data;
    },
    updateBaseState(id, index, val) {
      //换车时切换电池和信号信息
      this.$root.car_status[index].car_battery = val[1];
      this.$root.car_status[index].car_connectinState = val[2];
    },
    updateVehicleInfo(id, index, val) {
      //换车时切换车坐标和朝向
      var carindex;
      this.$root.car_status[index].car_speed = val[6];
      this.$root.car_status[index].car_speed_rad = val[7];
      for (var i = 0; i < this.$root.map_status.where_car.length; i++) {
        if (this.$root.map_status.where_car[i].car_id == val[1]) {
          this.$root.map_status.where_car[i].where = [val[3], val[4]];
          this.$root.map_status.where_car[i].direction = val[5];
          break;
        }
      }
    },

    updateErrorInfo(id, index, errors) {
      //换车时切换车设备状态
      this.$root.car_status[index].state_items[0].state_src1 = errors[0];
      this.$root.car_status[index].state_items[0].state_src2 = errors[4];
      this.$root.car_status[index].state_items[1].state_src1 = errors[1];
      this.$root.car_status[index].state_items[1].state_src2 = errors[5];
      this.$root.car_status[index].state_items[2].state_src1 = errors[2];
      this.$root.car_status[index].state_items[2].state_src2 = errors[6];
      this.$root.car_status[index].state_items[3].state_src1 = errors[3];
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "./SunnyCss.css";
</style>
