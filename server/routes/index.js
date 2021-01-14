const express = require("express");
const router = express.Router();
const moment = require('moment');//导入文件
// const path = require("path");
const fs = require("fs");
const dataBase = require("../schema");
// const dataBase = require("../schema/indexWz");
// const dataBase = require("../schema/min_cshis");

// 获取所有数据
router.get('/get/data', (req, res, next) => {
    let { pageSize, pageNo, page_id, _id, bid } = req.query;

    pageSize = pageSize ? pageSize * 1 : 200;
    pageNo = pageNo ? pageNo * 1 - 1 : 0;
    let filter = {};
    if (page_id) {
        filter._id = { $gt: page_id };
        pageNo = 0
    };
    if (_id) {
        filter._id = _id;
        pageNo = 0
    };
    if (bid) {
        filter.bid = bid;
        pageNo = 0
    };

    let p1 = new Promise((resolve, reject) => {
        dataBase.find(filter, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        }).skip(pageNo * pageSize).limit(pageSize)
    })

    let p2 = new Promise((resolve, reject) => {
        dataBase.find().count(function (err, count) {
            if (err) {
                reject(err)
            } else {
                resolve(count)
            }
        })
    })

    Promise.all([p1, p2]).then((result) => {
        res.json({ data: result[0], count: result[1], code: 200 });
    }).catch((error) => {
        console.log(error)
        res.json({ result: false, code: 500 });
    })
})


// 获取数据质量统计信息
router.get('/get/qualityStatistics', (req, res, next) => {
    const dataQualityStatistics = (jsonData) => {
        jsonData = JSON.parse(JSON.stringify(jsonData))
        let keyArr = [];
        for (const key in jsonData[0]) {
            keyArr.push(key);
        }
        let newObj = {}
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

        });
        // console.log(newObj);
        return newObj
    }
    dataBase.find({}, { _id: 0 }, (err, data) => {
        if (err) {
            console.log('错误信息：', err);
            res.json({ result: false, code: 500 });
        } else {
            res.json({ data: dataQualityStatistics(data), code: 200 });
        }
    })



    // dataBase.find().count(function(err, count) {
    //     res.json({ data: count, code: 200 });
    // })
    // 读取package.json
    function readFileIn() {
        // console.log('正在读取原package.json中...');
        // logger.log(sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss') + '：' + '正在读取原package.json中...');
        return fs.readFileSync(config.rootPath + config.projectName + config.packagePath + "/package.json", function (err, data) {
            if (err) {
                console.log("文件读取失败 in：" + err);
                logger.log(sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss') + '：' + "文件读取失败 in！");
                return false;
            } else {
                // console.log("文件读取成功！in");
                // logger.log(sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss') + '：' + "文件读取成功！in");
                return data.toString()
            }
        });
    }

})
// 获取字段统计信息
router.get('/get/keyStatistics', (req, res, next) => {
    let { key } = req.query;
    const repeatTime = (arr, tatol) => {
        let object = arr.reduce(function (prev, next) {
            prev[next] = (prev[next] + 1) || 1;
            return prev;
        }, {});
        let newArr = [];
        for (let key in object) {
            newArr.push({
                type: key,
                count: object[key],
                tatol,
                percentage: object[key] / tatol * 100
            })
        };
        return newArr
    };

    const dataQualityStatistics = (jsonData) => {
        jsonData = JSON.parse(JSON.stringify(jsonData))
        let keyArr = [];
        for (const key in jsonData[0]) {
            keyArr.push(key);
        }
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

            frequencyObj[key] = repeatTime(timeArr, jsonData.length);
        });
        return frequencyObj
    };

    let limitObj = {
        _id: 0
    };
    if (key) {
        limitObj[key] = 1;
    }
    dataBase.find({}, limitObj, (err, data) => {
        if (err) {
            console.log('错误信息：', err);
            res.json({ result: false, code: 500 });
        } else {
            res.json({ data: dataQualityStatistics(data), code: 200 });
        }
    })

})

