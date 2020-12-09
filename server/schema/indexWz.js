let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let SchemaClass = new Schema({
    Name: {
        type: String,
        default: ""
    },
    longitude: {
        type: String,
        default: ""
    },
    latitude: {
        type: String,
        default: ""
    },
    _class: {
        type: String,
        default: ""
    }
});

// 输出(导出);
module.exports = mongoose.model('city_positions', SchemaClass);
