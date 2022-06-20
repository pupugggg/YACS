const short = require('short-uuid')
const generateKey = ()=>{
    const translator = short()
    return translator.generate()
}
module.exports = {generateKey}