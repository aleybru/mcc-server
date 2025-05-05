// routes/index.js
const { Router } = require('express');

const authRoutes = require('./auth');
const userRoutes = require('./users');
const messageRoutes = require('./messages');
const uploadRoutes = require('./uploads');
const websiteRoutes = require('./website');

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/messages', messageRoutes);
router.use('/uploads', uploadRoutes);
router.use('/', websiteRoutes); // Home, landing, etc.

module.exports = router;
