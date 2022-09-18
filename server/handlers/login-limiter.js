import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
    window: 60*1000, //Limit number of login attempts to 5 per minute (60*1000ms)
    max: 5,
    message: {
        message: 'Too many login attempts. Tyry again after 1 minute.'
    },
    handler: (req,res,next,options) => {
        res.status(options.statusCode).json(options.message);
    },
    standardHeaders: true, // Rate limit infor in 'RateLimit-*' header
    legacyHeaders: false,
})

export default loginLimiter