<template>
  <div class="zl-drawer-warp">
    <div class="panel-toolbar">
      <span>{{ moduleObj.title }}</span>
      <img src="../../assets/delete.svg" />
    </div>
    <div v-if="moduleObj.type === 'data-tatistics'" class="zl-drawer-item">
      <DataStatistics :moduleObj="moduleObj" />
    </div>
    <div v-else-if="moduleObj.type === 'replace-word'" class="zl-drawer-item">
      <ReplaceWord :moduleObj="moduleObj" />
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
      moduleObj: this.info,
    };
  },
  props: ["info"],
  // watch: {
  //   data: {
  //     handler: function (data) {
  //       if (this.data && this.data.length) {
  //         console.log(data);
  //       }
  //     },
  //     immediate: true,
  //   },
  // },
  created() {},
  mounted() {
    this.$event.on("menu-type", (item) => {
      this.moduleObj = item;
    });
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.zl-drawer-warp {
  .zl-drawer-item {
    padding: 0px 20px;
    height: 90vh;
    overflow: auto;
  }
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