// 修改替换数据
router.post('/update/data', (req, res, next) => {
    let { type, content } = req.body;

    if (type === 'one') {
        let { _id, key, value } = content;
        let obj = {};
        obj[key] = value;
        dataBase.updateOne({ _id }, { $set: obj }, (err, data) => {
            if (err) {
                console.log(err);
                res.json({ result: false, code: 500, mas: "未找到匹配项！" });
            } else {
                res.json({ result: true, code: 200, mas: "更新成功！" });
            }
        });
    } else if (type === 'more') {
        let { columns, replace } = content;
        // console.log(columns, replace);
        let filterArr = [];
        if (columns && replace) {
            columns.forEach(key => {
                let filterObj = {}, regExp = "";
                replace.forEach(obj => {
                    regExp = '|' + obj.source + regExp
                })
                regExp = regExp.slice(1, regExp.length);
                filterObj[key] = { $regex: new RegExp(`${regExp}`, 'gi') }
                filterArr.push(filterObj)
            });
            if (filterArr.length !== 0) {
                let promise = new Promise((resolve, reject) => {
                    dataBase.find({ $or: filterArr }, (err, data) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(JSON.parse(JSON.stringify(data)))
                        }
                    })
                });
                promise.then(dataArr => {
                    // console.log(dataArr);
                    let countObj = {
                        tatol: 0, success: 0, error: 0
                    };
                    if (dataArr.length) {
                        dataArr.forEach(item => {
                            let obj = {}
                            columns.forEach(key => {
                                obj[key] = item[key]
                                replace.forEach(repObj => {
                                    obj[key] = obj[key].replace(new RegExp(repObj.source, 'gi'), repObj.target)
                                });
                            })
                            dataBase.updateOne({ _id: item._id }, { $set: obj }, (err, data) => {
                                if (err) {
                                    countObj.tatol = countObj.tatol + 1;
                                    countObj.error = countObj.error + 1;
                                    if (countObj.tatol === dataArr.length) {
                                        callBack(dataArr.length, countObj.success, countObj.error)
                                    }

                                } else {
                                    countObj.tatol = countObj.tatol + 1;
                                    countObj.success = countObj.success + 1;
                                    if (countObj.tatol === dataArr.length) {
                                        callBack(dataArr.length, countObj.success, countObj.error)
                                    };
                                }
                            });

                        });
                    } else {
                        callBack(0, 0, 0);
                    }

                    function callBack(tatol, success, error) {
                        if (countObj.tatol === countObj.success) {
                            res.json({ tatol, success, error, result: true, code: 200 });
                        } else {
                            res.json({ tatol, success, error, result: false, code: 500 });
                        }

                    }
                }, err => {
                    console.log('错误信息：', err);
                    res.json({ result: false, code: 500 });
                })
            } else {
                res.json({ result: false, code: 500, mas: "未找到匹配项！" });
            }
        } else {
            res.json({ result: false, code: 500, mas: "暂未选择任何替换参数！" });
        }
    }
})

