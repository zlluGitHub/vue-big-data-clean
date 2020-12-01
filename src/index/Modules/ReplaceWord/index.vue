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
        <div class="title">元素替换</div>
        <div class="content element-sub">
          <div
            class="item"
            v-for="(item, i) in characterArr"
            :key="item.source"
          >
            <Input v-model="item.source" placeholder="替换元素..." />
            <Icon type="md-arrow-round-forward" />
            <Input v-model="item.target" placeholder="目标元素..." />
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
      <li>
        <div class="title">匹配限制</div>
        <div class="content element-sub">
          <RadioGroup v-model="animal">
            <Radio border label="忽略大小写元素"></Radio>
            <Radio border label="匹配大写元素"></Radio>
            <Radio border label="匹配小写元素"></Radio>
          </RadioGroup>
        </div>
      </li>
    </ul>
    <div class="button-warp">
      <Button @click="handleOKOrCancel(false)">取消</Button>
      <Button type="primary" @click="handleOKOrCancel(true)">确定</Button>
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
      characterArr: [{ source: "", target: "" }],
    };
  },
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
      this.characterArr = [{ source: "", target: "" }];
    },
    handleOKOrCancel(mark) {
      if (mark) {
        this.handleData(this.characterArr);
        // this.handleClearData();
      } else {
        let { copyData } = this.dataState;
        this.$store.commit("setData", deepClone(copyData));
        this.handleClearData();
      }
    },
    handleData(newV, mark) {
      let { copyData } = this.dataState;
      let newData = deepClone(copyData);
      newData = newData.map((item, i) => {
        this.columnArr.forEach((key, index) => {
          let text = item[key];
          if (text) {
            newV.forEach((obj) => {
              let { source, target } = obj;
              let startIndex = text.indexOf(source);
              let endIndex = startIndex + source.length;
              if (startIndex > -1) {
                if (mark === "view") {
                  text =
                    text.slice(0, startIndex) +
                    (source
                      ? `<span class="del-highlight">${source}</span>`
                      : "") +
                    (target
                      ? `<span class="rep-highlight">${target}</span>`
                      : "") +
                    text.slice(endIndex, text.length);
                } else {
                  text =
                    text.slice(0, startIndex) +
                    target +
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
    },
    handleCharacterArr(mark, index) {
      if (index) {
        this.characterArr.splice(index - 1, 1);
      } else {
        this.characterArr.push({ source: "", target: "" });
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