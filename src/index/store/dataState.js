

import { deepClone } from "../utils/index";
import { reqGetData, reqQualityStatistics, reqKeyStatistics } from "../api";
import { processingModule, storeObj } from "../utils/processing";
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
  selectColumns: [],

  moduleStep: [
    // {
    //   module: {},
    //   paramObj: {}
    // }
  ],
  lastStepObj: {
    module: {},
    paramObj: {}
  },

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
  setModuleStep(state, data) {
    // console.log(data, 'asdasdasdasd');
    if (data.isLast) {
      state.moduleStep.push({
        module: data.module,
        paramObj: data.paramObj
      });
    } else {
      state.lastStepObj = {
        module: data.module,
        paramObj: data.paramObj
      };
      // console.log(state.lastStepObj,'aaaa');
    }
    // console.log(state.moduleStep);
  },
  setLastStepObj(state, data) {
    state.lastStepObj = data;
  },
  setData(state, data) {
    // console.log(state);
    state.data = deepClone(data);
  },
  setColumns(state, data) {
    // console.log(data);
    if (data && data.length) {
      if (data[0] && data[0].label && data[0].value) {
        data.sort((a, b) => a.label.localeCompare(b.label));
        state.columns = data;
      } else {
        data.sort((a, b) => a.localeCompare(b));
        state.columns = data.map(item => {
          return {
            label: item,
            value: item
          }
        })
      }
      // state.columns = deepClone(newData)
    } else {
      state.columns = []
    }
  },
  setColumnsCopy(state, data) {
    if (data && data.length) {
      if (data[0] && data[0].label && data[0].value) {
        data.sort((a, b) => a.label.localeCompare(b.label));
        state.columnsCopy = data;
      } else {
        data.sort((a, b) => a.localeCompare(b));
        state.columnsCopy = data.map(item => {
          return {
            label: item,
            value: item
          }
        })
      }

      // state.columns = deepClone(newData)
    } else {
      state.columnsCopy = []
    }

    // if (data && data.length) {
    //   let newData = data.map(item => {
    //     if (item.value && item.label) {
    //       return item
    //     } else {
    //       return {
    //         label: item,
    //         value: item
    //       }
    //     }
    //   })
    //   state.columnsCopy = deepClone(newData)
    // } else {
    //   state.columnsCopy = []
    // }
  },

  setSelectColumns(state, data) {
    console.log(data);
    state.selectColumns = data;
    if (data && data.length) {
      let keyArr = data.map(each => each.key);
      let newColumns = state.columnsCopy.map((item, i) => {
        let position = keyArr.indexOf(item.value);
        if (position > -1) {
          return { ...item, ...{ zl_state: data[position].state } };
        } else {
          return item;
        }
      });
      mutations.setColumns(state, newColumns);
    } else {
      mutations.setColumns(state, state.columnsCopy);
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
  reqGetData({ commit, state }, { pageSize, pageNo, page_id, _id, bid, callBack }) {
    callBack = callBack ? callBack : (e) => { }
    reqGetData({ pageSize, pageNo, page_id, _id, bid }).then((res) => {
      if (res.data.code === 200 || res.data.code === "200") {
        // console.log(res.data);
        let data = res.data.data;
        let columnsCopy = [];
        commit('setData', data)
        commit('setCopyData', data);
        // if (data.length) {
        //   for (const key in data[0]) {
        //     if (key !== '_id') {
        //       columnsCopy.push(key);
        //     };
        //   };
        // };

        // data.Object.keys(newData[0]);

        data.forEach(item => {
          columnsCopy.push(Object.keys(item))
        })

        let length = 0, columnsLengthArr = [];
        columnsCopy.forEach(arr => {
          if (arr.length > length) {
            length = arr.length;
            columnsLengthArr = arr;
          }
        })
        columnsCopy = columnsLengthArr;
        commit('setColumnsCopy', deepClone(columnsCopy));

        // // 分页加载处理
        // if (state.moduleStep.length !== 0) {
        //   let promise = Promise.resolve(deepClone(data));
        //   state.moduleStep.forEach(itemStep => {
        //     promise = promise.then((newData) => {
        //       return new Promise(resolve => {
        //         let { tableData } = processingModule(newData, itemStep)
        //         resolve(tableData);
        //       });
        //     });
        //   })
        //   promise.then((newData) => {
        //     if (state.lastStepObj.isLast) {
        //       commit('setData', processingModule(newData, state.lastStepObj, 'view'))
        //     } else {
        //       commit('setData', newData)
        //     };
        //   });
        // } else {
        let lastStepObj = state.lastStepObj
        if (JSON.stringify(lastStepObj.module) !== "{}") {
          // console.log(state.lastStepObj);
          let { tableData, columns } = processingModule(deepClone(data), state.lastStepObj, 'view');
          if (lastStepObj.module.type === 'columns-into-array' || lastStepObj.module.type === 'columns-into-object') {
            commit("setPreviewData", { tableData, columns });
          } else {
            commit('setData', tableData);
            columnsCopy = columns ? columns : columnsCopy;
          };
        };
        // };

        commit('setColumns', columnsCopy)

        if (state.selectColumns.length) {
          commit("setSelectColumns", state.selectColumns);
        };

        commit('setFooterInfo', {
          column: columnsCopy.length,
          row: res.data.count
        });

        commit('setPageInfo', {
          upId: data[0]._id,
          downId: data[data.length - 1]._id,
        });
      }
      callBack(res.data);
    }).catch(error => {
      console.log(error);
      callBack(error);
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
