let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let SchemaClass = new Schema({
    // porjecName: {
    //     type: String,
    //     default: ""
    // }
});

// 输出(导出);
module.exports = mongoose.model('cshis', SchemaClass);
