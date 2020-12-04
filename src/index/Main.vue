<template>
  <div class="main">
    <div class="left">
      <div class="zl-toolbar-container">
        <ToolBar :moduleConfig="menuData" />
      </div>
      <div class="zl-table-content" ref="tableContent">
        <div class="source scrollbar" :style="sourceStyle">
          <IndexTable :data="tableData" :column="columnsData" :order="true" />
        </div>
        <div
          class="preview scrollbar"
          :style="previewStyle"
          v-if="previewData.tableData && previewData.columns"
        >
          <PreviewTable
            :data="previewData.tableData"
            :column="previewData.columns"
          />
        </div>
        <!-- <Table :data="tableData" :column="columnsData" /> -->
      </div>
    </div>
    <div class="right">
      <Drawer :info="menuData.infoTatistics" />
    </div>
  </div>
</template>
<script>
import { moduleConfig } from "./config/index";
import { windowSize } from "./utils";
import contentData from "./data/data.json";
import ToolBar from "./Layout/ToolBar/index";
import IndexTable from "./Layout/Table/indexTable";
import PreviewTable from "./Layout/Table/previewTable";
import Drawer from "./Layout/Drawer/index";
export default {
  name: "zl-main",
  components: {
    ToolBar,
    IndexTable,
    PreviewTable,
    Drawer,
  },
  data() {
    return {
      menuData: moduleConfig,
      tableData: [],
      columnsData: [],
      previewData: {},
      sourceStyle: {},
      previewStyle: {},
    };
  },

  computed: {
    data() {
      return this.$store.state.dataState.data;
    },
    column() {
      return this.$store.state.dataState.columns;
    },
    preview() {
      return this.$store.state.dataState.previewData;
    },
  },
  watch: {
    data(newVal, oldVal) {
      console.log(newVal);
      this.tableData = newVal;
    },
    column(newVal, oldVal) {
      console.log(newVal);
      this.columnsData = newVal;
    },
    preview(newVal, oldVal) {
      console.log(newVal);
      this.$nextTick(() => {
        this.setSize(newVal);
      });

      this.previewData = newVal;
    },
  },

  created() {},
  mounted() {
    this.setSize();
    let data = contentData.data.map((item) => {
      item.isRow = true;
      return item;
    });
    let columns = [];
    if (data.length) {
      for (const key in data[0]) {
        columns.push({
          label: key,
          value: key,
        });
      }
    }
    this.$store.commit("setData", data);
    this.$store.commit("setColumns", columns);
    this.$store.commit("setColumnsCopy", columns);
    this.$store.commit("setCopyData", data);
  },
  methods: {
    setSize(newVal) {
      let tableContentWidth = this.$refs.tableContent.clientWidth;
      if (newVal && newVal.tableData) {
        tableContentWidth = tableContentWidth - 350;
      }
      let tableContentHeight = windowSize().winH - 43;
      this.sourceStyle = {
        width: tableContentWidth + "px",
        height: tableContentHeight + "px",
      };
      this.previewStyle = {
        width: "350px",
        height: tableContentHeight + "px",
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  .left {
    width: 75%;
    .zl-table-content {
      display: flex;
      justify-content: space-between;
      .source,
      .preview {
        // height: 95vh;
        overflow: auto;
      }
    }
  }
  .right {
    width: 25%;
    // width: 500px;
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