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
}