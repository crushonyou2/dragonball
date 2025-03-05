import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import express from 'express';
import productRoutes from '../routes/productRoutes';

const app = express();
app.use(express.json());
app.use('/api/products', productRoutes);

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Product API', () => {
  const testProduct = {
    name: 'Test GPU',
    category: 'GPU',
    currentPrice: 599.99,
    lowestPrice: 599.99,
    highestPrice: 699.99,
    priceHistory: [
      {
        price: 599.99,
        date: new Date()
      }
    ],
    url: 'https://example.com/test-gpu'
  };

  it('should create a new product', async () => {
    const response = await request(app)
      .post('/api/products')
      .send(testProduct);

    expect(response.status).toBe(201);
    expect(response.body.name).toBe(testProduct.name);
  });

  it('should get all products', async () => {
    const response = await request(app)
      .get('/api/products');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });
}); 