let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let SchemaClass = new Schema({}, { strict: false });

// 输出(导出);
module.exports = mongoose.model('min_cshis', SchemaClass);
