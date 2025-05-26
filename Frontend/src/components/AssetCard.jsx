import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  IconButton,
  Dialog,
  DialogContent,
  Box,
  Fab,
  Tooltip,
  DialogTitle,
  DialogActions,
  Button
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import VideocamIcon from '@mui/icons-material/Videocam';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CloseIcon from '@mui/icons-material/Close';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteIcon from '@mui/icons-material/Delete';
import { api } from '../App';

const AssetCard = ({ asset ,deleteAndUpdateAssets}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const handleClose = () => {
    setIsExpanded(false);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(asset.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = asset.filename;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/assets/deleteAsset/${id}`);
      deleteAndUpdateAssets(id);
      setShowDeleteConfirm(false);
      handleClose();

      
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const renderThumbnail = () => {
    switch (asset.type) {
      case 'image':
        return (
          <CardMedia
            component="img"
            height="140"
            image={asset.url}
            alt={asset.filename}
            sx={{ objectFit: 'cover' }}
          />
        );
      case 'video':
        return (
          <Box sx={{ position: 'relative', height: 140, bgcolor: '#000' }}>
            <video
              width="100%"
              height="100%"
              style={{ objectFit: 'contain' }}
              poster={asset.url}
            >
              <source src={asset.url} type="video/mp4" />
            </video>
            <VideocamIcon 
              sx={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)',
                fontSize: 40,
                color: 'white'
              }} 
            />
          </Box>
        );
      case 'pdf':
        return (
          <Box 
            sx={{ 
              height: 140, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              bgcolor: '#f5f5f5'
            }}
          >
            <PictureAsPdfIcon sx={{ fontSize: 60, color: '#d32f2f' }} />
          </Box>
        );
      default:
        return (
          <Box 
            sx={{ 
              height: 140, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              bgcolor: '#f5f5f5'
            }}
          >
            <ImageIcon sx={{ fontSize: 60, color: '#9e9e9e' }} />
          </Box>
        );
    }
  };

  const renderExpandedContent = () => {
    switch (asset.type) {
      case 'image':
        return (
          <img
            src={asset.url}
            alt={asset.filename}
            style={{ maxWidth: '100%', maxHeight: '80vh' }}
          />
        );
      case 'video':
        return (
          <video
            controls
            style={{ maxWidth: '100%', maxHeight: '80vh' }}
            autoPlay
          >
            <source src={asset.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      case 'pdf':
        return (
          <iframe
            src={asset.url}
            width="100%"
            height="100%"
            title={asset.filename}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Card 
        onClick={handleExpand}
        sx={{ 
          cursor: 'pointer',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.02)',
          }
        }}
      >
        {renderThumbnail()}
        <CardContent>
          <Typography noWrap variant="subtitle1">
            {asset.filename}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {(asset.size / (1024 * 1024)).toFixed(2)} MB
          </Typography>
        </CardContent>
      </Card>

      <Dialog
        open={isExpanded}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
      >
        <Box sx={{ position: 'relative', height: '100%' }}>
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.7)',
              },
              zIndex: 1
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent sx={{ height: '80vh', display: "flex", alignItems: "center", justifyContent: "center", position: 'relative' }}>
            {renderExpandedContent()}
            <Box sx={{ position: 'absolute', right: 24, bottom: 24, display: 'flex', gap: 2 }}>
              <Tooltip title="Delete">
                <Fab
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteConfirm(true);
                  }}
                  size="medium"
                >
                  <DeleteIcon />
                </Fab>
              </Tooltip>
              <Tooltip title="Download">
                <Fab
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload();
                  }}
                  size="medium"
                >
                  <FileDownloadIcon />
                </Fab>
              </Tooltip>
            </Box>
          </DialogContent>
        </Box>
      </Dialog>

      <Dialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
      >
        <DialogTitle>Delete Asset</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{asset.filename}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
          <Button onClick={()=>handleDelete(asset._id)} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AssetCard; 