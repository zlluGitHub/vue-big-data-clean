const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
// const dataBase = require("../schema");
// const dataBase = require("../schema/indexWz");
const dataBase = require("../schema/min_cshis");

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

// 批量修改数据
router.post('/get/update', (req, res, next) => {
    let { columns, replace } = req.body;
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
                dataArr.forEach(item => {
                    let obj = {}
                    columns.forEach(key => {
                        obj[key] = item[key]
                        replace.forEach(repObj => {
                            obj[key] = obj[key].replace(new RegExp(repObj.source, 'g'), repObj.target)
                        });
                    })
                    dataBase.updateOne({ _id: item._id }, { $set: obj }, (err, data) => {
                        if (err) {
                            console.log(err);
                        } else {
                            // console.log("更新成功!");
                        }
                    });
                })
                res.json({ update_count: dataArr.length, result: true, code: 200 });
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
})

module.exports = router;