import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product';

dotenv.config();

const testProducts = [
  {
    name: 'NVIDIA GeForce RTX 4080',
    category: 'GPU',
    currentPrice: 1299000,
    lowestPrice: 1199000,
    highestPrice: 1499000,
    priceHistory: [
      {
        price: 1499000,
        date: new Date('2024-01-01')
      },
      {
        price: 1299000,
        date: new Date('2024-03-01')
      }
    ],
    url: 'https://example.com/rtx4080',
    lastUpdated: new Date()
  },
  {
    name: 'AMD Ryzen 9 7950X',
    category: 'CPU',
    currentPrice: 799000,
    lowestPrice: 749000,
    highestPrice: 899000,
    priceHistory: [
      {
        price: 899000,
        date: new Date('2024-01-01')
      },
      {
        price: 799000,
        date: new Date('2024-03-01')
      }
    ],
    url: 'https://example.com/ryzen7950x',
    lastUpdated: new Date()
  },
  {
    name: 'Samsung 990 PRO 2TB',
    category: 'SSD',
    currentPrice: 249000,
    lowestPrice: 229000,
    highestPrice: 299000,
    priceHistory: [
      {
        price: 299000,
        date: new Date('2024-01-01')
      },
      {
        price: 249000,
        date: new Date('2024-03-01')
      }
    ],
    url: 'https://example.com/990pro2tb',
    lastUpdated: new Date()
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pc_parts');
    console.log('MongoDB에 연결되었습니다.');

    // 기존 데이터 삭제
    await Product.deleteMany({});
    console.log('기존 데이터가 삭제되었습니다.');

    // 테스트 데이터 추가
    await Product.insertMany(testProducts);
    console.log('테스트 데이터가 추가되었습니다.');

    await mongoose.disconnect();
    console.log('MongoDB 연결이 종료되었습니다.');
  } catch (error) {
    console.error('데이터베이스 시드 오류:', error);
    process.exit(1);
  }
};

seedDatabase(); 