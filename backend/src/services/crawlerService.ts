import * as puppeteer from 'puppeteer';
import Product from '../models/Product';

interface Selectors {
  products: string;
  name: string;
  price: string;
  link: string;
  category?: string;
}

interface Website {
  name: string;
  url: string;
  selectors: Selectors;
}

interface CrawledProduct {
  name: string;
  category: string;
  currentPrice: number;
  url: string;
  currency: string;
}

const websites: Website[] = [
  {
    name: '퀘이사존',
    url: 'https://quasarzone.com/bbs/qb_saleinfo',
    selectors: {
      products: '.market-info-list-cont',
      name: '.subject-link',
      price: '.text-orange',
      link: '.subject-link',
      category: '.category'
    }
  },
  {
    name: '에펨코리아',
    url: 'https://www.fmkorea.com/index.php?mid=hotdeal&category=1254381811',
    selectors: {
      products: '.fm_best_widget li:not(.notice)',
      name: '.title a',
      price: '.hotdeal_info',
      link: '.title a',
      category: '.category'
    }
  }
];

async function crawlWebsite(browser: puppeteer.Browser, website: Website): Promise<CrawledProduct[]> {
  const page = await browser.newPage();
  console.log(`크롤링 시작: ${website.name}`);
  
  try {
    // 브라우저 탐지 우회를 위한 설정
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');
    
    // 사이트별 특수 헤더 설정
    if (website.name === 'ZOD') {
      await page.setExtraHTTPHeaders({
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Pragma': 'no-cache',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1'
      });

      console.log(`ZOD 페이지 로딩 중: ${website.url}`);
      
      // 페이지 로드
      await page.goto(website.url, { 
        waitUntil: ['domcontentloaded', 'networkidle0'],
        timeout: 30000
      });

      // 페이지가 완전히 로드될 때까지 대기
      await page.waitForSelector('.board-list tbody tr', { timeout: 20000 })
        .catch(() => console.log('ZOD 게시글을 찾을 수 없습니다.'));

      // 스크롤 수행
      await autoScroll(page);

      // 추가 대기 시간
      await new Promise(resolve => setTimeout(resolve, 3000));

    } else {
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Referer': 'https://www.google.com/'
      });

      console.log(`페이지 로딩 중: ${website.url}`);

      // 리소스 차단 설정
      await page.setRequestInterception(true);
      page.on('request', (request) => {
        const blockedResourceTypes = ['image', 'stylesheet', 'font', 'media'];
        if (blockedResourceTypes.includes(request.resourceType())) {
          request.abort();
        } else {
          request.continue();
        }
      });
      
      if (website.name === '에펨코리아') {
        await page.goto(website.url, {
          waitUntil: 'networkidle0',
          timeout: 60000
        });
        await new Promise(resolve => setTimeout(resolve, 3000));
      } else {
        await page.goto(website.url, { 
          waitUntil: ['domcontentloaded', 'networkidle0'],
          timeout: 45000
        });
      }
    }
    
    console.log('페이지 로드 완료, 대기 시작');
    
    // 선택자 대기 시간 증가
    await page.waitForSelector(website.selectors.products, { timeout: 20000 })
      .catch(() => console.log('선택자를 찾을 수 없습니다:', website.selectors.products));
    
    // 동적 로딩을 위한 빠른 스크롤
    console.log('스크롤 시작');
    await autoScroll(page);
    
    // 추가 대기 시간
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('제품 정보 추출 시작');
    const products = await page.evaluate((selectors: Selectors, siteName: string) => {
      const items = document.querySelectorAll(selectors.products);
      
      const results = Array.from(items).map((item) => {
        const nameEl = item.querySelector(selectors.name);
        const priceEl = item.querySelector(selectors.price);
        const linkEl = item.querySelector(selectors.link) || item.querySelector('a');
        
        // 카테고리 추출 로직 추가
        let category = '';
        if (siteName === '에펨코리아') {
          const categoryEl = item.querySelector('.category');
          category = categoryEl?.textContent?.trim() || '';
          console.log('에펨코리아 카테고리:', category);
        } else if (siteName === '퀘이사존') {
          const categoryEl = item.querySelector('.category');
          category = categoryEl?.textContent?.trim() || '';
        } else if (siteName === 'ZOD') {
          category = 'PC/하드웨어'; // ZOD는 이미 PC 하드웨어 카테고리 페이지를 크롤링
        }
        
        let name = nameEl?.textContent?.trim() || '';
        let priceText = priceEl?.textContent?.trim() || '';
        
        // 가격과 통화 정보 추출
        let currency = 'KRW';
        let price = 0;

        if (siteName === '퀘이사존') {
          // 퀘이사존 가격 추출 로직
          const dollarMatch = priceText.match(/\$?\s*([\d,.]+)\s*(?:달러|USD|\$)/i);
          const yenMatch = priceText.match(/¥?\s*([\d,.]+)\s*(?:엔|JPY|¥)/i);
          
          if (dollarMatch) {
            price = parseFloat(dollarMatch[1].replace(/,/g, ''));
            currency = 'USD';
          } else if (yenMatch) {
            price = parseFloat(yenMatch[1].replace(/,/g, ''));
            currency = 'JPY';
          } else {
            const wonMatch = priceText.match(/([\d,]+)(?:\s*원)?/);
            if (wonMatch) {
              price = parseInt(wonMatch[1].replace(/,/g, ''), 10);
            }
          }
        } else if (siteName === 'ZOD') {
          // ZOD 가격 추출 로직
          const priceMatch = priceText.match(/([\d,]+)(?:\s*원)?/);
          if (priceMatch) {
            price = parseInt(priceMatch[1].replace(/,/g, ''), 10);
          }
          
          // 달러나 엔화 가격이 있는지 확인
          if (name.includes('$') || name.includes('달러')) {
            const dollarMatch = name.match(/\$?\s*([\d,.]+)/);
            if (dollarMatch) {
              price = parseFloat(dollarMatch[1].replace(/,/g, ''));
              currency = 'USD';
            }
          } else if (name.includes('¥') || name.includes('엔')) {
            const yenMatch = name.match(/¥?\s*([\d,.]+)/);
            if (yenMatch) {
              price = parseFloat(yenMatch[1].replace(/,/g, ''));
              currency = 'JPY';
            }
          }
        } else if (siteName === '에펨코리아') {
          // 에펨코리아 가격 추출 개선
          const priceMatch = priceText.match(/[\d,]+(?=원)/);  // '원' 앞의 숫자만 추출
          if (priceMatch) {
            price = parseInt(priceMatch[0].replace(/,/g, ''), 10);
            // 가격이 비정상적으로 낮은 경우 (1000원 미만) 무시
            if (price < 1000) {
              price = 0;
            }
          }
        }
        
        const url = linkEl?.getAttribute('href') || '';
        const fullUrl = url.startsWith('http') ? url : 
                       siteName === 'ZOD' ? `https://zod.kr${url}` :
                       siteName === '에펨코리아' ? `https://www.fmkorea.com${url}` :
                       `${window.location.origin}${url}`;
        
        return {
          name: name.replace(/\n/g, ' ').trim(),
          category,
          currentPrice: price,
          url: fullUrl,
          currency
        };
      });

      // 카테고리 기반 필터링
      return results.filter(product => {
        if (siteName === '에펨코리아') {
          // PC제품 카테고리 페이지에서는 모든 제품 포함
          return true;
        } else if (siteName === '퀘이사존') {
          return product.category === 'PC/하드웨어';
        } else if (siteName === 'ZOD') {
          // ZOD는 이미 PC 하드웨어 카테고리 페이지를 크롤링
          return true;
        }
        return true;
      });
    }, website.selectors, website.name);

    const filteredProducts = products.filter((p: CrawledProduct) => p.name && p.currentPrice > 0);
    console.log(`필터링 후 남은 제품 수: ${filteredProducts.length}`);
    return filteredProducts;
  } catch (error) {
    console.error(`${website.name} 크롤링 중 오류:`, error);
    return [];
  } finally {
    await page.close();
  }
}

