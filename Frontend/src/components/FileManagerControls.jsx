import React from 'react';

import { Box, Button, InputAdornment, MenuItem, Stack, TextField } from '@mui/material';

const sortOptions = [
  { label: 'Name', value: 'name' },
  { label: 'Date', value: 'date' },
  { label: 'Size', value: 'size' },
];

const fileTypeOptions = [
  { label: 'All', value: 'all' },
  { label: 'Image', value: 'image' },
  { label: 'PDF', value: 'pdf' },
  { label: 'Document', value: 'doc' },
];

const FileManagerControls = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  fileType,
  onFileTypeChange,
  onFileUpload,
}) => {
  return (
    <Box
      p={3}
      borderRadius={3}
      boxShadow={2}
      bgcolor="background.paper"
      sx={{ maxWidth: '100%' }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
      >
        {/* Search Input */}
        <TextField
          variant="outlined"
          placeholder="Search filename"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {/* <Search /> */}
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 220 }}
        />

        {/* Sort Dropdown */}
        <TextField
          select
          label="Sort By"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          variant="outlined"
          sx={{ minWidth: 150 }}
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
          label="File Type"
          value={fileType}
          onChange={(e) => onFileTypeChange(e.target.value)}
          variant="outlined"
          sx={{ minWidth: 150 }}
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
        //   startIcon={<Upload />}
          sx={{ minWidth: 140 }}
        >
          Upload File
          <input
            type="file"
            hidden
            onChange={onFileUpload}
          />
        </Button>
      </Stack>
    </Box>
  );
};

export default FileManagerControls;
