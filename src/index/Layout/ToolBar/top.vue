<template>
  <div class="zl-tool-bar">
    <div class="left">
      <!-- <ul>
        <li><img src="../../assets/1.svg" /></li>
        <li><img src="../../assets/2.svg" /></li>
      </ul> -->
      <ul>
        <li>
          <div @click="handleMenuSwitch('repInsWord')">
            <img src="../../assets/th.svg" />
            <img src="../../assets/xxjt.svg" class="arrow-icon" />
          </div>
          <ol v-if="moduleConfig.repInsWord && menuType === 'repInsWord'">
            <li
              v-for="(item, i) in moduleConfig.repInsWord"
              :key="i"
              @click="handleMenuClickItem(item)"
            >
              {{ item.title }}
            </li>
          </ol>
        </li>
        <li>
          <div @click="handleMenuSwitch('arrAndObj')">
            <img src="../../assets/zkh.svg" />
            <img src="../../assets/xxjt.svg" class="arrow-icon" />
          </div>
          <ol v-if="moduleConfig.arrAndObj && menuType === 'arrAndObj'">
            <li
              v-for="(item, i) in moduleConfig.arrAndObj"
              :key="i"
              @click="handleMenuClickItem(item)"
            >
              {{ item.title }}
            </li>
          </ol>
        </li>
      </ul>
    </div>
    <div class="right">
      <ul>
        <li>
          <div @click="handleMenuSwitch('filter-column')">
            <img src="../../assets/fil.svg" />
            <img src="../../assets/xxjt.svg" class="arrow-icon" />
          </div>
          <ol v-if="moduleConfig.arrAndObj && menuType === 'filter-column'">
            <FilterColumn v-model="columnArr" />
          </ol>
        </li>
      </ul>
    </div>
    <!-- 遮罩层 -->
    <div
      class="mask-box"
      v-if="menuType"
      @click="handleMenuSwitch(false)"
    ></div>
  </div>
</template>
<script>
import FilterColumn from "../../components/FilterColumn";
export default {
  name: "toolbar",
  components: {
    FilterColumn,
  },
  props: ["moduleConfig"],
  // watch: {
  //   moduleConfig: {
  //     handler: function (config) {
  //       this.menuData = config;
  //     },
  //     immediate: true,
  //   },
  // },
  data() {
    return {
      menuType: "",
      columnArr: [],
    };
  },
  watch: {
    columnArr: {
      // deep: true,
      handler: function (newV, oldV) {
        this.$store.commit(
          "setColumns",
          newV.map((item) => {
            return {
              label: item,
              value: item,
            };
          })
        );
      },
    },
  },
  created() {},
  mounted() {
    // console.log(moduleConfig);
  },
  methods: {
    handleMenuClickItem(item) {
      this.menuType = "";
      this.$event.emit("is-open-drawer", true);
      this.$event.emit("menu-type", item);
    },
    handleMenuSwitch(type) {
      if (type) {
        this.menuType = type;
      } else {
        this.menuType = "";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./style.scss";
</style>