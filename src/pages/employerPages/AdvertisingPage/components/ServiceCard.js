import React from 'react';
import {
  Box,
  Typography,
  Button,
  Divider,
  ListItem,
  ListItemText,
} from '@mui/material';
import { ServiceCard as StyledServiceCard, PriceTag, FeatureList } from './StyledComponents';
import UploadForm from './UploadForm';

const ServiceCard = ({
  icon: Icon,
  title,
  price,
  description,
  features,
  isFormOpen,
  onFormOpen,
  onFormClose,
  selectedImage,
  onImageChange,
  onServicePurchase,
  error,
}) => {
  return (
    <StyledServiceCard elevation={3}>
      <PriceTag>
        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
      </PriceTag>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
        <Icon color="primary" sx={{ fontSize: 40 }} />
        <Typography variant="h5">{title}</Typography>
      </Box>
      <Typography variant="body1" color="text.secondary" paragraph>
        {description}
      </Typography>
      <Divider sx={{ my: 2 }} />
      <FeatureList>
        {features.map((feature, index) => (
          <ListItem key={index}>
            <ListItemText 
              primary={feature.primary}
              secondary={feature.secondary}
            />
          </ListItem>
        ))}
      </FeatureList>
      <Box sx={{ mt: 'auto', pt: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth
          onClick={onFormOpen}
        >
          Đăng ký dịch vụ
        </Button>
      </Box>
      <UploadForm
        serviceType={(title === "Quảng cáo Banner" ? "BANNER" : "POPUP")}
        price={price}
        isOpen={isFormOpen}
        onClose={onFormClose}
        selectedImage={selectedImage}
        onImageChange={onImageChange}
        onSubmit={onServicePurchase}
        error={error}
      />
    </StyledServiceCard>
  );
};

export default ServiceCard;
