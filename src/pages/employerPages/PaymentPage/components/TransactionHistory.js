import React from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  styled
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import { motion, AnimatePresence } from 'framer-motion';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  backgroundColor: theme.palette.background.neutral,
  color: theme.palette.text.primary,
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:first-of-type': {
    borderTopLeftRadius: theme.shape.borderRadius,
  },
  '&:last-of-type': {
    borderTopRightRadius: theme.shape.borderRadius,
  }
}));

const StatusBadge = styled(Box)(({ theme, status }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: theme.spacing(0.5, 1.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: status === 'success' ? 'rgba(84, 214, 44, 0.16)' : 'rgba(255, 72, 66, 0.16)',
  color: status === 'success' ? theme.palette.success.main : theme.palette.error.main,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: status === 'success' ? 'rgba(84, 214, 44, 0.24)' : 'rgba(255, 72, 66, 0.24)',
  },
  '& .MuiSvgIcon-root': {
    fontSize: 16,
    marginRight: theme.spacing(0.5)
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
  transition: 'background-color 0.2s ease-in-out',
  '& td': {
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    color: theme.palette.text.primary,
    '&:first-of-type': {
      fontWeight: 500
    }
  }
}));

const EmptyState = ({ message, submessage }) => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    py: 8,
    flexDirection: 'column',
    gap: 1
  }}>
    <Typography variant="h6" color="text.secondary">
      {message}
    </Typography>
    {submessage && (
      <Typography variant="body2" color="text.secondary">
        {submessage}
      </Typography>
    )}
  </Box>
);

const LoadingState = () => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    py: 8,
    flexDirection: 'column',
    gap: 2
  }}>
    <CircularProgress size={40} />
    <Typography color="text.secondary">
      Đang tải lịch sử giao dịch...
    </Typography>
  </Box>
);

const ErrorState = ({ error, onRetry }) => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    py: 8,
    flexDirection: 'column',
    gap: 2
  }}>
    <ErrorOutlineIcon color="error" sx={{ fontSize: 40 }} />
    <Typography color="error" gutterBottom align="center">
      {error || 'Có lỗi xảy ra khi tải lịch sử giao dịch'}
    </Typography>
    <Button
      variant="contained"
      size="small"
      onClick={onRetry}
      startIcon={<RefreshIcon />}
    >
      Thử lại
    </Button>
  </Box>
);

const TransactionHistory = ({
  transactions,
  isLoading,
  error,
  onRetry
}) => {
  const isError = !!error;

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2 
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Lịch sử giao dịch
        </Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={onRetry}
          disabled={isLoading}
          variant="outlined"
          size="small"
          sx={{
            minWidth: 100,
            '& .MuiCircularProgress-root': {
              marginRight: 1
            }
          }}
        >
          {isLoading ? (
            <>
              <CircularProgress size={16} />
              Đang tải...
            </>
          ) : (
            'Làm mới'
          )}
        </Button>
      </Box>

      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: 2,
          boxShadow: (theme) => theme.customShadows?.z8 || '0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Thời gian</StyledTableCell>
              <StyledTableCell>Mã giao dịch</StyledTableCell>
              <StyledTableCell>Số tiền</StyledTableCell>
              <StyledTableCell>Phương thức</StyledTableCell>
              <StyledTableCell align="center">Trạng thái</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <AnimatePresence mode="wait">
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ border: 0 }}>
                    <LoadingState />
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ border: 0 }}>
                    <ErrorState error={error} onRetry={onRetry} />
                  </TableCell>
                </TableRow>
              ) : !transactions || transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ border: 0 }}>
                    <EmptyState 
                      message="Chưa có giao dịch nào"
                      submessage="Các giao dịch của bạn sẽ xuất hiện ở đây"
                    />
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction, index) => (
                  <motion.tr
                    key={transaction.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: index * 0.05,
                      type: 'spring',
                      stiffness: 100,
                      damping: 15
                    }}
                    component={StyledTableRow}
                  >
                    <TableCell>{transaction.formattedDate}</TableCell>
                    <TableCell>{transaction.paymentId}</TableCell>
                    <TableCell>{transaction.formattedAmount}</TableCell>
                    <TableCell>{transaction.method}</TableCell>
                    <TableCell align="center">
                      <StatusBadge status={transaction.status}>
                        {transaction.status === 'success' ? (
                          <>
                            <CheckCircleOutlineIcon />
                            Thành công
                          </>
                        ) : (
                          <>
                            <ErrorOutlineIcon />
                            Thất bại
                          </>
                        )}
                      </StatusBadge>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TransactionHistory;
