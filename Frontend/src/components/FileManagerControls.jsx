import React from 'react';
import { Box, Button, InputAdornment, MenuItem, Stack, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SortIcon from '@mui/icons-material/Sort';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

const sortOptions = [
  { label: 'Date: Newest First', value: 'newest' },
  { label: 'Date: Oldest First', value: 'oldest' },
  { label: 'File Size: Smallest First', value: 'lowSize' },
  { label: 'File Size: Largest First', value: 'highSize' },
];

const fileTypeOptions = [
  { label: 'All', value: 'all' },
  { label: 'Image', value: 'image' },
  { label: 'PDF', value: 'pdf' },
  { label: 'Document', value: 'doc' },
];

const FileManagerControls = ({ filters, onFilterChange, onFileUpload }) => {
  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: '#fff',
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      <Box
        sx={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: { xs: 2, sm: 3 },
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 2, md: 3 }}
          alignItems={{ xs: 'stretch', md: 'center' }}
        >
          {/* Search Input */}
          <TextField
            size="small"
            placeholder="Search files..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#666' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              flex: { md: 1 },
              backgroundColor: '#f8f9fa',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'transparent',
                },
                '&:hover fieldset': {
                  borderColor: 'transparent',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                  borderWidth: 1,
                },
              },
            }}
          />

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{
              flex: { md: '0 0 auto' },
            }}
          >
            {/* Sort Dropdown */}
            <TextField
              select
              size="small"
              value={filters.sort}
              onChange={(e) => onFilterChange('sort', e.target.value)}
              SelectProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SortIcon sx={{ color: '#666', mr: 1 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                minWidth: { xs: '100%', sm: '140px' },
                backgroundColor: '#f8f9fa',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'transparent',
                  },
                  '&:hover fieldset': {
                    borderColor: 'transparent',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                    borderWidth: 1,
                  },
                },
              }}
            >
              {sortOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            {/* File Type Dropdown */}
            <TextField
              select
              size="small"
              value={filters.type}
              onChange={(e) => onFilterChange('type', e.target.value)}
              SelectProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterAltIcon sx={{ color: '#666', mr: 1 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                minWidth: { xs: '100%', sm: '140px' },
                backgroundColor: '#f8f9fa',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'transparent',
                  },
                  '&:hover fieldset': {
                    borderColor: 'transparent',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                    borderWidth: 1,
                  },
                },
              }}
            >
              {fileTypeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            {/* Upload Button */}
            <Button
              variant="contained"
              component="label"
              startIcon={<UploadFileIcon />}
              sx={{
                height: '40px',
                textTransform: 'none',
                px: 3,
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
                minWidth: { xs: '100%', sm: 'auto' },
              }}
            >
              Upload
              <input
                type="file"
                hidden
                onChange={onFileUpload}
                accept="image/*,.pdf,.doc,.docx"
              />
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default FileManagerControls;
