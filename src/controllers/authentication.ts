import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import bcrypt from 'bcryptjs';
import { loginValidation, registerValidattion } from '../config/validations';
import { sendResponse } from '../config/helper';
import { createUser, getUserByEmail } from '../models/users';

const JWT_SECRET = process.env.JWT_SECRET as string;

export const register = async (req: Request, res: Response) => {
    try {
        const { error } = await registerValidattion.validateAsync(req.body);
        
        if(error){
            return sendResponse(res, httpStatus.BAD_REQUEST, false, "input mismatched");
        }

        const { name, email, password } = req.body;

        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return sendResponse(res, httpStatus.CONFLICT, false, "User already exists");
        }

        const newUser = await createUser({ email, password, name });

        return sendResponse(res, httpStatus.CREATED, true, "User registered successfully", newUser);
    } catch (error) {
        // console.log(error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, "An unexpected error occurred");
    }
};

export const login = async (req: Request, res: Response) => {
    try {

        const { error } = await loginValidation.validateAsync(req.body);
        
        if(error){
            return sendResponse(res, httpStatus.BAD_REQUEST, false, "input mismatched");
        }

        const { email, password } = req.body;

        const user = await getUserByEmail(email);
        if (!user) {
            return sendResponse(res, httpStatus.UNAUTHORIZED, false, "Invalid email or password");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return sendResponse(res, httpStatus.UNAUTHORIZED, false, "Invalid email or password");
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        const foundUser = {
            email: user.email,
            name: user.name,
            token: token,
            id: user._id
        }

        return sendResponse(res, httpStatus.OK, true, "login success", foundUser);
    } catch (error) {
        // console.log(error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, "An unexpected error occured");
    }
};
