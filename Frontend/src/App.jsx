import React ,{ useState, useEffect }from 'react'
import FileManagerControls from './components/FileManagerControls.jsx';
import AssetCard from './components/AssetCard.jsx';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Alert, 
  Snackbar, 
  Grid,
  LinearProgress,
} from '@mui/material';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import axios from 'axios';
console.log(import.meta.env.VITE_BACKEND_BASE_URI);
export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URI ,
  headers: {
    'Content-Type': 'application/json',
  }
});

const MAX_FILE_SIZE = 10 * 1024 * 1024; 

const ALLOWED_FILE_TYPES = {
  'image': ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  'video': ['video/mp4', 'video/webm', 'video/quicktime'],
  'pdf': ['application/pdf']
};

const ACCEPTED_FILE_TYPES = Object.values(ALLOWED_FILE_TYPES).flat().join(',');

const App = () => {
  const [filters, setFilters] = useState({
    search: '',
    sort: 'newest',
    type: 'all'
  });
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get('/assets/get_assets', {
        params: {
          filename: filters.search,
          sortBy: filters.sort,
          type: filters.type
        }
      });
      setAssets(response.data.assets);
    } catch (err) {
      setError('Failed to fetch assets. Please try again later.');
      console.error('Error fetching assets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [filters]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setWarning(`File size too large. Maximum size allowed is ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);
      setError(null);
      setWarning(null);

      const formData = new FormData();
      formData.append('file', file);

      await api.post('/assets/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      fetchAssets();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to upload file. Please try again later.';
      setWarning(errorMessage);
      console.error('Error uploading file:', err);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };
  const deleteAndUpdateAssets = (id) => {
    setAssets(prev=>prev.filter(asset => asset._id !== id));
  }

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
        onFileUpload={handleFileUpload}
        acceptedFileTypes={ACCEPTED_FILE_TYPES}
      />

      {(loading || uploading) && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4, gap: 2 }}>
          {uploading ? (
            <>
              <Typography variant="body2" color="text.secondary">
                Uploading... {uploadProgress}%
              </Typography>
              <Box sx={{ width: '200px' }}>
                <LinearProgress variant="determinate" value={uploadProgress} />
              </Box>
            </>
          ) : (
            <CircularProgress />
          )}
        </Box>
      )}
      
      {error && (
        <Box sx={{ textAlign: 'center', mt: 4, color: 'error.main' }}>
          <Typography>{error}</Typography>
        </Box>
      )}

      <Snackbar 
        open={Boolean(warning)} 
        autoHideDuration={6000} 
        onClose={() => setWarning(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setWarning(null)} 
          severity="warning" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {warning}
        </Alert>
      </Snackbar>

      {!loading && !error && (
        <Box
          sx={{
            margin: '0 auto',
            padding: { xs: 2, sm: 3 },
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {assets.length} assets found
          </Typography>
            
            
          <Grid container spacing={3}>
            {assets.length && assets?.map((asset) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={asset._id}>
                <AssetCard asset={asset} deleteAndUpdateAssets={deleteAndUpdateAssets} />
              </Grid>
            ))}
          </Grid>

          {assets.length === 0 && (
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: 8,
                bgcolor: 'white',
                borderRadius: 1,
                border: '1px dashed #ccc'
              }}
            >
              <Typography variant="body1" color="text.secondary">
                No assets found. Try uploading some files!
              </Typography>
            </Box>
          )}
        </Box>
      )}
      
    </Box>
  )
}

export default App
