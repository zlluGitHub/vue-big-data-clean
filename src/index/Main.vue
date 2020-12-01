<template>
  <div class="main">
    <div class="zl-toolbar-container">
      <ToolBar />
    </div>
    <div class="zl-table-content">
      <Table />
    </div>
    <div class="zl-drawer-content">
      <Drawer />
    </div>
  </div>
</template>
<script>
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
    return {};
  },
  created() {},
  mounted() {},
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
@import "./style/gloable.scss"
</style>