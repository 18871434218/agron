<template>
  <div id="missionMap" ref="rootmap" oncontextmenu="return false" style="padding:5vh">
    <el-dialog title="参数设置" :visible.sync="dialogVisible" @close="formCancel()" width="25%">
      <el-form>
        <el-form-item
          v-if="is_line==true"
          label="起点："
          label-width="120px"
        >{{lines[selected_line_id].start[0].toFixed(3)}},{{lines[selected_line_id].start[1].toFixed(3)}}</el-form-item>
        <el-form-item
          v-if="is_line==true"
          label="终点："
          label-width="120px"
        >{{lines[selected_line_id].end[0].toFixed(3)}},{{lines[selected_line_id].end[1].toFixed(3)}}</el-form-item>
        <el-form-item v-if="is_line==false" label="经度：" label-width="120px">{{preMark_x}}</el-form-item>
        <el-form-item v-if="is_line==false" label="纬度：" label-width="120px">{{preMark_y}}</el-form-item>
        <el-form-item v-if="is_line==false" label="特殊地点:" label-width="120px">
          <el-select v-model="selected_place" filterable :disabled="existed" placeholder="请选择">
            <el-option v-for="item in places" :key="item.name" :label="item.name" :value="item.xy"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工作类型:" label-width="120px">
          <el-select v-model="form.type" placeholder="请选择工作类型">
            <el-option label="洒水" value="water"></el-option>
            <el-option label="清扫" value="sweep"></el-option>
            <el-option label="行驶" value="move"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="路径宽度:(m)" label-width="120px">
          <div class="slider-box" style="float:left;margin-top:10px;margin-left:0px;">
            <vue-slider
              v-model="form.routeWidth"
              width="200px"
              :interval="sliderInterval"
              :min="sliderMin"
              :max="sliderMax"
            />
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="formCancel()">取 消</el-button>
        <el-button :disabled="form.type==''" type="primary" @click="formSubmit()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="任务列表"
      :visible.sync="listShow"
      @close="listCancel()"
      width="28%"
      style="left:0px"
    >
      <div style="margin-left:80%">
        <el-popover placement="bottom-end" trigger="click">
          <div style="display:inline-block;">
            <div>
              <b>筛选条件</b>
              <el-button @click="cleanFilters()" size="mini" style="display:right">重置</el-button>
            </div>

            <div style="white-space:nowrap;">
              备注: &nbsp;&nbsp;&nbsp;&nbsp;
              <el-input v-model="note_search" size="mini" placeholder="输入备注进行搜索" style="width:70%" />
            </div>
            <div style="white-space:nowrap;">
              状态: &nbsp;&nbsp;&nbsp;&nbsp;
              <el-select
                v-model="is_completed"
                filterable
                placeholder="请选择过滤状态"
                :disabled="canEdit"
                size="mini"
                style="width:70%"
              >
                <el-option v-for="item in possible_states" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </div>
            <div style="white-space:nowrap;">
              车辆: &nbsp;&nbsp;&nbsp;&nbsp;
              <el-select
                v-model="which_car"
                filterable
                placeholder="请选择车辆"
                :disabled="canEdit"
                size="mini"
                style="width:70%"
              >
                <el-option
                  v-for="item in cars_in_log"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </div>
          </div>

          <el-button slot="reference" style="right:0px">筛选</el-button>
        </el-popover>
      </div>

      <el-table
        ref="multipleTable"

        max-height="400"
        :data="route_list.filter(data => (!note_search || data.note.toLowerCase().includes(note_search.toLowerCase()))&&
        (!is_completed || data.status.toLowerCase()==is_completed.toLowerCase())&&(!which_car || data.used_car.toLowerCase()==which_car.toLowerCase())
        )"
        tooltip-effect="dark"
        style="width: 100%"
        row-key="id"
        @selection-change="handleSelectionChange"
        class="table_mission_log"
      >
        <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="设定时间">
                <span>{{ props.row.time_stamp.toLocaleString() }}</span>
              </el-form-item>
              <el-form-item label="开始时间">
                <span>{{ props.row.time_start.toLocaleTimeString() }}</span>
              </el-form-item>
              <el-form-item label="结束时间">
                <span>{{ props.row.time_end }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column property="id"  label="任务编号"></el-table-column>
        <el-table-column property="used_car"  label="车辆ID"></el-table-column>
        <el-table-column property="status"  label="状态"></el-table-column>
        <el-table-column property="note" label="备注"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">

        <el-button
          :disabled="selected_rows.length!=1"
          v-if="selected_rows.length<=1"
          type="primary"
          @click="logLoad()"
        >载入历史配置</el-button>
        <el-button
          :disabled="selected_rows.length <=1"
          v-if="selected_rows.length>1"
          type="primary"
          @click="manyLoad()"
        >批量重载</el-button>
      </span>
    </el-dialog>

    <el-dialog title="要保存新任务到本地吗?" :visible.sync="noteShow" @close="listShow=false" width="25%">
      <span slot="footer" class="dialog-footer">
        <el-button @click="noteShow=false">取 消</el-button>
        <el-button type="primary" @click="noteClose()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="is_help" @close="is_help=false" width="25%" v-if="hide_help==false">
      <div>请点击地图进行任务编辑操作。</div>
      <el-checkbox v-model="hide_help" style="font-weight:bold"> 不再显示</el-checkbox>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="is_help=false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="让哪个机器人重新完成该任务？" :visible.sync="redoShow" @close="redoShow=false" width="25%">
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="is_origin||selected_car==''" @click="redoNew()">选中的这个</el-button>
        <el-button @click="redoOrigin()">原来的那个(id:{{last_car}})</el-button>
      </span>
    </el-dialog>

    <el-dialog title="要发布任务吗？" :visible.sync="publishShow" @close="publishShow=false" width="25%">
      <div>确定为{{selected_car}}发布任务？</div>
      <div>设置开始时间:</div>
      <el-time-picker v-model="time_start" placeholder="开始时间"></el-time-picker>
      <div>设置备注:</div>
      <el-input v-model="mission_note" placeholder="在此输入备注"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="publishShow=false">取 消</el-button>
        <el-button type="primary" :disabled="time_start==null" @click="publishMQTT()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="批量重载任务" :visible.sync="manyShow" @close="manyShow=false" width="25%">
      <div>确定批量重载选定的任务吗？（每辆车一次仅可重载一个任务）</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="manyShow=false">取 消</el-button>
        <el-button type="primary" @click="manySubmit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import $ from "jquery";
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";

import "ol/ol.css";
import { Map, View } from "ol";
import Overlay from "ol/Overlay";
import mapconfig from "./config/mapconfig";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Line from "ol/geom/LineString";
import OlLayerVector from "ol/layer/Vector";
import OlSourceVector from "ol/source/Vector";

import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import Stroke from "ol/style/Stroke";

import mqtt from "mqtt";

// 用来添加相关文字描述的
import Text from "ol/style/Text";
import Fill from "ol/style/Fill";
import "jquery";
import { defaults as defaultInteractions, Select } from "ol/interaction";

export default {
  components: { VueSlider },
  inject: ["map_status", "the_cars"],
  data() {
    return {
      sliderInterval: 0.1,
      sliderMin: 0.1,
      sliderMax: 10.0,
      time_start: null,
      map: null,
      SourceVector: null,
      

      placesLengthOld: 0, //记录地点数组长度
      goalsLengthOld: 0, //记录目标点数组长度
      linesLengthOld: 0, //记录路径数组长度

      selected_line_id: 0, //记录被选中的路径的index
      canEdit: false, //为true时表示启用任务编辑模式
      listShow: false, //为true时显示任务列表选择窗口
      noteShow: false, //控制保存日志时的备注弹窗
      todoShow: false, //控制要不要从中断点开始的弹窗
      redoShow: false,
      manyShow: false,
      publishShow: false,
      existed: false, //为true时表示该feature（线路）已存在
      preMark: false, //控制选择任务类型前在图上提前出现的目的地标志

      dialogVisible: false, //控制工作类型选择弹窗
      coordinate_temp: null, //临时储存鼠标点击的像素点在地图上对应的坐标
      cars_in_log:[],
      selected_rows: [], //储存当前被选中的任务

      mission_note: "", //任务备注

      lines: "", //路径数组,
      notDoneLines: [], //未完成任务路径
      linesTemp: null, //临时储存路径数组

      selected_car: "", //储存被选中的车
      selectedByAttriFeature: null, //存储被选中的feature
      carsLengthOld: this.map_status.where_car.length, //有几辆车

      preGoal: null, //前一个目的地，初始值为车在地图上的位置

      last_stopped: null, //任务中断点

      goals: [], //目的地数组
      notDoneGoals: [], //未完成目的地
      goalsTemp: null, //临时储存目的地
      
      route_list: [], //历史任务数组
      current_mission: "", //当前车编辑中的任务
      is_origin: false,
      form: { type: "", routeWidth: 0.1 }, //储存路径类型的form
      note_search: "", //备注搜索
      possible_states: ["完成", "待完成", "进行中", "取消", "本地"], //可能出现的任务完成状态
      is_completed: "", //任务列表过滤器中的任务完成状态
      is_many: false,
      is_line: false,
      is_help: false,
      hide_help: false,
      which_car: "",
      car_icon_style: null, //存一下车图标样式，方便切换回来
      resetFlag: true,
      selected_place: "",
      client_map: null
    };
  },
  mounted() {
    this.hide_help = this.$root.hide_help;
    const mqtt_options = {
      connectTimeout: 40000,
      clientId: "MAP",
      clean: true,
      keepAliveInterval: 10
    };
    this.client_map = mqtt.connect("wss://www.sunnyiov.com/mqtt", mqtt_options);
    this.initMap();
    this.updatePlace();
    this.placesLengthOld = this.places.length;
    this.updateLines();
    this.linesLengthOld = this.lines.length;
    this.route_list = this.$root.mission_list;
    var vectorLayer = new OlLayerVector({
      source: this.SourceVector
    });
    this.carsLengthOld = this.where_car.length;
    this.updateCars();

    this.map.addLayer(vectorLayer);
    this.route_list = $.extend(true, [], this.$root.mission_list);
    this.map.on("singleclick", e => {
      var feature = this.map.forEachFeatureAtPixel(e.pixel, function(feature) {
        return feature;
      });
      var pixel = this.map.getEventPixel(e.originalEvent);
      var coordinate = e.coordinate;
      if (this.canEdit == true) {
        this.coordinate_temp = coordinate;
        this.goals.push({ xy: this.coordinate_temp });
        this.preMark = true;
        this.dialogVisible = true;
      } //点一下设置路径
    });
    this.map.on("dblclick", e => {
      var feature = this.map.forEachFeatureAtPixel(e.pixel, function(feature) {
        return feature;
      });
      var pixel = this.map.getEventPixel(e.originalEvent);
      this.map.forEachFeatureAtPixel(pixel, feature => {
        var coordinate = e.coordinate;
        if (feature.get("type") == "line") {
          if (this.canEdit == true) {
            this.existed = true;
            this.selected_line_id = feature.get("id");
            this.form.type = this.lines[this.selected_line_id].workType;
            this.is_line = true;
            this.dialogVisible = true;
          }
        } //双击已有路径编辑工作类型
      });
    });
  },
  beforeDestroy() {
    this.client_map.end();
  },
  computed: {
    preMark_x() {
      if (this.coordinate_temp != null) {
        return this.coordinate_temp[0].toFixed(3);
      } else {
        return "NaN";
      }
    },
    preMark_y() {
      if (this.coordinate_temp != null) {
        return this.coordinate_temp[1].toFixed(3);
      } else {
        return "NaN";
      }
    },

    places() {
      return this.map_status.places;
    },
    route_lines() {
      return this.map_status.lines;
    },
    view_details() {
      return this.map_status.view_details;
    },
    where_car() {
      return this.map_status.where_car;
    },
    last_car() {
      if (this.selected_rows.length == 1) {
        return this.selected_rows[0].used_car;
      }
    }
  },
  watch: {
    //利用watch监听data中数据的变化，在data中数据发生变化时实时更新地图中相关的feature
    selected_car(val) {
      for (var i = 0; i < this.$root.car_status.length; i++) {
        if (this.$root.car_status[i].car_id == this.selected_car) {
          if (this.resetFlag == true) {
            this.preGoal = this.where_car[i].where;

            this.cleanMap();
            this.updateCars();
            if (this.$root.map_status.where_car[i].current_mission != "") {
              this.current_mission = this.$root.map_status.where_car[
                i
              ].current_mission;
              this.lines = this.$root.map_status.where_car[
                i
              ].current_mission.mission_lines;
              this.goals = this.$root.map_status.where_car[
                i
              ].current_mission.mission_goals;
              this.time_start = this.$root.map_status.where_car[
                i
              ].current_mission.time_start;
              this.preGoal = this.goals[this.goals.length - 1].xy;
            }
          }
          this.resetFlag = true;
          this.selectCarByAttribute("Car", this.where_car[i].car_id);
          this.map
            .getView()
            .setCenter([
              this.where_car[i].where[0].toFixed(3),
              this.where_car[i].where[1].toFixed(3)
            ]);
          this.map.getView().setZoom(15);
          break;
        }
      }
    },
    hide_help(val){
      this.$root.hide_help=val;
    },
    listShow(val) {
      this.linesTemp = $.extend(true, [], this.lines);
      this.goalsTemp = $.extend(true, [], this.goals);
    },
    lines: {
      handler(newValue, oldValue) {
        this.linesLengthOld = this.lines.length;
        this.updateLines();
      },
      deep: true
    },
    where_car: {
      handler(newValue, oldValue) {
        this.carsLengthOld = this.where_car.length + 1;
        this.updateCars();
        for (var i = 0; i < this.$root.car_status.length; i++) {
          if (this.$root.car_status[i].car_id == this.selected_car) {
            this.selectCarByAttribute("Car", this.where_car[i].car_id);
            break;
          }
        }
      },
      deep: true
    },
    places: {
      handler(newValue, oldValue) {
        this.updatePlace();
        this.placesLengthOld = this.places.length;
      },
      deep: true
    },
    goals: {
      handler(newValue, oldValue) {
        this.updateGoals();
        this.goalsLengthOld = this.goals.length;
      },
      deep: true
    },
    selected_place: {
      handler(newValue, oldValue) {
        if (this.selected_place != "") {
          this.goals.pop();
          this.coordinate_temp = this.selected_place;
          this.goals.push({ xy: this.coordinate_temp });
        }
      },
      deep: true
    },
    selected_rows: {
      handler(val) {
        if (this.selected_rows) {
          // console.log("selectrow");
          // console.log(this.selected_rows);
        }
      },
      deep: true
    },
    route_list: {
      handler(val) {
        if (this.route_list) {
          // console.log("routelist");
          // console.log(this.route_list);
        }
      },
      deep: true
    }
  },
  methods: {
    insertMissionToSQL(val) {

      for (var i = 0; i < val.length; i++) {
        var addSqlParams = [val[i].used_car, JSON.stringify(val[i])];
        //增
        console.log(addSqlParams);
        this.$http
          .post("/api/insertMission", addSqlParams, {})
          .then(response => {
            console.log(response);
          });
      }
    },
    // updateCurrentMission(id,mission){
    //     var addSqlParams = [id,JSON.stringify(mission)];
    //     //增
    //     console.log(addSqlParams);
    //     this.$http
    //       .put("/api/updateCurrentMission", addSqlParams, {})
    //       .then(response => {
    //         console.log(response);
    //       });
    // },
    id2LogIndex(val) {
      //用车辆id找到该任务在任务日志里的index
      //批量重载如为一车选取多个任务，默认只重载第一个
      for (var i = 0; i < this.selected_rows.length; i++) {
        if (this.selected_rows[i].used_car == val) {
          return i;
          break;
        }
      }
      return null;
    },
    id2Index(val) {
      //用车辆id找到该车在车辆数组里的index
      for (var i = 0; i < this.$root.car_status.length; i++) {
        if (this.$root.car_status[i].car_id == val) {
          return i;
          break;
        }
      }
      return null;
    },
    publishMQTT() {
      var index = this.id2Index(this.selected_car);
      this.current_mission.status = "待完成";
      this.current_mission.id = this.route_list.length;
      this.current_mission.note = this.mission_note;
      this.current_mission.time_start = this.time_start;
      this.$root.map_status.where_car[index].current_mission = $.extend(
        true,
        null,
        this.current_mission
      );
      this.route_list.push($.extend(true, null, this.current_mission));
      this.$root.mission_list.push($.extend(true, null, this.current_mission));
      var temp = {
        car_id: this.selected_car,
        time_start: this.time_start,
        mission_lines: this.lines
      };

      var qtt = JSON.stringify(temp); //定义消息（可以为字符串、对象等）
      console.log(qtt);
      var topic = "testProject/clientPub/id" + this.selected_car + "/mission";
      this.client_map.publish(topic, qtt, { qos: 0, retain: false });
      this.insertMissionToSQL([this.current_mission]);
      this.mission_note = "";
      this.publishShow = false;
    },
    cleanFilters() {
      this.note_search = "";
      this.is_completed = "";
      this.which_car = "";
    },
    handleSelectionChange(val) {
      //选中历史日志时载入日志中的历史路径和目的地，并把车辆当的实时位置设置为第一段路径的起点
      this.selected_rows = $.extend(true, [], val);
      if (val.length == 1) {
        this.is_many = false;

        this.lines = $.extend(true, [], val[0].mission_lines);
        this.notDoneLines = $.extend(true, [], val[0].todo_lines);
        this.goals = $.extend(true, [], val[0].mission_goals);
        this.notDoneGoals = $.extend(true, [], val[0].todo_goals);
      } else if (val.length > 1) {
        this.is_many = true;
        var index = this.id2LogIndex(this.selected_car);
        // console.log(index);
        if (index != null) {
          this.lines = $.extend(true, [], val[index].mission_lines);
          this.notDoneLines = $.extend(true, [], val[index].todo_lines);
          this.goals = $.extend(true, [], val[index].mission_goals);
          this.notDoneGoals = $.extend(true, [], val[index].todo_goals);
        }
        // console.log(val.length);
        // console.log(val[index].mission_goals.length);
      }
    },
    toggleSelection(rows) {
      //多选，其实只拿来当清空选择用
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row, true);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    initMap() {
      this.map = new Map({
        interactions: defaultInteractions({ doubleClickZoom: false }),
        target: "missionMap",
        layers: mapconfig.streetmap(),
        view: new View(this.view_details)
      });
      this.SourceVector = new OlSourceVector({});
    },
    deleteFeature(type, id) {
      this.SourceVector.getFeatures().forEach(feature => {
        if (feature.getProperties().type == type) {
          this.SourceVector.removeFeature(feature);
        }
      });
    },
    cleanMap() {
      //只清除未上传的任务
      for (var i = 0; i < this.$root.car_status.length; i++) {
        if (this.$root.car_status[i].car_id == this.selected_car) {
          this.preGoal = this.where_car[i].where;
          this.current_mission = "";
        }
      }
      for (var i = 0; i < this.goalsLengthOld; i++) {
        this.deleteFeature("goal", i);
      }
      for (var i = 0; i < this.linesLengthOld; i++) {
        this.deleteFeature("line", i);
      }
      (this.goals = []), (this.lines = []), (this.goalsLengthOld = 0);
      this.time_start = null;
      this.notDoneLines = [];
      this.notDoneGoals = [];
      this.linesLengthOld = 0;
    },
    saveMission() {
      //虚假的保存任务
      this.noteShow = true;
    },
    noteClose() {
      //真正的保存任务到本地
      var index = this.id2Index(this.selected_car);
      var todo_lines = $.extend(true, [], this.lines); //这里先假装所有路径都没完成

      var todo_goals = $.extend(true, [], this.goals); //这里先假装所有目标都没完成
      todo_goals.unshift({
        xy: this.where_car[index].where.concat()
      });
      this.current_mission = {
        id: this.route_list.length,
        used_car: this.selected_car,
        time_start: "",
        time_end: "待计算",
        time_stamp: new Date(),
        point_start: $.extend(true, [], this.lines[0].start),
        mission_lines: $.extend(true, [], this.lines),

        mission_goals: $.extend(true, [], this.goals),
        status: "本地",
        todo_lines: todo_lines,
        todo_goals: todo_goals,
        note: ""
      };
      this.noteShow = false;
    },
    updatePlace() {
      //在地图上更新特殊地点
      for (var i = 0; i < this.placesLengthOld; i++) {
        this.deleteFeature("place", i);
      }
      for (i = 0; i < this.places.length; i++) {
        var iconFeature = new Feature({
          type: "place",
          id: i,
          geometry: new Point(this.places[i].xy),
          name: this.places[i].name
        });

        var iconStyle = new Style({
          image: new Icon({
            src: require("../../../assets/img/icon/mapMarkerBlue.png"),
            scale: 0.5
          })
        });
        iconFeature.setStyle(iconStyle);
        this.SourceVector.addFeature(iconFeature);
      }
    },
    updateGoals() {
      //在地图上更新目的地
      for (var i = 0; i < this.goalsLengthOld; i++) {
        this.deleteFeature("goal", i);
      }
      this.SourceVector.getFeatures();
      for (i = 0; i < this.goals.length; i++) {
        var iconFeature = new Feature({
          type: "goal",
          id: i,
          geometry: new Point(this.goals[i].xy)
        });

        var iconStyle = new Style({
          image: new Icon({
            src: require("../../../assets/img/poi-marker-default.png"),
            scale: 0.5,
            offset: [-26, -40],
            size: [100, 200]
          })
        });
        iconFeature.setStyle(iconStyle);
        this.SourceVector.addFeature(iconFeature);
      }
    },
    updateLines() {
      //在地图上更新路径
      for (var i = 0; i < this.linesLengthOld; i++) {
        this.deleteFeature("line", i);
      }
      for (i = 0; i < this.lines.length; i++) {
        var line = new Line([this.lines[i].start, this.lines[i].end]);
        var lineFeature = new Feature({
          geometry: line,
          type: "line",
          id: i,
          dashOffset: 0
        });
        var lineStyle = new Style({
          stroke: new Stroke({
            color: "#ffc028",
            width: 6
          })
        });
        // use style caching in production
        function getAnimationStrokeStyle() {
          return new Style({
            stroke: new Stroke({
              color: [204, 204, 255, 200],
              width: 3,
              lineDash: [2, 7]
            })
          });
        }
        function getStyle() {
          return [lineStyle];
        }

        lineFeature.setStyle(getStyle);
        this.SourceVector.addFeature(lineFeature);
      }
    },
    updateCars() {
      //在地图上更新车
      for (var i = 0; i < this.carsLengthOld; i++) {
        this.deleteFeature("Car", i);
      }
      for (i = 0; i < this.where_car.length; i++) {
        var iconFeature = new Feature({
          type: "Car",
          id: i,
          geometry: new Point(this.where_car[i].where),
          car_number: this.where_car[i].car_id,
          direction: ((90-this.where_car[i].direction) / 180) * Math.PI
        });
        this.car_icon_style = new Style({
          image: new Icon({
            src: require("../../../assets/img/普通.png"),
            scale: 0.6,
            rotation: ((90-this.where_car[i].direction) / 180) * Math.PI
          })
        });
        iconFeature.setStyle(this.car_icon_style);
        this.SourceVector.addFeature(iconFeature);
      }
    },

    formSubmit() {
      if (this.existed == true) {
        this.lines[this.selected_line_id].workType = this.form.type;
        this.lines[this.selected_line_id].routeWidth = this.form.routeWidth;
        this.existed = false;
      } else {
        this.preMark = false;
        this.lines = $.extend(true, [], this.lines);
        this.lines.push({
          start: this.preGoal,
          end: this.coordinate_temp,
          workType: this.form.type,
          routeWidth: this.form.routeWidth
        });
        this.preGoal = this.coordinate_temp;
        this.coordinate_temp = null;
      }

      this.selected_place = "";
      this.is_line = false;
      this.dialogVisible = false;
    },
    formCancel() {
      if (this.preMark == true) {
        this.goals.pop();
        this.selected_place = "";
        this.preMark = false;
      }
      // console.log("Form closed.");
      this.coordinate_temp = null;
      this.is_line = false;
      this.dialogVisible = false;
      this.existed = false;
    },
    logLoad() {
      this.preGoal = this.goals[this.goals.length - 1].xy;
      this.listShow = false;
      this.linesTemp = null;
      this.goalsTemp = null;
      if (this.selected_car == this.last_car) {
        this.is_origin = true;
      } else {
        this.is_origin = false;
      }

      this.redoShow = true;
    },
    manyLoad() {
      this.manyShow = true;
      this.is_many = false;
    },
    manySubmit() {
      this.preGoal = this.goals[this.goals.length - 1].xy;
      this.listShow = false;
      this.linesTemp = null;
      this.goalsTemp = null;
      for (var i = 0; i < this.selected_rows.length; i++) {
        var indexNow = this.id2Index(this.selected_rows[i].used_car);
        var indexLog = this.id2LogIndex(this.selected_rows[i].used_car);
        this.selected_rows[indexLog].time_start =
          new Date().toDateString() +
          " " +
          this.selected_rows[indexLog].time_start.toTimeString();
        this.selected_rows[indexLog].time_start = new Date(
          this.selected_rows[indexLog].time_start
        );
        this.$root.map_status.where_car[indexNow].current_mission = $.extend(
          true,
          null,
          this.selected_rows[indexLog]
        );

        this.$root.map_status.where_car[indexNow].current_mission.status =
          "未完成";

        var temp = {
          car_id: this.selected_rows[i].used_car,
          time_start: this.selected_rows[i].time_start,
          mission_lines: this.selected_rows[i].mission_lines
        };
        var qtt = JSON.stringify(temp); //定义消息（可以为字符串、对象等）
        var topic =
          "testProject/clientPub/id" +
          this.selected_rows[i].used_car +
          "/mission";
        this.client_map.publish(topic, qtt, { qos: 0, retain: false });
        this.insertMissionToSQL([
          this.$root.map_status.where_car[indexNow].current_mission
        ]);

        // console.log(this.selected_rows[i].used_car);
        // console.log(this.selected_rows[i].mission_goals);
      }

      this.manyShow = false;
    },
    listCancel() {
      this.lines = this.linesTemp.concat();
      this.goals = this.goalsTemp.concat();
      this.listShow = false;
    },
    redoNew() {
      // console.log(this.selected_rows);
      var index = this.id2Index(this.selected_car);
      if (
        this.where_car[index].where[0] !=
          this.selected_rows[0].point_start[0] ||
        this.where_car[index].where[1] != this.selected_rows[0].point_start[1]
      ) {
        this.lines.unshift({
          start: this.where_car[index].where,
          end: this.selected_rows[0].point_start,
          workType: "move",
          routeWidth: 0.1
        });
      }
      this.preGoal = this.goals[this.goals.length - 1].xy;
      this.time_start = new Date(
        (this.selected_rows[0].time_start =
          new Date().toDateString() +
          " " +
          this.selected_rows[0].time_start.toTimeString())
      );
      this.redoShow = false;
      this.noteClose();
      this.toggleSelection();
    },
    redoOrigin() {
      // console.log(this.selected_rows);
      if (!this.is_origin) {
        this.resetFlag = false;
      }

      this.selected_car = this.selected_rows[0].used_car;

      var index = this.id2Index(this.selected_car);

      if (
        this.where_car[index].where[0] !=
          this.selected_rows[0].point_start[0] ||
        this.where_car[index].where[1] != this.selected_rows[0].point_start[1]
      ) {
        this.lines.unshift({
          start: this.where_car[index].where,
          end: this.selected_rows[0].point_start,
          workType: "move",
          routeWidth: 0.1
        });
      }
      this.preGoal = this.goals[this.goals.length - 1].xy;
      this.time_start = new Date(
        (this.selected_rows[0].time_start =
          new Date().toDateString() +
          " " +
          this.selected_rows[0].time_start.toTimeString())
      );
      this.$emit("carId", this.selected_car);
      this.redoShow = false;
      this.noteClose();
      this.toggleSelection();
    },

    selectCarByAttribute(type, car_number) {
      var features = this.SourceVector.getFeatures();
      //console.log(features);
      if (this.selectedByAttriFeature != null) {
        this.selectedByAttriFeature.setStyle(this.car_icon_style);
        this.selectedByAttriFeature = null;
      }
      for (var i = 0, ii = features.length; i < ii; i++) {
        if (
          features[i].get("type") === type &&
          features[i].get("car_number") === car_number
        ) {
          this.selectedByAttriFeature = features[i];
          break;
        }
      }

      this.selectedByAttriFeature.setStyle(
        new Style({
          image: new Icon({
            src: require("../../../assets/img/选中.png"),
            scale: 0.6,
            rotation: this.selectedByAttriFeature.get("direction")
          }),
          text: new Text({
            text: "No." + this.selectedByAttriFeature.get("car_number"), // 添加文字描述
            font: "14px font-size", // 设置字体大小
            fill: new Fill({
              // 设置字体颜色
              color: "#5B39E9"
            }),
            offsetY: 20 // 设置文字偏移量
          })
        })
      );
    }
  }
};
</script>

<style>
.el-dialog {
  position: absolute;
  top: 7%;
  right: 4%;
}
.el-dialog .el-dialog__body {
  overflow: auto;
}

.table_mission_log.el-table th,
.table_mission_log.el-table tr {
  /* font-weight: normal; */
  color: "#505050";
  font-size: 14px;
}
</style>

