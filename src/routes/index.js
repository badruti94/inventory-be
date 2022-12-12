const express = require('express')
const router = express.Router()
const authRoute = require('../routes/auth')
const itemRoute = require('../routes/item')
const reportRoute = require('../routes/report')


router.use('/auth', authRoute)
router.use('/items', itemRoute)
router.use('/reports', reportRoute)


module.exports = router