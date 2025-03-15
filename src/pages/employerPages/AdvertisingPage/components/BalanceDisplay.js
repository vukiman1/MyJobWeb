import React from 'react';
import { Card, Stack, Typography, Box } from '@mui/material';

const BalanceDisplay = ({ balance }) => {
  return (
    <Card 
      sx={{ 
        p: 3, 
        background: 'linear-gradient(135deg, rgba(68, 29, 160, 0.8) 0%, rgba(68, 29, 160, 0.9) 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '150px',
          height: '150px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          borderRadius: '50%',
          transform: 'translate(30%, -30%)',
        }}
      />
      <Stack spacing={1}>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Số dư hiện tại
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(balance || 0)}
        </Typography>
      </Stack>
    </Card>
  );
};

export default BalanceDisplay;
