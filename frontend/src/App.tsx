import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Container } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import ProductList from './components/ProductList';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FF6B6B',
      light: '#FF8E53',
      dark: '#E85D5D',
      contrastText: '#fff'
    },
    secondary: {
      main: '#FF8E53',
      light: '#FFA776',
      dark: '#E67B40',
      contrastText: '#fff'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          '&:hover': {
            background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
            boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
          },
        },
        contained: {
          background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #E85D5D 30%, #E67B40 90%)',
          },
        }
      }
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          '& .MuiPaginationItem-root': {
            '&.Mui-selected': {
              background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
              color: '#fff',
              '&:hover': {
                background: 'linear-gradient(45deg, #E85D5D 30%, #E67B40 90%)',
              }
            }
          }
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(255, 107, 107, 0.1)',
          }
        }
      }
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Container>
          <Routes>
            <Route path="/" element={<ProductList />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
