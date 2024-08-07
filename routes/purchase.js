
const express = require('express');

const purchaseRouter = require('../controller/purchase');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/purchase/premium', authenticate,purchaseRouter.purchasePremium);


module.exports = router;