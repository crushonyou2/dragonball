import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  startCrawlingProducts,
  resetDatabase
} from '../controllers/productController';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.post('/crawl', startCrawlingProducts);
router.post('/reset', resetDatabase);

export default router; 