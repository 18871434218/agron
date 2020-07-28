<template>
  <el-col>
    <div style="margin-left:55px;margin-top:10px;">
      <!-- <el-row>
        <div style="font-size:22px;padding:10px;">实时监控</div>
      </el-row>
      <el-row>
        <el-col :lg="12">
          <div style="font-size:15px;height:50px;margin-top:15px;margin-left:10px">机器人在线数量:</div>
        </el-col>
        <el-col :lg="8">
          <div style=" font-size:30px;">{{the_cars.length}}</div>
        </el-col>
      </el-row>-->
      <el-row>
        <el-col :lg="2">
          <div style=" margin-left:5px;font-size:22px;">ID</div>
        </el-col>
        <el-col :lg="8">
          <div class v-if="canSee">
            <el-select v-model="car_id" filterable placeholder="请选择机器人" size="small">
              <el-option
                v-for="item in id_value"
                :key="item.car_id"
                :label="item.car_id"
                :value="item.car_id"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col  :lg="8" > <el-tag style="margin-left:8%;font-size:20px;" :color=tag_color effect="dark">{{car_work}}</el-tag> </el-col>
      </el-row>
    </div>
  </el-col>
</template>

<script>
export default {
  inject: ["the_cars"],
  props:{
        car_work: {
      type: String,
      default() {
        return "等待任务";
      }
    }
  },
  data() {
    return {
      car_id: "",
      canSee: false
    };
  },
  computed: {
    id_value() {
      return this.the_cars;
    },
    tag_color(){
      if(this.car_work=="等待任务"){
        return "#00b8f0";
      }
      else if(this.car_work=="任务进行中"){
        return "#ffc028";
      }
      else if(this.car_work=="绕障中"){
        return "#76C61B";
      }
      else if(this.car_work=="因障停车"){
        return "#c51f1d";
      }
      else if(this.car_work=="任务完成"){
        return "#6300ff";

      }
    }
  },
  created() {
    if (this.id_value != "") {
      this.canSee = true;
    }
  },
  watch: {
    car_id(val) {
      this.$emit("carId", this.car_id);
    },
    id_value: {//数据更新后会刷dom
      handler(val) {
        console.log(val);
        if (typeof val == "object") {
          this.canSee = false;
          this.canSee = true;
        }
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style scoped>
/* @import "../../SunnyCss.css"; */
@import "element-ui/lib/theme-chalk/display.css";
</style>