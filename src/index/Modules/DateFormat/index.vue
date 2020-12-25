<template>
  <div class="drawer-box">
    <ul>
      <li>
        <div class="title">选择列数据</div>
        <div class="content">
          <SelectColumn @on-change="handleOnChangeSelectColumn" ref="selectColumn" />
        </div>
      </li>
      <li>
        <div class="title">选择日期时间格式</div>
        <div class="content">
          <Select v-model="formatValue">
            <Option
              v-for="(item, i) in formatList"
              :key="'k' + i"
              :value="item"
              :label="item"
            >
              <span>{{ item }}</span>
              <span style="float: right; color: #ccc">{{ $moment().format(item) }}</span>
            </Option>
            <Option
              value="自定义日期时间格式"
              label="自定义日期时间格式"
              class="format-style"
            >
              <span>自定义日期时间格式</span>
            </Option>
          </Select>
        </div>
        <Input
          style="margin-top: 5px"
          type="textarea"
          :rows="4"
          v-if="formatValue === '自定义日期时间格式'"
          v-model="inputFormat"
          placeholder="例如：MM-DD-yyyy HH:MM:SSA 或者 MM-DD-yyyy hh:mm:ssa"
        />
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
import { dateTimeFormat } from "../../utils/processing";
import { reqDateTimeFormat } from "../../api";
export default {
  components: { SelectColumn },
  data() {
    return {
      formatValue: "",
      inputFormat: "",
      // http://momentjs.cn/
      formatList: [
        "MMMM DD, yyyy",
        "DD MMMM yyyy",
        "MMMM d yyyy",
        "M/d/yyyy",
        "MM-DD-yyyy",
        "d/M/yyyy",
        "DD/MM/yyyy",
        "DD-MM-yyyy",
        "DD.MM.yyyy",
        "yyyy-MM-DD",
        "yyyy/MM/DD",
        "MM-DD-yy",
        "MM/DD/yy",
        "DD-MM-yy",
        "DD/MM/yy",
        "DD.MM.yy",
        "yy-MM-DD",
        "yy/MM/DD",
        "d-MMM-yyyy",
        "M/d",
        "MMMM d",
        "MM-DD",
        "d-MMM",
        "MMM-d",
        "h:mma",
        "HH:mm",
        "h:mm:ssa",
        "HH:mm:ss",
        "M/d HH:mm",
        "M/d/yyyy HH:mm:ss",
        "MMMM d yyyy h:mm:ssa",
        "MM/DD/yyyy HH:mm:ss.SSS",
        "MM/DD/yyyy HH:mm:ss",
        "MM-DD-yyyy HH:mm:ss",
        "DD/MM/yyyy HH:mm:ss",
        "DD-MM-yyyy HH:mm:ss",
        "DD.MM.yyyy HH:mm:ss",
        "yyyy/MM/DD HH:mm:ss",
        "yyyy-MM-DD HH:mm:ss",
        "MM/DD/yyyy hh:mm:ssa",
        "MM-DD-yyyy hh:mm:ssa",
        "DD/MM/yyyy hh:mm:ssa",
        "DD-MM-yyyy hh:mm:ssa",
        "DD.MM.yyyy hh:mm:ssa",
        "yyyy/MM/DD hh:mm:ssa",
        "yyyy-MM-DD hh:mm:ssa",
      ],

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
    formatValue: {
      handler: function (newV, oldV) {
        this.handleData("view");
      },
    },
    inputFormat: {
      // deep: true,
      handler: function (newV, oldV) {
        this.handleData("view");
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
      this.formatValue = "";
      this.inputFormat = "";
    },
    handleOKOrCancel(mark) {
      let { copyData, columnsCopy } = this.dataState;
      let formatType =
        this.formatValue === "自定义日期时间格式" ? this.inputFormat : this.formatValue;
      if (mark === "ok") {
        if (this.columnArr.length) {
          this.$event.emit("loading", true);
          reqDateTimeFormat({ columnArr: this.columnArr, formatType })
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
        this.handleClear();
        // let { copyData } = this.dataState;
        // this.$store.commit("setData", deepClone(copyData));
      }
    },
    handleData(mark) {
      let { copyData, columnsCopy } = this.dataState;
      let dataObj = dateTimeFormat(
        deepClone(copyData),
        {
          columnArr: this.columnArr,
          formatType:
            this.formatValue === "自定义日期时间格式"
              ? this.inputFormat
              : this.formatValue,
        },
        mark
      );
      // 缓存最后一步操作
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
        paramObj: {
          columnArr: this.columnArr,
          formatType:
            this.formatValue === "自定义日期时间格式"
              ? this.inputFormat
              : this.formatValue,
        },
        isLast: mark,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.format-style {
  border-top: 1px solid #eee;
  margin-top: 10px;
  span {
    display: block;
    text-align: center;
  }
}
</style>
