import React from 'react';
import {
  Paper,
  Box,
  Stack,
  Typography,
  Button,
  IconButton,
  TextField,
  Alert,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import { Collapse } from '@mui/material';
import { VisuallyHiddenInput } from './StyledComponents';

const UploadForm = ({ 
  serviceType, 
  price, 
  isOpen, 
  onClose, 
  selectedImage, 
  onImageChange, 
  onSubmit, 
  error 
}) => {
  const [url, setUrl] = React.useState('');
  return (
    <Collapse in={isOpen}>
      <Paper sx={{ p: 3, mt: 2, bgcolor: 'rgba(68, 29, 160, 0.03)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Upload hình ảnh</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Stack spacing={2}>
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            sx={{ mb: 2 }}
          >
            Chọn hình ảnh
            <VisuallyHiddenInput type="file" accept="image/*" onChange={onImageChange} />
          </Button>
          {selectedImage && (
            <Typography variant="body2" color="text.secondary">
              Đã chọn: {selectedImage.name}
            </Typography>
          )}
          <TextField
            fullWidth
            label="Đường dẫn liên kết (URL)"
            variant="outlined"
            size="small"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body1">
              Phí dịch vụ: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => onSubmit(serviceType, price, url)}
              disabled={!selectedImage}
            >
              Xác nhận
            </Button>
          </Box>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Stack>
      </Paper>
    </Collapse>
  );
};

export default UploadForm;
