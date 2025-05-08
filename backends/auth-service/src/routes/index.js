const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const promotionRoutes = require('./promotion.routes');


router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/promotion', promotionRoutes);

module.exports = router;