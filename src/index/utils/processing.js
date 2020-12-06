import Vue from 'vue';

Vue.prototype.$saveData = function (columns, data) {
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
                tatol:jsonData.length,
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
    console.log(newObj);
    return {
        whole: newObj,// 元素缺失率
        frequency: frequencyObj// 统计数组中元素的重复次数
    }
}

// 批量替换指定元素
export const replaceWord = (newData, option, mark) => {
    let { columnArr, characterArr } = option;
    return newData.map((item, i) => {
        columnArr.forEach((key, index) => {
            let text = item[key];
            if (text) {
                characterArr.forEach((obj) => {
                    let { source, target } = obj;
                    let startIndex = text.indexOf(source);
                    let endIndex = startIndex + source.length;
                    if (startIndex > -1) {
                        if (mark === "view") {
                            text =
                                text.slice(0, startIndex) +
                                (source
                                    ? `<span class="del-highlight">${source}</span>`
                                    : "") +
                                (target
                                    ? `<span class="rep-highlight">${target}</span>`
                                    : "") +
                                text.slice(endIndex, text.length);
                        } else {
                            text =
                                text.slice(0, startIndex) +
                                target +
                                text.slice(endIndex, text.length);
                        }
                    }
                    item[key] = text;
                });
            }
        });
        return item;
    });
};
// 批量删除指定元素
export const deleteWord = (newData, option, mark) => {
    let { columnArr, characterArr } = option;
    return newData.map((item, i) => {
        columnArr.forEach((key, index) => {
            let text = item[key];
            if (text) {
                characterArr.forEach((val) => {
                    let startIndex = text.indexOf(val);
                    let endIndex = startIndex + val.length;
                    if (startIndex > -1) {
                        if (mark === "view") {
                            text =
                                text.slice(0, startIndex) +
                                (val ? `<span class="del-highlight">${val}</span>` : "") +
                                text.slice(endIndex, text.length);
                        } else {
                            text =
                                text.slice(0, startIndex) +
                                text.slice(endIndex, text.length);
                        }
                    }
                    item[key] = text;
                });
            }
        });
        return item;
    });
}

// 批量插入指定元素
export const insertWordFun = (newData, option, mark) => {
    let { columnArr, matchRules, insertWord, insertWordObj } = option;
    return newData.map((item, i) => {
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
                        let startIndex = text.indexOf(insertWordObj.front);
                        let endIndex = text.indexOf(insertWordObj.after);
                        if (startIndex > -1 && endIndex > -1) {
                            //  console.log(startIndex,endIndex);
                            text =
                                text.slice(
                                    0,
                                    startIndex + insertWordObj.front.length
                                ) +
                                (insertWord
                                    ? `<span class="add-highlight">${insertWord}</span>`
                                    : "") +
                                text.slice(endIndex, text.length);
                        }
                    } else if (matchRules === "position") {
                        if (
                            insertWordObj.front * 1 < text.length &&
                            insertWordObj.after * 1 < text.length
                        ) {
                            // console.log( insertWordObj);
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
                        let startIndex = text.indexOf(insertWordObj.front);
                        let endIndex = text.indexOf(insertWordObj.after);
                        if (startIndex > -1 && endIndex > -1) {
                            text =
                                text.slice(
                                    0,
                                    startIndex + insertWordObj.front.length
                                ) +
                                insertWord +
                                text.slice(endIndex, text.length);
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
};

export const columnsIntoArray = (newData, option, mark) => {
    let { columnArr, columnName } = option;
    let columnNamePar = "";
    let newTableData = newData.map((item, i) => {
        let itemObj = {}, newArr = [];
        columnArr.forEach((key, index) => {
            if (item[key]) {
                newArr.push(item[key]);
                columnNamePar = columnName ? columnName : key + '_copy';
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
                columnNamePar = columnName ? columnName : key + '_copy';
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