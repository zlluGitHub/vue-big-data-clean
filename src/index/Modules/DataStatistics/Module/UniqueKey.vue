<template>
  <div class="zl-module-warp">
    <div class="title">{{ title }}</div>
    <div class="content">
      <div class="input-box">
        <input type="text" />
        <img src="../../../assets/search.svg" />
      </div>
      <ul class="scrollbar">
        <li>
          <label> 有效率 </label>
          <span>100%</span>
          <em :style="{ width: '80%' }"></em>
        </li>
        <li>
          <label> 无效率 </label>
          <span>100%</span>
          <em :style="{ width: '50%' }"></em>
        </li>
        <li>
          <label> 缺失率 </label>
          <span>100%</span>
          <em :style="{ width: '30%' }"></em>
        </li>
        <li>
          <label> 缺失率 </label>
          <span>100%</span>
          <em :style="{ width: '30%' }"></em>
        </li>
        <li>
          <label> 缺失率 </label>
          <span>100%</span>
          <em :style="{ width: '30%' }"></em>
        </li>
        <li>
          <label> 缺失率 </label>
          <span>100%</span>
          <em :style="{ width: '30%' }"></em>
        </li>
        <li>
          <label> 缺失率 </label>
          <span>100%</span>
          <em :style="{ width: '30%' }"></em>
        </li>
        <li>
          <label> 缺失率 </label>
          <span>100%</span>
          <em :style="{ width: '30%' }"></em>
        </li>
        <li>
          <label> 缺失率 </label>
          <span>100%</span>
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
.zl-module-warp {
  .content {
    .input-box {
      position: relative;
      > input {
        width: 100%;
        padding: 8px 0;
        padding-left: 32px;
        padding-right: 8px;
        border-radius: 4px;
        box-shadow: none;
        line-height: 18px;
        background: none;
        outline: none;
        border: 1px solid #cfd9e3;
        font-size: 14px;
      }
      > img {
        width: 23px;
        height: 23px;
        position: absolute;
        left: 6px;
        top: 8px;
        opacity: 0.5;
        cursor: pointer;
        transition: opacity 0.2s ease;
        &:hover {
          opacity: 1;
        }
      }
    }
    > ul {
      margin-top: 10px;
      max-height: 100px;
      overflow: auto;
      > li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #fff;
        position: relative;
        padding: 3px 10px;
        height: 20px;
        margin: 5px 0;
        label {
          // color: #fff;
          z-index: 1;
        }
        span {
          z-index: 1;
        }

        > em {
          position: absolute;
          left: 0;
          top: 0;
          border-radius: 2px;
          width: 50%;
          height: 100%;
          background: #21a9ac;
          cursor: pointer;
          transition: background 0.2s;
          &:hover {
            background: #21aaac8c;
          }
        }
      }
    }
  }
}
</style>