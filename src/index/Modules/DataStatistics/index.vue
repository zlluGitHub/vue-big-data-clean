<template>
  <div class="drawer-box">
    <div class="zl-warp">
      <Quality title="数据质量" />
    </div>
    <div class="zl-warp">
      <UniqueKey title="键值统计" />
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
  // props: ["title"],
  data() {
    return {
      // configure:{
      // }
    };
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>