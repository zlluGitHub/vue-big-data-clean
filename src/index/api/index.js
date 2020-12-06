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
        url: '/dataClear/get/update',
        method: 'post',
        data
    })
}
