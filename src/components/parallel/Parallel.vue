<template>
  <div>
    <el-row id="parallel">
      <el-col :lg="24">
        <div style="height: 50px;"></div>
      </el-col>
      <el-col :lg="2"></el-col>
      <el-col :lg="20">
        <h1>parallel</h1>
        <div class="ag-container" style="height:80vh">
          <AgoraVideoCall
            :videoProfile="videoProfile"
            :channel="channel"
            :transcode="transcode"
            :attendeeMode="attendeeMode"
            :baseMode="baseMode"
            :appId="appId"
            :uid="uid"
          ></AgoraVideoCall>
        </div>
        <div style="height:50px"></div>
      </el-col>
      <el-col :lg="2"></el-col>
    </el-row>
  </div>
</template>

<script>
import AgoraVideoCall from "@/components/parallel/parts/AgoraVideoCall";
export default {
  data() {
    return {
      appId: "d8dc577dfb654283b70e61599932811a",
      videoProfile: "480p_4",
      channel: "test",
      transcode: "interop",
      attendeeMode: "video",
      baseMode: "avc",
      uid: undefined
    };
  },
  components: {
    AgoraVideoCall
  }
};
</script>

<style scoped>
@import "../SunnyCss.css";

.ag-container {
  width: 90%;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}
</style>