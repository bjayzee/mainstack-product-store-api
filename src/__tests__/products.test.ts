import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { 
    saveProduct, 
    fetchProductById, 
    fetchProductByName, 
    fetchAllProducts, 
    fetchAllProductsByLimit, 
    deleteProduct, 
    updateProduct 
} from '../controllers/products'; 
import { createProduct, deleteProductById, getAllProducts, getProductById, getProductByName, updateProductById, getAllProductsWithLimits } from '../models/products';
import { sendResponse } from '../config/helper';

jest.mock('../models/products', () => ({
    createProduct: jest.fn(),
    deleteProductById: jest.fn(),
    getAllProducts: jest.fn(),
    getProductById: jest.fn(),
    getProductByName: jest.fn(),
    updateProductById: jest.fn(),
    getAllProductsWithLimits: jest.fn(),
}));

jest.mock('../config/helper', () => ({
    sendResponse: jest.fn(),
}));

jest.mock('../config/validations', () => ({
    createProductValidattion: {
        validateAsync: jest.fn().mockResolvedValue({}), // Mock successful validation
    },
}));

const mockRequest = (body = {}, params = {}, query = {}) => {
    return {
        body,
        params,
        query,
    } as Request;
};

const mockResponse = () => {
    const res: Partial<Response> = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
    };
    return res as Response;
};

