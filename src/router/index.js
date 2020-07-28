import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Monitor from "@/components/monitor/Monitor.vue";
import DataAnalysis from "@/components/dataAnalysis/DataAnalysis.vue";
import Mission from "@/components/mission/Mission.vue";
import Manager from "@/components/manager/Manager.vue";
import User from "@/components/user/User.vue";
import Message from "@/components/user/Message.vue";
import Parallel from "@/components/parallel/Parallel.vue";

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import Alldata from "../assets/data/test.js";
Vue.use(ElementUI)
Vue.use(Router)

export default new Router({//加新页面记得来这里注册组件，最好别用props传值，因为不能实现动态绑定，把本地临时数据都用$root在main.js里操作或者用provide+inject是比较方便的方法
  routes: [
    {
      path: '/Home',
      name: 'Home',
      component: Home,
      children: [
        {
          path: "/Monitor",
          name: "Monitor",
          component: Monitor,
        },
        {
          path: "/DataAnalysis",
          name: "DataAnalysis",
          component: DataAnalysis,
          prop: {}
        },
        {
          path: "/Mission",
          name: "Mission",
          component: Mission,
          props: {
            the_cars: Alldata.the_cars
          }

        },
        {
          path: "/Manager",
          name: "Manager",
          component: Manager,
          props: {}
        },
        {
          path: "/User",
          name: "User",
          component: User,
          props: {}
        },
        {
          path: "/Message",
          name: "Message",
          component: Message,
          props: {}
        },
        {
          path: "/Parallel",
          name: "Parallel",
          component: Parallel,
          props: {}
        },
      ]


    },
    {      path: '/Login',
    name: 'Login',
    component: Login,},
    { path: '/', redirect: '/Login' }

  ]
})
