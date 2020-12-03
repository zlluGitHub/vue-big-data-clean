<template>
  <div class="zl-table-box" @click.stop="handleClearClick">
    <table ref="table">
      <tr>
        <th
          v-for="(item, i) in columns"
          :key="i"
          :class="[
            'column-header',
            'column-header-' + i === selectClass.header ? 'source' : null,
            item.state === 'source' ? 'select' : null,
          ]"
          @click.stop="
            handleSelectColumnClick(
              item.label,
              'column-header-' + i,
              'row-' + i
            )
          "
        >
          {{ item.label }}
        </th>
      </tr>
      <tr
        v-for="(item, m) in tableData"
        :key="m"
        :class="[
          'column',
          'column-' + m === selectClass.column ? 'source' : null,
        ]"
      >
        <th
          v-for="(each, n) in columns"
          :key="n"
          :class="[
            'row',
            'row-' + n === selectClass.row ? 'source' : null,
            each.state === 'source' ? 'select' : null,
            m + '-' + n,
          ]"
        >
          <div
            v-if="each.value == 'order'"
            class="order"
            @click.stop="handleSelectRowClick(m, 'column-' + m)"
          >
            {{ m + 1 }}
          </div>
          <div
            v-else
            @click.stop="handleSelectBlockClick(m, n, item[each.value])"
            v-html="item[each.value]"
          ></div>
        </th>
      </tr>
    </table>
  </div>
</template>

<script>
// import data from "../../data/data.json";
// import { deepClone } from "../../utils/index.js";
export default {
  name: "app",
  data() {
    return {
      selectClass: {},
      columns: [],
      tableData: [],
    };
  },
  props: ["data", "column"],
  watch: {
    data: {
       deep:true,
      handler: function (data) {
        if (this.data && this.data.length) {
          this.tableData = data;
        }
      },
      immediate: true,
    },
    column: {
      deep:true,
      handler: function (columnArr) {
        if (columnArr && columnArr.length) {
          this.handleClearClick();
          this.columns = [
            {
              label: "#",
              value: "order",
            },
            ...columnArr,
          ];
        }
      },
      immediate: true,
    },
  },
  // mounted() {
  //   // let data1 = data.data;
  //   // this.tableData = data1.map((item, i) => {
  //   //   item.projectName_copy = "23_" + i;
  //   //   return item;
  //   // });
  //   // console.log(this.tableData);
  // },
  methods: {
    // 选中某一块
    handleSelectBlockClick(m, n, item) {
      console.log(m, n, item);
    },
    // 清除选择
    handleClearClick() {
      this.selectClass = {};
    },
    //选中列
    handleSelectColumnClick(columnName, header, row) {
      this.selectClass = { header, row };
      this.selectClass = { ...this.selectClass };
      console.log(columnName);
    },
    //选中行
    handleSelectRowClick(rowIndex, column) {
      this.selectClass = { column };
      this.selectClass = { ...this.selectClass };
      console.log(rowIndex);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./style.scss";
</style>
