<template>
  <div class="drawer-box">
    <ul>
      <li>
        <div class="title">选择删除的列</div>
        <div class="content">
          <SelectColumn
            @on-change="handleOnChangeSelectColumn"
            :optionList="optionList"
            ref="selectColumn"
          />
        </div>
      </li>

      <!-- <li>
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
      </li> -->
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
import { deleteColumns } from "../../utils/processing";
export default {
  components: { SelectColumn },
  data() {
    return {
      dataState: this.$store.state.dataState,
      // columnArr: [],
      // characterArr: [""],
      optionList: [
        {
          value: "more",
          label: "选择多列",
        },
        {
          value: "range",
          label: "选择范围",
        },
        {
          value: "senior",
          label: "高级选择",
        },
      ],
    };
  },
  props: ["moduleObj"],
  // watch: {
  //   characterArr: {
  //     deep: true,
  //     handler: function (newV, oldV) {
  //       if (newV && newV[0]) {
  //         this.handleData(newV, "view");
  //       }
  //     },
  //   },
  //   columnArr: {
  //     // deep: true,
  //     handler: function (newV, oldV) {
  //       if (newV && newV[0]) {
  //         this.handleData(newV, "view");
  //       }
  //     },
  //   },
  // },

  methods: {
    handleOnChangeSelectColumn(arr) {
      this.columnArr = arr;
    },

    handleOKOrCancel(mark) {
      if (mark === "ok") {
        if (this.columnArr.length) {
          this.$event.emit("loading", true);
          reqDelete({
            type: "column",
            content: {
              columns: this.columnArr,
            },
          })
            .then((res) => {
              this.$event.emit("loading", false);
              if (res.data.code === 200) {
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
        // this.$store.commit("setStepDataArr", {
        //   module: this.moduleObj,
        //   columnArr: this.columnArr,
        //   characterArr: this.characterArr,
        // });
      } else {
        this.$refs.selectColumn.handleClear();
      }
    },
    handleData(columnArr) {
      let { copyData } = this.dataState;
      let newData = deepClone(copyData);
      newData = deleteColumns(newData, columnArr);
      this.$store.commit("setData", newData);
      this.$saveData(newData.columns, newData.tableData);
    },
    // handleCharacterArr(mark, index) {
    //   if (index) {
    //     this.characterArr.splice(index - 1, 1);
    //   } else {
    //     this.characterArr.push("");
    //   }
    // },
  },
};
</script>
