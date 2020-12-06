<template>
  <div class="main">
    <div class="left" ref="leftWarp" :style="{ width: leftWarpWidth + 'px' }">
      <div class="zl-toolbar-container">
        <ToolBarTop :moduleConfig="menuData" />
      </div>
      <div class="zl-table-content">
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
      <div class="zl-toolbar-bottom">
        <ToolBarBottom :toolBar="footerInfo" />
      </div>
    </div>
    <div class="right" v-if="isOpenDrawer">
      <Drawer
        :info="menuData.infoTatistics"
        @on-click="handleOnClick"
        :height="height"
      />
    </div>
  </div>
</template>
<script>
import contentData from "./data/data.json";

import { dataQualityStatistics } from "./utils/processing";
import { moduleConfig } from "./config/index";
import { windowSize } from "./utils";
import ToolBarTop from "./Layout/ToolBar/top";
import ToolBarBottom from "./Layout/ToolBar/bottom";
import IndexTable from "./Layout/Table/indexTable";
import PreviewTable from "./Layout/Table/previewTable";
import Drawer from "./Layout/Drawer/index";
export default {
  name: "zl-main",
  components: {
    ToolBarTop,
    ToolBarBottom,
    IndexTable,
    PreviewTable,
    Drawer,
  },
  data() {
    return {
      isOpenDrawer: true,
      menuData: moduleConfig,
      tableData: [],
      columnsData: [],
      previewData: {},
      sourceStyle: {},
      previewStyle: {},
      height: 600,
      leftWarpWidth: 0,
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
    footerInfo() {
      return this.$store.state.dataState.footerInfo;
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

  created() {
    this.$store.dispatch("reqQualityStatistics");
    this.$store.dispatch("reqGetData", { pageNo: 1, pageSize: 200 });
    this.$event.on("is-open-drawer", (state) => {
      this.isOpenDrawer = state;
    });
  },
  mounted() {
    this.setSize();
    window.onresize = () => {
      this.setSize();
    };

    // let data = contentData.data;

    // let columns = [];
    // if (data.length) {
    //   for (const key in data[0]) {
    //     columns.push({
    //       label: key,
    //       value: key,
    //     });
    //   }
    // }

    // this.toolBar = {
    //   column: columns.length,
    //   row: data.length,
    // };
    // this.$saveData(columns, data);

    // this.$store.commit("setDataQualityStatistics", dataQualityStatistics(data));
  },
  methods: {
    handleOnClick(state) {
      this.isOpenDrawer = state;
    },
    setSize(newVal) {
      // let tableContentWidth = this.$refs.tableContent.clientWidth;

      if (this.isOpenDrawer) {
        this.leftWarpWidth = this.$refs.leftWarp.clientWidth - 450;
      } else {
        this.leftWarpWidth = this.$refs.leftWarp.clientWidth;
      }

      let tableContentHeight = windowSize().winH - 44 * 2;
      this.height = tableContentHeight;
      this.sourceStyle = {
        height: tableContentHeight + "px",
      };
      this.previewStyle = {
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
    position: relative;
    width: 100%;
    flex: 1;
    .zl-table-content {
      display: flex;
      width: 100%;
      justify-content: space-between;
      .source,
      .preview {
        overflow: auto;
      }
      .source {
        width: 100%;
        flex: 1;
      }
      // .preview {

      // }
    }
    .zl-toolbar-bottom {
      position: absolute;
      // bottom: -44;
      width: 100%;
    }
  }
  .right {
    width: 450px;
    border-left: 1px solid #eee;
    // background: #eee;
  }
}
</style>
<style lang="scss">
@import "./style/gloable.scss";
</style>