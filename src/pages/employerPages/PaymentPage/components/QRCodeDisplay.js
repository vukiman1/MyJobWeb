import React from 'react';
import { Box, Stack, Typography, Button, CircularProgress, Alert, styled } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import PaidIcon from '@mui/icons-material/Paid';

const QRCodeBox = styled(Box)(({ theme }) => ({
  width: '300px',
  height: '300px',
  border: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
    transform: 'translateY(-4px)'
  }
}));

const BankInfoBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  width: '100%',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  border: `1px solid ${theme.palette.divider}`,
  '& strong': {
    color: theme.palette.primary.main,
    fontWeight: 600
  }
}));

const QRCodeDisplay = ({
  qrCodeUrl,
  isGenerated,
  loading,
  error,
  selectedAmount,
  onGenerateQrCode,
  onPaymentComplete,
  reference
}) => {
  const formattedAmount = new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(selectedAmount);

  const bankInfo = {
    name: 'ACB',
    accountHolder: 'Vũ Kim An',
    accountNumber: '31263287',
    amount: formattedAmount,
    reference: reference
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            style={{ width: '100%' }}
          >
            <Alert 
              severity="error"
              icon={<ErrorOutlineIcon />}
              action={
                <Button
                  color="error"
                  size="small"
                  onClick={onGenerateQrCode}
                  startIcon={<RefreshIcon />}
                >
                  Thử lại
                </Button>
              }
            >
              {error}
            </Alert>
          </motion.div>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={onGenerateQrCode}
          disabled={loading || !selectedAmount}
          startIcon={loading ? null : <QrCode2Icon />}
          fullWidth
          sx={{ 
            height: 48,
            position: 'relative',
            '& .MuiCircularProgress-root': {
              marginRight: 1
            }
          }}
        >
          {loading ? (
            <>
              <CircularProgress size={24} color="inherit" />
              Đang tạo mã QR...
            </>
          ) : (
            isGenerated ? 'Tạo mã QR mới' : 'Tạo mã QR'
          )}
        </Button>

        <AnimatePresence mode="wait">
          {qrCodeUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ 
                duration: 0.3,
                type: 'spring',
                stiffness: 200,
                damping: 20
              }}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <QRCodeBox>
                <motion.img 
                  src={qrCodeUrl}
                  alt="QR Code"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  style={{ 
                    maxWidth: '90%', 
                    maxHeight: '90%',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }} 
                />
              </QRCodeBox>

              <BankInfoBox>
                <Stack 
                  direction="row" 
                  alignItems="center" 
                  spacing={1} 
                  sx={{ mb: 2 }}
                >
                  <PaidIcon color="primary" />
                  <Typography 
                    variant="subtitle1"
                    sx={{ fontWeight: 600, color: 'primary.main' }}
                  >
                    Thông tin chuyển khoản
                  </Typography>
                </Stack>
                <Stack spacing={2}>
                  <Typography variant="body1">
                    <strong>Ngân hàng:</strong> {bankInfo.name}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Chủ tài khoản:</strong> {bankInfo.accountHolder}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Số tài khoản:</strong> {bankInfo.accountNumber}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Số tiền:</strong> {bankInfo.amount}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Nội dung chuyển khoản:</strong> {bankInfo.reference}
                  </Typography>
                </Stack>
              </BankInfoBox>

              <Stack direction="row" spacing={2} sx={{ mt: 3, width: '100%', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  onClick={() => onPaymentComplete(reference, selectedAmount, 'Qr Code')}
                  disabled={loading}
                >
                  Bấm vào đây nếu đã chuyển khoản
                </Button>
              </Stack>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default QRCodeDisplay;
