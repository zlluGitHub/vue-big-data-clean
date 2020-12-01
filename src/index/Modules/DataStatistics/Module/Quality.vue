<template>
  <div class="zl-module-warp">
    <div class="title">{{ title }}</div>
    <div class="content">
      <ul>
        <li>
          <label> 有效率 </label>
          <p><span>12213</span><span>100%</span></p>
          <em :style="{ width: '80%' }"></em>
        </li>
        <li>
          <label> 无效率 </label>
          <p><span>12213</span><span>100%</span></p>
          <em :style="{ width: '50%' }"></em>
        </li>
        <li>
          <label> 缺失率 </label>
          <p><span>12213</span><span>100%</span></p>
          <em :style="{ width: '30%' }"></em>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // configure:{
      // }
    };
  },
  props: ["title"],
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
$borderRadius: 5px;
.zl-module-warp {
  .content {
    > ul {
      > li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #fff;
        border-radius: $borderRadius;
        position: relative;
        padding: 3px 10px;
        line-height: 1.3;
        margin: 3px 0;
        label {
          color: #fff;
          z-index: 1;
        }
        p {
          z-index: 1;
          color: #aaa;
          span {
            margin-left: 10px;
          }
        }
        > em {
          position: absolute;
          left: 0;
          top: 0;
          width: 50%;
          height: 100%;
          border-radius: $borderRadius;
          background: #21a9ac;
        }
      }
    }
  }
}
</style>