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
        <div class="title">需要删除的元素</div>
        <div class="content element-sub">
          <div class="item" v-for="(item, i) in characterArr" :key="item">
            <Input v-model="characterArr[i]" placeholder="批量删除元素..." />
            <Icon
              type="ios-add-circle-outline"
              @click.stop="handleCharacterArr('add')"
            />
            <Icon
              v-if="characterArr && characterArr.length !== 1"
              type="ios-trash-outline"
              @click.stop="handleCharacterArr('delete', i + 1)"
            />
          </div>
        </div>
      </li>
      <!-- <li>
        <div class="title">匹配限制</div>
        <div class="content element-sub">
          <RadioGroup v-model="animal">
            <Radio border label="忽略大小写元素"></Radio>
            <Radio border label="匹配大写元素"></Radio>
            <Radio border label="匹配小写元素"></Radio>
          </RadioGroup>
        </div>
      </li> -->
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
      animal: null,
      dataState: this.$store.state.dataState,
      columnList: [
        // {
        //   value: "New York",
        //   label: "New York",
        // },
      ],
      columnArr: [],
      characterArr: [""],
    };
  },
  props: ["moduleObj"],
  watch: {
    // columnArr: {
    //   deep: true, //深度监听设置为 true
    //   handler: function (newV, oldV) {
    //     console.log(newV);
    //   },
    // },
    characterArr: {
      deep: true, //深度监听设置为 true
      handler: function (newV, oldV) {
        this.handleData(newV, "view");
      },
    },
  },
  created() {},
  mounted() {
    let { columns } = this.dataState;
    this.columnList = columns;
  },
  methods: {
    handleClearData() {
      this.columnArr = [];
      this.characterArr = [""];
    },
    handleOKOrCancel(mark) {
      if (mark === "ok") {
        // 缓存数据
        this.handleData(this.characterArr);
        this.$store.commit("setStepDataArr", {
          module: this.moduleObj,
          columnArr: this.columnArr,
          characterArr: this.characterArr,
        });
      } else {
        let { copyData } = this.dataState;
        this.$store.commit("setData", deepClone(copyData));
        this.handleClearData();
      }
      this.$emit("on-button-click");
    },
    handleData(newV, mark) {
      let { copyData } = this.dataState;
      let newData = deepClone(copyData);
      newData = newData.map((item, i) => {
        this.columnArr.forEach((key, index) => {
          let text = item[key];
          if (text) {
            newV.forEach((val) => {
              let startIndex = text.indexOf(val);
              let endIndex = startIndex + val.length;
              if (startIndex > -1) {
                if (mark === "view") {
                  text =
                    text.slice(0, startIndex) +
                    (val ? `<span class="del-highlight">${val}</span>` : "") +
                    text.slice(endIndex, text.length);
                } else {
                  text =
                    text.slice(0, startIndex) +
                    text.slice(endIndex, text.length);
                }
              }
              item[key] = text;
            });
          }
        });
        return item;
      });
      this.$store.commit("setData", newData);
      if (mark !== "view") {
        this.$store.commit("setCopyData", newData);
        // this.$Notice.success({ title: "批量操作成功！" });
      }
    },
    handleCharacterArr(mark, index) {
      if (index) {
        this.characterArr.splice(index - 1, 1);
      } else {
        this.characterArr.push("");
      }
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