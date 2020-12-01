<template>
  <div class="main">
    <div class="zl-toolbar-container">
      <ToolBar :moduleConfig="menuData" />
    </div>
    <div class="zl-table-content">
      <Table
        :data="tableData"
        :column="['order', 'projectName', 'remark', 'target']"
      />
    </div>
    <div class="zl-drawer-content">
      <Drawer :info="menuData.infoTatistics" />
    </div>
  </div>
</template>
<script>
import { moduleConfig } from "./config/index";
import contentData from "./data/data.json";
import ToolBar from "./Layout/ToolBar/index";
import Table from "./Layout/Table/index";
import Drawer from "./Layout/Drawer/index";
export default {
  name: "zl-main",
  components: {
    ToolBar,
    Table,
    Drawer,
  },
  data() {
    return {
      menuData: moduleConfig,
      tableData: [],
    };
  },

  computed: {
    data() {
      return this.$store.state.dataState.data; //需要监听的数据
    },
  },
  watch: {
    data(newVal, oldVal) {
      this.tableData = newVal;
    },
  },

  created() {},
  mounted() {
    this.tableData = contentData.data;
    this.$store.commit("setData", contentData.data);
    this.$store.commit("setCopyData", contentData.data);
  },
  methods: {
    setSize() {},
  },
};
</script>

<style lang="scss" scoped>
.main {
  .zl-drawer-content {
    width: 500px;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    border-left: 1px solid #eee;
    // background: #eee;
  }
}
</style>
<style lang="scss">
@import "./style/gloable.scss";
</style>