<template>
  <div class="zl-table-box" @click.stop="handleClearClick">
    <table border="0" cellspacing="0" cellpadding="0">
      <tr>
        <th
          v-for="(item, i) in columns"
          :key="i"
          :class="[
            'column-header',
            'column-header-' + i === selectClass.header ? 'source-header' : null,
            item.zl_state === 'source' ? 'select-header' : null,
            item.zl_state === 'target' ? 'preview-header' : null,
            !order ? 'preview' : null,
          ]"
          @click.stop="
            handleSelectColumnClick(item.label, 'column-header-' + i, 'row-' + i)
          "
        >
          <!-- <div :style="{ width: item.width ? item.width + 'px' : '200px' }"> -->
          <div>
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
          item.zl_isRow ? 'is-row' : null,
        ]"
      >
        <td
          v-for="(each, n) in columns"
          :key="n"
          :class="[
            'row',
            'row-' + n === selectClass.row ? 'source' : null,
            each.zl_state === 'source' ? 'select' : null,
            each.zl_state === 'target' ? 'preview' : null,
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
          <!-- <Tooltip
            v-else
            :transfer="false"
            placement="top-start"
            max-width="200"
          >
            <div slot="content" v-html="item[each.value]"></div> -->
          <!-- :style="{ width: item.width ? item.width + 'px' : '200px' }" -->
          <div
            class="zl-text"
            @click.stop="
              handleSelectBlockClick(m, n, item[each.value], each.value, item._id)
            "
            v-html="item[each.value]"
          ></div>
          <!-- </Tooltip> -->
        </td>
      </tr>
    </table>
    <Modal
      :title="`修改第 ${textData.rowIndex + 1} 行，第 ${textData.columnIndex} 列`"
      v-model="isModal"
      ok-text="提交"
      @on-ok="handleModalOk"
      @on-cancel="handleModalCancel"
      :closable="false"
    >
      <Input
        v-model="textData.value"
        type="textarea"
        :rows="4"
        placeholder="请输入内容..."
      />
    </Modal>
  </div>
</template>

<script>
import { reqUpdate } from "../../api";
export default {
  name: "app",
  data() {
    return {
      textData: {
        value: "",
        rowIndex: 0,
        columnIndex: 0,
      },
      selectClass: {},
      columns: [],
      tableData: [],
      isModal: false,
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
    handleModalOk() {
      let { data, copyData, columns, columnsCopy } = this.$store.state.dataState;

      data[this.textData.rowIndex][
        columns[this.textData.columnIndex - 1].value
      ] = this.textData.value;

      copyData[this.textData.rowIndex][
        columnsCopy[this.textData.columnIndex - 1].value
      ] = this.textData.value;
      this.$event.emit("loading", true);
      reqUpdate({
        type: "one",
        content: {
          _id: this.textData._id,
          key: this.textData.key,
          value: this.textData.value,
        },
      })
        .then((res) => {
          this.$event.emit("loading", false);
          if (res.data.code === 200) {
            this.$Notice.success({
              title: "更新成功！",
            });
          } else {
            this.$Notice.error({
              title: "更新失败！",
            });
          }
        })
        .catch((error) => {
          this.$Notice.error({
            title: "网络异常，请稍后再试！",
          });
          console.log(error);
        });
    },
    handleModalCancel() {},
    // 选中某一块
    handleSelectBlockClick(m, n, text, key, _id) {
      console.log(key, _id);
      this.textData = {
        value: text,
        rowIndex: m,
        columnIndex: n,
        columnIndex: n,
        key,
        _id,
      };
      this.isModal = !this.isModal;
    },
    // 清除选择
    handleClearClick() {
      this.selectClass = {};
      // this.$event.emit("columnName");
    },
    //选中列
    handleSelectColumnClick(columnName, header, row) {
      this.selectClass = { header, row };
      // this.selectClass = { ...this.selectClass };
      this.$event.emit("is-open-drawer", true);
      this.$event.emit("menu-type", {
        type: "data-tatistics",
      });
      this.$event.emit("columnName", columnName);

      // console.log(columnName);
    },
    //选中行
    handleSelectRowClick(rowIndex, column) {
      this.selectClass = { column };
      // this.selectClass = { ...this.selectClass };
      console.log(rowIndex);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./style.scss";
</style>
