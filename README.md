# 드래곤볼 — PC 부품 핫딜 모아보기

**여러 커뮤니티에 흩어진 PC 부품 핫딜을 한 화면에서 비교하는 웹 서비스**

[![Backend](https://img.shields.io/badge/Node.js%20%2B%20Express-TypeScript-3178C6?logo=typescript&logoColor=white)](#기술-스택)
[![Crawler](https://img.shields.io/badge/crawler-Puppeteer-40B5A4?logo=puppeteer&logoColor=white)](#설계-판단)
[![DB](https://img.shields.io/badge/MongoDB-document%20store-47A248?logo=mongodb&logoColor=white)](#기술-스택)
[![Tests](https://img.shields.io/badge/tests-Jest-C21325?logo=jest&logoColor=white)](#테스트)

PC 부품은 커뮤니티 핫딜 게시판마다 따로 올라와서, 값을 비교하려면 **여러 사이트를 각각 돌아야 합니다.**
퀘이사존·에펨코리아·ZOD의 핫딜 글을 수집해 하나의 목록으로 정규화하고, 가격순 정렬과 페이지네이션으로 비교할 수 있게 만들었습니다.

---

## 주요 기능

- 여러 커뮤니티 핫딜 게시판에서 **부품 가격 정보 수집**
- 사이트마다 다른 글 형식을 **공통 스키마로 정규화**해 한 목록에 병합
- 가격순 정렬과 페이지네이션
- 원글로 바로 이동하는 링크 (사이트별 상대·절대 경로 차이 보정)

## 설계 판단

### 정적 요청 대신 브라우저 자동화

대상 게시판이 **로그인 유도·동적 렌더링·봇 차단**을 섞어 쓰고 있어 HTTP 요청만으로는 목록이 비어 옵니다.
Puppeteer로 실제 페이지를 띄워 렌더링된 DOM에서 값을 읽는 쪽을 택했습니다.

### 사이트별 파서를 분리했다

퀘이사존·에펨코리아·ZOD는 **DOM 구조와 링크 형식이 전부 다릅니다.**
사이트 정의를 데이터로 분리하고 파서를 사이트별로 두어, 한 사이트의 마크업이 바뀌어도 다른 수집이 멈추지 않게 했습니다.
링크도 사이트별 상대 경로 규칙을 각각 보정해 절대 URL로 만듭니다.

### 수집과 조회를 분리했다

크롤링은 느리고 실패할 수 있는 작업이라 **요청 때마다 돌리면 응답이 그 실패에 묶입니다.**
수집 결과를 MongoDB에 저장하고 API는 저장된 데이터를 조회하도록 나눴습니다.

## 기술 스택

| 영역 | 기술 |
|---|---|
| 프론트 | React, Material-UI, TypeScript |
| 백엔드 | Node.js, Express, TypeScript |
| 수집 | Puppeteer |
| 저장소 | MongoDB |
| 테스트 | Jest |

## 실행

```bash
git clone https://github.com/crushonyou2/dragonball.git
```

```bash
cd backend && npm install && npm run dev
```

```bash
cd frontend && npm install && npm start
```

## 테스트

```bash
cd backend && npm test
```

## 범위와 조건

- **개인 학습 프로젝트입니다.** 상시 배포·운영은 하지 않습니다.
- 수집 대상은 커뮤니티의 공개 게시판 목록이며, 대상 사이트의 마크업이 바뀌면 파서 수정이 필요합니다.
- 가격 정보는 원글을 그대로 옮긴 것이므로 최종 확인은 원글 링크에서 해야 합니다.

## 만든 사람

**Jigwan Joe** — Backend

- GitHub: [@crushonyou2](https://github.com/crushonyou2)
- Email: jigwan.joe@gmail.com
