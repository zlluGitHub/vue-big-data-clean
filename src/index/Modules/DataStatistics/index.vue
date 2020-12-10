<template>
  <div class="drawer-box">
    <div class="zl-warp">
      <div class="zl-module-warp-list">
        <div class="title">键值有效统计</div>
        <div class="content">
          <ul>
            <li
              v-for="(item, i) in qualityStatisticsData"
              :key="'q' + i"
              @click="onColumnName(item.key)"
            >
              <div class="tip">
                <label>{{ item.key }}</label>

                <p>
                  <span>{{
                    item.value ? item.value.valid + "/" + item.value.tatol : 0
                  }}</span
                  ><span>{{ item.value ? parseInt(item.value.percentage) : 0 }}%</span>
                </p>
              </div>
              <div class="block">
                <em
                  :style="{
                    width: (item.value ? item.value.percentage : 0) + '%',
                  }"
                ></em>
              </div>
            </li>
            <!--<li>
          <label> 无效率 </label>
          <p><span>12213</span><span>100%</span></p>
          <em :style="{ width: '50%' }"></em>
        </li>
        <li>
          <label> 缺失率 </label>
          <p><span>12213</span><span>100%</span></p>
          <em :style="{ width: '30%' }"></em>
        </li> -->
          </ul>
        </div>
      </div>
    </div>
    <div class="zl-warp">
      <div class="zl-module-warp-key">
        <div class="title">字段数据统计</div>
        <div class="content">
          <div class="input-box">
            <input type="text" v-model="inputValue" />
            <img src="../../assets/search.svg" />
          </div>
          <ul class="scrollbar" v-if="keyStatisticsData && keyStatisticsData.length">
            <li v-for="(item, i) in keyStatisticsData" :key="'q' + i">
              <label> {{ item.type }} </label>
              <span>{{ item.percentage ? item.percentage.toFixed(2) : 0 }}%</span>
              <em
                :style="{
                  width: (item.percentage ? item.percentage : 0) + '%',
                }"
              ></em>
            </li>
          </ul>
          <ul v-else class="scrollbar">
            <div>请选择有效字段</div>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      qualityStatisticsData: [],
      keyStatisticsData: [],
      inputValue: "",
      key: "",
    };
  },
  computed: {
    qualityStatistics() {
      return this.$store.state.dataState.qualityStatistics;
    },
    keyStatistics() {
      return this.$store.state.dataState.keyStatistics;
    },
  },
  watch: {
    qualityStatistics: {
      handler: function (data) {
        let arr = [];
        for (const key in data) {
          arr.push({
            key: key,
            value: data[key],
          });
        }
        this.qualityStatisticsData = arr;
      },
      immediate: true,
    },

    keyStatistics: {
      handler: function (data) {
        if (this.key) {
          this.keyStatisticsData = data[this.key];
        }
      },
      immediate: true,
    },
    inputValue(val) {
      let data = this.$store.state.dataState.keyStatistics;
      if (val) {
        this.keyStatisticsData = data[this.key].filter((item) => {
          return item.type.indexOf(val) > -1;
        });
      } else {
        this.keyStatisticsData = data[this.key];
      }
    },
  },

  created() {
    this.$event.on("columnName", this.onColumnName);
  },
  mounted() {},
  methods: {
    onColumnName(key) {
      this.key = key;
      if (this.key) {
        this.$store.dispatch("reqKeyStatistics", this.key);
        // this.contentArr = this.content[key];
      }
      // else {
      //   this.$store.dispatch("reqKeyStatistics", this.key);
      // }
    },
  },
  beforeDestroy() {
    this.$event.off("columnName", this.onColumnName);
  },
};
</script>
<style lang="scss" scoped>
$borderRadius: 5px;
.zl-module-warp-list {
  .content {
    > ul {
      > li {
        margin: 8px 0;
        .tip {
          display: flex;
          justify-content: space-between;
          // align-items: center;
          label {
            color: #666;
            font-size: 14px;
          }
          p {
            color: #aaa;
            font-family: Georgia;
            span {
              margin-left: 10px;
              display: inline-block;
              &:last-child {
                width: 40px;
                text-align: right;
              }
            }
          }
        }

        // margin: 3px 0;

        .block {
          border-radius: $borderRadius;
          position: relative;
          background: #eee;
          padding: 6px 10px;
          cursor: pointer;
          &:hover {
            em {
              background: #21aaac85;
            }
          }
          em {
            position: absolute;
            left: 0;
            top: 0;
            width: 50%;
            height: 100%;
            border-radius: $borderRadius;
            background: #21a9ac;
            transition: background 0.2s ease;
          }
        }
      }
    }
  }
}
.zl-module-warp-key {
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
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
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
