<template>
  <div class="drawer-box">
    <ul>
      <li>
        <div class="title">选择列数据</div>
        <div class="content">
          <SelectColumn v-model="columnArr" />
        </div>
      </li>
      <li>
        <div class="title">新建列名称</div>
        <div class="content">
          <Input v-model="columnName" placeholder="新建列名..." />
        </div>
      </li>
    </ul>
    <div class="button-warp">
      <Button @click="handleOKOrCancel(false)">取消</Button>
      <Button type="primary" @click="handleOKOrCancel('ok')">确定</Button>
    </div>
  </div>
</template>
<script>
import SelectColumn from "../../components/SelectColumn/index";
import { deepClone } from "../../utils/index";
import { columnsIntoObj } from "../../utils/processing";
export default {
  components: { SelectColumn },
  data() {
    return {
      columnName: "",
      dataState: this.$store.state.dataState,
      columnArr: [],
    };
  },
  props: ["moduleObj"],
  watch: {
    columnArr: {
      // deep: true,
      handler: function (newV, oldV) {
        this.handleData("view");
      },
    },
    columnName: {
      // deep: true,
      handler: function (newV, oldV) {
        // console.log(newV);
        this.handleData("view");
      },
    },
  },
  // created() {
  //   this.columnArr = this.dataState.columns;
  // },
  methods: {
    handleClearData() {
      this.columnArr = [];
    },
    handleOKOrCancel(mark) {
      let { copyData, columnsCopy } = this.dataState;
      if (mark === "ok") {
        // 缓存数据
        this.handleData();
        this.$store.commit("setStepDataArr", {
          columnArr: this.columnArr,
          columnName: this.columnName,
        });
        this.$store.commit("setPreviewData", { show: false });
        this.$emit("on-button-click");
      } else {
        this.$store.commit("setColumns", columnsCopy);
        this.$store.commit("setData", deepClone(copyData));
        this.handleClearData();
      }
    },
    handleData(mark) {
      let { copyData, columnsCopy } = this.dataState;
      let backData = columnsIntoObj(
        copyData,
        {
          columnArr: this.columnArr,
          columnName: this.columnName,
        },
        mark
      );
      if (mark === "view") {
        this.$store.commit("setPreviewData", backData);
      } else {
        this.$saveData(backData.columns, backData.tableData);
        // this.$Notice.success({ title: "批量替换成功！" });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
// .drawer-box {
// }
</style>