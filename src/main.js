// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCookies from 'vue-cookies'

Vue.use(VueCookies)
Vue.use(VueAxios, axios)
Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
  el: '#app',
  provide() {//用provide能让本组件的所有下级组件都能用inject来取到这些值，当值改变时所有下级组件取到的值也会跟着改变
    return {
      the_cars: this.the_cars,
      car_status: this.car_status,
      map_status: this.map_status,
      current_page: this.current_page,
  

    }
  },
  data() {
    return {
      login_time:null,
      can_login:false,
      is_logout:false,
      hide_help:false,
      message_list:[{id:"000",type:"Danger",text:"一号车掉沟里了。",status:"未读"},{id:"001",type:"Warning",text:"一号车缺水了。",status:"已读"},{id:"002",type:"Danger",text:"一号车撞到花坛了。",status:"未读"}],
      current_page:{name:"Moniter"},
      user:{"name":window.$cookies.get("user_name")||null,"password":window.$cookies.get("password")||null},
      mission_list: [],//从数据库那里下载来的任务日志
      the_cars: [{ "car_id": "001" }],//在线车辆
  
      car_status: [{
        "car_id": "001", "car_speed": 10, "car_battery": 10, "car_connectinState": 0.5, "car_speed_rad": 0.5,"car_work":"任务进行中",
        "state_items": [
          { "state_id1": "locationInfoImg", "state_name1": "位置信息", "state_src1": require('assets/img/monitor/icon-26.png'), "state_id2": "cameraInfoImg", "state_name2": "相机", "state_src2": require('assets/img/monitor/icon-26.png') },
          { "state_id1": "lidarInfoImg", "state_name1": "激光雷达", "state_src1": require('assets/img/monitor/icon-26.png'), "state_id2": "MMWRInfoImg", "state_name2": "任务执行", "state_src2": require('assets/img/monitor/icon-26.png') },
          { "state_id1": "MMWRInfoImg", "state_name1": "毫米波雷达", "state_src1": require('assets/img/monitor/icon-26.png'), "state_id2": "controllerInfoImg", "state_name2": "控制器", "state_src2": require('assets/img/monitor/icon-26.png') },
          { "state_id1": "ultrasonicRadarInfoImg", "state_name1": "超声波雷达", "state_src1": require('assets/img/monitor/icon-26.png') }
        ]

      },],
      map_status: {
        "places": [//地图上固定坐标的点，就是地图上那些小蓝圈
          { xy: [114, 22], name: '小卖部' },
          { xy: [114.1, 22.1], name: '水果店' },
          { xy: [114.5, 22.5], name: '洗衣房' },
          { xy: [114.1, 22.5], name: '食堂' }
        ],
        lines: [],//任务路径组
        view_details: {//openlayers初始view设置
          projection: "EPSG:4326",    //使用这个坐标系
          center: [115, 22],
          zoom: 9
        },
        "where_car": [{ "car_id": "001", where: [114.7, 22.5], direction: 180, current_mission: '' }]//    rotate 方法第一个参数是角度，为数值，单位不是度，180度对应数值PI，也就是3.1415926 · · ·；且正数表示顺时针旋转，如要想顺时针旋转60度，那么传入 Math.PI /3。
        //     这里direction直接传入度数就行了，转换方法我已经写到地图组件内部了
      }
    }

  },
  router,
  components: { App },
  template: '<App/>'
})
