// middlewares/logger.js
const logger = (req, res, next) => {
    console.log(`[${req.method}] ${req.originalUrl}`);
    console.log(`Headers:`, req.headers);
    console.log(`Body:`, req.body);
    next();
};
module.exports = logger;
