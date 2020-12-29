<template>
  <div class="drawer-box">
    <ul>
      <li>
        <div class="title">选择需要转换的列</div>
        <div class="content">
          <SelectColumn
            @on-change="handleOnChangeSelectColumn"
            ref="selectColumn"
            :isSetSelectColumns="true"
          />
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
import { deepClone } from "../../utils";
import { reqToUpperCase } from "../../api";
import SelectColumn from "../../components/SelectColumn/index";
import { toUpperCase } from "../../utils/processing";
export default {
  components: { SelectColumn },
  data() {
    return {
      dataState: this.$store.state.dataState,
      columnArr: [],
    };
  },
  props: ["moduleObj"],
  watch: {
    columnArr: {
      // deep: true,
      handler: function (newV, oldV) {
        if (newV && newV[0]) {
          this.handleData(newV, "view");
        }
      },
    },
  },

  methods: {
    handleOnChangeSelectColumn(arr) {
      this.columnArr = arr;
    },
    handleClear() {
      this.$refs.selectColumn.handleClear();
      let { copyData } = this.dataState;
      this.$store.commit("setData", deepClone(copyData));
    },
    handleOKOrCancel(mark) {
      if (mark === "ok") {
        if (this.columnArr.length) {
          this.$event.emit("loading", true);
          reqToUpperCase({ columnArr: this.columnArr })
            .then((res) => {
              this.$event.emit("loading", false);
              if (res.data.code === 200) {
                // 保存步骤数据
                this.setModuleStep(true);
                // 处理展示数据
                this.handleData(this.columnArr);
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
      } else {
        this.handleClear();
      }
    },
    handleData(columnArr, mark) {
      let { copyData } = this.dataState;
      let dataObj = toUpperCase(deepClone(copyData), columnArr, mark);
      this.setModuleStep(false);
      this.$store.commit("setData", dataObj.tableData);
      if (mark !== "view") {
        this.$store.commit("setCopyData", dataObj.tableData);
        // this.$Notice.success({ title: "批量替换成功！" });
      }
    },
    setModuleStep(mark) {
      this.$store.commit("setModuleStep", {
        module: this.moduleObj,
        paramObj: this.columnArr,
        isLast: mark,
      });
    },
  },
};
</script>
