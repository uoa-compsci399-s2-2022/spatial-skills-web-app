import APIError from "./APIError.js";

const adminAuthHandler = (req,res,next) => {
    if (!req.permissions.includes("admin")){
        return next(new APIError("Forbidden.", 403));
    }
    next();
};

export default adminAuthHandler;