// 修改删除数据
router.post('/delete/data', (req, res, next) => {
    let { type, content } = req.body;

    if (type === 'column') {
        let { columns } = content;
        dataBase.find({}, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                data = JSON.parse(JSON.stringify(data));

                let countObj = {
                    tatol: 0, success: 0, error: 0
                };
                data.forEach((item, i) => {
                    let obj = {}

                    columns.forEach(key => {
                        obj[key] = "";
                    });
                    // console.log(obj);
                    dataBase.updateOne({ _id: item._id }, { $unset: obj }, (err) => {
                        resCallBack(err, countObj, data, res);
                    });
                });
            }
        })




        // let { _id, key, value } = content;
        // let obj = {};
        // obj[key] = value;
        // dataBase.updateOne({ _id }, { $set: obj }, (err, data) => {
        //     if (err) {
        //         console.log(err);
        //         res.json({ result: false, code: 500, mas: "未找到匹配项！" });
        //     } else {
        //         res.json({ result: true, code: 200, mas: "更新成功！" });
        //     }
        // });

    } else if (type === 'word') {
        let { columns, word } = content;
        // console.log(columns, word);
        let filterArr = [];
        if (columns && word) {
            columns.forEach(key => {
                let filterObj = {}, regExp = "";
                word.forEach(val => {
                    regExp = '|' + val + regExp
                })
                regExp = regExp.slice(1, regExp.length);
                filterObj[key] = { $regex: new RegExp(`${regExp}`, 'gi') }
                filterArr.push(filterObj)
            });
            // console.log(filterArr);
            if (filterArr.length !== 0) {
                let promise = new Promise((resolve, reject) => {
                    dataBase.find({ $or: filterArr }, (err, data) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(JSON.parse(JSON.stringify(data)))
                        }
                    })
                });
                promise.then(dataArr => {
                    let countObj = {
                        tatol: 0, success: 0, error: 0
                    };

                    dataArr.forEach(item => {
                        let obj = {}
                        columns.forEach(key => {
                            obj[key] = item[key]
                            word.forEach(repObj => {
                                obj[key] = obj[key].replace(new RegExp(repObj, 'gi'), "")
                            });
                        })
                        dataBase.updateOne({ _id: item._id }, { $set: obj }, (err, data) => {
                            if (err) {
                                countObj.tatol = countObj.tatol + 1;
                                countObj.error = countObj.error + 1;
                                if (countObj.tatol === dataArr.length) {
                                    callBack(dataArr.length, countObj.success, countObj.error)
                                }

                            } else {
                                countObj.tatol = countObj.tatol + 1;
                                countObj.success = countObj.success + 1;
                                if (countObj.tatol === dataArr.length) {
                                    callBack(dataArr.length, countObj.success, countObj.error)
                                };
                            }
                        });
                        function callBack(tatol, success, error) {
                            if (countObj.tatol === countObj.success) {
                                res.json({ tatol, success, error, result: true, code: 200 });
                            } else {
                                res.json({ tatol, success, error, result: false, code: 500 });
                            }

                        }
                    });
                }, err => {
                    console.log('错误信息：', err);
                    res.json({ result: false, code: 500 });
                })
            } else {
                res.json({ result: false, code: 500, mas: "未找到匹配项！" });
            }
        } else {
            res.json({ result: false, code: 500, mas: "暂未选择任何替换参数！" });
        }
    }
})

// 插入数据
router.post('/insert/data', (req, res, next) => {
    let { type, content } = req.body;

    if (type === 'columns') {
        // let { _id, key, value } = content;
        // let obj = {};
        // obj[key] = value;
        // dataBase.updateOne({ _id }, { $set: obj }, (err, data) => {
        //     if (err) {
        //         console.log(err);
        //         res.json({ result: false, code: 500, mas: "未找到匹配项！" });
        //     } else {
        //         res.json({ result: true, code: 200, mas: "更新成功！" });
        //     }
        // });
    } else if (type === 'word') {
        let { columnArr, insertWord, insertWordObj, matchRules } = content;
        // console.log(columns, word);
        let countObj = {
            tatol: 0, success: 0, error: 0
        };
        if (matchRules === 'start') {

            dataBase.find({}, (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    data = JSON.parse(JSON.stringify(data));
                    data.forEach(item => {
                        let obj = {}
                        columnArr.forEach(key => {
                            obj[key] = insertWord + item[key];
                        })
                        dataBase.updateOne({ _id: item._id }, { $set: obj }, (err) => {
                            resCallBack(err, countObj, data, res);
                        });
                    })
                }
            })

        } else if (matchRules === 'end') {

            dataBase.find({}, (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    data = JSON.parse(JSON.stringify(data));
                    data.forEach(item => {
                        let obj = {}
                        columnArr.forEach(key => {
                            obj[key] = item[key] + insertWord
                        })
                        dataBase.updateOne({ _id: item._id }, { $set: obj }, (err) => {
                            resCallBack(err, countObj, data, res);
                        });
                    });
                }
            })

        } else if (matchRules === 'position') {

            dataBase.find({}, (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    data = JSON.parse(JSON.stringify(data));
                    data.forEach(item => {
                        let obj = {}
                        columnArr.forEach(key => {
                            obj[key] = item[key].slice(0, insertWordObj.front) +
                                insertWord +
                                item[key].slice(insertWordObj.after, item[key].length);
                        })
                        dataBase.updateOne({ _id: item._id }, { $set: obj }, (err) => {
                            resCallBack(err, countObj, data, res);
                        });
                    });
                }
            })

        } else if (matchRules === 'between') {
            let filterArr = [];
            columnArr.forEach(key => {
                let filterObj = {}
                let regExp = insertWordObj.front + insertWordObj.after;
                // word.forEach(val => {
                // regExp = '&&' + val + regExp
                // })
                // regExp = regExp.slice(1, regExp.length);
                filterObj[key] = { $regex: new RegExp(`${regExp}`, 'i') }
                filterArr.push(filterObj)
            });


            let promise = new Promise((resolve, reject) => {
                dataBase.find({ $or: filterArr }, (err, data) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(JSON.parse(JSON.stringify(data)))
                    }
                })
            });
            promise.then(dataArr => {
                // console.log(dataArr);
                dataArr.forEach(item => {
                    let obj = {}
                    columnArr.forEach(key => {
                        obj[key] = item[key].replace(new RegExp(insertWordObj.front + insertWordObj.after, 'gi'), insertWordObj.front + insertWord + insertWordObj.after)
                    })
                    dataBase.updateOne({ _id: item._id }, { $set: obj }, (err, data) => {
                        resCallBack(err, countObj, dataArr, res);
                    });
                });
            }, err => {
                console.log('错误信息：', err);
                res.json({ result: false, code: 500 });
            })

        }


    }
})


