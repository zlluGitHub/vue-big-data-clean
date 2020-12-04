<template>
  <div class="main">
    <div class="left">
      <div class="zl-toolbar-container">
        <ToolBar :moduleConfig="menuData" />
      </div>
      <div class="zl-table-content" ref="tableContent">
        <div class="source" :style="sourceStyle">
          <Table :data="tableData" :column="columnsData" :order="true" />
        </div>
        <div
          class="preview"
          :style="previewStyle"
          v-if="previewData.tableData && previewData.columns"
        >
          <Table :data="previewData.tableData" :column="previewData.columns" />
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
// import { windowSize } from "./utils";
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
    let data = contentData.data;
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
      let tableContentWidth = this.$refs.tableContent.clientWidth + 13;
      if (newVal && newVal.tableData) {
        tableContentWidth = tableContentWidth - 350;
      }
      this.sourceStyle = {
        width: tableContentWidth + "px",
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
      // .source,
      // .preview {
      //   height: 95vh;
      //   overflow: auto;
      //   /* 设置滚动条的样式 */
      //   &::-webkit-scrollbar {
      //     width: 5px;
      //     border-radius: 10px;
      //     background-color: #e7e6eb;
      //     cursor: pointer;
      //   }
      //   /* 滚动槽 */
      //   &::-webkit-scrollbar-track {
      //     border-radius: 10px;
      //   }

      //   /* 滚动条滑块 */
      //   &::-webkit-scrollbar-thumb {
      //     border-radius: 10px;
      //     cursor: pointer;
      //     background: #b4bccd;
      //   }
      // }
      // .source {
      //   width: calc(100% - 350px);
      // }
      .preview {
        width: 350px;
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