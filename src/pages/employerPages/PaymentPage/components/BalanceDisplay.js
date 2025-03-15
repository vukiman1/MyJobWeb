import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Box, Stack, Typography, IconButton, CircularProgress, Alert, styled } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const BalanceCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.primary.contrastText,
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease-in-out',
  boxShadow: theme.customShadows?.z16 || '0 8px 16px 0 rgba(0,0,0,0.1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.customShadows?.z24 || '0 12px 24px 0 rgba(0,0,0,0.15)'
  }
}));

const BackgroundDecoration = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  width: '200px',
  height: '200px',
  background: `radial-gradient(circle, ${theme.palette.primary.light}20 0%, ${theme.palette.primary.main}00 70%)`,
  borderRadius: '50%',
  transform: 'translate(30%, -30%)',
  pointerEvents: 'none'
}));

const RefreshButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  opacity: 0.8,
  transition: 'all 0.2s ease-in-out',
  '&:hover': { 
    opacity: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: 'rotate(30deg)'
  },
  '&.Mui-disabled': { 
    opacity: 0.3,
    backgroundColor: 'transparent'
  }
}));

const StyledAlert = styled(Alert)(({ theme }) => ({
  backgroundColor: 'rgba(255, 72, 66, 0.16)',
  color: theme.palette.primary.contrastText,
  border: '1px solid rgba(255, 72, 66, 0.3)',
  '& .MuiAlert-icon': {
    color: theme.palette.primary.contrastText
  },
  '& .MuiAlert-action': {
    color: theme.palette.primary.contrastText
  }
}));

const BalanceDisplay = ({ balance, balanceLoading, balanceError, onRefresh }) => {
  const formattedBalance = new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(balance || 0);

  return (
    <BalanceCard>
      <BackgroundDecoration />
      
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccountBalanceWalletIcon sx={{ fontSize: 24, opacity: 0.9 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Số dư hiện tại
            </Typography>
          </Box>

          <RefreshButton
            onClick={onRefresh}
            disabled={balanceLoading}
            size="small"
            aria-label="Làm mới số dư"
          >
            <AnimatePresence mode="wait">
              {balanceLoading ? (
                <motion.div
                  key="loading"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshIcon />
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <RefreshIcon />
                </motion.div>
              )}
            </AnimatePresence>
          </RefreshButton>
        </Box>

        <AnimatePresence mode="wait">
          {balanceLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CircularProgress size={24} sx={{ color: 'inherit' }} />
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Đang cập nhật số dư...
                </Typography>
              </Box>
            </motion.div>
          ) : balanceError ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <StyledAlert 
                severity="error"
                icon={<ErrorOutlineIcon />}
                action={
                  <IconButton
                    color="inherit"
                    size="small"
                    onClick={onRefresh}
                    sx={{ 
                      '&:hover': { 
                        backgroundColor: 'rgba(255, 255, 255, 0.1)' 
                      } 
                    }}
                  >
                    <RefreshIcon fontSize="small" />
                  </IconButton>
                }
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {balanceError}
                </Typography>
              </StyledAlert>
            </motion.div>
          ) : (
            <motion.div
              key={balance}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.5, 
                type: 'spring',
                stiffness: 100,
                damping: 15
              }}
            >
              <Typography variant="h3" sx={{ 
                fontWeight: 700,
                textShadow: '0px 2px 4px rgba(0,0,0,0.2)',
                letterSpacing: '-0.5px'
              }}>
                {formattedBalance}
              </Typography>
              <Typography variant="body2" sx={{ 
                opacity: 0.8, 
                mt: 0.5,
                fontWeight: 500
              }}>
                Cập nhật lần cuối: {new Date().toLocaleTimeString('vi-VN')}
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
      </Stack>
    </BalanceCard>
  );
};

export default BalanceDisplay;
