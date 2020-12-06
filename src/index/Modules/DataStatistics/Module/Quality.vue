<template>
  <div class="zl-module-warp">
    <div class="title">{{ title }}</div>
    <div class="content">
      <ul>
        <li
          v-for="(item, i) in contentArr"
          :key="'q' + i"
          @click="handleClick(item.key)"
        >
          <div class="tip">
            <label>{{ item.key }}</label>

            <p>
              <span>{{
                item.value ? item.value.valid + "/" + item.value.tatol : 0
              }}</span
              ><span
                >{{ item.value ? parseInt(item.value.percentage) : 0 }}%</span
              >
            </p>
          </div>
          <div class="block">
            <em
              :style="{ width: (item.value ? item.value.percentage : 0) + '%' }"
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
</template>
<script>
export default {
  data() {
    return {
      contentArr: [],
    };
  },
  props: ["content", "title"],
  watch: {
    content: {
      handler: function (data) {
        let arr = [];
        for (const key in data) {
          arr.push({
            key: key,
            value: data[key],
          });
        }
        this.contentArr = arr;
      },
      immediate: true,
    },
  },
  created() {},
  mounted() {},
  methods: {
    handleClick(key) {
      this.$event.emit("columnName", key);
    },
  },
};
</script>

<style lang="scss" scoped>
$borderRadius: 5px;
.zl-module-warp {
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
</style>