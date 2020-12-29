import Vue from 'vue';
import moment from 'moment';//导入文件
import store from "../store";
// export let storeData = {};
Vue.prototype.$saveData = function (columns, data) {
    // columns = columns.filter(item => {
    //     return item !== '_id'
    // })
    this.$store.commit("setData", data);
    this.$store.commit("setColumns", columns);
    this.$store.commit("setColumnsCopy", columns);
    this.$store.commit("setCopyData", data);
}


// 数据质量统计
export const dataQualityStatistics = (jsonData) => {
    const repeatTime = (arr) => {
        let object = arr.reduce(function (prev, next) {
            prev[next] = (prev[next] + 1) || 1;
            return prev;
        }, {});
        let newArr = [];
        for (let key in object) {
            newArr.push({
                type: key,
                count: object[key],
                tatol: jsonData.length,
                percentage: object[key] / jsonData.length * 100
            })
        };
        return newArr
    }
    let keyArr = [];
    for (const key in jsonData[0]) {
        keyArr.push(key);
    }
    // console.log(keyArr);

    let newObj = {}
    let frequencyObj = {}
    keyArr.forEach(key => {
        let valid = 0
        let timeArr = []
        jsonData.forEach(each => {
            timeArr.push(each[key])
            if (each[key] || each[key] === 0) {
                valid = valid + 1
            }
        });
        newObj[key] = {
            valid,
            tatol: jsonData.length,
            percentage: valid / jsonData.length * 100
        }
        frequencyObj[key] = repeatTime(timeArr);

    });
    // console.log(newObj);
    return {
        whole: newObj,// 元素缺失率
        frequency: frequencyObj// 统计数组中元素的重复次数
    }
}

// 批量替换指定元素
export const replaceWord = (newData, option, mark) => {
    let { columnArr, characterArr } = option;
    newData = newData.map((item, i) => {
        columnArr.forEach((key, index) => {
            let text = item[key];
            if (text) {
                characterArr.forEach((obj) => {
                    let { source, target } = obj;
                    let startIndex = text.indexOf(source);
                    if (startIndex > -1) {
                        if (mark === "view") {
                            text = text.replace(new RegExp(source, 'gi'), (source ? `<span class="del-highlight">${source}</span>` : '') + (target ? `<span class="rep-highlight">${target}</span>` : ''))
                        } else {
                            text = text.replace(new RegExp(source, 'gi'), target)
                        }
                    }

                    item[key] = text;
                });
            }
        });

        return item;
    });
    return { tableData: newData }
};
// 批量删除指定元素
export const deleteWord = (newData, option, mark) => {
    let { columnArr, characterArr } = option;
    newData = newData.map((item, i) => {
        columnArr.forEach((key, index) => {
            let text = item[key];
            if (text) {
                characterArr.forEach((val) => {
                    let startIndex = text.indexOf(val);
                    if (startIndex > -1) {
                        if (mark === "view") {
                            text = text.replace(new RegExp(val, 'gi'), val ? `<span class="del-highlight">${val}</span>` : '');
                        } else {
                            text = text.replace(new RegExp(val, 'gi'), '');
                        }
                    }
                    item[key] = text;
                });
            }
        });
        return item;
    });
    return { tableData: newData }
}

// 批量插入指定元素
export const insertWordFun = (newData, option, mark) => {
    console.log(option);
    let { columnArr, matchRules, insertWord, insertWordObj } = option;
    newData = newData.map((item, i) => {
        columnArr.forEach((key, index) => {
            let text = item[key];
            if (text) {
                if (mark === "view") {
                    if (matchRules === "start") {
                        text =
                            (insertWord
                                ? `<span class="add-highlight">${insertWord}</span>`
                                : "") + text;
                    } else if (matchRules === "end") {
                        text =
                            text +
                            (insertWord
                                ? `<span class="add-highlight">${insertWord}</span>`
                                : "");
                    } else if (matchRules === "between") {
                        let isExist = text.indexOf(insertWordObj.front + insertWordObj.after);
                        if (isExist > -1) {
                            text = text.replace(new RegExp(insertWordObj.front + insertWordObj.after, 'gi'), insertWordObj.front + (insertWord
                                ? `<span class="add-highlight">${insertWord}</span>`
                                : "") + insertWordObj.after);
                        }
                    } else if (matchRules === "position") {
                        if (
                            insertWordObj.front * 1 < text.length &&
                            insertWordObj.after * 1 < text.length
                        ) {
                            text =
                                text.slice(0, insertWordObj.front) +
                                (insertWord
                                    ? `<span class="add-highlight">${insertWord}</span>`
                                    : "") +
                                text.slice(insertWordObj.after, text.length);
                        }
                    }
                } else {
                    if (matchRules === "start") {
                        text = insertWord + text;
                    } else if (matchRules === "end") {
                        text = text + insertWord;
                    } else if (matchRules === "between") {
                        let isExist = text.indexOf(insertWordObj.front + insertWordObj.after);
                        if (isExist > -1) {
                            text = text.replace(new RegExp(insertWordObj.front + insertWordObj.after, 'gi'), insertWordObj.front + insertWord + insertWordObj.after);
                        }
                    } else if (matchRules === "position") {
                        if (
                            insertWordObj.front * 1 < text.length &&
                            insertWordObj.after * 1 < text.length
                        ) {
                            text =
                                text.slice(0, insertWordObj.front) +
                                insertWord +
                                text.slice(insertWordObj.after, text.length);
                        }
                    }
                }

                item[key] = text;
            }
        });
        return item;
    });
    return { tableData: newData }
};

