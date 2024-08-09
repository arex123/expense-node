const express = require('express')
const router = express.Router()
const userController = require('../controller/user')

router.get('/showLogin',userController.showLogin)
router.post('/submitLogin',userController.submitLogin)
router.get('/signup',userController.showSignup)
router.post('/signup',userController.createUser)
router.post('/password/forgotpassword',userController.forgetPsd)

module.exports = router