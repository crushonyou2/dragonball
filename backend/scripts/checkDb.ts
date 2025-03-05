import mongoose from 'mongoose';
import Product from '../src/models/Product';

async function checkDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/dragonball');
    console.log('MongoDB에 연결되었습니다.');
    
    const count = await Product.countDocuments();
    console.log(`현재 제품 수: ${count}`);
    
    if (count > 0) {
      const products = await Product.find().limit(5);
      console.log('\n처음 5개 제품:');
      products.forEach(product => {
        console.log(`- ${product.name} (${product.currentPrice}원)`);
      });
    }
    
    await mongoose.disconnect();
    console.log('\nMongoDB 연결이 종료되었습니다.');
    process.exit(0);
  } catch (error) {
    console.error('데이터베이스 확인 중 오류:', error);
    process.exit(1);
  }
}

checkDatabase(); 