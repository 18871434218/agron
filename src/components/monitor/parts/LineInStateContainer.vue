<template>
<!-- 已经没用了 -->
  <div class="bg">
    <div style="width: 15%;float: left;min-height: 1px;"></div>

    <div style="width: 40%;float: left;min-height: 1px;">
      <div class="iconInfo">
        <img v-if="iconSrc1 != ''" :id="state_id1" class="alertIcon" :src="iconSrc1" />
        <p v-if="iconSrc1 == ''">没图</p>
      </div>
      <div class="alertContent">
        <span>{{state_name1}}</span>
      </div>
    </div>
    <div v-if="state_id2 !=''" style="width: 45%;float: left;min-height: 1px;">
      <div class="iconInfo">
        <img v-if="iconSrc2 != ''" :id="state_id2" :src="iconSrc2" class="alertIcon" />
      </div>
      <div class="alertContent">
        <span>{{state_name2}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    state_src1: {
      type: String,
      default() {
        return "/icon/errorBlue.png";
      } //非动态，只是个初始值
    },
    state_src2: {
      type: String,
      default() {
        return "";
      } //非动态，只是个初始值
    },
    state_id1: {
      type: String,
      default() {
        return "";
      }
    },
    state_id2: {
      type: String,
      default() {
        return "";
      }
    },
    state_name1: {
      type: String,
      default() {
        return "得起个名字";
      }
    },
    state_name2: {
      type: String,
      default() {
        return "";
      }
    }
  },
  data() {
    return {
      state_icon1: this.state_src1, //动态的在这里改
      state_icon2: this.state_src2
    };
  },
  computed: {
    iconSrc1: function() {
      return require("../../../assets/img" + this.state_icon1);
    },
    iconSrc2: function() {
      return require("../../../assets/img" + this.state_icon2);
    }
  }
};
</script>

<style scoped>
@import "../../SunnyCss.css";
</style>>