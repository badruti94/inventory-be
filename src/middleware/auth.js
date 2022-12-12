const jwt = require('jsonwebtoken')

exports.isLogin = (req, res, next) => {
    const authorizationHeader = req.header('Authorization')
    if (!authorizationHeader) {
        return res.status(403).send({
            message: 'No token found'
        })
    }

    const token = authorizationHeader.split(' ')[1]
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY)
        req.userId = decoded.userId
        next()
    } catch (error) {
        return res.status(403).send({
            message: 'Token is invalid'
        })
    }
}

