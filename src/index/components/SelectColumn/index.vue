<template>
  <div>
    <Select
      v-model="columnType"
      placeholder="选择方式"
      @on-change="handleColumnType"
    >
      <Option
        v-for="item in columnTypeList"
        :value="item.value"
        :key="item.value"
        >{{ item.label }}</Option
      >
    </Select>
    <Select
      v-if="columnType === 'more'"
      v-model="columnArr"
      multiple
      style="margin-top: 5px"
    >
      <Option
        v-for="item in columnList"
        :value="item.value"
        :key="item.value"
        >{{ item.label }}</Option
      >
    </Select>
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
  </div>
</template>
<script>
export default {
  data() {
    return {
      dataState: this.$store.state.dataState,
      columnArr: [],
      columnType: "",
      columnTypeList: [
        {
          value: "all",
          label: "选择全部",
        },
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
    columnArr: {
      deep: true,
      handler: function (newV, oldV) {
        this.$emit("returnBack", newV);
      },
    },
    rangeValue: {
      deep: true,
      handler: function (newV, oldV) {
        this.columnArr = this.handleColumnMatch(newV.start, newV.end);
      },
    },
    seniorValue: {
      deep: true,
      handler: function (newV, oldV) {
        console.log(newV);
        let columnArr = [];
        if (newV.indexOf(",") > -1) {
          let split = newV.split(",");
          split.forEach((item) => {
            if (item.indexOf("~") > -1) {
              let splitA = item.split("~");
              console.log(splitA);
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
        console.log(this.columnArr);
        // this.columnArr = columnArr;
      },
    },
  },

  created() {
    let { columns } = this.dataState;
    this.columnList = columns;
  },

  methods: {
    handleColumnType(val) {
      this.columnArr = [];
      if (val === "all") {
        this.columnArr = this.dataState.columns.map((item) => {
          return item.value;
        });
      }
    },
    handleColumnMatch(startVal, endVal) {
      let columnArr = [];
      let columnsValueAllArr = this.dataState.columns.map((item) => {
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
  },
};
</script>