export const columnsIntoArray = (newData, option, mark) => {
    let { columnArr, columnName } = option;
    let columnNamePar = "";
    let newTableData = newData.map((item, i) => {
        let itemObj = {}, newArr = [];
        columnArr.forEach((key, index) => {
            if (item[key]) {
                newArr.push(item[key]);
                columnNamePar = columnName ? columnName : 'column_name';
            };
        });

        if (mark === "view") {
            itemObj[columnNamePar] = JSON.stringify(newArr);
            return itemObj;
        } else {
            item[columnNamePar] = JSON.stringify(newArr);
            return item;
        }

    });

    let newColumns = [{
        label: columnNamePar,
        value: columnNamePar,
    }];
    if (mark !== "view") {
        let columns = []
        for (const key in newData[0]) {
            columns.push({
                label: key,
                value: key,
            })
        }
        newColumns = columns;
    }
    return { columns: newColumns, tableData: newTableData }
}

export const columnsIntoObj = (newData, option, mark) => {
    let { columnArr, columnName } = option;
    let columnNamePar = "";
    let newTableData = newData.map((item, i) => {
        let itemObj = {}, newObj = {};
        columnArr.forEach((key, index) => {
            if (item[key]) {
                newObj[key] = item[key];
                columnNamePar = columnName ? columnName : 'column_name';
            };
        });
        if (mark === "view") {
            itemObj[columnNamePar] = JSON.stringify(newObj);
            return itemObj;
        } else {
            item[columnNamePar] = JSON.stringify(newObj);
            return item;
        }
    });

    let newColumns = [{
        label: columnNamePar,
        value: columnNamePar,
    }];
    if (mark !== "view") {
        let columns = []
        for (const key in newData[0]) {
            columns.push({
                label: key,
                value: key,
            })
        }
        newColumns = columns;
    }
    return { columns: newColumns, tableData: newTableData }
}

export const deleteColumns = (newData, columnArr, mark) => {

    newData.forEach((item, i) => {
        columnArr.forEach((key, index) => {
            delete item[key];
        });
    });

    let columns = []
    for (const key in newData[0]) {
        columns.push({
            label: key,
            value: key,
        })
    }
    // console.log(columns);
    return { columns, tableData: newData }

}

export const toLowerCase = (newData, columnArr, mark) => {
    newData.forEach((item, i) => {
        columnArr.forEach((key, index) => {
            let newText = item[key].toLowerCase();
            if (newText !== item[key]) {
                if (mark === 'view') {
                    item[key] = `<span class="del-highlight">${item[key]}</span><span class="rep-highlight">${newText}</span>`
                    console.log(item[key]);
                } else {
                    item[key] = newText
                }
            };
        });
    });
    return { tableData: newData }
}

export const toUpperCase = (newData, columnArr, mark) => {
    newData.forEach((item, i) => {
        columnArr.forEach((key, index) => {
            let newText = item[key].toUpperCase();
            if (newText !== item[key]) {
                if (mark === 'view') {
                    item[key] = `<span class="del-highlight">${item[key]}</span><span class="rep-highlight">${newText}</span>`
                } else {
                    item[key] = newText
                }
            };
        });
    });
    return { tableData: newData }
};

export const dateTimeFormat = (newData, option, mark) => {
    let { columnArr, formatType } = option;
    if (formatType) {
        newData.forEach((item, i) => {
            columnArr.forEach((key, index) => {
                let newText = moment(item[key]).format(formatType);
                console.log(newText);
                if (newText !== 'Invalid date') {
                    if (mark === 'view') {
                        item[key] = `<span class="del-highlight">${item[key]}</span><span class="rep-highlight">${newText}</span>`
                    } else {
                        item[key] = newText;
                    }
                } else {
                    item[key] = `<span class="error-highlight">${item[key]}（格式错误）</span>`
                }
            });
        });
    }
    return { tableData: newData }
};

