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
  Divider,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Collapse,
  Alert,
  IconButton,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ImageIcon from '@mui/icons-material/Image';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import WorkIcon from '@mui/icons-material/Work';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';

import { TabTitle } from '../../../utils/generalFunction';

// Styled components
const ServiceCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const PriceTag = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 20,
  right: -30,
  background: theme.palette.primary.main,
  color: 'white',
  padding: '4px 30px',
  transform: 'rotate(45deg)',
  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
}));

const FeatureList = styled(List)(({ theme }) => ({
  '& .MuiListItem-root': {
    paddingLeft: 0,
    paddingRight: 0,
  },
}));

const JobPostCard = styled(Paper)(({ theme, selected }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  border: selected ? `2px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const AdvertisingPage = () => {
  TabTitle('Dịch vụ quảng cáo - Nhà tuyển dụng');
  const { currentUser } = useSelector((state) => state.user);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [openBannerForm, setOpenBannerForm] = useState(false);
  const [openPopupForm, setOpenPopupForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState('');
  const [purchaseHistory, setPurchaseHistory] = useState([
    { id: 1, service: 'Banner Quảng cáo', date: '2024-02-12', price: 1000000, status: 'Đang hoạt động' },
    { id: 2, service: 'Popup Quảng cáo', date: '2024-02-10', price: 800000, status: 'Đã kết thúc' },
    { id: 3, service: 'Đẩy tin tuyển dụng', date: '2024-02-08', price: 200000, status: 'Đang hoạt động' },
  ]);

  const handlePostSelection = (postId) => {
    setSelectedPosts(prev => 
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setError('');
    }
  };

  const handleServicePurchase = (serviceType, price) => {
    if ((currentUser?.balance || 0) < price) {
      setError('Số dư không đủ để thực hiện giao dịch này');
      return;
    }
    // Handle purchase logic here
    setError('');
    // Close forms after successful purchase
    setOpenBannerForm(false);
    setOpenPopupForm(false);
    setSelectedImage(null);
  };

  const handleStatusToggle = (id) => {
    setPurchaseHistory(prevHistory =>
      prevHistory.map(item => {
        if (item.id === id) {
          return {
            ...item,
            status: item.status === 'Đang hoạt động' ? 'Đã kết thúc' : 'Đang hoạt động'
          };
        }
        return item;
      })
    );
  };

  const renderUploadForm = (serviceType, price, isOpen, setIsOpen) => (
    <Collapse in={isOpen}>
      <Paper sx={{ p: 3, mt: 2, bgcolor: 'rgba(68, 29, 160, 0.03)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Upload hình ảnh</Typography>
          <IconButton onClick={() => setIsOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Stack spacing={2}>
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            sx={{ mb: 2 }}
          >
            Chọn hình ảnh
            <VisuallyHiddenInput type="file" accept="image/*" onChange={handleImageChange} />
          </Button>
          {selectedImage && (
            <Typography variant="body2" color="text.secondary">
              Đã chọn: {selectedImage.name}
            </Typography>
          )}
          <TextField
            fullWidth
            label="Đường dẫn liên kết (URL)"
            variant="outlined"
            size="small"
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body1">
              Phí dịch vụ: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleServicePurchase(serviceType, price)}
              disabled={!selectedImage}
            >
              Xác nhận
            </Button>
          </Box>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Stack>
      </Paper>
    </Collapse>
  );

  // Mock data for job posts
  const jobPosts = [
    { id: 1, title: 'Senior Frontend Developer', company: 'Tech Corp', date: '2024-02-12' },
    { id: 2, title: 'Backend Engineer', company: 'Digital Solutions', date: '2024-02-11' },
    { id: 3, title: 'Full Stack Developer', company: 'Web Systems', date: '2024-02-10' },
  ];

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

      {/* Services Grid */}
      <Grid container spacing={3}>
        {/* Banner Ad Service */}
        <Grid item xs={12} md={6}>
          <ServiceCard elevation={3}>
            <PriceTag>1.000.000 VNĐ</PriceTag>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
              <ImageIcon color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h5">Quảng cáo Banner</Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" paragraph>
              Hiển thị hình ảnh của bạn ở vị trí banner đầu trang
            </Typography>
            <Divider sx={{ my: 2 }} />
            <FeatureList>
              <ListItem>
                <ListItemText 
                  primary="Kích thước banner: 1920x400 px"
                  secondary="Hiển thị trên tất cả các trang"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Thời gian hiển thị: 7 ngày"
                  secondary="24/7 không giới hạn lượt xem"
                />
              </ListItem>
            </FeatureList>
            <Box sx={{ mt: 'auto', pt: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth
                onClick={() => setOpenBannerForm(true)}
              >
                Đăng ký dịch vụ
              </Button>
            </Box>
            {renderUploadForm('banner', 1000000, openBannerForm, setOpenBannerForm)}
          </ServiceCard>
        </Grid>

        {/* Popup Ad Service */}
        <Grid item xs={12} md={6}>
          <ServiceCard elevation={3}>
            <PriceTag>800.000 VNĐ</PriceTag>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
              <OpenInNewIcon color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h5">Quảng cáo Popup</Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" paragraph>
              Hiển thị popup quảng cáo khi người dùng truy cập website
            </Typography>
            <Divider sx={{ my: 2 }} />
            <FeatureList>
              <ListItem>
                <ListItemText 
                  primary="Kích thước popup: 400x800 px"
                  secondary="Hiển thị ở giữa màn hình"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Thời gian hiển thị: 5 ngày"
                  secondary="Tối đa 3 lần/người dùng/ngày"
                />
              </ListItem>
            </FeatureList>
            <Box sx={{ mt: 'auto', pt: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth
                onClick={() => setOpenPopupForm(true)}
              >
                Đăng ký dịch vụ
              </Button>
            </Box>
            {renderUploadForm('popup', 800000, openPopupForm, setOpenPopupForm)}
          </ServiceCard>
        </Grid>

        {/* Job Post Promotion */}
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
              <WorkIcon color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h5">Đẩy tin tuyển dụng</Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" paragraph>
              Chọn tin tuyển dụng bạn muốn đẩy lên đầu trang - 200.000 VNĐ/tin
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom>
                  Danh sách tin tuyển dụng
                </Typography>
                {jobPosts.map((post) => (
                  <JobPostCard 
                    key={post.id}
                    selected={selectedPosts.includes(post.id)}
                    onClick={() => handlePostSelection(post.id)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Checkbox
                        checked={selectedPosts.includes(post.id)}
                        onChange={() => handlePostSelection(post.id)}
                      />
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {post.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {post.company} • Đăng ngày: {post.date}
                        </Typography>
                      </Box>
                    </Box>
                  </JobPostCard>
                ))}
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, bgcolor: 'rgba(68, 29, 160, 0.03)' }}>
                  <Typography variant="h6" gutterBottom>
                    Tổng thanh toán
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Số tin đã chọn: {selectedPosts.length}
                  </Typography>
                  <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedPosts.length * 200000)}
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth
                    disabled={selectedPosts.length === 0}
                  >
                    Đẩy tin đã chọn
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>

      {/* Purchase History */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Lịch sử giao dịch
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
                        onChange={() => handleStatusToggle(item.id)}
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
    </Stack>
  );
};

export default AdvertisingPage;