import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyUser = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        return next(errorHandler(401, "You need to login"));
    }

    jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return next(errorHandler(401, "You need to login"));
        } else {
            req.user = user;
            next();
        }
    });
};
