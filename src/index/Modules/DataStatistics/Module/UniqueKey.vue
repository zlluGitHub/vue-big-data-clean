<template>
  <div class="zl-module-warp">
    <div class="title">{{ title }}</div>
    <div class="content">
      <div class="input-box">
        <input type="text" v-model="inputValue" />
        <img src="../../../assets/search.svg" />
      </div>
      <ul class="scrollbar" v-if="contentArr && contentArr.length">
        <li v-for="(item, i) in contentArr" :key="'q' + i">
          <label> {{ item.type }} </label>
          <span>{{ item.percentage ? item.percentage.toFixed(2) : 0 }}%</span>
          <em
            :style="{ width: (item.percentage ? item.percentage : 0) + '%' }"
          ></em>
        </li>
      </ul>
      <ul v-else class="scrollbar">
        <div>请选择有效字段</div>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      contentArr: [],
      inputValue: "",
      key: "",
    };
  },
  props: ["content", "title"],
  watch: {
    inputValue(val) {
      if (val) {
        this.contentArr = this.content[this.key].filter((item) => {
          return item.type.indexOf(val) > -1;
        });
      } else {
        this.contentArr = this.content[this.key];
      }
    },
    content: {
      handler: function (data) {
        if (this.key) {
          this.contentArr = data[this.key];
        }
      },
      immediate: true,
    },
  },
  created() {
    this.$event.on("columnName", (key) => {
      this.key = key;
      // this.$store.dispatch("reqKeyStatistics", this.key);
      if (this.key) {
        this.contentArr = this.content[key];
      }
      else {
        this.$store.dispatch("reqKeyStatistics", this.key);
      }
    });
  },
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
      max-height: 430px;
      overflow: auto;
      > div {
        padding: 20px 0;
        text-align: center;
        background: rgba(238, 238, 238, 0.589);
      }
      > li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: rgba(238, 238, 238, 0.589);
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