<template>
  <div class="drawer-box">
    <ul>
      <li>
        <div class="title">选择列（可多选）</div>
        <div class="content">
          <SelectColumn @on-change="handleOnChangeSelectColumn" ref="selectColumn"  :isSetSelectColumns="true"/>
        </div>
      </li>

      <li>
        <div class="title">需要删除的元素</div>
        <div class="content element-sub">
          <div class="item" v-for="(item, i) in characterArr" :key="'y' + i">
            <Input v-model="characterArr[i]" placeholder="批量删除元素..." />
            <Icon type="ios-add-circle-outline" @click.stop="handleCharacterArr('add')" />
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
import { reqDelete } from "../../api";
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
        if (newV && newV[0]) {
          this.handleData(newV, "view");
        }
      },
    },
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
      this.characterArr = [""];
    },
    handleOKOrCancel(mark) {
      if (mark === "ok") {
        if (this.columnArr.length) {
          this.$event.emit("loading", true);
          reqDelete({
            type: "word",
            content: {
              columns: this.columnArr,
              word: this.characterArr,
            },
          })
            .then((res) => {
              this.$event.emit("loading", false);
              if (res.data.code === 200) {
                
                // 保存步骤数据
                this.setModuleStep(true);

                // 处理展示数据
                this.handleData(this.characterArr);
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
    handleData(newV, mark) {
      let { copyData } = this.dataState;
      let dataObj = deleteWord(
        deepClone(copyData),
        {
          columnArr: this.columnArr,
          characterArr: newV,
        },
        mark
      );

      this.setModuleStep(false);

      this.$store.commit("setData", dataObj.tableData);
      if (mark !== "view") {
        this.$store.commit("setCopyData", dataObj.tableData);
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
    setModuleStep(mark) {
      // 保存步骤数据
      this.$store.commit("setModuleStep", {
        module: this.moduleObj,
        paramObj: {
          columnArr: this.columnArr,
          characterArr: this.characterArr,
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