export const splitPosition = (newData, option, mark) => {
    let { columnArr, positionArr, isNotSplit } = option;
    let columns = [];
    if (positionArr[0] && columnArr[0]) {
        positionArr = positionArr.map(number => number * 1);
        positionArr.sort((a, b) => a - b);
        newData = newData.map((item, i) => {
            let obj = {};
            columnArr.forEach((key, index) => {
                let newText = item[key];
                let textArr = [newText.slice(0, positionArr[0])];
                // newText
                for (let index = 0; index < positionArr.length; index++) {
                    textArr.push(newText.slice(positionArr[index], positionArr[index + 1]));
                }
                for (const ik in item) {
                    if (ik === key) {
                        textArr.forEach((text, n) => {
                            obj[key + `_${n + 1}`] = text;
                            if (columns.indexOf(key + `_${n + 1}`) <= -1) {
                                columns.push(key + `_${n + 1}`)
                            }
                        })
                    }
                }
            });

            obj = { ...obj, ...item };
            if (isNotSplit === 'no') {
                for (const ik in item) {
                    if (columnArr.indexOf(ik) > -1) {
                        delete obj[ik]
                    }
                }
            }
            return obj;
        });
        // }

        // let dataColumns = Object.keys(newData[0]);
        let columnsCopy = store.state.dataState.columnsCopy;
        columnsCopy = columnsCopy.map(item => item.value);
        columns = Array.from(new Set([...columns, ...columnsCopy]));

        if (mark === 'view') {
            columns = columns.sort((a, b) => a.localeCompare(b));
            columns = columns.map(key => {
                return {
                    label: key,
                    value: key
                }
            });
            columnArr.forEach(key => {
                columns.forEach(each => {
                    if (each.label.indexOf(key + '_') > -1) {
                        each.zl_state = 'target';
                    } else if (each.label.indexOf(key) > -1) {
                        each.zl_state = 'source';
                    }
                })
            });
        }
    } else {
        // for (const key in newData[0]) {
        //     columns.push({
        //         label: key,
        //         value: key
        //     })
        // }
        columns = store.state.dataState.columnsCopy;
        columnArr.forEach(key => {
            columns.forEach(each => {
                if (each.label.indexOf(key) > -1) {
                    each.zl_state = 'source';
                }
            })
        });
    }
    return { columns, tableData: newData }
};

export const splitWord = (newData, option, mark) => {
    let { columnArr, positionArr, isNotSplit } = option;
    let columns = [];
    // console.log();
    if (positionArr[0] && columnArr[0]) {
        positionArr = positionArr.map(item => item.toString());
        // positionArr.sort((a, b) => a - b);
        newData = newData.map((item, i) => {
            let obj = {};
            columnArr.forEach((key, index) => {
                let newText = item[key];
                // let textArr = [newText.slice(0, positionArr[0])];
                // // newText

                let textArr = []
                for (let index = 0; index < positionArr.length; index++) {
                    textArr = newText.split(new RegExp(positionArr[index], 'gi'));
                    // textArr.push(newText.slice(positionArr[index], positionArr[index + 1]));
                }
                for (const ik in item) {
                    if (ik === key) {
                        textArr.forEach((text, n) => {
                            obj[key + `_${n + 1}`] = text;
                            if (columns.indexOf(key + `_${n + 1}`) <= -1) {
                                columns.push(key + `_${n + 1}`)
                            }
                        })
                    }
                }
            });
            obj = { ...obj, ...item };
            if (isNotSplit === 'no') {
                for (const ik in item) {
                    if (columnArr.indexOf(ik) > -1) {
                        delete obj[ik]
                    }
                }
            }
            return obj;
        });
        // }

        let columnsCopy = store.state.dataState.columnsCopy;
        columnsCopy = columnsCopy.map(item => item.value);
        columns = Array.from(new Set([...columns, ...columnsCopy]));

        if (mark === 'view') {
            columns.sort((a, b) => a.localeCompare(b));
            columns = columns.map(key => {
                return {
                    label: key,
                    value: key
                }
            });
            columnArr.forEach(key => {
                columns.forEach(each => {
                    if (each.label.indexOf(key + '_') > -1) {
                        each.zl_state = 'target';
                    } else if (each.label.indexOf(key) > -1) {
                        each.zl_state = 'source';
                    }
                })
            });
        }
    } else {
        columns = store.state.dataState.columnsCopy;
        // for (const key in newData[0]) {
        //     columns.push({
        //         label: key,
        //         value: key
        //     })
        // }
        columnArr.forEach(key => {
            columns.forEach(each => {
                if (each.label.indexOf(key) > -1) {
                    each.zl_state = 'source';
                }
            })
        });
    }
    return { columns, tableData: newData }
};

export const processingModule = (data, itemData, mark) => {
    let { module, paramObj } = itemData;
    if (module.type === 'replace-word') {
        return replaceWord(data, paramObj, mark);
    } else if (module.type === 'delete-word') {
        return deleteWord(data, paramObj, mark);
    } else if (module.type === 'insert-word') {
        return insertWordFun(data, paramObj, mark);
    } else if (module.type === 'columns-into-array') {
        return columnsIntoArray(data, paramObj, mark);
    } else if (module.type === 'columns-into-object') {
        return columnsIntoObj(data, paramObj, mark);
    } else if (module.type === 'columns-delete') {
        return deleteColumns(data, paramObj, mark);
    } else if (module.type === 'to-lower-case') {
        return toLowerCase(data, paramObj, mark);
    } else if (module.type === 'to-upper-case') {
        return toUpperCase(data, paramObj, mark);
    } else if (module.type === 'date-time-format') {
        return dateTimeFormat(data, paramObj, mark);
    } else if (module.type === 'split-position') {
        return splitPosition(data, paramObj, mark);
    } else if (module.type === 'split-word') {
        return splitWord(data, paramObj, mark);
    }
}