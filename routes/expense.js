
const express = require('express');

const expenseRouter = require('../controller/expense');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/',expenseRouter.showForm);

router.post('/submit-form',authenticate, expenseRouter.submitForm);

router.get('/products',authenticate,expenseRouter.products)

router.delete('/remove/:id',authenticate,expenseRouter.removeExpenseById)

router.get('/download',authenticate,expenseRouter.download)

router.get('/leaderboard',expenseRouter.leaderboard)

module.exports = router;