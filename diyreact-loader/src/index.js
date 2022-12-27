const diyreact = require('diyreact-transpiler');
module.exports = function (source) {
    return diyreact.compile(source);
}