// 자동 스크롤 함수 최적화
async function autoScroll(page: puppeteer.Page): Promise<void> {
  await page.evaluate(() => {
    return new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 300; // 스크롤 거리 증가
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        
        if(totalHeight >= scrollHeight){
          clearInterval(timer);
          resolve();
        }
      }, 50); // 스크롤 간격 감소
    });
  });
}

export async function startCrawling(): Promise<string> {
  console.log('크롤링 프로세스 시작');
  const browser = await puppeteer.launch({
    headless: true,  // headless 모드 활성화
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1920x1080',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
      '--disable-blink-features=AutomationControlled'
    ]
  });

  try {
    // 병렬로 크롤링 실행
    const crawlingPromises = websites.map(website => crawlWebsite(browser, website));
    const productsArrays = await Promise.all(crawlingPromises);
    const allProducts = productsArrays.flat();

    console.log(`총 크롤링된 제품 수: ${allProducts.length}`);

    // 데이터베이스 업데이트도 병렬로 처리
    await Promise.all(allProducts.map(async (product) => {
      const existingProduct = await Product.findOne({ url: product.url });
      
      if (existingProduct) {
        if (existingProduct.currentPrice !== product.currentPrice) {
          existingProduct.priceHistory.push({
            price: existingProduct.currentPrice,
            date: existingProduct.lastUpdated
          });
          
          existingProduct.currentPrice = product.currentPrice;
          existingProduct.lastUpdated = new Date();
          
          if (product.currentPrice < existingProduct.lowestPrice) {
            existingProduct.lowestPrice = product.currentPrice;
          }
          if (product.currentPrice > existingProduct.highestPrice) {
            existingProduct.highestPrice = product.currentPrice;
          }
          
          await existingProduct.save();
        }
      } else {
        await Product.create({
          ...product,
          lowestPrice: product.currentPrice,
          highestPrice: product.currentPrice,
          priceHistory: [{
            price: product.currentPrice,
            date: new Date()
          }],
          lastUpdated: new Date()
        });
      }
    }));

    return `${allProducts.length}개의 제품이 크롤링되었습니다.`;
  } finally {
    await browser.close();
  }
}