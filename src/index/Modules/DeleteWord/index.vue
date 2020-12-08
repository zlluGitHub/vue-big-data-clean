<template>
  <div class="drawer-box">
    <ul>
      <li>
        <div class="title">选择列（可多选）</div>
        <div class="content">
          <SelectColumn
            @on-change="handleOnChangeSelectColumn"
            ref="selectColumn"
          />
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
import { deleteWord } from "../../utils/processing";
export default {
  components: { SelectColumn },
  data() {
    return {
      dataState: this.$store.state.dataState,
      columnArr: [],
      characterArr: [""],
    };
  },
  props: ["moduleObj"],
  watch: {
    characterArr: {
      deep: true,
      handler: function (newV, oldV) {
        this.handleData(newV, "view");
      },
    },
    columnArr: {
      // deep: true,
      handler: function (newV, oldV) {
        this.handleData(newV, "view");
      },
    },
  },

  methods: {
    handleOnChangeSelectColumn(arr) {
      this.columnArr = arr;
    },
    handleClearData() {
      this.columnArr = [];
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
        this.$refs.selectColumn.handleClear();
        this.characterArr = [""];
      }
    },
    handleData(newV, mark) {
      let { copyData } = this.dataState;
      let newData = deepClone(copyData);
      newData = deleteWord(
        newData,
        {
          columnArr: this.columnArr,
          characterArr: newV,
        },
        mark
      );
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