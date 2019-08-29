let time = new Date();

const logger = (req,res,next) => {
    console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}:${time.toLocaleDateString()}`);
    next();
};

module.exports = logger;