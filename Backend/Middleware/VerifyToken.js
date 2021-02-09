const JWT = require("jsonwebtoken")

module.exports = (req, res, next) => {
    const token = req.headers.token
    req.token=token
    const user_id=req.headers.user_id
    next()
    
}

