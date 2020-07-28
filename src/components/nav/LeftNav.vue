<template>
  <div id="leftNavDiv" v-on:mouseenter="triggerTab(true)" v-on:mouseleave="triggerTab(false)">
    <el-menu class="el-menu-vertical-demo myLeftNav" :collapse="!left_nav_isOpen">
      <div style="height: 230px"></div>

      <!-- <el-menu-item index="0" v-on:click="triggerTab()">
        <i v-show="left_nav_isOpen==false" class="el-icon-s-unfold" style="color:ivory;"></i>
        <i v-show="left_nav_isOpen==true" class="el-icon-s-fold" style="color:ivory;"></i>
      </el-menu-item>-->
      <el-submenu index="1" style="margin-bottom:25px">
        <template slot="title">
          <i
            v-if="link_name!='User'&&link_name!='Message'"
            class="el-icon-user-solid"
            style="color:ivory;font-size:35px;"
          ></i>
          <i
            v-if="link_name=='User'||link_name=='Message'"
            class="el-icon-user-solid"
            style="color:#001F3A;font-size:35px;"
          ></i>
          <!-- <el-avatar size="small" fit="contain">
            <img src="../../assets/img/pang.jpg" />
          </el-avatar>-->
          <span class="leftNavFont" style="font-size:25px;color:#001F3A;" v-if="link_name=='User'||link_name=='Message'" >{{user_name}}</span>
          <span class="leftNavFont" style="font-size:25px;color:ivory;" v-if="link_name!='User'&&link_name!='Message'">{{user_name}}</span>
        </template>
        <el-menu-item index="1-1" v-on:click="changePage('User')" style="font-size:20px;">用户信息</el-menu-item>
        <el-menu-item index="1-2" v-on:click="logout()" style="font-size:20px;">切换账户</el-menu-item>
        <el-menu-item index="1-3" v-on:click="changePage('Message')" style="font-size:20px;">
          消息中心
          <el-badge v-if="unread_messages!=0" :value="unread_messages" :max="99"></el-badge>
        </el-menu-item>
      </el-submenu>
      <div style="background:ivory;height:1px;width:100%;"></div>

      <el-menu-item
        v-for="thing in left_nav_details"
        v-bind:key=" thing.left_index"
        v-on:click="changePage(thing.left_link)"
        :index="'2-'+thing.left_index"
        style="color:ivory;margin-top:70px;font-size:25px;"
      >
        <i
          v-if="link_name!=thing.left_link"
          :class="thing.left_icon_class"
          style="color:ivory;margin-right:40px;font-size:35px;"
        ></i>
        <i
          v-if="link_name==thing.left_link"
          :class="thing.left_icon_class"
          style="color:#001F3A;margin-right:40px;font-size:35px;"
        ></i>
        <span v-if="link_name!=thing.left_link" >{{thing.left_txt}}</span>
        <span v-if="link_name==thing.left_link" style="color:#001F3A;">{{thing.left_txt}}</span>

      </el-menu-item>

      <!-- <el-submenu
        v-for="item in left_nav_details"
        v-bind:key="item.txt"
        :index="item.left_index+''"
      >
        <template slot="title">
          <i :class="item.left_icon_class" style="color:ivory;"></i>
          <span class="leftNavFont">{{item.left_txt}}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item
            v-for="thing in item.sub_nav"
            v-bind:key="thing.sub_index+''"
            v-on:click="changePage(thing.sub_link)"
          >
            <i :class="thing.sub_icon_class"></i>
            {{thing.sub_txt}}
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>-->
      <div style="height:20%"></div>
      <!--系统切换，系统为调度平台时导航栏里没有平行驾驶 -->
      <!-- <div v-if="left_nav_isOpen" style="margin-left:10px">
        <b>系统切换:</b>
        <el-select v-model="sys_txt" filterable placeholder="请选择系统">
          <el-option
            v-for="item in systems"
            :key="item.sys_code"
            :label="item.sys_txt"
            :value="item.sys_txt"
          ></el-option>
        </el-select>
      </div>-->
    </el-menu>
  </div>
</template>

<script>
export default {
  inject: ["current_page"],
  data() {
    return {
      left_nav_isOpen: null,
      left_nav_details: this.$attrs.left_nav_details,
      user_name: this.$root.user.name,
      systems: [
        { sys_code: 1, sys_txt: "调度平台" },
        { sys_code: 2, sys_txt: "待定" }
      ],
      sys_txt: "",

      timer: ""
    };
  },
  created() {
    console.log(this.link_name);
  },
  computed: {
    link_name() {
      return this.current_page.name;
    },
    unread_messages() {
      var temp = 0;
      for (var i = 0; i < this.$root.message_list.length; i++) {
        if (this.$root.message_list[i].status == "未读") {
          temp = temp + 1;
        }
      }
      return temp;
    }
  },
  mounted() {
    // setTimeout(e => {
    //   if (this.$root.can_login == false) {
    //     this.$alert("请从登陆页面登陆", "提示", {
    //       confirmButtonText: "确定",
    //       callback: action => {
    //         this.$root.is_logout = true;
    //         window.removeEventListener(
    //           "beforeunload",
    //           this.beforeunloadHandler()
    //         );
    //         this.$router.push({ name: "Login" });
    //       }
    //     });
    //   }
    // }, 10000); 
    this.timer = setInterval(() => {
        if (this.$root.can_login==false) {
          
              this.$root.is_logout = true;
              window.removeEventListener(
                "beforeunload",
                this.beforeunloadHandler()
              );
              this.$router.push({ name: "Login" });

     
        }

    }, 100);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  watch: {
    sys_txt(val) {
      this.$emit("system", this.sys_txt); //切换系统用
    }
  },
  methods: {
    beforeunloadHandler() {
      this.$message({
        message: "登录失效，请重新登陆。（注意：刷新页面也会导致需要重新登录。）",
        type: "warning"
      });
    },
    logout() {
      this.$confirm("确定切换用户吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$root.is_logout = true;
          window.removeEventListener(
            "beforeunload",
            this.beforeunloadHandler()
          );
          this.changePage("Login");
        })
        .catch(() => {});
    },
    openNav() {
      //document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
      // $(".hamburger").click(function(){
      // 	$(this).toggleClass("is-active");
      // });
      this.left_nav_isOpen = true;
    },
    closeNav() {
      //document.body.style.backgroundColor = "rgba(0,0,0,1)";
      // $(".hamburger").click(function(){
      // 	$(this).toggleClass("toggled");
      // });
      this.left_nav_isOpen = false;
    },
    triggerTab(val) {
      //控制侧边栏开关
      if (val == false) {
        this.closeNav();
      } else {
        this.openNav();
      }
    },
    changePage(val) {
      //控制页面切换
      if (val != this.$root.current_page.name) {
        this.$root.current_page.name = val;
        this.$router.push({ name: val });
      }
    }
  }
};
</script>

<style scoped>
@import "../SunnyCss.css";

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 250px;
  min-height: 400px;
}
.leftNavFont {
  margin-left: 4vh;
  border-right: 0;
  color: ivory;
}
.myLeftNav {
  background-image: linear-gradient(to bottom, #00fff5, #00b4f0);
  border-right: 0;
  background-size: 100%;
  background-repeat: no-repeat;
  width: 76px;
  height: 100%;
  display: block;
  position: fixed;
  overflow-x: hidden;
  overflow-y: hidden;
  font-size: 15px;
  z-index: 999;
}
</style>>
