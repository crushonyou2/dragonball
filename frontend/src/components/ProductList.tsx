import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { Grid, Container, Typography, CircularProgress, Box, Pagination, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Product, productApi } from '../services/api';
import ProductCard from './ProductCard';
import SearchBar from './SearchBar';

const ITEMS_PER_PAGE = 12; // 페이지당 표시할 아이템 수

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [crawling, setCrawling] = useState(false);
  const [page, setPage] = useState(1);
  const initialFetchDone = useRef(false);

  const startCrawling = async () => {
    try {
      setCrawling(true);
      const response = await fetch('http://localhost:5000/api/products/crawl', {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('크롤링 시작에 실패했습니다');
      }

      // 크롤링 완료 후 바로 제품 목록을 가져옵니다
      const data = await productApi.getProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error('크롤링 중 오류:', err);
      setError(err instanceof Error ? err.message : '크롤링 중 오류가 발생했습니다');
    } finally {
      setCrawling(false);
    }
  };

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await productApi.getProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '제품을 불러오는 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  }, []);

  // 컴포넌트 마운트 시에만 제품 목록을 가져옵니다
  useEffect(() => {
    if (!initialFetchDone.current) {
      initialFetchDone.current = true;
      fetchProducts();
    }
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setPage(1);
  }, []);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleRefresh = () => {
    startCrawling();
  };

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;

    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  // 현재 페이지의 제품들
  const currentProducts = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, page]);

  // 총 페이지 수
  const pageCount = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ px: 4, py: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        pb: 2,
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <img src="/dragonball-logo.png" alt="드래곤볼 로고" style={{ height: '45px', width: 'auto' }} />
          <Typography 
            variant="h5" 
            component="h2" 
            sx={{
              fontFamily: "'Noto Sans KR', sans-serif",
              fontWeight: 700,
              fontSize: '1.8rem',
              background: 'linear-gradient(45deg, #FF6B6B, #FF8E53)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
            }}
          >
            드래곤볼
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {crawling ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} />
              <Typography variant="body2" color="textSecondary">
                최신 정보 수집 중...
              </Typography>
            </Box>
          ) : (
            <IconButton onClick={handleRefresh} title="새로고침">
              <RefreshIcon />
            </IconButton>
          )}
        </Box>
      </Box>
      <Container maxWidth="xl">
        <SearchBar onSearchChange={handleSearchChange} />
        <Grid container spacing={3}>
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <Grid item key={product._id} xs={12} sm={6} md={4}>
                <ProductCard product={product} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography align="center" color="textSecondary">
                검색 결과가 없습니다.
              </Typography>
            </Grid>
          )}
        </Grid>
        {pageCount > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
            <Pagination 
              count={pageCount} 
              page={page} 
              onChange={handlePageChange}
              color="primary"
              size="large"
            />
          </Box>
        )}
      </Container>
    </Box>
  );
} 