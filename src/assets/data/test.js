module.exports = {

  


  "nav_details": [
    { "top_index": 2, "top_link": "#", "top_icon_class": 'el-icon-user-solid', "top_icon_name": '用户中心' },
    { "top_index": 3, "top_link": "#", "top_icon_class": 'el-icon-message-solid', "top_icon_name": '信息中心' }],

  "nav_systems": [{
    "top_code": 1, "top_txt": "调度平台", "top_link_icon": "el-icon-potato-strips",
    "nav_details": [
      { left_index: 2, left_link: "Monitor", left_icon_class: 'el-icon-s-platform', left_txt: "实时监控", sub_nav: [{ sub_index: 1, sub_txt: "主界面", sub_link: "Monitor", sub_icon_class: "el-icon-lollipop" }] },
      { left_index: 3, left_link: "DataAnalysis", left_icon_class: 'el-icon-data-line', left_txt: "数据分析", sub_nav: [{ sub_index: 1, sub_txt: "全局数据分析", sub_link: "DataAnalysis", sub_icon_class: "el-icon-lollipop" }, { sub_index: 2, sub_txt: "单机器人", sub_link: "DataAnalysisOne", sub_icon_class: "el-icon-lollipop" }] },
      { left_index: 4, left_link: "Mission", left_icon_class: 'el-icon-s-flag', left_txt: "任务发布", sub_nav: [{ sub_index: 1, sub_txt: "主界面", sub_link: "Mission", sub_icon_class: "el-icon-lollipop" }] },
      // { left_index: 5, left_link: "Manager", left_icon_class: 'el-icon-s-tools', left_txt: "设备管理", sub_nav: [{ sub_index: 1, sub_txt: "主界面", sub_link: "Manager", sub_icon_class: "el-icon-lollipop" }] },
      { left_index: 6, left_link: "Parallel", left_icon_class: 'el-icon-s-tools', left_txt: "平行驾驶", sub_nav: [{ sub_index: 1, sub_txt: "视频通话", sub_link: "Parallel", sub_icon_class: "el-icon-lollipop" }] }
    ]
  },
  {
    "top_code": 2, "top_txt": "待定", "top_link_icon": "el-icon-milk-tea",
    "nav_details": [
      { left_index: 2, left_link: "Monitor", left_icon_class: 'el-icon-s-platform', left_txt: "没想好", sub_nav: [{ sub_index: 1, sub_txt: "主界面", sub_link: "Monitor", sub_icon_class: "el-icon-lollipop" }] },
      { left_index: 3, left_link: "DataAnalysis", left_icon_class: 'el-icon-truck', left_txt: "没想好", sub_nav: [{ sub_index: 1, sub_txt: "主界面", sub_link: "DataAnalysis", sub_icon_class: "el-icon-lollipop" }, { sub_index: 2, sub_txt: "单机器人", sub_link: "DataAnalysisOne", sub_icon_class: "el-icon-lollipop" }] },
      { left_index: 4, left_link: "Mission", left_icon_class: 'el-icon-s-promotion', left_txt: "没想好", sub_nav: [{ sub_index: 1, sub_txt: "主界面", sub_link: "Mission", sub_icon_class: "el-icon-lollipop" }] },
      { left_index: 5, left_link: "Manager", left_icon_class: 'el-icon-s-tools', left_txt: "没想好", sub_nav: [{ sub_index: 1, sub_txt: "主界面", sub_link: "Manager", sub_icon_class: "el-icon-lollipop" }] },
      { left_index: 6, left_link: "Parallel", left_icon_class: 'el-icon-s-tools', left_txt: "平行驾驶", sub_nav: [{ sub_index: 1, sub_txt: "视频通话", sub_link: "Parallel", sub_icon_class: "el-icon-lollipop" }] },

    ]
  }],




}