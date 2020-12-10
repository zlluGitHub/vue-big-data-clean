<template>
  <div class="zl-spin-col">
    <Spin :fix="fix">
      <Icon type="ios-loading" size="18" class="zl-spin-icon-load"></Icon>
      <div>操作正在执行，请稍后...</div>
    </Spin>
  </div>
</template>
<script>
export default {
  props: ["fix"],
};
</script>
<style lang="scss" scoped>
.zl-spin-col {
  /deep/ .ivu-spin {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    color: #666;
    // font-size: 20px;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.5);
  }
  .zl-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
  @keyframes ani-demo-spin {
    from {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
}
</style>
