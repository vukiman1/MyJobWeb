import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Divider,
  styled
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.customShadows?.z24 || '0px 8px 16px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden'
  }
}));

const StatusIcon = styled(motion.div)(({ theme, success }) => ({
  width: 60,
  height: 60,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: success ? theme.palette.success.lighter : theme.palette.error.lighter,
  color: success ? theme.palette.success.main : theme.palette.error.main,
  marginBottom: theme.spacing(2),
  '& .MuiSvgIcon-root': {
    fontSize: 32
  }
}));

const DetailBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.neutral,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  '& .MuiTypography-root': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '&:not(:last-child)': {
      marginBottom: theme.spacing(1)
    }
  }
}));

const PaymentDialog = ({
  open,
  onClose,
  paymentResult,
  paymentError,
  selectedAmount,
  selectedMethod,
  reference,
  onRetry
}) => {
  const formattedAmount = new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(selectedAmount);

  const getMethodName = (methodId) => {
    const methods = {
      qrcode: 'QR Code',
      momo: 'MoMo',
      paypal: 'PayPal',
      vnpay: 'VnPay'
    };
    return methods[methodId] || methodId;
  };

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ 
        textAlign: 'center',
        p: 3,
        pb: 0
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <AnimatePresence mode="wait">
            {paymentResult?.success ? (
              <StatusIcon
                success
                key="success"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              >
                <CheckCircleOutlineIcon />
              </StatusIcon>
            ) : (
              <StatusIcon
                key="error"
                initial={{ scale: 0 }}
                animate={{ 
                  scale: 1,
                  x: [-10, 10, -10, 10, 0],
                  transition: { 
                    scale: { duration: 0.3 },
                    x: { duration: 0.5, delay: 0.3 }
                  }
                }}
                exit={{ scale: 0 }}
              >
                <ErrorOutlineIcon />
              </StatusIcon>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Typography variant="h5" component="div" sx={{ fontWeight: 600, mb: 1 }}>
              {paymentResult?.success ? 'Thanh toán thành công' : 'Thanh toán thất bại'}
            </Typography>
          </motion.div>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            Chi tiết giao dịch
          </Typography>

          <DetailBox>
            <Typography variant="body1">
              <span>Số tiền</span>
              <strong>{formattedAmount}</strong>
            </Typography>
            <Typography variant="body1">
              <span>Phương thức</span>
              <strong>{getMethodName(selectedMethod)}</strong>
            </Typography>
            {reference && (
              <Typography variant="body1">
                <span>Mã giao dịch</span>
                <strong>{reference}</strong>
              </Typography>
            )}
            <Typography variant="body1">
              <span>Trạng thái</span>
              <Box component="strong" sx={{ 
                color: paymentResult?.success ? 'success.main' : 'error.main',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}>
                {paymentResult?.success ? (
                  <>
                    <CheckCircleOutlineIcon fontSize="small" />
                    Thành công
                  </>
                ) : (
                  <>
                    <ErrorOutlineIcon fontSize="small" />
                    Thất bại
                  </>
                )}
              </Box>
            </Typography>
          </DetailBox>

          <Box sx={{ mt: 3 }}>
            {paymentResult?.success ? (
              <Alert 
                severity="success"
                variant="outlined"
                sx={{ 
                  borderRadius: 1,
                  '& .MuiAlert-message': { width: '100%' }
                }}
              >
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Giao dịch đã được xác nhận thành công
                </Typography>
                <Typography variant="body2">
                  Số dư tài khoản của bạn đã được cập nhật và được <b>tặng x10 giá trị nạp</b>. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.
                </Typography>
              </Alert>
            ) : (
              <Alert 
                severity="error"
                variant="outlined"
                sx={{ 
                  borderRadius: 1,
                  '& .MuiAlert-message': { width: '100%' }
                }}
              >
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  {paymentError || 'Có lỗi xảy ra trong quá trình thanh toán'}
                </Typography>
                <Typography variant="body2">
                  Vui lòng kiểm tra lại thông tin và thử lại. Nếu lỗi vẫn tiếp tục, hãy liên hệ với bộ phận hỗ trợ.
                </Typography>
              </Alert>
            )}
          </Box>
        </motion.div>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        {paymentResult?.success ? (
          <Button
            variant="contained"
            color="primary"
            onClick={onClose}
            fullWidth
          >
            Đóng
          </Button>
        ) : (
          <>
            <Button
              variant="outlined"
              color="inherit"
              onClick={onClose}
              startIcon={<CloseIcon />}
              sx={{ flex: 1 }}
            >
              Đóng
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={onRetry}
              startIcon={<RefreshIcon />}
              sx={{ flex: 1 }}
            >
              Thử lại
            </Button>
          </>
        )}
      </DialogActions>
    </StyledDialog>
  );
};

export default PaymentDialog;
