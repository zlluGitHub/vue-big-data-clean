<template>
  <div class="zl-filter">
    <Tabs :animated="false">
      <TabPane label="选择列行" name="name1">
        <Select v-model="columnType" placeholder="选择方式">
          <Option
            v-for="item in columnTypeList"
            :value="item.value"
            :key="item.value"
            >{{ item.label }}</Option
          >
        </Select>

        <CheckboxGroup
          v-if="columnType === 'more'"
          v-model="columnArr"
          class="scrollbar"
        >
          <Checkbox
            v-for="item in columnList"
            :label="item.value"
            :key="item.value"
            >{{ item.label }}</Checkbox
          >
        </CheckboxGroup>

        <template v-if="columnType === 'range'">
          <Select
            placeholder="选择开始列"
            v-model="rangeValue.start"
            style="margin-top: 5px"
          >
            <Option
              v-for="item in columnList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </Select>
          <Select
            placeholder="选择结束列"
            v-model="rangeValue.end"
            style="margin-top: 5px"
          >
            <Option
              v-for="item in columnList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </Select>
        </template>
        <Input
          style="margin-top: 5px"
          type="textarea"
          :rows="4"
          v-if="columnType === 'senior'"
          v-model="seniorValue"
          placeholder="例如：a 或者 b,e 或者 c~d 或者 f,c~e,d,r~n,k"
        />
      </TabPane>
      <TabPane label="选择横行" name="name2">
        <Input
          style="margin-top: 5px"
          type="textarea"
          :rows="4"
          v-model="rowValue"
          placeholder="输入行号，例如：1 或者 2,4 或者 5~7 或者 8,10~12,14,16~20,25"
      /></TabPane>
    </Tabs>
    <div class="bottom">
      <Button type="primary" long @click="handleReset">重置</Button>
    </div>
  </div>
</template>
<script>
import { deepClone } from "../../utils";
export default {
  name: "filters",
  components: {
    // SelectColumn,
  },
  data() {
    return {
      dataState: this.$store.state.dataState,
      columnArr: [],
      columnType: "more",
      rowValue: "",
      columnTypeList: [
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

      rangeValue: {
        start: "",
        end: "",
      },
      seniorValue: "",
      columnList: [],
    };
  },
  model: {
    event: "returnBack",
  },
  watch: {
    rowValue: {
      handler: function (newV, oldV) {
        // newV = newV*1
        let { data } = this.dataState;
        let newData = deepClone(data);

        if (newV) {
          newData.forEach((item, m) => {
            item.zl_isRow = true;
          });
          let rowArr = [];
          if (newV.indexOf(",") > -1) {
            let split = newV.split(",");
            split.forEach((item) => {
              if (item.indexOf("~") > -1) {
                let splitA = item.split("~");
                // console.log(splitA);
                rowArr = [
                  ...rowArr,
                  ...this.handleRowMatch(splitA[0], splitA[1]),
                ];
              } else {
                rowArr.push(item * 1);
              }
            });
          } else {
            if (newV.indexOf("~") > -1) {
              let splitA = newV.split("~");
              rowArr = this.handleRowMatch(splitA[0], splitA[1]);
            } else {
              rowArr = [newV * 1];
            }
          }
          // console.log(rowArr);
          rowArr.forEach((i, m) => {
            newData[i - 1].zl_isRow = false;
          });
        } else {
          newData.forEach((item, m) => {
            item.zl_isRow = false;
          });
        }

        this.$store.commit("setFilterRowData", newV);
        this.$store.commit("setData", newData);
      },
    },
    columnArr: {
      // deep: true,
      handler: function (newV, oldV) {
        if (newV.length) {
          this.$emit("returnBack", newV);
        } else {
          this.$emit(
            "returnBack",
            this.columnList.map((item) => {
              return item.value;
            })
          );
        }
        this.$store.commit("setFilterColumnData", newV);
      },
    },
    rangeValue: {
      deep: true,
      handler: function (newV, oldV) {
        if (newV) {
          this.columnArr = this.handleColumnMatch(newV.start, newV.end);
        }
      },
    },
    seniorValue: {
      deep: true,
      handler: function (newV, oldV) {
        // console.log(newV);
        if (newV) {
          let columnArr = [];
          if (newV.indexOf(",") > -1) {
            let split = newV.split(",");
            split.forEach((item) => {
              if (item.indexOf("~") > -1) {
                let splitA = item.split("~");
                // console.log(splitA);
                columnArr = [
                  ...columnArr,
                  ...this.handleColumnMatch(splitA[0], splitA[1]),
                ];
              } else {
                columnArr.push(item);
              }
            });
            this.columnArr = Array.from(new Set(columnArr));
          } else {
            if (newV.indexOf("~") > -1) {
              let splitA = newV.split("~");
              this.columnArr = this.handleColumnMatch(splitA[0], splitA[1]);
            } else {
              this.columnArr = [newV];
            }
          }
        }
        // console.log(this.columnArr);
        // this.columnArr = columnArr;
      },
    },
  },

  created() {
    let { columnsCopy, columns, filter } = this.dataState;

    this.columnList = columnsCopy;
    if (columnsCopy.length !== columns.length) {
      this.columnArr = columns.map((item) => {
        return item.value;
      });
    }

    this.rowValue = filter.row;
    this.columnArr = filter.column;
  },

  methods: {
    handleReset() {
      if (this.rowValue) {
        this.rowValue = "";
      }

      this.columnType = "more";
      this.rangeValue = {
        start: "",
        end: "",
      };
      this.seniorValue = "";
    },
    handleColumnMatch(startVal, endVal) {
      let columnArr = [];
      let columnsValueAllArr = this.columnList.map((item) => {
        return item.value;
      });
      let start = columnsValueAllArr.indexOf(startVal);
      let end = columnsValueAllArr.indexOf(endVal);
      if (start <= end) {
        columnArr = columnsValueAllArr.slice(start, end + 1);
      } else {
        columnArr = columnsValueAllArr.slice(end, start + 1);
      }
      return columnArr;
    },
    handleRowMatch(startVal, endVal) {
      let rowArr = [];
      let start = startVal !== "" ? startVal * 1 : 0;
      let end = endVal !== "" ? endVal * 1 : 0;
      if (start <= end) {
        for (let index = 0; index <= end - start; index++) {
          rowArr.push(start + index);
        }
      } else {
        for (let index = 0; index <= start - end; index++) {
          rowArr.push(end + index);
        }
      }
      return rowArr;
    },
  },
};
</script>

<style lang="scss" scoped>
.zl-filter {
  padding: 0px 20px;
  width: 350px;
  .bottom {
    margin: 20px 0;
  }
}
/deep/ .ivu-checkbox-group {
  margin-top: 10px !important;
  max-height: 320px;
  overflow: auto;
}
/deep/ .ivu-select,
/deep/ .ivu-tabs {
  overflow: initial;
}
/deep/ .ivu-checkbox-group-item {
  display: block;
  padding: 2px 0;
}
</style>