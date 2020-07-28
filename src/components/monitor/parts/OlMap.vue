<template>
  <div id="map" ref="rootmap" oncontextmenu="return false" style="padding:4vh;"></div>
</template>

<script>
import "ol/ol.css";
import { Map, View } from "ol";
import Overlay from "ol/Overlay";
import mapconfig from "./config/mapconfig";
import Feature from "ol/Feature";
import { doubleClick } from "ol/events/condition";
import Point from "ol/geom/Point";
import Line from "ol/geom/LineString";
import OlLayerVector from "ol/layer/Vector";
import OlSourceVector from "ol/source/Vector";

import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import Stroke from "ol/style/Stroke";

// 用来添加相关文字描述的
import Text from "ol/style/Text";
import Fill from "ol/style/Fill";
import "jquery";
import { defaults as defaultInteractions, Select } from "ol/interaction";
//添加translate，用来让元素能移动

export default {
  inject: ["map_status"],
  data() {
    return {
      map: null,
      select: null,

      SourceVector: null,
      CarVector: null,
      placesLengthOld: 0,
      linesLengthOld: 0,
      goalsLengthOld: 0,
      carsLengthOld: 0,

      selected_car: "",

      selectedByAttriFeature:'',
      car_icon_style: null, //存一下车图标样式，方便切换回来
    };
  },
  mounted() {
    this.initMap();

    this.updatePlaces();
    this.placesLengthOld = this.places.length;

    this.updateLines();
    this.linesLengthOld = this.lines.length;

    var vectorLayer = new OlLayerVector({
      source: this.SourceVector
    });
    this.carsLengthOld = this.where_car.length;
    this.updateCars();
    // this.map.addInteraction(this.select);
    this.map.addLayer(vectorLayer);
    this.map.on("dblclick", e => {
      //绑定选定车辆事件到双击
      var feature = this.map.forEachFeatureAtPixel(e.pixel, function(feature) {
        return feature;
      });
      var pixel = this.map.getEventPixel(e.originalEvent);
      this.map.forEachFeatureAtPixel(pixel, feature => {
        var coodinate = e.coordinate;
        if (feature.get("type") == "Car") {
          this.$emit("carId", feature.get("car_number"));
          this.selectedByAttriFeature=feature;
        }
      });
    });
  },
  computed: {
    // selected_collection() {
    //   //实时获取被选中的地图feature
    //   if (this.select != null) {
    //     console.log(this.select);
    //     return this.select.getFeatures();
    //   } else {
    //     return "";
    //   }
    // },
    places() {
      //实时获取固定地点（小蓝圈）
      // return this.map_status.places;
      return [];
    },
    lines() {
      //实时获取任务路径
      if (this.selected_car != "") {
        for (var i = 0; i < this.map_status.where_car.length; i++) {
          if (this.map_status.where_car[i].car_id == this.selected_car) {
            if (this.map_status.where_car[i].current_mission != "") {
              return this.map_status.where_car[i].current_mission.mission_lines;
            }
          }
        }
        return [];
      } else {
        return [];
      }
    },
    goals() {
      //实时获取任务路径
      if (this.selected_car != "") {
        for (var i = 0; i < this.map_status.where_car.length; i++) {
          if (this.map_status.where_car[i].car_id == this.selected_car) {
            if (this.map_status.where_car[i].current_mission != "") {
              return this.map_status.where_car[i].current_mission.mission_goals;
            }
          }
        }
        return [];
      } else {
        return [];
      }
    },
    view_details() {
      return this.map_status.view_details;
    },
    where_car() {
      //实时获取车
      return this.map_status.where_car;
    }
  },
  watch: {

    selected_car(val) {
      //换车了就会更新实时监控里的坐标和朝向
      if (this.selected_car != "") {
        for (var i = 0; i < this.$root.car_status.length; i++) {
          if (this.$root.car_status[i].car_id == this.selected_car) {
            document.getElementById("poseInfoLongitude").innerHTML =
              "经度: " + this.where_car[i].where[0].toFixed(3);
            document.getElementById("poseInfoLatitude").innerHTML =
              "纬度: " + this.where_car[i].where[1].toFixed(3);
            document.getElementById("poseInfoPose").innerHTML =
              "方向角: " +this.where_car[i].direction.toFixed(3);
            this.selectCarByAttribute("Car", this.where_car[i].car_id);
            this.map.getView().setCenter([this.where_car[i].where[0].toFixed(3),this.where_car[i].where[1].toFixed(3)]);
            this.map.getView().setZoom(15);

            break;
          }
        }
      }
    },
    lines: {
      //更新任务路径
      handler(newValue, oldValue) {
        this.updateLines();
        this.linesLengthOld = this.lines.length;
        // console.log("newlineslen:" + lines.length);
      },
      deep: true
    },
    goals: {
      //更新任务路径
      handler(newValue, oldValue) {
        this.updateGoals();
        this.goalsLengthOld = this.goals.length;
        // console.log("newlineslen:" + lines.length);
      },
      deep: true
    },
    where_car: {
      //车动了就会更新实时监控里的坐标和朝向
      handler(newValue, oldValue) {
        this.carsLengthOld = this.where_car.length;
        this.updateCars();
        for (var i = 0; i < this.$root.car_status.length; i++) {
          if (this.$root.car_status[i].car_id == this.selected_car) {
            document.getElementById("poseInfoLongitude").innerHTML =
              "经度: " + this.where_car[i].where[0].toFixed(3);
            document.getElementById("poseInfoLatitude").innerHTML =
              "纬度: " + this.where_car[i].where[1].toFixed(3);
            document.getElementById("poseInfoPose").innerHTML =
              "方向角: " +this.where_car[i].direction.toFixed(3);
            this.selectCarByAttribute("Car", this.where_car[i].car_id);
            break;
          }
        }
      },
      deep: true
    },
    places: {
      //更新固定地点（小蓝圈）
      handler(newValue, oldValue) {
        this.updatePlaces();
        this.placesLengthOld = this.places.length;
        // console.log("newplacelen:" + this.places.length);
      },
      deep: true
    }
  },
  methods: {
    initMap() {
      //初始化地图
      this.map = new Map({
        interactions: defaultInteractions({ doubleClickZoom: false }),
        target: "map",
        layers: mapconfig.streetmap(),
        view: new View(this.view_details)
      });

      this.select = new Select({
        //添加select后车子图标会改变、底下会出现字的事件
        condition: doubleClick,
        style: function(feature) {
          if (feature.get("type") == "Car") {
            feature.setStyle(
              new Style({
                image: new Icon({
                  src: require("../../../assets/img/mission/mapYellowB.png"),
                  rotation: feature.get("direction")
                }),
                text: new Text({
                  text: "No." + feature.get("car_number"), // 添加文字描述
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
      });

      this.SourceVector = new OlSourceVector({});
    },
    deleteFeature(type, id) {
      //删除指定feature
      this.SourceVector.getFeatures().forEach(feature => {
        if (
          feature.getProperties().id == id &&
          feature.getProperties().type == type
        ) {
          this.SourceVector.removeFeature(feature);
        }
      });
    },
    updatePlaces() {
      //当地点信息更新时重绘所有地点
      for (var i = 0; i < this.placesLengthOld; i++) {
        this.deleteFeature("place", i);
      }
      for (i = 0; i < this.places.length; i++) {
        var iconFeature = new Feature({
          type: "place",
          id: i,
          geometry: new Point(this.places[i].xy),
          car_number: this.places[i].name
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
      //当目的地信息更新时重绘所有目的地
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
          }),
          text: new Text({
            text:
              "经:" +
              this.goals[i].xy[0].toFixed(3) +
              "  纬:" +
              this.goals[i].xy[1].toFixed(3), // 添加文字描述
            font: "14px font-size", // 设置字体大小
            fill: new Fill({
              // 设置字体颜色
              color: "#5B39E9"
            }),
            offsetY: 20 // 设置文字偏移量
          })
        });
        iconFeature.setStyle(iconStyle);
        this.SourceVector.addFeature(iconFeature);
      }
    },
    updateLines() {
      //当任务路径信息更新时重绘所有任务路径
      for (var i = 0; i < this.linesLengthOld; i++) {
        this.deleteFeature("line", i);
      }
      for (i = 0; i < this.lines.length; i++) {
        var line = new Line([this.lines[i].start, this.lines[i].end]);
        var lineFeature = new Feature({
          geometry: line,
          type: "line",
          id: i,
          dashOffset: 0,
          car_number: this.lines[i].car_number
        });
        var lineStyle = new Style({
          stroke: new Stroke({
            color: "#ffc028",
            width: 6
          })
        });

        function getAnimationStrokeStyle() {
          return new Style({
            stroke: new Stroke({
              color: [204, 204, 255, 1],
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
      //当车辆信息更新时重绘所有车
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

    selectCarByAttribute(type, car_number) {
      //根据车辆id选择地图上对应的车辆feature
      var features = this.SourceVector.getFeatures();
      //console.log(features);
      if (this.selectedByAttriFeature != "") {
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
            scale:0.6,
            rotation: this.selectedByAttriFeature.get("direction")
          }),
          text: new Text({
            text:  this.selectedByAttriFeature.get("car_number"), // 添加文字描述
            font: "14px font-size", // 设置字体大小
            fill: new Fill({
              // 设置字体颜色
              color: "#5B39E9"
            }),
            offsetY: 30 // 设置文字偏移量
          })
        })
      );

      // if (this.selected_collection.array_.length != 0) {
      //   this.selected_collection.pop();
      // }

      // this.selected_collection.push(selectedByAttriFeature);
    }
  }
};
</script>

<style>
</style>

