const express = require('express')
const { getReport } = require('../controllers/reports')
const { isLogin } = require('../middleware/auth')
const router = express.Router()

router.get('/', isLogin, getReport)

module.exports = router