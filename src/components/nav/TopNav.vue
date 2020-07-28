<template>
<!-- 已经是废案了，这个头部导航栏早没了 -->
  <div style="width:100%;position: fixed;z-index:999;">
    <el-menu background-color="slateblue" mode="horizontal" style="border:0; ">
      <a href="#">
        <img
          class="hidden-md-and-down"
          style="float:left;height: 8vh;width:auto; margin-top:1vh;"
          src="../../assets/img/icon/logo_cut.png"
        />
      </a>
      <!-- <el-button-group>
          <el-button  class="top_nav_links " v-for="item in nav_systems" v-bind:key="item.top_code" v-on:click="updateLeftNav(item.top_txt)" > 
              <div style="padding-top:2vh"><i :class="item.top_link_icon"></i>{{item.top_txt}}</div>
　　　　   </el-button>
      </el-button-group>-->

      <el-submenu
        v-for="item in nav_systems"
        v-bind:key="item.top_code"
        :index="'1-'+item.top_code"
        style="margin-top:2vh;"
      >
        <template slot="title">
          <span style="color:ivory;">
            <i :class="item.top_link_icon" style="color:ivory;"></i>
            &nbsp;{{item.top_txt}}
          </span>
        </template>
        <el-submenu
          v-for="thing in item.nav_details"
          v-bind:key="thing.left_index"
          :index="'1-'+item.top_code+'-'+item.top_code+'-'+thing.left_index"
        >
          <template slot="title">
            <span style="color:ivory;">
              <i :class="thing.left_icon_class" style="color:ivory;"></i>
              &nbsp;{{thing.left_txt}}
            </span>
          </template>

          <el-menu-item
            v-for="temp in thing.sub_nav"
            v-bind:key="temp.sub_index+''"
            v-on:click="changePage(temp.sub_link)"
            style="color:ivory;"
          >
            <i :class="temp.sub_icon_class" style="color:ivory;"></i>
            {{temp.sub_txt}}
          </el-menu-item>
        </el-submenu>
      </el-submenu>

      <el-submenu style="margin-top:2vh;float:right;" index="2">
        <template slot="title">
          <i class="el-icon-setting" style=" text-align:center;color:ivory;font-size:4vh;"></i>
        </template>
        <el-menu-item
          v-for="item in nav_details"
          v-bind:key="item.top_icon_class"
          :href="item.top_link"
          :index="'2-'+item.top_index"
          style="color:ivory;"
        >
          <i :class="item.top_icon_class" style="color:ivory;"></i>
          {{item.top_icon_name}}
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nav_details: this.$attrs.nav_details,
      nav_systems: this.$attrs.nav_systems
    };
  },
  methods: {
    changePage(data) {
      this.$emit("page", data);
      console.log(data);
    }
  }
};
</script>

<style scoped>
@import "../SunnyCss.css";
@import "element-ui/lib/theme-chalk/display.css";
</style>