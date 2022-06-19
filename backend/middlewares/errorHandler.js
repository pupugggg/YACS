const ErrorWithStatusCode = require('../util/ErrorWithStatusCode')
const errorHandler = (err,req,res,next) =>{
    let statusCode = res.statusCode!==200 ? res.statusCode : 500
    if(err instanceof ErrorWithStatusCode){
        statusCode = err.status
    }
    res.status(statusCode)
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })
}

module.exports = errorHandler