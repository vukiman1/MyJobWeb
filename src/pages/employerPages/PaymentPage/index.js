import React, { useState, useEffect, useCallback } from 'react';
import { Container, Paper, Box, Snackbar, Alert, Grid, Typography } from '@mui/material';
import paymentService from '../../../services/paymentService';
import { TabTitle } from '../../../utils/generalFunction';
import BalanceDisplay from './components/BalanceDisplay';
import PaymentMethods from './components/PaymentMethods';
import AmountSelection from './components/AmountSelection';
import QRCodeDisplay from './components/QRCodeDisplay';
import PaymentDialog from './components/PaymentDialog';
import TransactionHistory from './components/TransactionHistory';
import PaymentNotes from './components/PaymentNotes';
import { PAYMENT_IMAGES } from '../../../configs/constants'
import { useSelector } from 'react-redux';

const paymentMethods = [
  { id: 'qrcode', name: 'QR Code', image: PAYMENT_IMAGES.QRCODE },
  { id: 'momo', name: 'Momo', image: PAYMENT_IMAGES.MOMO },
  { id: 'paypal', name: 'PayPal', image: PAYMENT_IMAGES.PAYPAL },
  { id: 'vnpay', name: 'VnPay', image: PAYMENT_IMAGES.VNPAY }
];

const amounts = [
  1000, 2000, 2500, 3000, 4000, 5000
];

const formatTransaction = (transaction) => ({
  ...transaction,
  formattedAmount: new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(transaction.price),
  formattedDate: new Date(transaction.createAt).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }),
  status: transaction.status === 1 ? 'success' : 'error'
});

