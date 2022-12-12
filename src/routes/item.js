const express = require('express')
const { getItems, createItem, deleteItem, itemIn, itemOut } = require('../controllers/item')
const { isLogin } = require('../middleware/auth')
const router = express.Router()

router.get('/', isLogin, getItems)
router.post('/', isLogin, createItem)
router.delete('/:id', isLogin, deleteItem)
router.post('/:id/in', isLogin, itemIn)
router.post('/:id/out', isLogin, itemOut)



module.exports = router