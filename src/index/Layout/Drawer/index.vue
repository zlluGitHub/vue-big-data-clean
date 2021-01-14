<template>
  <div class="zl-drawer-warp">
    <div class="panel-toolbar">
      <span>{{ moduleObj.title }}</span>
      <img src="../../assets/delete.svg" @click="handleClose" />
    </div>
    <!-- <transition name="show"> -->
    <div v-if="moduleObj.type === 'data-tatistics'" class="zl-drawer-item" :style="style">
      <DataStatistics :moduleObj="moduleObj" />
    </div>
    <div
      v-else-if="moduleObj.type === 'replace-word'"
      class="zl-drawer-item"
      :style="style"
    >
      <!-- @on-button-click="handleOnButtonClick" -->
      <ReplaceWord :moduleObj="moduleObj" />
    </div>
    <div
      v-else-if="moduleObj.type === 'delete-word'"
      class="zl-drawer-item"
      :style="style"
    >
      <DeleteWord :moduleObj="moduleObj" />
    </div>
    <div
      v-else-if="moduleObj.type === 'insert-word'"
      class="zl-drawer-item"
      :style="style"
    >
      <InsertWord :moduleObj="moduleObj" />
    </div>
    <div
      v-else-if="moduleObj.type === 'columns-into-array'"
      class="zl-drawer-item"
      :style="style"
    >
      <ColumnsIntoArray :moduleObj="moduleObj" />
    </div>
    <div
      v-else-if="moduleObj.type === 'columns-into-object'"
      class="zl-drawer-item"
      :style="style"
    >
      <ColumnsIntoObj :moduleObj="moduleObj" />
    </div>
    <div
      v-else-if="moduleObj.type === 'columns-delete'"
      class="zl-drawer-item"
      :style="style"
    >
      <DeleteColumns :moduleObj="moduleObj" />
    </div>
    <div
      v-else-if="moduleObj.type === 'to-lower-case'"
      class="zl-drawer-item"
      :style="style"
    >
      <ToLowerCase :moduleObj="moduleObj" />
    </div>
    <div
      v-else-if="moduleObj.type === 'to-upper-case'"
      class="zl-drawer-item"
      :style="style"
    >
      <ToUpperCase :moduleObj="moduleObj" />
    </div>
    <div
      v-else-if="moduleObj.type === 'date-time-format'"
      class="zl-drawer-item"
      :style="style"
    >
      <DateFormat :moduleObj="moduleObj" />
    </div>
    <div
      v-else-if="moduleObj.type === 'split-position'"
      class="zl-drawer-item"
      :style="style"
    >
      <SplitPosition :moduleObj="moduleObj" />
    </div>
    <div
      v-else-if="moduleObj.type === 'split-word'"
      class="zl-drawer-item"
      :style="style"
    >
      <SplitWord :moduleObj="moduleObj" />
    </div>
    <div
      v-else-if="moduleObj.type === 'merge-columns'"
      class="zl-drawer-item"
      :style="style"
    >
      <MergeColumns :moduleObj="moduleObj" />
    </div>
    <div v-else></div>
    <!-- </transition> -->
  </div>
</template>
<script>
import DataStatistics from "../../Modules/DataStatistics";
import ReplaceWord from "../../Modules/ReplaceWord";
import DeleteWord from "../../Modules/DeleteWord";
import InsertWord from "../../Modules/InsertWord";
import ColumnsIntoArray from "../../Modules/ColumnsIntoArray";
import ColumnsIntoObj from "../../Modules/ColumnsIntoObj";
import DeleteColumns from "../../Modules/DeleteColumns";
import ToLowerCase from "../../Modules/ToLowerCase";
import ToUpperCase from "../../Modules/ToUpperCase";
import DateFormat from "../../Modules/DateFormat";
import SplitPosition from "../../Modules/SplitPosition";
import SplitWord from "../../Modules/SplitWord";
import MergeColumns from "../../Modules/MergeColumns";
export default {
  components: {
    DataStatistics,
    DeleteWord,
    ReplaceWord,
    InsertWord,
    ColumnsIntoArray,
    ColumnsIntoObj,
    DeleteColumns,
    ToLowerCase,
    ToUpperCase,
    DateFormat,
    SplitPosition,
    SplitWord,
    MergeColumns
  },
  data() {
    return {
      moduleObj: this.info,
      style: {
        height: 600 + "px",
      },
    };
  },
  props: ["info", "height"],
  watch: {
    height: {
      handler: function (val) {
        this.style = {
          height: val - 4 + "px",
        };
      },
      immediate: true,
    },
  },
  // created() {

  // },
  mounted() {
    this.$event.on("menu-type", this.onMenuType);
  },
  methods: {
    onMenuType(item) {
      this.$store.commit("setPreviewData", {});
      this.moduleObj = item;
      console.log(item);
    },
    handleClose() {
      this.$emit("on-close", false);
    },
    // handleOnButtonClick() {
    //   // console.log(this.info);
    //   this.moduleObj = this.info;
    // },
  },
  beforeDestroy() {
    this.$event.off("menu-type", this.onMenuType);
  },
};
</script>
<style lang="scss" scoped>
.zl-drawer-warp {
  .zl-drawer-item {
    padding: 0px 20px;
    overflow: auto;
  }
  .panel-toolbar {
    background: #f4f8fd;
    height: 42px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 15px;
    position: relative;
    img {
      position: absolute;
      top: 14px;
      right: 15px;
      width: 16px;
      height: 16px;
      cursor: pointer;
    }
  }
}
</style>
