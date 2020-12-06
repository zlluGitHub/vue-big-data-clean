<template>
  <div class="drawer-box">
    <div class="zl-warp">
      <Quality title="键值有效统计" :content="qualityStatistics" />
    </div>
    <div class="zl-warp">
      <UniqueKey title="字段数据统计" :content="keyStatistics" />
    </div>
  </div>
</template>
<script>
import Quality from "./Module/Quality";
import UniqueKey from "./Module/UniqueKey";
export default {
  components: {
    Quality,
    UniqueKey,
  },
  // data() {
  //   return {
  //     content: {},
  //   };
  // },
  computed: {
    qualityStatistics() {
      return this.$store.state.dataState.qualityStatistics;
    },
    keyStatistics() {
      return this.$store.state.dataState.keyStatistics;
    },
  },
  // watch: {
  //   dataStatistics: {
  //     handler: function (data) {
  //       this.content = data;
  //     },
  //     immediate: true,
  //   },
  // },

  created() {},
  mounted() {},
  methods: {},
};
</script>