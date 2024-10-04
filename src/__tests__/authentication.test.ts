import { Request, Response } from "express";
import httpStatus from "http-status";
import { register, login } from '../controllers/authentication'; 
import { sendResponse } from '../config/helper'; 
import { getUserByEmail, createUser } from '../models/users'; 
import { registerValidattion, loginValidation } from '../config/validations'; 

jest.mock('../config/helper', () => ({
    sendResponse: jest.fn(),
}));

jest.mock('../models/users', () => ({
    getUserByEmail: jest.fn(),
    createUser: jest.fn(),
}));

jest.mock('../config/validations', () => ({
    registerValidattion: {
        validateAsync: jest.fn(),
    },
    loginValidation: {
        validateAsync: jest.fn(),
    },
}));

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe("User Authentication", () => {
    const mockRequest = (body: object): Request => ({
        body,
    } as Request);

    const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("User Registration", () => {
        it("should register a user successfully", async () => {
            const req = mockRequest({
                name: "John Doe",
                email: "john@example.com",
                password: "securepassword",
            });

            const existingUser = null; 
            (getUserByEmail as jest.Mock).mockResolvedValue(existingUser);
            (registerValidattion.validateAsync as jest.Mock).mockResolvedValue({});
            const newUser = { id: '1', name: "John Doe", email: "john@example.com" };
            (createUser as jest.Mock).mockResolvedValue(newUser);

            await register(req, mockResponse as Response);

            expect(sendResponse).toHaveBeenCalledWith(mockResponse, httpStatus.CREATED, true, "User registered successfully", newUser);
        });

        it("should return an error if validation fails", async () => {
            const req = mockRequest({
                name: "John Doe",
                email: "invalid-email",
                password: "securepassword",
            });

            (registerValidattion.validateAsync as jest.Mock).mockResolvedValue({
                error: { details: [{ message: "input mismatched" }] },
            });

            await register(req, mockResponse as Response);

            expect(sendResponse).toHaveBeenCalledWith(mockResponse, httpStatus.BAD_REQUEST, false, "input mismatched");
        });

        it("should return an error if user already exists", async () => {
            const req = mockRequest({
                name: "John Doe",
                email: "john@example.com",
                password: "securepassword",
            });

            const existingUser = { id: '1', name: "John Doe", email: "john@example.com" };
            (getUserByEmail as jest.Mock).mockResolvedValue(existingUser);
            (registerValidattion.validateAsync as jest.Mock).mockResolvedValue({});

            await register(req, mockResponse as Response);

            expect(sendResponse).toHaveBeenCalledWith(mockResponse, httpStatus.CONFLICT, false, "User already exists");
        });

        it("should return an error if an unexpected error occurs", async () => {
            const req = mockRequest({
                name: "John Doe",
                email: "john@example.com",
                password: "securepassword",
            });

            (getUserByEmail as jest.Mock).mockImplementation(() => {
                throw new Error("Unexpected error");
            });

            await register(req, mockResponse as Response);

            expect(sendResponse).toHaveBeenCalledWith(mockResponse, httpStatus.INTERNAL_SERVER_ERROR, false, "An unexpected error occurred");
        });
    });
});