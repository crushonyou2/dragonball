import React, { useState } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
  onSearchChange: (value: string) => void;
}

export default function SearchBar({ onSearchChange }: SearchBarProps) {
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = () => {
    onSearchChange(searchInput);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="검색어를 입력하세요"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <IconButton 
        onClick={handleSearch}
        color="primary"
        sx={{ p: '10px' }}
        aria-label="검색"
      >
        <SearchIcon />
      </IconButton>
    </Box>
  );
} 