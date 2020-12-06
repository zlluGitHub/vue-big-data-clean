<template>
  <div class="zl-drawer-warp">
    <div class="panel-toolbar">
      <span>{{ moduleObj.title }}</span>
      <img src="../../assets/delete.svg" @click="handleClose" />
    </div>
    <div
      v-if="moduleObj.type === 'data-tatistics'"
      class="zl-drawer-item"
      :style="style"
    >
      <DataStatistics :moduleObj="moduleObj" />
    </div>
    <div
      v-else-if="moduleObj.type === 'replace-word'"
      class="zl-drawer-item"
      :style="style"
    >
      <ReplaceWord
        :moduleObj="moduleObj"
        @on-button-click="handleOnButtonClick"
      />
    </div>
    <div
      v-else-if="moduleObj.type === 'delete-word'"
      class="zl-drawer-item"
      :style="style"
    >
      <DeleteWord
        :moduleObj="moduleObj"
        @on-button-click="handleOnButtonClick"
      />
    </div>
    <div
      v-else-if="moduleObj.type === 'insert-word'"
      class="zl-drawer-item"
      :style="style"
    >
      <InsertWord
        :moduleObj="moduleObj"
        @on-button-click="handleOnButtonClick"
      />
    </div>
    <div
      v-else-if="moduleObj.type === 'columns-into-array'"
      class="zl-drawer-item"
      :style="style"
    >
      <ColumnsIntoArray
        :moduleObj="moduleObj"
        @on-button-click="handleOnButtonClick"
      />
    </div>
    <div
      v-else-if="moduleObj.type === 'columns-into-object'"
      class="zl-drawer-item"
      :style="style"
    >
      <ColumnsIntoObj
        :moduleObj="moduleObj"
        @on-button-click="handleOnButtonClick"
      />
    </div>
    <div v-else></div>
  </div>
</template>
<script>
import DataStatistics from "../../Modules/DataStatistics";
import ReplaceWord from "../../Modules/ReplaceWord";
import DeleteWord from "../../Modules/DeleteWord";
import InsertWord from "../../Modules/InsertWord";
import ColumnsIntoArray from "../../Modules/ColumnsIntoArray";
import ColumnsIntoObj from "../../Modules/ColumnsIntoObj";
export default {
  components: {
    DataStatistics,
    DeleteWord,
    ReplaceWord,
    InsertWord,
    ColumnsIntoArray,
    ColumnsIntoObj,
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
    // data: {
    //   handler: function (data) {
    //     if (this.data && this.data.length) {
    //       console.log(data);
    //     }
    //   },
    //   immediate: true,
    // },
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
    this.$event.on("menu-type", (item) => {
      this.moduleObj = item;
    });
  },
  methods: {
    handleClose() {
      this.$emit("on-click", false);
    },
    handleOnButtonClick() {
      console.log(this.info);
      this.moduleObj = this.info;
    },
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