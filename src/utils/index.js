
// 判定要克隆的对象是不是引用类型，如果是引用类型，则继续迭代,如果该项是基本类型，则直接复制。
export function deepClone(obj) {
    let newObj = Array.isArray(obj) ? [] : {}

    if (obj && typeof obj === "object") {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                newObj[key] = (obj && typeof obj[key] === 'object') ? deepClone(obj[key]) : obj[key];
            }
        }
    }
    return newObj
}