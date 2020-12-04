<template>
  <div
    class="zl-table-box"
    @click.stop="handleClearClick"
  >
    <table border="0" cellspacing="0" cellpadding="0">
      <tr>
        <th
          v-for="(item, i) in columns"
          :key="i"
          :class="[
           'column-header',
            !order ? 'preview-header' : null,
          ]"
        >
          <div>
            {{ item.label }}
          </div>
        </th>
      </tr>
      <tr
        v-for="(item, m) in tableData"
        :key="m"
      >
        <td
          v-for="(each, n) in columns"
          :key="n"
          :class="[
            'row',
            !order ? 'preview' : null,
          ]"
        >
          <div
            v-if="each.value == 'order'"
            class="order"
          >
            {{ m + 1 }}
          </div>
          <div
            v-else
            @click.stop="handleSelectBlockClick(m, n, item[each.value])"
            v-html="item[each.value]"
          ></div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      selectClass: {},
      columns: [],
      tableData: []
    };
  },
  props: ["data", "column"],
  watch: {
    data: {
      deep: true,
      handler: function (data) {
        if (this.data && this.data.length) {
          this.tableData = data;
        }
      },
      immediate: true,
    },
    column: {
      deep: true,
      handler: function (columnArr) {
        if (columnArr && columnArr.length) {
          this.handleClearClick();
            this.columns = [...columnArr];
        }
      },
      immediate: true,
    },
  },
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
