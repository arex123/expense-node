
const express = require('express');

const purchaseRouter = require('../controller/purchase');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/premium', authenticate,purchaseRouter.purchasePremium);
router.post('/updateTransaction', authenticate,purchaseRouter.updateTransaction);


module.exports = router;