# 드래곤볼 - PC 부품 가격 비교 사이트

PC 부품 가격을 여러 커뮤니티에서 실시간으로 크롤링하여 보여주는 웹 애플리케이션입니다.

## 주요 기능

- 실시간 PC 부품 가격 정보 크롤링
- 퀘이사존, 에펨코리아의 핫딜 정보 수집
- 사용자 친화적인 UI로 정보 제공
- 가격순 정렬 및 페이지네이션 기능

## 기술 스택

- Frontend: React, Material-UI
- Backend: Node.js, Express, TypeScript
- Database: MongoDB
- 크롤링: Puppeteer

## 설치 방법

1. 저장소 클론
```bash
git clone https://github.com/crushonyou2/dragonball.git
cd dragonball
```

2. 백엔드 설치 및 실행
```bash
cd backend
npm install
npm run dev
```

3. 프론트엔드 설치 및 실행
```bash
cd frontend
npm install
npm start
```

## 환경 설정

백엔드 `.env` 파일 설정:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dragonball
```

## 라이선스

MIT License 