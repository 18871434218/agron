<template>
  <el-row>
    <el-col :lg="2"></el-col>
    <el-col :lg="20">
      <h1>manager</h1>
      <el-transfer
        v-model="value"
        :data="data"
        :titles="['候选车辆', ' 已选中车辆']"
        :button-texts="['移除', '选择']"
      ></el-transfer>
      <el-select v-model="version" filterable placeholder="请选择版本" size="small">
        <el-option v-for="item in version_list" :key="item" :label="item" :value="item"></el-option>
      </el-select>
      <el-button
        style="background-color: transparent;color:ivory;"
        icon="el-icon-s-claim"
        size="mini"
      >部署</el-button>
    </el-col>
    <el-col :lg="2"></el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    const generateData = _ => {
      const data = [];
      for (let i = 1; i <= 15; i++) {
        data.push({
          key: i,
          label: `车 ${i}`,
          disabled: i % 4 === 0
        });
      }
      return data;
    };
    return {
      data: generateData(),
      value: [1],
      version: null,
      version_list: ["1.1", "1.2", "1.3"]
    };
  }
};
</script>

<style scoped>
@import "../SunnyCss.css";
</style>