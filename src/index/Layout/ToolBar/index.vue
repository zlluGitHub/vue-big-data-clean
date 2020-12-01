<template>
  <div class="zl-warp">
    <div class="left">
      <ul>
        <li><img src="../../assets/1.svg" /></li>
        <li><img src="../../assets/2.svg" /></li>
      </ul>
      <ul>
        <li>
          <img src="../../assets/th.svg" />
          <img src="../../assets/xxjt.svg" class="arrow-icon" />
          <ol>
            <li></li>
          </ol>
        </li>
        <li>
          <img src="../../assets/zkh.svg" />
          <img src="../../assets/xxjt.svg" class="arrow-icon" />
          <ol>
            <li></li>
          </ol>
        </li>
      </ul>
    </div>
    <div class="right">登录</div>
  </div>
</template>
<script>
export default {
  name: "toolbar",
  components: {
    // Footer,
  },
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

<style lang="scss" scoped>
@import "./style.scss";
</style>