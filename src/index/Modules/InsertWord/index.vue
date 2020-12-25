<template>
  <div class="drawer-box">
    <ul>
      <li>
        <div class="title">选择列（可多选）</div>
        <div class="content">
          <SelectColumn @on-change="handleOnChangeSelectColumn" ref="selectColumn" />
        </div>
      </li>
      <li>
        <div class="title">匹配规则</div>
        <div class="content">
          <Select v-model="matchRules">
            <Option
              v-for="item in matchRulesList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </Select>
        </div>
      </li>

      <template v-if="matchRules === 'between'">
        <li>
          <div class="title">前一个字符</div>
          <div class="content">
            <Input v-model="insertWordObj.front" placeholder="前一个字符..." />
          </div>
        </li>
        <li>
          <div class="title">后一个字符</div>
          <div class="content">
            <Input v-model="insertWordObj.after" placeholder="后一个字符..." />
          </div>
        </li>
      </template>
      <template v-if="matchRules === 'position'">
        <li>
          <div class="title">开始位置</div>
          <div class="content">
            <InputNumber
              :min="0"
              v-model="insertWordObj.front"
              style="width: 100%"
            ></InputNumber>
          </div>
        </li>
        <li>
          <div class="title">结束位置</div>
          <div class="content">
            <InputNumber
              :min="0"
              v-model="insertWordObj.after"
              style="width: 100%"
            ></InputNumber>
          </div>
        </li>
      </template>
      <li>
        <div class="title">字符插入</div>
        <div class="content">
          <Input v-model="insertWord" placeholder="插入字符..." />
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
import SelectColumn from "../../components/SelectColumn/index";
import { reqInsert } from "../../api";
import { insertWordFun } from "../../utils/processing";
export default {
  components: { SelectColumn },
  data() {
    return {
      dataState: this.$store.state.dataState,
      columnArr: [],
      matchRules: "",
      matchRulesList: [
        {
          value: "start",
          label: "首行元素符插入",
        },
        {
          value: "end",
          label: "末行元素符插入",
        },
        {
          value: "between",
          label: "分割符之间插入",
        },
        {
          value: "position",
          label: "位置之间插入",
        },
      ],
      insertWord: "",
      insertWordObj: {
        front: null,
        after: null,
      },
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
    insertWord: {
      handler: function (newV, oldV) {
        this.handleData("view");
      },
    },
  },
  // created() {},
  mounted() {
    let { columns } = this.dataState;
    this.columnList = columns;
  },
  methods: {
    handleOnChangeSelectColumn(arr) {
      this.columnArr = arr;
    },
    handleClear() {
      this.$refs.selectColumn.handleClear();
      // this.columnArr = [];
      this.insertWord = "";
      this.matchRules = "";
      this.insertWordObj = {
        front: null,
        after: null,
      };
    },
    handleOKOrCancel(mark) {
      if (mark === "ok") {
        if (this.columnArr.length) {
          this.$event.emit("loading", true);
          reqInsert({
            type: "word",
            content: {
              columnArr: this.columnArr,
              matchRules: this.matchRules,
              insertWord: this.insertWord,
              insertWordObj: this.insertWordObj,
            },
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
      let { copyData } = this.dataState;
      let dataObj = insertWordFun(
        deepClone(copyData),
        {
          columnArr: this.columnArr,
          matchRules: this.matchRules,
          insertWord: this.insertWord,
          insertWordObj: this.insertWordObj,
        },
        mark
      );
      this.setModuleStep(false);

      this.$store.commit("setData", dataObj.tableData);
      if (mark !== "view") {
        this.$store.commit("setCopyData", dataObj.tableData);
        // this.$Notice.success({ title: "批量替换成功！" });
      }
    },
    setModuleStep(mark) {
      // 保存步骤数据
      this.$store.commit("setModuleStep", {
        module: this.moduleObj,
        paramObj: {
          columnArr: this.columnArr,
          matchRules: this.matchRules,
          insertWord: this.insertWord,
          insertWordObj: this.insertWordObj,
        },
        isLast: mark,
      });
    },
  },
};
</script>
