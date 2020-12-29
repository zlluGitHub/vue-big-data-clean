export const moduleConfig = {
    infoTatistics: {
        title: "数据统计信息",
        type: "data-tatistics",
    },
    delete:{
        title: "删除列数据",
        type: "columns-delete",
    },

    arrAndObj: [
        {
            title: "将列嵌套到数组中",
            type: "columns-into-array",
        },
        {
            title: "将列嵌套到对象中",
            type: "columns-into-object",
        },
        // {
        //     title: "将元素嵌套到列中",
        //     type: "columns-into-object",
        // },
        // {
        //     title: "将元素转化成对象",
        //     type: "columns-into-object",
        // },
        // {
        //     title: "将匹配值提取到数组",
        //     type: "columns-into-object",
        // },
        // {
        //     title: "将匹配值提取到对象",
        //     type: "columns-into-object",
        // },
    ],
    repInsWord: [
        {
            title: "批量替换指定元素",
            type: "replace-word",
        },
        {
            title: "批量删除指定元素",
            type: "delete-word",
        },
        {
            title: "批量插入指定元素",
            type: "insert-word",
        },
    ],
    format: [
        {
            title: "转化为大写",
            type: "to-upper-case",
        },
        {
            title: "转化为小写",
            type: "to-lower-case",
        },
        {
            title: "更改日期时间格式",
            type: "date-time-format",
        },
        // {
        //     title: "更改时间格式",
        //     type: "insert-replace",
        // },
        // {
        //     title: "更改日期时间格式",
        //     type: "insert-replace",
        // },
        // {
        //     title: "自定义日期时间格式",
        //     type: "insert-replace",
        // },
    ],
   
    split: [
        {
            title: "根据字符或字符串拆分",
            type: "split-word",
        },
        // {
        //     title: "两个定界符之间拆分",
        //     type: "insert-replace",
        // },
        {
            title: "根据字符位置拆分",
            type: "split-position",
        },
    ]
}