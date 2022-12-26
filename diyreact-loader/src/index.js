const diyreact = require('diyreact-parser');
module.exports = function (source) {
    return diyreact.compile(source);
}
