<template>
  <div>
    <el-row id="mission" style="float:inherit; min-height:600px;">
      <el-col :lg="24">
        <el-row>
          <el-row id="missionWrapper">
            <el-col :lg="16" :md="24" :sm="24" :xs="24">
              <MissionOlMap ref="map" @carId="changeCar"></MissionOlMap>
            </el-col>
            <el-col :lg="8" :md="24" :sm="24" :xs="24">
              <div class="mission-mid-right">
                <div style="height:10%"></div>
                <el-row style="width:360px">
                  <el-col :lg="16">
                    <div style="height:10%;" class="mission-mid-right-inner">
                      ID&nbsp;
                      <el-select
                        v-model="car_id"
                        filterable
                        placeholder="请选择"
                        :disabled="canEdit"
                        v-if="canSee"
                        size="mini"
                        style="width:80%"
                      >
                        <el-option
                          v-for="item in id_value"
                          :key="item.car_id"
                          :label="item.car_id"
                          :value="item.car_id"
                        ></el-option>
                      </el-select>
                    </div>
                  </el-col>
                </el-row>
                <el-row style="width:360px;margin-top:30px">
                  <el-col :lg="8">
                    <el-button
                      class="mission_buttom"
                      v-if="canEdit==false"
                      :disabled="!(canEdit==false && car_id!='')"
                      icon="el-icon-edit"
                      size="mini"
                      @click="editFunc()"
                    >编辑任务</el-button>
                    <el-button
                      class="mission_buttom"
                      v-if="canEdit==true"
                      :disabled="this.$refs.map.lines.length==0"
                      size="mini"
                      icon="el-icon-edit"
                      @click="saveFunc()"
                    >保存任务</el-button>
                  </el-col>
                  <el-col :lg="8">
                    <el-button
                      class="mission_buttom"
                      :disabled="!(canEdit==false && car_id!=''&&this.$refs.map.lines.length!=0)"
                      icon="el-icon-refresh-right"
                      size="mini"
                      @click="resetFunc()"
                    >重置任务</el-button>
                  </el-col>
                  <el-col :lg="8">
                    <el-button
                      class="mission_buttom"
                      :disabled="!(canEdit==false&&car_id!=''&&this.$refs.map.lines.length!=0 && this.$refs.map.current_mission!='')"
                      icon="el-icon-s-order"
                      size="mini"
                      @click="publishFunc()"
                    >上传任务</el-button>
                  </el-col>
                </el-row>
                <div class="mission-mid-right-inner" style="padding-top:40px;padding-bottom:20px">
                  <span>当前任务</span>
                </div>
                <div style="height:350px;border-radius: 10px;">
                  <el-table
                    style="width:360px;color:ivory;"
                    height="350"
                    max-height="350"
                    :data="this.$root.map_status.where_car.filter(data =>(data.current_mission!=''))"
                    class="table_current_missions"
                  >
                    <el-table-column type="expand">
                      <template slot-scope="props">
                        <el-form
                          label-position="left"
                          inline
                          class="demo-table-expand"
                          style="color:ivory"
                        >
                          <el-form-item label="设定时间" class="white">
                            <span>{{ props.row.current_mission.time_stamp.toLocaleString() }}</span>
                          </el-form-item>
                          <el-form-item label="开始时间" class="white">
                            <span>{{ props.row.current_mission.time_start.toLocaleTimeString() }}</span>
                          </el-form-item>
                        </el-form>
                      </template>
                    </el-table-column>
                    <el-table-column property="car_id" label="CarID"></el-table-column>
                    <el-table-column property="current_mission.status" label="状态"></el-table-column>
                    <el-table-column property="current_mission.note" label="备注"></el-table-column>
                  </el-table>
                </div>

                <div style="height:30%;" class="mission-mid-right-inner missionButton">
                  <div style="margin-left:47%">
                    <el-button
                      class="mission_buttom"
                      :disabled="!(canEdit==false)"
                      size="mini"
                      icon="el-icon-s-order"
                      @click="listFunc()"
                    >任务列表</el-button>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";
