<template>
  <div class="drawer-box">
    <ul>
      <li>
        <div class="title">选择列数据</div>
        <div class="content">
          <SelectColumn
            @on-change="handleOnChangeSelectColumn"
            ref="selectColumn"
          />
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
import SelectColumn from "../../components/SelectColumn/index";
import { deepClone } from "../../utils/index";
import { replaceWord } from "../../utils/processing";
export default {
  components: { SelectColumn },
  data() {
    return {
      animal: null,
      dataState: this.$store.state.dataState,
      columnArr: [],
      characterArr: [{ source: "", target: "" }],
    };
  },
  props: ["moduleObj"],
  watch: {
    // columnArr: {
    //   // deep: true,
    //   handler: function (newV, oldV) {
    //     if (newV.length) {
    //       this.handleData(newV, "view");
    //     }
    //   },
    // },
    characterArr: {
      deep: true,
      handler: function (newV, oldV) {
        this.handleData(newV, "view");
      },
    },
  },
  created() {
    this.columnArr = this.dataState.columns.map((item) => {
      return item.value;
    });
  },
  methods: {
    handleOnChangeSelectColumn(arr) {
      this.columnArr = arr;
    },

    handleOKOrCancel(mark) {
      if (mark === "ok") {
        this.$event.emit("loading", true);
        this.$store.dispatch("reqUpdate", {
          params: {
            columns: this.columnArr,
            replace: this.characterArr,
          },
          callBack: (res) => {
            this.handleData(this.characterArr);
            this.$event.emit("loading", false);
          },
        });

        // this.$store.commit("setStepDataArr", {
        //   module: this.moduleObj,
        //   columnArr: this.columnArr,
        //   characterArr: this.characterArr,
        // });
      } else {
        this.$refs.selectColumn.handleClear();
        this.columnArr = [];
        this.characterArr = [{ source: "", target: "" }];
      }
      // this.$emit("on-button-click");
    },
    handleData(newV, mark) {
      let { copyData } = this.dataState;
      let newData = deepClone(copyData);
      newData = replaceWord(
        newData,
        {
          columnArr: this.columnArr,
          characterArr: newV,
        },
        mark
      );
      this.$store.commit("setData", newData);
      // if (mark !== "view") {
      //   this.$store.commit("setCopyData", newData);
      //   // this.$Notice.success({ title: "批量替换成功！" });
      // }
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