import React from 'react';
import {
  Card,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Switch,
  Tooltip,
} from '@mui/material';

const PurchaseHistory = ({ purchaseHistory, onStatusToggle }) => {
  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Lịch sử mua hàng
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Dịch vụ</TableCell>
              <TableCell>Ngày mua</TableCell>
              <TableCell>Giá tiền</TableCell>
              <TableCell align="center">Trạng thái</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchaseHistory.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.service}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                </TableCell>
                <TableCell align="center">
                  <Typography
                    variant="body2"
                    sx={{
                      color: item.status === 'Đang hoạt động' ? 'success.main' : 'text.secondary',
                      fontWeight: item.status === 'Đang hoạt động' ? 'bold' : 'normal',
                    }}
                  >
                    {item.status}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Tooltip title={`${item.status === 'Đang hoạt động' ? 'Tắt' : 'Bật'} trạng thái`}>
                    <Switch
                      checked={item.status === 'Đang hoạt động'}
                      onChange={() => onStatusToggle(item.id)}
                      color="success"
                    />
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default PurchaseHistory;
