import { deepClone } from "../utils/index"
const state = {
  filter: {
    row: "",
    column: []
  },
  copyData: [],
  data: [],

  columns: [],
  columnsCopy: [],

  stepDataArr: [],

  previewData: {
    columns: [],
    tableData: []
  }
}
const mutations = {
  setFilterRowData(state, val) {
    state.filter.row = val;
  },
  setFilterColumnData(state, val) {
    state.filter.column = val;
  },

  setCopyData(state, data) {
    state.copyData = deepClone(data);
  },
  setStepDataArr(state, data) {
    state.stepDataArr.push(data);
  },
  setData(state, data) {
    state.data = deepClone(data);
  },
  setColumns(state, data) {
    if (data && data.length) {
      let newData = data.map(item => {
        if (item.value && item.label) {
          return item
        } else {
          return {
            label: item,
            label: value
          }
        }
      })
      state.columns = deepClone(newData)
    } else {
      state.columns = []
    }
  },
  setColumnsCopy(state, data) {
    if (data && data.length) {
      let newData = data.map(item => {
        if (item.value && item.label) {
          return item
        } else {
          return {
            label: item,
            label: value
          }
        }
      })
      state.columnsCopy = deepClone(newData)
    } else {
      state.columnsCopy = []
    }
  },
  setPreviewData(state, data) {
    state.previewData = data;
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
