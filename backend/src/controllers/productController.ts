import { Request, Response } from 'express';
import Product, { IProduct } from '../models/Product';
import { startCrawling } from '../services/crawlerService';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find().sort({ lastUpdated: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: '제품 목록을 가져오는데 실패했습니다.' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: '제품을 찾을 수 없습니다.' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || '서버 오류가 발생했습니다.' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = new Product(req.body);
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error: any) {
    res.status(400).json({ message: error.message || '잘못된 요청입니다.' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: '제품을 찾을 수 없습니다.' });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message || '잘못된 요청입니다.' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (product) {
      res.json({ message: '제품이 삭제되었습니다.' });
    } else {
      res.status(404).json({ message: '제품을 찾을 수 없습니다.' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || '서버 오류가 발생했습니다.' });
  }
};

export const startCrawlingProducts = async (req: Request, res: Response) => {
  try {
    const message = await startCrawling();
    res.json({ message });
  } catch (error) {
    res.status(500).json({ message: '크롤링 시작에 실패했습니다.' });
  }
};

export const resetDatabase = async (req: Request, res: Response) => {
  try {
    await Product.deleteMany({});
    res.json({ message: '데이터베이스가 초기화되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '데이터베이스 초기화 중 오류가 발생했습니다.' });
  }
}; 