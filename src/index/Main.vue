<template>
  <div class="main">
    <div class="left" ref="leftWarp" :style="{ width: leftWarpWidth + 'px' }">
      <div class="zl-toolbar-container">
        <ToolBarTop
          :moduleConfig="menuData"
          @on-clear-select="$refs.indexTable.handleClearClick()"
        />
      </div>
      <div class="zl-table-content">
        <div class="source scrollbar" :style="sourceStyle" ref="source">
          <div ref="indexTableWarp">
            <IndexTable
              :data="tableData"
              :column="columnsData"
              :order="true"
              ref="indexTable"
            />
          </div>
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
        <Loading v-if="loading.state" :text="loading.text" />
      </div>
      <div class="zl-toolbar-bottom">
        <ToolBarBottom :toolBar="footerInfo" />
      </div>
    </div>
    <div class="right" v-show="isOpenDrawer">
      <Drawer
        :info="menuData.infoTatistics"
        @on-close="onDrawerClose"
        :height="height"
      />
    </div>
  </div>
</template>
<script>
import contentData from "./data/data.json";

import Loading from "./components/Loading";
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
    Loading,
  },
  data() {
    return {
      loading: {},
      isOpenDrawer: false,
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
      console.log(newVal, "--data--");
      this.tableData = newVal;
    },
    column(newVal, oldVal) {
      console.log(newVal, "--column--");
      this.columnsData = newVal;
    },
    preview(newVal, oldVal) {
      console.log(newVal, "--previewData--");
      this.$nextTick(() => {
        this.setSize(newVal);
      });
      this.previewData = newVal;
    },
  },

  created() {
    this.$store.dispatch("reqQualityStatistics");
    this.$store.dispatch("reqGetData", { pageNo: 1, pageSize: 200 });
    this.$event.on("is-open-drawer", this.onIsOpenDrawer);
    this.$event.on("loading", this.onLoading);
  },
  mounted() {
    this.setSize();
    window.onresize = () => {
      this.setSize();
    };

    // 监听div滚动
    let source = this.$refs.source;
    let indexTableWarp = this.$refs.indexTableWarp;
    let isLoading = true;
    let pageNo = 1;
    // 监听这个dom的scroll事件
    source.onscroll = () => {
      // console.log(indexTableWarp.offsetHeight);
      // console.log(source.scrollTop);
      // console.log(indexTableWarp.offsetHeight - (source.scrollTop + this.height));
      let residualHeight =
        indexTableWarp.offsetHeight - (source.scrollTop + this.height);
      if (isLoading && residualHeight < 2000) {
        isLoading = false;
        // let { upId, downId } = this.$store.state.dataState.pageInfo;
        this.$store.dispatch("reqGetData", {
          pageNo: 1,
          pageSize: 200 * pageNo,
          callBack: () => {
            pageNo = pageNo + 1;
            isLoading = true;
          },
        });
      }
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
    onIsOpenDrawer(state) {
      this.isOpenDrawer = state;
    },
    onDrawerClose() {
      this.$store.commit("setColumns", this.$store.state.dataState.columnsCopy);
      this.isOpenDrawer = false;
      this.$store.commit("setPreviewData", []);
      this.$event.emit("menu-type", {
        type: "data-tatistics",
      });
      this.$refs.indexTable.handleClearClick();
    },
    onLoading(state, text) {
      this.loading = { state, text: text ? text : "操作正在执行，请稍后..." };
    },
    // handleOnClick(state) {
    //   this.isOpenDrawer = state;
    // },
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
  beforeDestroy() {
    this.$event.off("is-open-drawer", this.offIsOpenDrawer);
    this.$event.off("loading", this.onLoading);
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
      position: relative;
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
  /deep/ .ivu-spin {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    color: #515a6e;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.9);
  }
}
</style>
<style lang="scss">
@import "./style/gloable.scss";
</style>