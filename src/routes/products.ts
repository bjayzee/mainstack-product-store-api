import { Router } from 'express';
import { saveProduct, fetchAllProducts, fetchAllProductsByLimit, 
    fetchProductByName, fetchProductById, updateProduct, deleteProduct } from '../controllers/products';
import { isAuthenticated } from '../middlewares';

export default (router: Router) => {
    router.post('/products', isAuthenticated, saveProduct);
    router.get('/products', isAuthenticated, fetchAllProducts);
    router.get('/products/paginated', isAuthenticated, fetchAllProductsByLimit);
    router.get('/products/name', isAuthenticated, fetchProductByName);
    router.get('/products/:id', isAuthenticated, fetchProductById);
    router.patch('/products/:id', isAuthenticated, updateProduct);
    router.delete('/products/:id', isAuthenticated, deleteProduct);
}
