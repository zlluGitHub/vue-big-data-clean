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
        <div class="title">新建列名</div>
        <div class="content">
          <Input v-model="objData.columnName" placeholder="新建列名..." />
        </div>
      </li>
      <li>
        <div class="title">新建键名</div>
        <div class="content">
          <Input v-model="objData.key" placeholder="新建列名..." />
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
import { columnsIntoArray } from "../../utils/processing";
export default {
  components: { SelectColumn },
  data() {
    return {
      objData: {
        columnName: "",
        key: "",
      },
      dataState: this.$store.state.dataState,
      columnArr: [],
    };
  },
  props: ["moduleObj"],
  watch: {
    objData: {
      deep: true,
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
      if (mark === "ok") {
        // 缓存数据
        this.handleData();
        this.$store.commit("setStepDataArr", {
          module: this.moduleObj,
          columnArr: this.columnArr,
          columnArr: this.columnArr,
        });
      } else {
        let { copyData, columnsCopy } = this.dataState;
        this.$store.commit("setColumns", columnsCopy);
        this.$store.commit("setData", deepClone(copyData));
        this.handleClearData();
      }
      this.$emit("on-button-click");
    },
    handleData(mark) {
      let { copyData, columnsCopy } = this.dataState;
      let backData = columnsIntoArray(
        deepClone(copyData),
        {
          columnArr: this.columnArr,
          columnAll: deepClone(columnsCopy),
        },
        mark
      );
      this.$store.commit("setColumns", backData.columns);
      this.$store.commit("setData", backData.data);
      if (mark !== "view") {
        this.$store.commit("setColumnsCopy", backData.columns);
        this.$store.commit("setCopyData", backData.data);
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