import MissionOlMap from "@/components/mission/parts/MissionOlMap.vue";

export default {
  inject: ["the_cars", "map_status"],
  data() {
    return {
      mission_summary: "balablabla",
      canEdit: false,
      id_value: this.the_cars,
      car_id: "",
      can_resume: false,
      canSee: false
    };
  },
  components: { MissionOlMap },
  watch: {
    the_cars: {
      handler(val) {
        if (typeof val == "object") {
          this.canSee = false;
          this.canSee = true;
        }
      },
      deep: true,
      immediate: true
    },
    car_id(val) {
      this.$refs.map.selected_car = this.car_id;
    }
  },
  mounted() {
    this.selectAllFromSQL();
  },
  methods: {
    editFunc() {
      //开启编辑模式
      this.canEdit = true;
      this.$refs.map.canEdit = true;
      this.$refs.map.is_help = true;
    },

    resetFunc() {
      //重置任务
      this.$refs.map.cleanMap();
    },
    saveFunc() {
      //保存任务
      this.canEdit = false;
      this.$refs.map.canEdit = false;
      this.$refs.map.saveMission();
    },
    listFunc() {
      //打开任务列表
      this.$refs.map.listShow = !this.$refs.map.listShow;
    },
    publishFunc() {
      //上传任务
      this.$refs.map.publishShow = true;
    },
    changeCar(val) {
      //换车
      this.car_id = val;
    },
    selectAllFromSQL() {
      this.axios.get("/api/loadMissionHistory").then(response => {
        this.$root.mission_list = [];
        this.$refs.map.cars_in_log = [];
        for (var i = 0; i < response.data.length; i++) {
          var temp = JSON.parse(response.data[i].mission);
          temp.time_stamp = new Date(temp.time_stamp);
          temp.time_start = new Date(temp.time_start);
          // console.log(temp.time_start)
          this.$root.mission_list.push(temp);
          if (this.$refs.map.cars_in_log.indexOf(temp.used_car) < 0) {
            this.$refs.map.cars_in_log.push(temp.used_car);
          }
        }
        // console.log(this.$refs.map.cars_in_log);
      });
      // this.axios.get("/api/loadMission").then(response => {
      //   console.log(response);
      //   for (var i = 0; i < response.data.length; i++) {
      //     for(var j = 0; j <this.$root.map_status.where_car.length;j++){
      //         if (response.data[i].car_id==this.$root.map_status.where_car[j].car_id){
      //           this.$root.map_status.where_car[j].current_mission=JSON.parse(response.data[i].car_mission);
      //         }
      //     }
      //   }
      //   // console.log(this.$refs.map.cars_in_log);
      // });
    }
  }
};
</script>
<style >
.table_current_missions.el-table--border tr,
td {
  background-color: transparent !important;
  border: 0 !important;
}
.table_current_missions.el-table::before {
  height: 0;
}
.table_current_missions.el-table,
.table_current_missions.el-table__expanded-cell {
  background-color: transparent !important;
}

.table_current_missions.el-table th,
.table_current_missions.el-table tr {
  border: 1 !important;
  border-bottom-color: rgba(255, 255, 255, 0.1) !important;
  /* font-weight: normal;
  color:ivory; */
  font-size: 18px;
  background-color: rgba(255, 255, 255, 0.1) !important;
}
.table_current_missions.el-table--enable-row-hover
  .el-table__body
  tr:hover
  > td {
  background-color: transparent !important;
}
.mission_buttom {
  background: linear-gradient(to right, #001f3b, #001f3b, #00b4f0);
  background-size: 200%;
  color: ivory;
  transition: background-position 0.5s;
}
.mission_buttom:hover {
  background-position: 100% 0;
  color: #00fff5;
}
</style>
<style scoped>
@import "../SunnyCss.css";
</style>