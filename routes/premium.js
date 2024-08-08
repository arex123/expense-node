const express = require('express')
const premiumController = require('../controller/premium')
const { authenticate } = require('../middleware/auth')
const router = express.Router()

router.get('/showLeaderboard',authenticate,premiumController.showLeaderboard)

module.exports = router