import { Request, Response } from 'express'
import { createProductValidattion } from "../config/validations";
import httpStatus from "http-status";
import { createProduct, deleteProductById, getAllProducts, getAllProductsWithLimits, getProductById, getProductByName, updateProductById } from "../models/products";
import { sendResponse } from "../config/helper";


export const saveProduct = async(req: Request, res: Response) => {
    try {

        const { error } = await createProductValidattion.validateAsync(req.body);
        if(error){
            return sendResponse(res, httpStatus.BAD_REQUEST, false, error.message)
        }


        const product = await createProduct(req.body);

        return sendResponse(res, httpStatus.CREATED, true, "product created successfully", product)        
    } catch (error) {
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, "An unxpected error has occured");
    }
}

export const fetchProductById = async (req: Request, res: Response) =>{
    try {
        const { id } = req.params;

        const product = await getProductById(id);

        return sendResponse(res, httpStatus.OK, true, "Product ffetched successfully", product);
    } catch (error) {
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, "An unexpected error has occured");
    }
}

export const fetchProductByName = async (req: Request, res: Response) =>{
    try {
        const { name } = req.query;
        if (!name || typeof name !== 'string') {
            return sendResponse(res, httpStatus.BAD_REQUEST, false, 'Product name is required as a query parameter');
        }

        const product = await getProductByName(name);

        return sendResponse(res, httpStatus.OK, true, "Product fetched successfully", product);
    } catch (error) {
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, "An unexpected error has occured");
    }
}

export const fetchAllProducts = async(req: Request, res: Response) =>{
    try {

        const products = await getAllProducts();

        return sendResponse(res, httpStatus.OK, true, "Products feteched successfully", products);        
    } catch (error) {
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, "An unexpected error has occured")
    }
}

export const fetchAllProductsByLimit = async(req: Request, res: Response) =>{
    try {

        const limit = parseInt(req.query.limit as string, 10) || 10;
        const offset = parseInt(req.query.offset as string, 10) || 0;

        if (limit < 0 || offset < 0) {
            return sendResponse(res, httpStatus.BAD_REQUEST, false, "Limit and offset must be non-negative numbers");
        }

        const products = await getAllProductsWithLimits(limit, offset);

        return sendResponse(res, httpStatus.OK, true, "Products feteched successfully", products);        
        
    } catch (error) {
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, "An unexpected error has occured");
    }
}

export const deleteProduct = async(req: Request, res: Response) =>{
    try {
        const { id } = req.params;

        const product = await getProductById(id);
            if (!product) {
                return sendResponse(res, httpStatus.NOT_FOUND, false, "Product not found");
            }


        const deleteProduct = await deleteProductById(id);

        return sendResponse(res, httpStatus.OK, true, "Products deleted successfully", deleteProduct);        
    } catch (error) {
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, "An unexpected error has occured");
    }
}

export const updateProduct = async (req: Request, res: Response) =>{
    try {
        const { id } = req.params;

        const product = await updateProductById(id, req.body);

        return sendResponse(res, httpStatus.OK, true, "Products updated successfully", product);        
    } catch (error) {
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, "An unexpected error has occured");
    }
}