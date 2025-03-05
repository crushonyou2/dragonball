import mongoose from 'mongoose';
import Product from '../src/models/Product';

async function resetDatabase() {
  try {
    // MongoDB 연결
    await mongoose.connect('mongodb://localhost:27017/dragonball');
    console.log('MongoDB에 연결되었습니다.');
    
    // Product 컬렉션 삭제
    await mongoose.connection.collection('products').drop();
    console.log('제품 컬렉션이 삭제되었습니다.');
    
    // 새로운 컬렉션 생성
    await Product.createCollection();
    console.log('새로운 제품 컬렉션이 생성되었습니다.');
    
    // 현재 제품 수 확인
    const count = await Product.countDocuments();
    console.log(`현재 제품 수: ${count}`);
    
  } catch (error) {
    if ((error as any).code === 26) {
      console.log('제품 컬렉션이 이미 비어있습니다.');
    } else {
      console.error('데이터베이스 초기화 중 오류:', error);
      process.exit(1);
    }
  } finally {
    // 연결 종료
    await mongoose.disconnect();
    console.log('MongoDB 연결이 종료되었습니다.');
    process.exit(0);
  }
}

resetDatabase(); 