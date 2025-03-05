import React from 'react';
import { Card, CardContent, Typography, Box, Link, Button } from '@mui/material';
import { Product } from '../services/api';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const getDomainName = (url: string) => {
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      return domain;
    } catch {
      return '알 수 없음';
    }
  };

  const formatPrice = (price: number, currency: string) => {
    switch(currency) {
      case 'USD':
        return `$${price.toLocaleString()} (약 ${Math.round(price * 1350).toLocaleString()}원)`;
      case 'JPY':
        return `¥${price.toLocaleString()} (약 ${Math.round(price * 9).toLocaleString()}원)`;
      default:
        return `${price.toLocaleString()}원`;
    }
  };

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      '& .MuiTypography-root': {
        lineHeight: 1.5
      }
    }}>
      <CardContent sx={{ 
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        pb: 1
      }}>
        <Typography 
          variant="caption" 
          color="text.secondary"
          sx={{
            fontSize: '0.75rem',
            height: '1.5em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {getDomainName(product.url)}
        </Typography>
        <Link
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          color="inherit"
          underline="hover"
          sx={{
            display: 'block',
            mb: 1
          }}
        >
          <Typography 
            variant="subtitle1" 
            component="h2"
            sx={{
              height: '3em',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: '1.5em !important'
            }}
          >
            {product.name.replace(/\n/g, '').trim()}
          </Typography>
        </Link>
        <Box sx={{ mt: 'auto' }}>
          <Typography 
            variant="h6" 
            color="primary"
            sx={{
              fontWeight: 600,
              mb: 1,
              minHeight: product.currency !== 'KRW' ? '3em' : '1.5em'
            }}
          >
            {formatPrice(product.currentPrice, product.currency)}
          </Typography>
          <Button
            component={Link}
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            fullWidth
            size="large"
          >
            구매하기
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
} 