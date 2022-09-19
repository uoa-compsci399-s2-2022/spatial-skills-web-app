import jwt from "jsonwebtoken";
import APIError from "./APIError.js";
import dotenv from "dotenv";
dotenv.config();

const jwtHandler = async (req,res,next) => {
    // Look for authorisation header 
    const authHeader = req.headers.authorization || req.headers.Authorization;

    // Check for standardised auth header
    if (!authHeader?.startsWith('Bearer ')){
        return next(
            new APIError("Invalid authorization header.", 400)
        );
    }

    const accessToken = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        req.username = decoded.UserInfo.username;
        req.permissions = decoded.UserInfo.permissions;

    } catch (e){
        return next(new APIError("Unauthorised.", 401));
    }

    next(); //call next middleware
}

export default jwtHandler;