// 插入新字段数据
router.post('/add/data', (req, res, next) => {
    let { type, content } = req.body;

    if (type === 'columns') {
        // let { _id, key, value } = content;
        // let obj = {};
        // obj[key] = value;
        // dataBase.updateOne({ _id }, { $set: obj }, (err, data) => {
        //     if (err) {
        //         console.log(err);
        //         res.json({ result: false, code: 500, mas: "未找到匹配项！" });
        //     } else {
        //         res.json({ result: true, code: 200, mas: "更新成功！" });
        //     }
        // });
    } else if (type === 'field_arr') {
        let { columnArr, columnName } = content;
        dataBase.find({}, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                data = JSON.parse(JSON.stringify(data));

                let countObj = {
                    tatol: 0, success: 0, error: 0
                };
                columnName = columnName ? columnName : 'column_name';
                data.forEach((item, i) => {
                    let itemObj = {}, newArr = [];
                    columnArr.forEach((key, index) => {
                        if (item[key]) {
                            newArr.push(item[key]);
                        };
                    });
                    itemObj[columnName] = JSON.stringify(newArr)

                    dataBase.updateOne({ _id: item._id }, { $set: itemObj }, (err) => {
                        resCallBack(err, countObj, data, res);
                    });

                });
            }
        })
    } else if (type === 'field_obj') {
        let { columnArr, columnName } = content;
        dataBase.find({}, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                data = JSON.parse(JSON.stringify(data));

                let countObj = {
                    tatol: 0, success: 0, error: 0
                };
                columnName = columnName ? columnName : 'column_name';
                data.forEach((item, i) => {
                    let itemObj = {}, newObj = {};
                    columnArr.forEach((key, index) => {
                        if (item[key]) {
                            newObj[key] = item[key];
                        };
                    });
                    itemObj[columnName] = JSON.stringify(newObj)

                    dataBase.updateOne({ _id: item._id }, { $set: itemObj }, (err) => {
                        resCallBack(err, countObj, data, res);
                    });

                });
            }
        })
    }
})

// 将字符转化成小写
router.post('/toLowerCase/data', (req, res, next) => {
    let { columnArr } = req.body;
    let countObj = {
        tatol: 0, success: 0, error: 0
    };
    dataBase.find({}, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            data = JSON.parse(JSON.stringify(data));
            data.forEach(item => {
                let obj = {}
                columnArr.forEach(key => {
                    obj[key] = item[key].toLowerCase()
                })
                dataBase.updateOne({ _id: item._id }, { $set: obj }, (err) => {
                    resCallBack(err, countObj, data, res);
                });
            });
        }
    })
})

// 将字符转化成大写
router.post('/toUpperCase/data', (req, res, next) => {
    let { columnArr } = req.body;
    let countObj = {
        tatol: 0, success: 0, error: 0
    };
    dataBase.find({}, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            data = JSON.parse(JSON.stringify(data));
            data.forEach(item => {
                let obj = {}
                columnArr.forEach(key => {
                    obj[key] = item[key].toUpperCase()
                })
                dataBase.updateOne({ _id: item._id }, { $set: obj }, (err) => {
                    resCallBack(err, countObj, data, res);
                });
            });
        }
    })
})

