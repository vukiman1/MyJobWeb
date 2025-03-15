import React from 'react';
import { Paper, Stack, Typography, Link, Box, styled } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { motion } from 'framer-motion';

const NotePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.neutral,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '4px',
    height: '100%',
    backgroundColor: theme.palette.primary.main,
    borderTopLeftRadius: theme.shape.borderRadius,
    borderBottomLeftRadius: theme.shape.borderRadius
  }
}));

const NoteItem = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(1.5),
  '& .MuiSvgIcon-root': {
    color: theme.palette.primary.main,
    marginTop: theme.spacing(0.5),
    fontSize: 16
  }
}));

const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: 'none',
  fontWeight: 600,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    color: theme.palette.primary.dark,
    textDecoration: 'underline'
  }
}));

const PaymentNotes = () => {
  const notes = [
    'Vui lòng điền chính xác nội dung chuyển khoản để thực hiện nạp tiền tự động.',
    'Không chấp nhận giao dịch nạp tiền từ tài khoản công ty. Chỉ các giao dịch được thực hiện từ tài khoản cá nhân, đúng với thông tin đã đăng ký với ngân hàng, mới được xử lý.',
    'Tiền sẽ vào tài khoảng trong vòng 1-10 phút kể từ khi giao dịch thành công. Tuy nhiên đôi lúc do một vài lỗi khách quan, tiền có thể sẽ vào chậm hơn một chút.',
    'Vietcombank trong khoảng 23-3h không thể kiểm tra lịch sử giao dịch, các giao dịch trong khung giờ này có thể mất từ 15 phút đến 2 giờ tiền mới vào tài khoản. Bạn có thể tránh nạp tiền trong khung giờ này để đỡ mất thời gian chờ đợi nhé.',
    'Nếu quá lâu không thấy cập nhật số dư, Vui lòng liên hệ hỗ trợ viên.'
  ];

  return (
    <NotePaper>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <InfoOutlinedIcon color="primary" />
        <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
          Lưu ý quan trọng
        </Typography>
      </Box>

      <Stack spacing={2}>
        {notes.map((note, index) => (
          <NoteItem
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <InfoOutlinedIcon fontSize="small" />
            <Typography 
              variant="body1" 
              color="text.primary"
              sx={{ 
                flex: 1,
                ...(index === notes.length - 1 && {
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 0.5
                })
              }}
            >
              {index === notes.length - 1 ? (
                <>
                  {note.split('Vui lòng')[0]}
                  Vui lòng
                  <StyledLink href="/contact" target="_blank">
                    liên hệ hỗ trợ viên tại đây
                  </StyledLink>
                </>
              ) : (
                note
              )}
            </Typography>
          </NoteItem>
        ))}
      </Stack>
    </NotePaper>
  );
};

export default PaymentNotes;
