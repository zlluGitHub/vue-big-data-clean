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
          ]"
          @click.stop="
            handleSelectColumnClick(
              item.title,
              'column-header-' + i,
              'row-' + i
            )
          "
        >
          {{ item.title }}
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
            m + '-' + n,
          ]"
        >
          <div
            v-if="each.key == 'order'"
            class="order"
            @click.stop="handleSelectRowClick(m, 'column-' + m)"
          >
            {{ m + 1 }}
          </div>
          <div
            v-else
            @click.stop="handleSelectBlockClick(m, n, item[each.key])"
          >
            {{ item[each.key] }}
          </div>
        </th>
      </tr>
    </table>
  </div>
</template>

<script>
import data from "../../data/data.json";
export default {
  name: "app",
  data() {
    return {
      selectClass: {},
      columns: [
        {
          title: "#",
          key: "order",
        },
        {
          title: "projectName",
          key: "projectName",
        },
        {
          title: "projectName_copy",
          key: "projectName_copy",
        },
        {
          title: "author",
          key: "author",
        },
        {
          title: "remark",
          key: "remark",
        },
        {
          title: "root",
          key: "root",
        },
        {
          title: "time",
          key: "time",
        },
      ],
      tableData: [],
    };
  },
  mounted() {
    let data1 = data.data;
    this.tableData = data1.map((item, i) => {
      item.projectName_copy = "23_" + i;
      return item;
    });
    // console.log(this.tableData);
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
