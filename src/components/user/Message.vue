<template>
  <el-row id="message">
    <el-col :span="24">
      <div style="height: 100px;"></div>
    </el-col>
    <el-col :span="2"></el-col>
    <el-col :span="20">
      <h1>信息中心</h1>
      <el-table
        :data="this.$root.message_list"
        style="width: 100%"
        :row-class-name="tableRowClassName"
        class="message_table"
        @row-click="readMessage"
        :header-cell-style="{'background': '#314a61','color':'#909399','border': 0}"
      >
        <el-table-column  width="180">
          <template slot-scope="scope">
                <el-tag size="medium" v-if="scope.row.status=='未读'" color="blue">{{ scope.row.status}}</el-tag>
                <el-tag size="medium" v-if="scope.row.status=='已读'" color="#00fff5">{{ scope.row.status}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" sortable width="180"></el-table-column>
        <el-table-column prop="id" label="ID" sortable width="180"></el-table-column>
        <el-table-column prop="text" label="内容"></el-table-column>
      </el-table>
    </el-col>
    <el-col :span="2"></el-col>
  </el-row>
</template>

<script>
export default {
  methods: {
    tableRowClassName({ row, rowIndex }) {
      return row.type;
    },
    readMessage(val) {
      if (val.status == "未读") {
        val.status = "已读";
      }
    }
  }
};
</script>
<style>
.message_table.el-table .Warning {
  background: #98ff44;
}

.message_table.el-table .Danger {
  background: #e41f18dc;
}

.message_table.el-table--border tr,
td {
  background-color: transparent !important;
  border: 0 !important;
}
.message_table.el-table::before {
  height: 0;
}
.message_table.el-table,
.message_table.el-table__expanded-cell {
  background-color: transparent !important;
}

.message_table.el-table th,
.message_table.el-table tr {

  color:rgb(179, 179, 175); 
  font-size: 18px;
}
.message_table.el-table--enable-row-hover
  .el-table__body
  tr:hover
  > td {
  background-color: transparent !important;
}

</style>
<style scoped>
@import "../SunnyCss.css";
</style>