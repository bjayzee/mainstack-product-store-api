import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { sendResponse } from '../config/helper';

const JWT_SECRET = process.env.JWT_SECRET as string;

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]; 

    if (!token) {
        return sendResponse(res, httpStatus.UNAUTHORIZED, false, "Authorization token is required");
    }

    try {

        const decoded = jwt.verify(token, JWT_SECRET) as {id: string, email: string};
        req.user = decoded; 
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return sendResponse(res, httpStatus.UNAUTHORIZED, false, "Token has expired");
        } else {
            return sendResponse(res, httpStatus.UNAUTHORIZED, false, "Invalid token");
        }
    }
};
