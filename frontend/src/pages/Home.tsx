import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography } from '@mui/material';
import { Product } from '../types/types';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // TODO: API 호출 구현
    const fetchProducts = async () => {
      try {
        // const response = await axios.get('/api/products');
        // setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        PC 부품 가격 비교
      </Typography>
      <Grid container spacing={3}>
        {loading ? (
          <Typography>로딩 중...</Typography>
        ) : (
          products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              {/* TODO: ProductCard 컴포넌트 구현 */}
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default Home; 