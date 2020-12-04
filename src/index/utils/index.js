
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

export function windowSize() {
    let winW = 0, winH = 0;
    if (window.innerHeight) {
        // all except IE
        winW = window.innerWidth;
        winH = window.innerHeight;
    } else if (document.documentElement && document.documentElement.clientHeight || document.documentElement.clientWidth) {
        // IE 6 Strict Mode
        winW = document.documentElement.clientWidth;
        winH = document.documentElement.clientHeight;
    } else if (document.body) {
        // other
        winW = document.body.clientWidth;
        winH = document.body.clientHeight;
    }
    return { winW, winH }
}