// 日期时间格式转化
router.post('/dateTimeFormat/data', (req, res, next) => {
    let { columnArr, formatType } = req.body;
    let countObj = {
        tatol: 0, success: 0, error: 0
    };
    dataBase.find({}, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            data = JSON.parse(JSON.stringify(data));
            data.forEach(item => {
                let obj = {}
                columnArr.forEach(key => {
                    let newText = moment(item[key]).format(formatType);
                    if (newText !== 'Invalid date') {
                        obj[key] = newText;
                    } else {
                        obj[key] = item[key]
                    }
                })
                dataBase.updateOne({ _id: item._id }, { $set: obj }, (err) => {
                    resCallBack(err, countObj, data, res);
                });
            });
        }
    })
})

// 根据字符位置拆分
router.post('/splitPosition/data', (req, res, next) => {
    let { columnArr, positionArr, isNotSplit } = req.body;
    let countObj = {
        tatol: 0, success: 0, error: 0
    };
    dataBase.find({}, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            data = JSON.parse(JSON.stringify(data));

            data.forEach((item, i) => {
                let obj = {};
                let unsetObj = {};
                columnArr.forEach((key, index) => {
                    if (isNotSplit === 'no') {
                        unsetObj[key] = "";
                    }
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
                            })
                        }
                    }
                });

                dataBase.updateOne({ _id: item._id }, { $set: obj, $unset: unsetObj }, (err) => {
                    resCallBack(err, countObj, data, res);
                });

            });

        }
    })
})
// 根据字符或字符串拆分
router.post('/splitWord/data', (req, res, next) => {
    let { columnArr, positionArr, isNotSplit } = req.body;
    let countObj = {
        tatol: 0, success: 0, error: 0
    };
    dataBase.find({}, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            data = JSON.parse(JSON.stringify(data));

            data.forEach((item, i) => {
                let obj = {};
                let unsetObj = {};
                columnArr.forEach((key, index) => {
                    if (isNotSplit === 'no') {
                        unsetObj[key] = "";
                    }

                    // let newText = item[key];

                    let textArr = []
                    for (let index = 0; index < positionArr.length; index++) {
                        textArr = item[key].split(new RegExp(positionArr[index], 'gi'));
                    }
                    for (const ik in item) {
                        if (ik === key) {
                            textArr.forEach((text, n) => {
                                obj[key + `_${n + 1}`] = text;
                            })
                        }
                    }
                });

                dataBase.updateOne({ _id: item._id }, { $set: obj, $unset: unsetObj }, (err) => {
                    resCallBack(err, countObj, data, res);
                });

            });

        }
    })
})
// 根据字符或字符串合并
router.post('/mergeColumns/data', (req, res, next) => {
    let { columnArr, columnName, splitWordValue } = req.body;
    let countObj = {
        tatol: 0, success: 0, error: 0
    };
    dataBase.find({}, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            data = JSON.parse(JSON.stringify(data));

            data.forEach((item, i) => {
                let obj = {}, newContent = "";
                columnArr.forEach((key, index) => {
                    if (item[key]) {
                        // newObj[key] = item[key];
                        newContent = newContent + splitWordValue + item[key];
                        columnNamePar = columnName ? columnName : 'column_name';
                    };
                });

                obj[columnNamePar] = newContent.slice(splitWordValue.length, newContent.length);
                dataBase.updateOne({ _id: item._id }, { $set: obj }, (err) => {
                    resCallBack(err, countObj, data, res);
                });

            });

        }
    })
})

// 函数处理部分
function resCallBack(err, countObj, dataArr, res) {

    if (err) {
        countObj.tatol = countObj.tatol + 1;
        countObj.error = countObj.error + 1;
        if (countObj.tatol === dataArr.length) {
            callBack(dataArr.length, countObj.success, countObj.error, res)
        }

    } else {
        countObj.tatol = countObj.tatol + 1;
        countObj.success = countObj.success + 1;
        if (countObj.tatol === dataArr.length) {
            callBack(dataArr.length, countObj.success, countObj.error, res)
        };
    }
    // console.log(countObj, dataArr.length);
}

function callBack(tatol, success, error, res) {
    if (tatol === success) {
        res.json({ tatol, success, error, result: true, code: 200 });
    } else {
        res.json({ tatol, success, error, result: false, code: 500 });
    }
}
module.exports = router;