const PaymentPage = () => {
  TabTitle('Thanh toán Premium - Nhà tuyển dụng');
  const [balance, setBalance] = useState(0);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [balanceError, setBalanceError] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [isQrGenerated, setIsQrGenerated] = useState(false);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionsError, setTransactionsError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [currentReference, setCurrentReference] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  const showSnackbar = useCallback((message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  const refreshBalance = useCallback(async () => {
    setBalanceLoading(true);
    const response = await paymentService.getCurrentBalance();
    setBalance(response.currentMoney);
    setBalanceLoading(false);
    setBalanceError(null);
    showSnackbar('Số dư đã được cập nhật', 'success');
  }, [showSnackbar]);

  const fetchTransactions = useCallback(async () => {
    setTransactionsLoading(true);
    try {
      const response = await paymentService.getTransactionHistory();
      if (response?.data) {
        const formattedTransactions = response.data.map(formatTransaction);
        setTransactions(formattedTransactions);
        setTransactionsError(null);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      const errorMessage = error.response?.data?.message || 'Không thể tải lịch sử giao dịch. Vui lòng thử lại sau.';
      setTransactionsError(errorMessage);
      showSnackbar(errorMessage, 'error');
    } finally {
      setTransactionsLoading(false);
    }
  }, [showSnackbar]);

  useEffect(() => {
    refreshBalance();
    fetchTransactions();
  }, [refreshBalance, fetchTransactions]);

  const handleMethodChange = (method) => {
    setSelectedMethod(method);
    setQrCodeUrl(null);
    setIsQrGenerated(false);
    setQrError(null);
    setCurrentReference(null);
  };

  const handleAmountChange = (amount) => {
    setSelectedAmount(amount);
    setQrCodeUrl(null);
    setIsQrGenerated(false);
    setQrError(null);
    setCurrentReference(null);
  };

  const generateReferenceCode = () => {
      // Use only unambiguous characters to avoid confusion
      const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed I, O, 0, 1 for clarity
      const length = 6;
      const prefix = currentUser.id
      let result = '';
      // Generate cryptographically secure random numbers
      const randomValues = new Uint32Array(length);
      window.crypto.getRandomValues(randomValues);
      
      for (let i = 0; i < length; i++) {
        result += characters.charAt(randomValues[i] % characters.length);
      }
      const code = `${prefix}${result}`;
      return code;

  };

  const handleGenerateQrCode = async () => {
    if (!selectedMethod || !selectedAmount) {
      showSnackbar('Vui lòng chọn phương thức và số tiền thanh toán', 'warning');
      return;
    }

    setQrLoading(true);
    setQrError(null);
    
    try {
      const reference = generateReferenceCode();
      setCurrentReference(reference);
      const qrUrl = `https://qr.sepay.vn/img?acc=31263287&bank=ACB&amount=${selectedAmount}&des=${reference}`;
      setQrCodeUrl(qrUrl);
      setIsQrGenerated(true);
      setQrError(null);
    } catch (error) {
      const errorMessage = error.message || 'Không thể tạo mã QR. Vui lòng thử lại sau.';
      setQrError(errorMessage);
      showSnackbar(errorMessage, 'error');
      setCurrentReference(null);
    } finally {
      setQrLoading(false);
    }
  };

  const handlePaymentComplete = async (referenceCode, amount, method) => {
    console.log('Payment complete:', { referenceCode, amount, method });
    const response = await paymentService.checkTransaction(referenceCode, amount, method);
    if (response.data) {
      try {
        await Promise.all([refreshBalance(), fetchTransactions()]);
        setPaymentResult({ success: true });
        showSnackbar('Thanh toán thành công!', 'success');
      } catch (error) {
        console.error('Error refreshing data after payment:', error);
        // Still show success but with a warning about refresh
        setPaymentResult({ success: true });
        showSnackbar('Thanh toán thành công, nhưng không thể cập nhật số dư. Vui lòng làm mới trang.', 'warning');
      }
    } else {
      const errorMessage = 'Có lỗi xảy ra trong quá trình thanh toán';
      setPaymentError(errorMessage);
      setPaymentResult({ success: false });
      showSnackbar(errorMessage, 'error');
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setPaymentResult(null);
    setPaymentError(null);
    setQrCodeUrl(null);
    setIsQrGenerated(false);
    setSelectedMethod('');
    setSelectedAmount(0);
    setCurrentReference(null);
  };

  return (
    <Container >
      <Paper sx={{ p: 3 }}>
        <Box sx={{  mx: 'auto' }}>
          <BalanceDisplay 
            balance={balance}
            balanceLoading={balanceLoading}
            balanceError={balanceError}
            onRefresh={refreshBalance}
          />

          <PaymentMethods
            methods={paymentMethods}
            selectedMethod={selectedMethod}
            onMethodChange={handleMethodChange}
          />

          <Grid 
            container 
            spacing={4} 
            sx={{ 
              mt: 2,
              minHeight: 600,
              '& .MuiPaper-root': {
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }
            }}
          >
            <Grid item xs={12} md={7}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3,
                  backgroundColor: 'background.neutral',
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Chọn số tiền nạp
                </Typography>
                <AmountSelection
                  amounts={amounts}
                  selectedAmount={selectedAmount}
                  onAmountChange={handleAmountChange}
                />
                <Box sx={{ mt: 4 }}>
                  <PaymentNotes />
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={5}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3,
                  backgroundColor: 'background.neutral',
                  border: '1px solid',
                  borderColor: 'divider',
                  position: 'sticky',
                  top: 24
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Quét mã QR để thanh toán
                </Typography>
                <QRCodeDisplay
                  qrCodeUrl={qrCodeUrl}
                  isGenerated={isQrGenerated}
                  loading={qrLoading}
                  error={qrError}
                  selectedAmount={selectedAmount}
                  selectedMethod={selectedMethod}
                  onGenerateQrCode={handleGenerateQrCode}
                  onPaymentComplete={handlePaymentComplete}
                  reference={currentReference}
                />
              </Paper>
            </Grid>
          </Grid>

          <TransactionHistory
            transactions={transactions}
            isLoading={transactionsLoading}
            error={transactionsError}
            onRetry={fetchTransactions}
          />
          <PaymentDialog
            open={dialogOpen}
            onClose={handleCloseDialog}
            paymentResult={paymentResult}
            paymentError={paymentError}
            selectedAmount={selectedAmount}
            selectedMethod={selectedMethod}
            reference={currentReference}
            onRetry={handleGenerateQrCode}
          />

          <Snackbar 
            open={snackbar.open} 
            autoHideDuration={6000} 
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert 
              onClose={handleCloseSnackbar} 
              severity={snackbar.severity}
              variant="filled"
              sx={{ width: '100%' }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      </Paper>
    </Container>
  );
};

export default PaymentPage;