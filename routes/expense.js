
const express = require('express');

const expenseRouter = require('../controller/expense');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', expenseRouter.showForm);

router.post('/submit-form',authenticate, expenseRouter.submitForm);

router.get('/getAll',authenticate,expenseRouter.getAll)

router.delete('/remove/:id',authenticate,expenseRouter.removeExpenseById)

module.exports = router;