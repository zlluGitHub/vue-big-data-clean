import { deepClone } from "../utils/index"
const state = {
  copyData: [],
  data: [],
  columns: [],
}
const mutations = {
  setCopyData(state, data) {
    state.copyData = deepClone(data);
  },
  setData(state, data) {
    state.data = data;
  },
  setColumns(state, data) {
    state.columns = data.map(item => {
      return {
        value: item.key,
        label: item.title
      }
    });
  }
}
const actions = {
  // setData(context, data) {
  //   context.commit('setData', data);
  // }
}
const getters = {
  // //获文章取条获件分页列表
  // getArticleReplyPage(state) {
  //   return function (pageNo, pageSize) {
  //     let list = 0;
  //     return list;
  //   }
  // }
}
export default {
  state,
  actions,
  mutations,
  getters
}
