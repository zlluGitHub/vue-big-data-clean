<template>
  <div class="drawer-box">
    <ul>
      <li>
        <div class="title">选择列数据</div>
        <div class="content">
          <SelectColumn
            @on-change="handleOnChangeSelectColumn"
            ref="selectColumn"
            :isSetSelectColumns="true"
          />
        </div>
      </li>
      <li>
        <div class="title">分隔字符</div>
        <div class="content">
          <Input v-model="splitWordValue" placeholder="分隔字符..." />
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
import { mergeColumns } from "../../utils/processing";
import { reqMergeColumns } from "../../api";
export default {
  components: { SelectColumn },
  data() {
    return {
      columnName: "",
      splitWordValue: "",
      dataState: this.$store.state.dataState,
      columnArr: [],
    };
  },
  props: ["moduleObj"],
  watch: {
    splitWordValue() {
      this.handleData("view");
    },
    columnArr: {
      // deep: true,
      handler: function (newV, oldV) {
        this.handleData("view");
      },
    },
    columnName: {
      // deep: true,
      handler: function (newV, oldV) {
        if (newV) {
          this.handleData("view");
        }
      },
    },
  },
  // created() {
  //   this.columnArr = this.dataState.columns;
  // },
  methods: {
    handleOnChangeSelectColumn(arr) {
      this.columnArr = arr;
    },
    handleClear() {
      this.$refs.selectColumn.handleClear();
      // this.columnArr = [];
      this.columnName = "";
      this.$store.commit("setPreviewData", []);
    },
    handleOKOrCancel(mark) {
      let { copyData, columnsCopy } = this.dataState;
      if (mark === "ok") {
        if (this.columnArr.length) {
          this.$event.emit("loading", true);
          reqMergeColumns({
            columnArr: this.columnArr,
            columnName: this.columnName,
            splitWordValue: this.splitWordValue,
          })
            .then((res) => {
              this.$event.emit("loading", false);
              if (res.data.code === 200) {
                // 保存步骤数据
                this.setModuleStep(true);
                // 处理展示数据
                this.handleData();
                this.handleClear();
                this.$Modal.success({
                  title: "系统提示",
                  content: `总共：${res.data.tatol}条，成功：${res.data.success}条，失败：${res.data.error}条`,
                });
              } else {
                this.$Notice.error({
                  title: "操作失败！",
                });
              }
            })
            .catch((error) => {
              this.$event.emit("loading", false);
              this.$Notice.error({
                title: "网络异常，请稍后再试！",
              });
              console.log(error);
            });
        } else {
          this.$Notice.warning({
            title: "请输入相关内容后操作！",
          });
        }
        // this.$store.commit("setStepDataArr", {
        //   module: this.moduleObj,
        //   columnArr: this.columnArr,
        //   characterArr: this.characterArr,
        // });
      } else {
        if (this.columnArr.length) {
          this.handleClear();
        }
      }
    },
    handleData(mark) {
      let { copyData, columnsCopy } = this.dataState;
      let backData = mergeColumns(
        deepClone(copyData),
        {
          columnArr: this.columnArr,
          columnName: this.columnName,
          splitWordValue: this.splitWordValue,
        },
        mark
      );
      
      // 缓存最后一步操作
      this.setModuleStep(false);

      if (mark === "view") {
        this.$store.commit("setPreviewData", backData);
      } else {
        this.$saveData(backData.columns, backData.tableData);
        // this.$Notice.success({ title: "批量替换成功！" });
      }
    },
    setModuleStep(mark) {
      this.$store.commit("setModuleStep", {
        module: this.moduleObj,
        paramObj: {
          columnArr: this.columnArr,
          columnName: this.columnName,
          splitWordValue: this.splitWordValue,
        },
        isLast: mark,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
// .drawer-box {
// }
</style>
