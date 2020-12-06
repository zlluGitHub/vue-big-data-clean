<template>
  <div class="zl-tool-bar">
    <ul>
      <li>
        <span>{{ toolBarObj.column }}</span> 列
      </li>
      <li>
        <span>{{ toolBarObj.row }}</span> 行
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: ["toolBar"],
  data() {
    return {
      toolBarObj: {},
    };
  },
  watch: {
    toolBar: {
      immediate: true,
      handler: function (newV, oldV) {
        this.toolBarObj = newV;
      },
    },
  }
};
</script>

<style lang="scss" scoped>
@import "./style.scss";
.zl-tool-bar {
  background: #f4f8fd;
  border-top: 1px solid #eee;
  ul {
    li {
      span {
        font-family: Georgia;
        margin-right: 5px;
      }
    }
  }
}
</style>