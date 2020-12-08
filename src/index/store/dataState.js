import { deepClone } from "../utils/index"
import { reqGetData, reqQualityStatistics, reqKeyStatistics, reqUpdate } from "../api"
const state = {
  pageInfo: {
    pageSize: 200,
    pageNo: 1,
    order: 0,
    upId: "",
    downId: "",
  },

  footerInfo: {},

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
  },

  qualityStatistics: {},
  keyStatistics: {}
}
const mutations = {
  setPageInfo(state, obj) {
    state.pageInfo = {
      pageNo: obj.pageNo ? obj.pageNo : state.pageInfo.pageNo,
      pageSize: obj.pageSize ? obj.pageSize : state.pageInfo.pageSize,
      order: obj.order ? obj.order : state.pageInfo.order,
      upId: obj.upId ? obj.upId : state.pageInfo.upId,
      downId: obj.downId ? obj.downId : state.pageInfo.downId,
    };
  },
  setFooterInfo(state, val) {
    state.footerInfo = val;
  },
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
            value: item
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
            value: item
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
  },
  setQualityStatistics(state, data) {
    state.qualityStatistics = data;
  },
  setKeyStatistics(state, data) {
    state.keyStatistics = data;
  },
}
const actions = {
  reqGetData({ commit, state }, { pageSize, pageNo, page_id, _id, bid ,callBack}) {
    // console.log(params);
    reqGetData({ pageSize, pageNo, page_id, _id, bid }).then((res) => {
      if (res.data.code === 200 || res.data.code === "200") {
        // console.log(res.data);
        let data = res.data.data
        let columns = [];
        if (data.length) {
          for (const key in data[0]) {
            columns.push(key);
          }
        }
        commit('setFooterInfo', {
          column: columns.length,
          row: res.data.count
        })

        commit('setPageInfo', {
          upId: data[0]._id,
          downId: data[data.length - 1]._id,
        })

        commit('setColumns', columns)
        commit('setColumnsCopy', columns)
        commit('setData', data)
        commit('setCopyData', data)
      } else {
        console.log(res);
      }
      callBack(res.data)
    }).catch(error => {
      console.log(error);
      // callBack(error)
    });
  },
  reqQualityStatistics({ commit, state }, params) {
    reqQualityStatistics(params).then((res) => {
      if (res.data.code === 200 || res.data.code === "200") {
        commit('setQualityStatistics', res.data.data)
      } else {
        console.log(res);
      }
    }).catch(error => {
      console.log(error);
    });
  },
  reqKeyStatistics({ commit, state }, params) {
    reqKeyStatistics(params).then((res) => {
      if (res.data.code === 200 || res.data.code === "200") {
        commit('setKeyStatistics', res.data.data)
      } else {
        console.log(res);
      }
    }).catch(error => {
      console.log(error);
    });
  },
  reqUpdate({ commit, state, dispatch }, { params, callBack }) {
    reqUpdate(params).then((res) => {
      callBack(res.data);
      // let pageInfo = state.pageInfo
      // dispatch("reqGetData", {
      //   page_id: pageInfo.upId,
      //   pageSize: pageInfo.pageSize
      // });
    }).catch(error => {
      callBack(res)
      console.log(error);
    });
  }
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
