<template>
  <div class="drawer-box">
    <ul>
      <!-- <li>
        <div class="title">选择需要按字符拆分的列</div>
        <div class="content">
          <Select v-model="columnName" style="margin-top: 5px">
            <Option v-for="item in columnList" :value="item.value" :key="item.value">{{
              item.label
            }}</Option>
          </Select>
        </div>
      </li> -->
      <li>
        <div class="title">选择列（可多选）</div>
        <div class="content">
          <SelectColumn
            @on-change="handleOnChangeSelectColumn"
            ref="selectColumn"
            :isSetSelectColumns="isSetSelectColumns"
          />
        </div>
      </li>
      <li>
        <div class="title">选择拆分规则</div>
        <div class="content">
          <Select v-model="ruleValue" style="margin-top: 5px">
            <Option v-for="(item, i) in ruleList" :value="item.value" :key="'g' + i">{{
              item.label
            }}</Option>
          </Select>
        </div>
      </li>
      <li v-if="ruleValue === 'one'">
        <div class="title">拆分字符</div>
        <div class="content">
          <Input
            placeholder="输入开始字符"
            v-model="positionArr[0]"
            style="width: 100%"
          />
        </div>
      </li>
      <template v-if="ruleValue === 'interval'">
        <li>
          <div class="title">开始字符</div>
          <div class="content">
            <Input
              placeholder="输入开始字符"
              v-model="positionArr[0]"
              style="width: 100%"
            />
          </div>
        </li>
        <li>
          <div class="title">结束字符</div>
          <div class="content">
            <Input
              placeholder="输入结束字符"
              :min="0"
              v-model="positionArr[1]"
              style="width: 100%"
            />
          </div>
        </li>
      </template>
      <li v-if="ruleValue === 'many'">
        <div class="title">拆分字符</div>
        <div class="content element-sub">
          <div class="item" v-for="(item, i) in positionArr" :key="'y' + i">
            <Input
              v-model="positionArr[i]"
              :placeholder="'第' + (i + 1) + '个拆分字符'"
            />
            <Icon type="ios-add-circle-outline" @click.stop="handlePositionArr('add')" />
            <Icon
              v-if="positionArr && positionArr.length !== 1"
              type="ios-trash-outline"
              @click.stop="handlePositionArr('delete', i + 1)"
            />
          </div>
        </div>
      </li>
      <Input
        style="margin-top: 5px"
        type="textarea"
        :rows="4"
        v-if="ruleValue === 'senior'"
        v-model="seniorValue"
        placeholder="例如：0 或 1,3,5"
      />
    </ul>
    <div class="button-warp">
      <Button @click="handleOKOrCancel(false)">取消</Button>
      <Button type="primary" @click="handleOKOrCancel('ok')">确定</Button>
    </div>
  </div>
</template>
<script>
import { deepClone } from "../../utils";
import { reqSplitWord } from "../../api";
import SelectColumn from "../../components/SelectColumn/index";
import { splitWord } from "../../utils/processing";
export default {
  components: { SelectColumn },
  data() {
    return {
      columnArr: [],
      columnList: [],
      positionArr: [""],
      ruleValue: "",
      ruleList: [
        {
          value: "one",
          label: "单个字符拆分",
        },
        {
          value: "interval",
          label: "间隔字符拆分",
        },
        {
          value: "many",
          label: "多个字符拆分",
        },
        {
          value: "senior",
          label: "高级字符拆分",
        },
      ],
      position: {
        start: null,
        end: null,
      },
      seniorValue: "",
      isNotSplit: "yes",
      isSetSelectColumns: false,
      dataState: this.$store.state.dataState,
    };
  },
  props: ["moduleObj"],
  watch: {
    columnArr: {
      // deep: true,
      handler: function (newV, oldV) {
        this.handleData(newV, this.positionArr, "view");
      },
    },
    positionArr: {
      // deep: true,
      handler: function (newV, oldV) {
        this.handleData(this.columnArr, newV, "view");
      },
    },
    seniorValue(newV, oldV) {
      let positionArr = [];
      if (newV) {
        positionArr = newV.split(",");
      }
      this.handleData(this.columnArr, positionArr, "view");
    },
  },
  created() {
    let { columnsCopy } = this.dataState;
    this.columnList = columnsCopy;
  },
  methods: {
    handleOnChangeSelectColumn(arr) {
      this.columnArr = arr;
    },
    handleClear() {
      this.$refs.selectColumn.handleClear();
      this.columnArr = [];
      this.positionArr = [""];
      this.ruleValue = "";
      this.seniorValue = "";
      // let { copyData } = this.dataState;
      // this.$store.commit("setData", deepClone(copyData));
    },
    handleOKOrCancel(mark) {
      if (mark === "ok") {
        if (this.columnArr.length) {
          this.$event.emit("loading", true);
          reqSplitWord({
            columnArr: this.columnArr,
            positionArr: this.positionArr,
            isNotSplit: this.isNotSplit,
          })
            .then((res) => {
              this.$event.emit("loading", false);
              console.log(res.data);
              if (res.data.code === 200) {
                // 保存步骤数据
                this.setModuleStep(true);
                // 处理展示数据
                this.handleData(this.columnArr, this.positionArr);
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
    handleData(columnArr, positionArr, mark) {
      let { copyData, columnsCopy } = this.dataState;

      let dataObj = splitWord(
        deepClone(copyData),
        {
          columnArr,
          positionArr,
          isNotSplit: this.isNotSplit,
        },
        mark
      );
      this.setModuleStep(false);

      this.$store.commit("setData", dataObj.tableData);
      this.$store.commit("setColumns", dataObj.columns);
      if (mark !== "view") {
        this.$store.commit("setData", dataObj.tableData);
        this.$store.commit("setColumns", dataObj.columns);
        this.$store.commit("setColumnsCopy", dataObj.columns);
        this.$store.commit("setCopyData", dataObj.tableData);
        // this.$Notice.success({ title: "批量替换成功！" });
      }
    },
    handlePositionArr(mark, index) {
      if (index) {
        this.positionArr.splice(index - 1, 1);
      } else {
        this.positionArr.push("");
      }
    },
    setModuleStep(mark) {
      this.$store.commit("setModuleStep", {
        module: this.moduleObj,
        paramObj: {
          columnArr: this.columnArr,
          positionArr: this.positionArr,
          isNotSplit: this.isNotSplit,
        },
        isLast: mark,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.drawer-box {
  .element-sub {
    .item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      /deep/ .ivu-input-number {
        flex: 1;
      }
      &:last-child {
        margin-bottom: 0;
      }
      .ivu-icon-md-arrow-round-forward {
        padding: 0 5px;
        color: #bbb;
      }
      .ivu-icon-ios-add-circle-outline,
      .ivu-icon-ios-trash-outline {
        font-size: 20px;
        margin-left: 10px;
        cursor: pointer;
        &:hover {
          color: #2d8cf0;
        }
      }
    }
  }
}
</style>
