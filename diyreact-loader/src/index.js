const diyreact = require('diyreact-parser');
const {loader} = require('./loader')
module.exports = function (source) {
    return loader(source);
}
