<template>
  <div class="zl-drawer-warp">
    <div class="panel-toolbar">
      <span>{{ moduleObj.title }}</span>
      <img src="../../assets/delete.svg" />
    </div>
    <div v-if="moduleObj.type === 'data-tatistics'" class="zl-drawer-item">
      <DataStatistics />
    </div>
    <div v-else-if="moduleObj.type === 'replace-word'" class="zl-drawer-item">
      <ReplaceWord />
    </div>
    <div v-else></div>
  </div>
</template>
<script>
import DataStatistics from "../../Modules/DataStatistics";
import ReplaceWord from "../../Modules/ReplaceWord";
export default {
  components: {
    DataStatistics,
    ReplaceWord,
  },
  data() {
    return {
      moduleObj: {
        title: "替换指定元素",
        type: "replace-word",
      },
    };
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.zl-drawer-warp {
  .panel-toolbar {
    background: #f4f8fd;
    height: 42px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 15px;
    position: relative;
    img {
      position: absolute;
      top: 14px;
      right: 15px;
      width: 16px;
      height: 16px;
      cursor: pointer;
    }
  }
}
</style>
<style lang="scss">
.zl-drawer-warp {
  .zl-module-warp {
    .title {
      font-weight: 500;
      color: #24292e;
      font-size: 14px;
      margin-top: 20px;
      margin-bottom: 10px;
    }
  }
  .drawer-box {
    .zl-warp {
      padding: 0 20px;
    }
  }
}
</style>