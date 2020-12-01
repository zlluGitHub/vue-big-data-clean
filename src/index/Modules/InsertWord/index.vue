<template>
  <div class="drawer-box">
    <ul>
      <li>
        <div class="title">选择列（可多选）</div>
        <div class="content">
          <Select v-model="columnArr" multiple>
            <Option
              v-for="item in columnList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </Select>
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
import { deepClone } from "../../../utils/index";
export default {
  components: {},
  data() {
    return {
      dataState: this.$store.state.dataState,
      columnArr: [],
      columnList: [
        // {
        //   value: "New York",
        //   label: "New York",
        // },
      ],
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

      // characterArr: [{ source: "", target: "" }],
    };
  },
  props: ["moduleObj"],
  watch: {
    columnArr: {
      deep: true,
      handler: function (newV, oldV) {
        this.handleData("view");
      },
    },
    // insertWordObj: {
    //   deep: true,
    //   handler: function (newV, oldV) {
    //     this.handleData("view");
    //   },
    // },
    insertWord: {
      // deep: true,
      handler: function (newV, oldV) {
        this.handleData("view");
      },
    },
    // characterArr: {
    //   deep: true, //深度监听设置为 true
    //   handler: function (newV, oldV) {
    //     this.handleData(newV, "view");
    //   },
    // },
  },
  created() {},
  mounted() {
    let { columns } = this.dataState;
    this.columnList = columns;
  },
  methods: {
    handleClearData() {
      this.columnArr = [];
      // this.characterArr = [{ source: "", target: "" }];
    },
    handleOKOrCancel(mark) {
      if (mark === "ok") {
        // 缓存数据
        this.handleData();
        this.$store.commit("setStepDataArr", {
          module: this.moduleObj,
          columnArr: this.columnArr,
          insertWord: this.insertWord,
          insertWordObj: this.insertWordObj,
        });
      } else {
        let { copyData } = this.dataState;
        this.$store.commit("setData", deepClone(copyData));
        this.handleClearData();
      }
      this.$emit("on-button-click");
    },

    handleData(mark) {
      let { copyData } = this.dataState;
      let newData = deepClone(copyData);
      newData = newData.map((item, i) => {
        this.columnArr.forEach((key, index) => {
          let text = item[key];
          if (text) {
            if (mark === "view") {
              if (this.matchRules === "start") {
                text =
                  (this.insertWord
                    ? `<span class="add-highlight">${this.insertWord}</span>`
                    : "") + text;
              } else if (this.matchRules === "end") {
                text =
                  text +
                  (this.insertWord
                    ? `<span class="add-highlight">${this.insertWord}</span>`
                    : "");
              } else if (this.matchRules === "between") {
                let startIndex = text.indexOf(this.insertWordObj.front);
                let endIndex = text.indexOf(this.insertWordObj.after);
                if (startIndex > -1 && endIndex > -1) {
                  //  console.log(startIndex,endIndex);
                  text =
                    text.slice(
                      0,
                      startIndex + this.insertWordObj.front.length
                    ) +
                    (this.insertWord
                      ? `<span class="add-highlight">${this.insertWord}</span>`
                      : "") +
                    text.slice(endIndex, text.length);
                }
              } else if (this.matchRules === "position") {
                if (
                  this.insertWordObj.front * 1 < text.length &&
                  this.insertWordObj.after * 1 < text.length
                ) {
                  // console.log(this.insertWordObj);
                  text =
                    text.slice(0, this.insertWordObj.front) +
                    (this.insertWord
                      ? `<span class="add-highlight">${this.insertWord}</span>`
                      : "") +
                    text.slice(this.insertWordObj.after, text.length);
                }
              }
            } else {
              if (this.matchRules === "start") {
                text = this.insertWord + text;
              } else if (this.matchRules === "end") {
                text = text + this.insertWord;
              } else if (this.matchRules === "between") {
                let startIndex = text.indexOf(this.insertWordObj.front);
                let endIndex = text.indexOf(this.insertWordObj.after);
                if (startIndex > -1 && endIndex > -1) {
                  text =
                    text.slice(
                      0,
                      startIndex + this.insertWordObj.front.length
                    ) +
                    this.insertWord +
                    text.slice(endIndex, text.length);
                }
              } else if (this.matchRules === "position") {
                if (
                  this.insertWordObj.front * 1 < text.length &&
                  this.insertWordObj.after * 1 < text.length
                ) {
                  text =
                    text.slice(0, this.insertWordObj.front) +
                    this.insertWord +
                    text.slice(this.insertWordObj.after, text.length);
                }
              }
            }

            item[key] = text;
          }
        });
        return item;
      });
      this.$store.commit("setData", newData);
      if (mark !== "view") {
        this.$store.commit("setCopyData", newData);
        // this.$Notice.success({ title: "批量替换成功！" });
      }
    },

    // handleCharacterArr(mark, index) {
    //   if (index) {
    //     this.characterArr.splice(index - 1, 1);
    //   } else {
    //     this.characterArr.push({ source: "", target: "" });
    //   }
    // },
  },
};
</script>