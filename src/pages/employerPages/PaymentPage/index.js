import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Card,
  Grid,
  Stack,
  Typography,
  Box,
  Button,
  Paper,
  Link,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { TabTitle } from '../../../utils/generalFunction';

// Styled components
const PaymentMethodCard = styled(Paper)(({ theme, selected }) => ({
  padding: theme.spacing(2),
  cursor: 'pointer',
  border: selected ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
  transition: 'all 0.3s ease',
  '&:hover': {
    border: `2px solid ${theme.palette.primary.main}`,
    transform: 'translateY(-2px)',
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const AmountButton = styled(Button)(({ theme, selected }) => ({
  minWidth: '120px',
  backgroundColor: selected ? theme.palette.primary.main : 'transparent',
  color: selected ? '#fff' : theme.palette.text.primary,
  border: `1px solid ${selected ? theme.palette.primary.main : theme.palette.divider}`,
  '&:hover': {
    backgroundColor: selected ? theme.palette.primary.dark : 'rgba(68, 29, 160, 0.08)',
  },
}));

const QRCodeBox = styled(Box)(({ theme }) => ({
  width: '250px',
  height: '250px',
  border: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const PaymentPage = () => {
  TabTitle('Thanh toán Premium - Nhà tuyển dụng');
  const { currentUser } = useSelector((state) => state.user);

  const [selectedMethod, setSelectedMethod] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isQrGenerated, setIsQrGenerated] = useState(false);

  const paymentMethods = [
    { id: 'qr', name: 'QR Code', logo: '🔲' },
    { id: 'vnpay', name: 'VnPay', logo: '💳' },
    { id: 'momo', name: 'Momo', logo: '📱' },
    { id: 'paypal', name: 'PayPal', logo: '💰' },
  ];

  const amounts = [
    { value: 50000, label: '50.000 VNĐ' },
    { value: 100000, label: '100.000 VNĐ' },
    { value: 200000, label: '200.000 VNĐ' },
    { value: 500000, label: '500.000 VNĐ' },
  ];

  const handleMethodChange = (method) => {
    setSelectedMethod(method);
    setQrCodeUrl('');
    setIsQrGenerated(false);
  };

  const handleAmountChange = (amount) => {
    setSelectedAmount(amount);
    setQrCodeUrl('');
    setIsQrGenerated(false);
  };

  const generateQrCode = () => {
    if (!selectedAmount || !currentUser?.id) return;

    const qrUrl = `https://qr.sepay.vn/img?acc=31263287&bank=ACB&amount=${selectedAmount}&des=${currentUser.id}TTPAYMENT`;
    setQrCodeUrl(qrUrl);
    setIsQrGenerated(true);
  };

  const handleConfirmPayment = () => {
    // Handle payment confirmation
    console.log('Payment confirmed:', { selectedMethod, selectedAmount });
  };

  return (
    <Stack spacing={3}>
      {/* Balance Display */}
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
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentUser?.balance || 0)}
          </Typography>
        </Stack>
      </Card>

      {/* Payment Card */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Thanh toán Premium
        </Typography>

        {/* Payment Methods */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Chọn phương thức thanh toán
          </Typography>
          <Grid container spacing={2}>
            {paymentMethods.map((method) => (
              <Grid item xs={12} sm={6} md={3} key={method.id}>
                <PaymentMethodCard
                  selected={selectedMethod === method.id}
                  onClick={() => handleMethodChange(method.id)}
                  elevation={selectedMethod === method.id ? 3 : 1}
                >
                  <Typography variant="h2" component="div">
                    {method.logo}
                  </Typography>
                  <Typography variant="subtitle1">{method.name}</Typography>
                </PaymentMethodCard>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Grid container spacing={4}>
          {/* Left Side - Amount Selection and QR */}
          <Grid item xs={12} md={6}>
            {/* Amount Selection */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Chọn mệnh giá
              </Typography>
              <Stack spacing={2}>
                {amounts.map((amount) => (
                  <AmountButton
                    key={amount.value}
                    variant="outlined"
                    selected={selectedAmount === amount.value}
                    onClick={() => handleAmountChange(amount.value)}
                    fullWidth
                  >
                    {amount.label}
                  </AmountButton>
                ))}
              </Stack>
            </Box>

            {/* QR Code Display */}
            {selectedMethod && selectedAmount && (
              <>
                <Typography variant="h6" gutterBottom>
                  Quét mã QR để thanh toán
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={generateQrCode}
                    disabled={!selectedAmount || !currentUser?.id}
                  >
                    Tạo mã QR
                  </Button>
                  {qrCodeUrl && (
                    <QRCodeBox>
                      <img src={qrCodeUrl} alt="QR Code" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                    </QRCodeBox>
                  )}
                </Box>

                {/* Bank Information */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Thông tin chuyển khoản:
                  </Typography>
                  <Stack spacing={1}>
                    <Typography variant="body1">Ngân hàng: ACB</Typography>
                    <Typography variant="body1">Chủ tài khoản: Vũ Kim An</Typography>
                    <Typography variant="body1">Số tài khoản: 31263287</Typography>
                    <Typography variant="body1">
                      Nội dung chuyển khoản: {currentUser?.id}TTPAYMENT
                    </Typography>
                  </Stack>
                </Box>
              </>
            )}
          </Grid>

          {/* Right Side - Payment Notes */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, bgcolor: 'rgba(68, 29, 160, 0.03)' }}>
              <Typography variant="h6" gutterBottom color="primary">
                Lưu ý:
              </Typography>
              <Stack spacing={2}>
                <Typography variant="body1">
                  • Vui lòng điền chính xác nội dung chuyển khoản để thực hiện nạp tiền tự động.
                </Typography>
                <Typography variant="body1">
                  • Không chấp nhận giao dịch nạp tiền từ tài khoản công ty. Chỉ các giao dịch được thực hiện từ tài khoản cá nhân, đúng với thông tin đã đăng ký với ngân hàng, mới được xử lý.
                </Typography>
                <Typography variant="body1">
                  • Tiền sẽ vào tài khoảng trong vòng 1-10 phút kể từ khi giao dịch thành công. Tuy nhiên đôi lúc do một vài lỗi khách quan, tiền có thể sẽ vào chậm hơn một chút.
                </Typography>
                <Typography variant="body1">
                  • Vietcombank trong khoảng 23-3h không thể kiểm tra lịch sử giao dịch, các giao dịch trong khung giờ này có thể mất từ 15 phút đến 2 giờ tiền mới vào tài khoản. Bạn có thể tránh nạp tiền trong khung giờ này để đỡ mất thời gian chờ đợi nhé.
                </Typography>
                <Typography variant="body1">
                  • Nếu quá lâu không thấy cập nhật số dư, Vui lòng{' '}
                  <Link href="#" color="primary" sx={{ textDecoration: 'none' }}>
                    liên hệ hỗ trợ viên: Tại đây
                  </Link>
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* Confirm Button */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            disabled={!isQrGenerated}
            onClick={handleConfirmPayment}
          >
            Xác nhận đã thanh toán
          </Button>
        </Box>
      </Card>
    </Stack>
  );
};

export default PaymentPage;