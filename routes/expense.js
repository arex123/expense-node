
const express = require('express');

const expenseRouter = require('../controller/expense')

const router = express.Router();

router.get('/', expenseRouter.showForm);

router.post('/submit-form', expenseRouter.submitForm);

router.get('/getAll',expenseRouter.getAll)

router.delete('/remove/:id',expenseRouter.removeExpenseById)

module.exports = router;