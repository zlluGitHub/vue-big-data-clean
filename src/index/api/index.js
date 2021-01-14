import { request } from '../utils/request';

// 获取数据列表
export function reqGetData(data) {
    return request({
        url: '/dataClear/get/data',
        method: 'get',
        params: data
    })
}

//数据统计信息
export function reqQualityStatistics() {
    return request({
        url: '/dataClear/get/qualityStatistics',
        method: 'get'
    })
}

//获取字段统计信息
export function reqKeyStatistics(key) {
    return request({
        url: '/dataClear/get/keyStatistics',
        method: 'get',
        params: { key }
    })
}
// 更新替换内容
export function reqUpdate(data) {
    return request({
        url: '/dataClear/update/data',
        method: 'post',
        data
    })
}

// 删除字符内容
export function reqDelete(data) {
    return request({
        url: '/dataClear/delete/data',
        method: 'post',
        data
    })
}

// 插入字符内容
export function reqInsert(data) {
    return request({
        url: '/dataClear/insert/data',
        method: 'post',
        data
    })
}

// 添加数据内容
export function reqAdd(data) {
    return request({
        url: '/dataClear/add/data',
        method: 'post',
        data
    })
}
// 将字符转化成小写
export function reqToLowerCase(data) {
    return request({
        url: '/dataClear/toLowerCase/data',
        method: 'post',
        data
    })
}

// 将字符转化成大写
export function reqToUpperCase(data) {
    return request({
        url: '/dataClear/toUpperCase/data',
        method: 'post',
        data
    })
}
// 日期时间格式转化
export function reqDateTimeFormat(data) {
    return request({
        url: '/dataClear/dateTimeFormat/data',
        method: 'post',
        data
    })
}
// 根据字位置拆分
export function reqSplitPosition(data) {
    return request({
        url: '/dataClear/splitPosition/data',
        method: 'post',
        data
    })
}
// 根据字符或字符串拆分
export function reqSplitWord(data) {
    return request({
        url: '/dataClear/splitWord/data',
        method: 'post',
        data
    })
}
// 根据字符或字符串合并
export function reqMergeColumns(data) {
    return request({
        url: '/dataClear/mergeColumns/data',
        method: 'post',
        data
    })
}