<template>
  <div style="margin-left:60px;">
    <el-col>
      <el-row>
        <el-col :lg="24">
          <div style="font-size:20px;margin-top:15px;margin-bottom:15px;width:80%;height:33px;">实时位置坐标</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :lg="10">
          <div id="poseInfoLongitude" style="margin-bottom:10px"></div>
        </el-col>
        <el-col :lg="10">
          <div id="poseInfoLatitude" style="margin-bottom:10px"></div>
        </el-col>
      </el-row>
      <el-row>
        <div id="poseInfoPose" style="margin-bottom:10px"></div>
      </el-row>
      <el-row>
        <div >
          <el-table style="width: 80%;margin-left:-10px;margin-top:50px;" :data="this.state_items" size="mini" class="table_transparent">
            <el-table-column>
              <template slot="header">
                <div style="font-size:20px;color:ivory;font-weight:normal;">设备状态</div>
              </template>
              <template slot-scope="scope">
                <img
                  v-if="scope.row.state_src1!=null"
                  :id="scope.row.state_id1"
                  :src="scope.row.state_src1"
                  width="20"
                  height="20"
                />
                <span style="margin-left: 20px;font-size:15px;color:ivory;">{{ scope.row.state_name1 }}</span>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <img
                  v-if="scope.row.state_src2!=null"
                  :id="scope.row.state_id2"
                  :src="scope.row.state_src2"
                  width="20"
                  height="20"
                />
                <span style="margin-left: 20px;font-size:15px;color:ivory;">{{ scope.row.state_name2 }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-row>
      <!-- <div class="stateContainer-mid-right">
        <div style="width:100%;height:5%"></div>
        <div style="width:100%;height:10%">
          <div class="iconInfo">
            <img src="../../../assets/img/icon/iconPose.png" class="stateIconInfo" />
          </div>
          <div class="iconContentInfo">
            <p>位置信息</p>
          </div>
        </div>
        <div style="width:100%;height:20%">
          <div style="margin-left: 100px;font-size: 20px;">
            <p id="poseInfoLongitude"></p>
            <p id="poseInfoLatitude"></p>
            <p id="poseInfoPose"></p>
          </div>
        </div>
        <div style="width:100%;height:8%">
          <div class="iconInfo">
            <img src="../../../assets/img/icon/errorBlue.png" class="stateIconInfo" />
          </div>
          <div class="iconContentInfo">
            <p>异常报警</p>
          </div>
        </div>
        <div style="width:100%;height:60%">
          <div style="height:5%"></div>
          <div class="bg" v-if="canSee">
            <stateline
              v-for="item in state_items"
              v-bind:key="item.state_id1"
              :state_id1="item.state_id1"
              :state_name1="item.state_name1"
              :state_src1="item.state_src1"
              :state_id2="item.state_id2"
              :state_name2="item.state_name2"
              :state_src2="item.state_src2"
            ></stateline>
          </div>
        </div>
      </div>-->
    </el-col>
  </div>
</template>

<script>
// import stateline from "@/components/monitor/parts/LineInStateContainer.vue";
export default {
  // components: { stateline },

  data() {
    return {
      selected_index: null,
      canSee: false
    };
  },
  mounted() {
  },
  computed: {
    state_items: function() {
      //实时更新设备状态
      for (var i = 0; i < this.$root.car_status.length; i++) {
        if (this.$root.car_status[i].car_id == this.selected_index ) {
          return this.$root.car_status[i].state_items;
          break;
        }
      }
    }
  },
  watch: {
    state_items: {
      //实时根据设备状态更新图标
      handler(val) {
        if (typeof val == "object") {
          this.canSee = false;

          this.canSee = true;

          for (var i = 0; i < val.length; i++) {
            this.changeIcon(val[i].state_id1, val[i].state_src1);

            if (val[i].state_id2) {
              this.changeIcon(val[i].state_id2, val[i].state_src2);
            }
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    changeIcon(id, pic) {
      //换图还是直接按id找图改src得了，变化一个改一个
      if (pic == undefined) {
        pic = require("assets/img//icon/errorBlue.png");
      }
      if (document.getElementById(id) != null) {
        document.getElementById(id).src = pic;
      }
    }
    // tableRowClassName({ row, rowIndex }) {
    //   if (rowIndex % 2 == 1) {
    //     return "warning-row";
    //   } else if (rowIndex % 2 == 0) {
    //     return "success-row";
    //   }
    //   return "";
    // }
  }
};
</script>
<style>
.table_transparent.el-table--border tr,
td {
  border: none !important;
}
.table_transparent.el-table::before {
  height: 0;
}

.table_transparent.el-table,
.table_transparent.el-table__expanded-cell {
  background-color: transparent !important;
}

.table_transparent.el-table th,
.table_transparent.el-table tr  {
  border: 0 !important;
  font-weight: normal;
  color:ivory;
  font-size: 18px;
  background-color: transparent !important;
}
.table_transparent.el-table--enable-row-hover .el-table__body tr:hover>td{
background-color: transparent !important;
}
</style>
<style scoped>
/* @import "../../SunnyCss.css";
.bg:nth-child(n) {
  height: 50px;
  margin: auto 20px;
  background-color: #08284e;
}
.bg:nth-child(even) {
  height: 50pxvh;
  margin: auto 20px;
  background-color: #0b2d55;
}
.el-table .warning-row {
  background: rgb(161, 138, 164);
}

.el-table .success-row {
  background: #f0f9eb;
}

.el-table__header {
  display: none;
} */

</style>>