describe('Product Controller', () => {
    describe('saveProduct', () => {
        it('should create a product successfully', async () => {
            const req = mockRequest({ name: 'Product A', price: 100 });
            const res = mockResponse();
            const product = { id: 1, name: 'Product A', price: 100 };
    
            (createProduct as jest.Mock).mockResolvedValue(product); // Ensure this is mocked
            await saveProduct(req, res);
            
            expect(sendResponse).toHaveBeenCalledWith(res, httpStatus.CREATED, true, "product created successfully", product);
        });


        it('should return a 500 error on unexpected error', async () => {
            const req = mockRequest({ name: 'Product A', price: 100 });
            const res = mockResponse();

            (createProduct as jest.Mock).mockRejectedValue(new Error("Unexpected Error"));

            await saveProduct(req, res);

            expect(sendResponse).toHaveBeenCalledWith(res, httpStatus.INTERNAL_SERVER_ERROR, false, "An unxpected error has occured");
        });
    });

    describe('fetchProductById', () => {
        it('should fetch product by id successfully', async () => {
            const req = mockRequest({}, { id: '1' });
            const res = mockResponse();
            const product = { id: 1, name: 'Product A', price: 100 };

            (getProductById as jest.Mock).mockResolvedValue(product);
            await fetchProductById(req, res);

            expect(sendResponse).toHaveBeenCalledWith(res, httpStatus.OK, true, "Product ffetched successfully", product);
        });

        it('should return a 500 error on unexpected error', async () => {
            const req = mockRequest({}, { id: '1' });
            const res = mockResponse();

            (getProductById as jest.Mock).mockRejectedValue(new Error("Unexpected Error"));

            await fetchProductById(req, res);

            expect(sendResponse).toHaveBeenCalledWith(res, httpStatus.INTERNAL_SERVER_ERROR, false, "An unexpected error has occured");
        });
    });

    describe('fetchProductByName', () => {
        it('should fetch product by name successfully', async () => {
            const req = mockRequest({}, {}, { name: 'Product A' });
            const res = mockResponse();
            const product = { id: 1, name: 'Product A', price: 100 };

            (getProductByName as jest.Mock).mockResolvedValue(product);
            await fetchProductByName(req, res);

            expect(sendResponse).toHaveBeenCalledWith(res, httpStatus.OK, true, "Product fetched successfully", product);
        });

        it('should return a 400 error if name is not provided', async () => {
            const req = mockRequest({}, {}, { });
            const res = mockResponse();

            await fetchProductByName(req, res);

            expect(sendResponse).toHaveBeenCalledWith(res, httpStatus.BAD_REQUEST, false, 'Product name is required as a query parameter');
        });

        it('should return a 500 error on unexpected error', async () => {
            const req = mockRequest({}, {}, { name: 'Product A' });
            const res = mockResponse();

            (getProductByName as jest.Mock).mockRejectedValue(new Error("Unexpected Error"));

            await fetchProductByName(req, res);

            expect(sendResponse).toHaveBeenCalledWith(res, httpStatus.INTERNAL_SERVER_ERROR, false, "An unexpected error has occured");
        });
    });

    describe('fetchAllProducts', () => {
        it('should fetch all products successfully', async () => {
            const req = mockRequest();
            const res = mockResponse();
            const products = [{ id: 1, name: 'Product A', price: 100 }];

            (getAllProducts as jest.Mock).mockResolvedValue(products);
            await fetchAllProducts(req, res);

            expect(sendResponse).toHaveBeenCalledWith(res, httpStatus.OK, true, "Products feteched successfully", products);
        });

        it('should return a 500 error on unexpected error', async () => {
            const req = mockRequest();
            const res = mockResponse();

            (getAllProducts as jest.Mock).mockRejectedValue(new Error("Unexpected Error"));

            await fetchAllProducts(req, res);

            expect(sendResponse).toHaveBeenCalledWith(res, httpStatus.INTERNAL_SERVER_ERROR, false, "An unexpected error has occured");
        });
    });

    describe('fetchAllProductsByLimit', () => {
        it('should fetch products with limit and offset successfully', async () => {
            const req = mockRequest({}, {}, { limit: '10', offset: '0' });
            const res = mockResponse();
            const products = [{ id: 1, name: 'Product A', price: 100 }];

            (getAllProductsWithLimits as jest.Mock).mockResolvedValue(products);
            await fetchAllProductsByLimit(req, res);

            expect(sendResponse).toHaveBeenCalledWith(res, httpStatus.OK, true, "Products feteched successfully", products);
        });

        it('should return a 400 error if limit or offset are negative', async () => {
            const req = mockRequest({}, {}, { limit: '-1', offset: '-1' });
            const res = mockResponse();

            await fetchAllProductsByLimit(req, res);

            expect(sendResponse).toHaveBeenCalledWith(res, httpStatus.BAD_REQUEST, false, "Limit and offset must be non-negative numbers");
        });

        it('should return a 500 error on unexpected error', async () => {
            const req = mockRequest({}, {}, { limit: '10', offset: '0' });
            const res = mockResponse();

            (getAllProductsWithLimits as jest.Mock).mockRejectedValue(new Error("Unexpected Error"));

            await fetchAllProductsByLimit(req, res);

            expect(sendResponse).toHaveBeenCalledWith(res, httpStatus.INTERNAL_SERVER_ERROR, false, "An unexpected error has occured");
        });
    });

    describe('deleteProduct', () => {
        it('should delete a product successfully', async () => {
            const req = mockRequest({}, { id: '1' });
            const res = mockResponse();
            const product = { id: 1, name: 'Product A', price: 100 };

            (getProductById as jest.Mock).mockResolvedValue(product);
            (deleteProductById as jest.Mock).mockResolvedValue(true);
            await deleteProduct(req, res);

            expect(sendResponse).toHaveBeenCalledWith(res, httpStatus.OK, true, "Products deleted successfully", true);
        });

        it('should return a 404 error if product not found', async () => {
            const req = mockRequest({}, { id: '1' });
            const res = mockResponse();

            (getProductById as jest.Mock).mockResolvedValue(null);
            await deleteProduct(req, res);

            expect(sendResponse).toHaveBeenCalledWith(res, httpStatus.NOT_FOUND, false, "Product not found");
        });

        it('should return a 500 error on unexpected error', async () => {
            const req = mockRequest({}, { id: '1' });
            const res = mockResponse();

            (getProductById as jest.Mock).mockResolvedValue({});
            (deleteProductById as jest.Mock).mockRejectedValue(new Error("Unexpected Error"));

            await deleteProduct(req, res);

            expect(sendResponse).toHaveBeenCalledWith(res, httpStatus.INTERNAL_SERVER_ERROR, false, "An unexpected error has occured");
        });
    });

    describe('updateProduct', () => {
        it('should update a product successfully', async () => {
            const req = mockRequest({ name: 'Updated Product' }, { id: '1' });
            const res = mockResponse();
            const updatedProduct = { id: 1, name: 'Updated Product', price: 100 };

            (updateProductById as jest.Mock).mockResolvedValue(updatedProduct);
            await updateProduct(req, res);

            expect(sendResponse).toHaveBeenCalledWith(res, httpStatus.OK, true, "Products updated successfully", updatedProduct);
        });

        it('should return a 500 error on unexpected error', async () => {
            const req = mockRequest({ name: 'Updated Product' }, { id: '1' });
            const res = mockResponse();

            (updateProductById as jest.Mock).mockRejectedValue(new Error("Unexpected Error"));

            await updateProduct(req, res);

            expect(sendResponse).toHaveBeenCalledWith(res, httpStatus.INTERNAL_SERVER_ERROR, false, "An unexpected error has occured");
        });
    });
});
