var express = require('express');
var router = express.Router();

var userRouter = require('./user.js');
var entryRouter = require('./entry.js');
var peopleRouter = require('./people.js');

router.use('/user/', userRouter);
router.use('/entry/', entryRouter);
// router.use('/people/', peopleRouter);

module.exports = router;
