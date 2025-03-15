import React from 'react';
import {
  Card,
  Box,
  Grid,
  Typography,
  Divider,
  Checkbox,
  Button,
  Paper,
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import { JobPostCard } from './StyledComponents';

const JobPostPromotion = ({ 
  jobPosts, 
  selectedPosts, 
  onPostSelection 
}) => {
  const pricePerPost = 200000;

  return (
    <Card sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
        <WorkIcon color="primary" sx={{ fontSize: 40 }} />
        <Typography variant="h5">Đẩy tin tuyển dụng</Typography>
      </Box>
      <Typography variant="body1" color="text.secondary" paragraph>
        Chọn tin tuyển dụng bạn muốn đẩy lên đầu trang - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(pricePerPost)}/tin
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
              onClick={() => onPostSelection(post.id)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  checked={selectedPosts.includes(post.id)}
                  onChange={() => onPostSelection(post.id)}
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
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedPosts.length * pricePerPost)}
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
  );
};

export default JobPostPromotion;
