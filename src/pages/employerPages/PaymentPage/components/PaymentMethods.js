import React from 'react';
import { Box, Grid, Typography, Paper, Chip, styled } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const PaymentMethodCard = styled(Paper)(({ theme, selected }) => ({
  padding: theme.spacing(3),
  cursor: 'pointer',
  border: selected ? `2px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.3s ease',
  backgroundColor: selected ? theme.palette.background.neutral : theme.palette.background.paper,
  '&:hover': {
    border: `2px solid ${theme.palette.primary.main}`,
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4]
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  position: 'relative',
  overflow: 'hidden',
  height: '100%'
}));

const PaymentIcon = styled('img')({
  width: '64px',
  height: '64px',
  objectFit: 'contain',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)'
  }
});

const SelectedBadge = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  color: theme.palette.primary.main
}));

const PaymentMethods = ({ methods, selectedMethod, onMethodChange }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          mb: 3,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        Chọn phương thức thanh toán
        {selectedMethod && (
          <Chip 
            label={methods.find(m => m.id === selectedMethod)?.name || ''} 
            color="primary" 
            size="small"
            sx={{ ml: 2 }}
          />
        )}
      </Typography>

      <Grid container spacing={3}>
        {methods.map((method) => (
          <Grid item xs={12} sm={4} md={3} key={method.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PaymentMethodCard
                selected={selectedMethod === method.id}
                onClick={() => onMethodChange(method.id)}
                elevation={selectedMethod === method.id ? 3 : 1}
              >
                <PaymentIcon 
                  src={method.image} 
                  alt={method.name}
                  loading="lazy"
                />
                <Typography 
                  variant="subtitle1"
                  sx={{ 
                    fontWeight: selectedMethod === method.id ? 600 : 500,
                    color: selectedMethod === method.id ? 'primary.main' : 'text.primary'
                  }}
                >
                  {method.name}
                </Typography>

                <AnimatePresence>
                  {selectedMethod === method.id && (
                    <SelectedBadge
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CheckCircleIcon />
                    </SelectedBadge>
                  )}
                </AnimatePresence>
              </PaymentMethodCard>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PaymentMethods;
