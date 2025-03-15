import React from 'react';
import { Box, Stack, Typography, Button, styled } from '@mui/material';
import { motion } from 'framer-motion';
import PaidIcon from '@mui/icons-material/Paid';

const AmountButton = styled(Button)(({ theme, selected }) => ({
  minWidth: '120px',
  padding: theme.spacing(2),
  backgroundColor: selected ? theme.palette.primary.main : theme.palette.background.paper,
  color: selected ? '#fff' : theme.palette.text.primary,
  border: `1px solid ${selected ? theme.palette.primary.main : theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  boxShadow: selected ? '0 4px 12px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.05)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: selected ? theme.palette.primary.dark : theme.palette.background.default,
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
  },
}));

const AmountSelection = ({ amounts, selectedAmount, onAmountChange }) => {
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Stack spacing={3}>
      <Stack 
        direction="row" 
        flexWrap="wrap" 
        gap={2} 
        justifyContent="center"
      >
        {amounts.map((amount, index) => (
          <motion.div
            key={amount}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.3,
              delay: index * 0.1,
              type: 'spring',
              stiffness: 100
            }}
          >
            <AmountButton
              selected={selectedAmount === amount}
              onClick={() => onAmountChange(amount)}
              startIcon={selectedAmount === amount && <PaidIcon />}
            >
              {formatAmount(amount)}
            </AmountButton>
          </motion.div>
        ))}
      </Stack>
      {selectedAmount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Typography 
            variant="h5" 
            align="center" 
            color="primary"
            sx={{ 
              fontWeight: 600,
              mt: 2,
              p: 2,
              borderRadius: 1,
              backgroundColor: 'background.paper',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            Số tiền: {formatAmount(selectedAmount)}
          </Typography>
        </motion.div>
      )}
    </Stack>
  );
};

export default AmountSelection;
