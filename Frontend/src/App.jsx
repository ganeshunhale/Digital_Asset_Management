import React from 'react'
import FileManagerControls from './components/FileManagerControls.jsx';
import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import axios from 'axios';

const App = () => {
  const [filters, setFilters] = useState({
    search: '',
    sort: 'newest',
    type: 'all'
  });
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Only add parameters if they have values
      // const params = new URLSearchParams();
      // if (filters.search) params.append('filename', filters.search);
      // if (filters.sort) params.append('sortBy', filters.sort);
      // if (filters.type !== 'all') params.append('type', filters.type);

      const url = `http://localhost:8000/api/v1/assets/get_assets`;
      const response = await axios.get(url,{
        params: {
          filename: filters.search,
          sortBy: filters.sort,
          type: filters.type
        }
      });
      setAssets(response.data);
    } catch (err) {
      setError('Failed to fetch assets. Please try again later.');
      console.error('Error fetching assets:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch assets when filters change
  useEffect(() => {
    fetchAssets();
  }, [filters]);

  // Handler for all filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Box 
        sx={{ 
          backgroundColor: '#fff',
          borderBottom: '1px solid #e0e0e0',
          mb: 3
        }}
      >
        <Box
          sx={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: { xs: 2, sm: 3 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2
          }}
        >
          <CloudQueueIcon 
            sx={{ 
              fontSize: { xs: 28, sm: 32 },
              color: 'primary.main'
            }} 
          />
          <Typography 
            variant="h1" 
            sx={{
              fontSize: { xs: '1.5rem', sm: '1.75rem' },
              fontWeight: 500,
              color: '#2c3e50',
              textAlign: 'center',
              margin: 0
            }}
          >
            Digital Asset Management
          </Typography>
        </Box>
      </Box>

      <FileManagerControls
        filters={filters}
        onFilterChange={handleFilterChange}
        onFileUpload={(e) => {
          const file = e.target.files[0];
          if (file) {
            console.log('Uploading file:', file.name);
          }
        }}
      />

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {/* Error State */}
      {error && (
        <Box sx={{ textAlign: 'center', mt: 4, color: 'error.main' }}>
          <Typography>{error}</Typography>
        </Box>
      )}

      {/* Assets Display */}
      {!loading && !error && (
        <Box
          sx={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: { xs: 2, sm: 3 },
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {assets.length} assets found
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default App
