
const express = require('express');

const formRouter = require('../controller/form')

const router = express.Router();

router.get('/', formRouter.showForm);

router.post('/submit-form', formRouter.submitForm);

router.get('/getAll',formRouter.getAll)

router.delete('/remove/:id',formRouter.removeExpenseById)

module.exports = router;