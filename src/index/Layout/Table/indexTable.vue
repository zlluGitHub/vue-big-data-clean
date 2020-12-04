<template>
  <div class="zl-table-box" @click.stop="handleClearClick">
    <table border="0" cellspacing="0" cellpadding="0">
      <tr>
        <th
          v-for="(item, i) in columns"
          :key="i"
          :class="[
            'column-header',
            'column-header-' + i === selectClass.header
              ? 'source-header'
              : null,
            item.state === 'source' ? 'select-header' : null,
            !order ? 'preview' : null,
          ]"
          @click.stop="
            handleSelectColumnClick(
              item.label,
              'column-header-' + i,
              'row-' + i
            )
          "
        >
          <div :style="{ width: item.width ? item.width + 'px' : '200px' }">
            {{ item.label }}
          </div>
        </th>
      </tr>
      <tr
        v-for="(item, m) in tableData"
        :key="m"
        :class="[
          'column',
          'column-' + m === selectClass.column ? 'source' : null,
          !item.isRow ? 'is-row' : null,
        ]"
      >
        <td
          v-for="(each, n) in columns"
          :key="n"
          :class="[
            'row',
            'row-' + n === selectClass.row ? 'source' : null,
            each.state === 'source' ? 'select' : null,
            m + '-' + n,
            !order ? 'preview' : null,
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
            :style="{ width: each.width ? each.width + 'px' : '200px' }"
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
      tableData: [],
    };
  },
  props: ["data", "column", "order"],
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
          if (!this.order) {
            this.columns = [...columnArr];
          } else {
            this.columns = [
              {
                label: "#",
                value: "order",
                width: "60",
              },
              ...columnArr,
            ];
          }
        } else {
          this.columns = [
            {
              label: "#",
              value: "order",
              width: "60",
            },
          ];
        }
      },
      immediate: true,
    },
  },
  // mounted() {
  //   // let windowSize = windowSize();
  //   // this.winHeight = windowSize.winH;
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
