import { Router } from "express";
import products from "./products";
import authentication from "./authentication";

const router = Router();
export default (): Router =>{
    products(router);
    authentication(router);
    
    return router;
}