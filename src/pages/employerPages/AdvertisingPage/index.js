import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Grid, Stack } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import { TabTitle } from '../../../utils/generalFunction';
import BalanceDisplay from './components/BalanceDisplay';
import ServiceCard from './components/ServiceCard';
import JobPostPromotion from './components/JobPostPromotion';
import PurchaseHistory from './components/PurchaseHistory';
import myjobService from '../../../services/myjobService';

const AdvertisingPage = () => {
  TabTitle('Dịch vụ quảng cáo - Nhà tuyển dụng');
  const { currentUser } = useSelector((state) => state.user);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [openBannerForm, setOpenBannerForm] = useState(false);
  const [openPopupForm, setOpenPopupForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState('');
  const [purchaseHistory, setPurchaseHistory] = useState([
    { id: 1, service: 'Banner Quảng cáo', date: '2024-02-12', price: 10000, status: 'Đang hoạt động' },
    { id: 2, service: 'Popup Quảng cáo', date: '2024-02-10', price: 8000, status: 'Đã kết thúc' },
    { id: 3, service: 'Đẩy tin tuyển dụng', date: '2024-02-08', price: 2000, status: 'Đang hoạt động' },
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
    console.log(file)
    if (file) {
      setSelectedImage(file);
      setError('');
    }
  };

  const handleServicePurchase = (serviceType, price, url) => {
    console.log(url)
    // alert(price)
    myjobService.createUserBanner({
      link: url,
      file: selectedImage
    })
    if ((currentUser?.money || 0) < price) {
      setError('Số dư không đủ để thực hiện giao dịch này');
      return;
    }
    setError('');
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

  // Mock data for job posts
  const jobPosts = [
    { id: 1, title: 'Senior Frontend Developer', company: 'Tech Corp', date: '2024-02-12' },
    { id: 2, title: 'Backend Engineer', company: 'Digital Solutions', date: '2024-02-11' },
    { id: 3, title: 'Full Stack Developer', company: 'Web Systems', date: '2024-02-10' },
  ];

  const bannerFeatures = [
    {
      primary: 'Kích thước banner: 1920x400 px',
      secondary: 'Hiển thị trên tất cả các trang',
    },
    {
      primary: 'Thời gian hiển thị: 7 ngày',
      secondary: '24/7 không giới hạn lượt xem',
    },
  ];

  const popupFeatures = [
    {
      primary: 'Kích thước popup: 400x800 px',
      secondary: 'Hiển thị ở giữa màn hình',
    },
    {
      primary: 'Thời gian hiển thị: 5 ngày',
      secondary: 'Tối đa 3 lần/người dùng/ngày',
    },
  ];

  return (
    <Stack spacing={3}>
      {/* <BalanceDisplay balance={currentUser?.balance} /> */}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ServiceCard
            icon={ImageIcon}
            title="Quảng cáo Banner"
            price={10000}
            description="Hiển thị hình ảnh của bạn ở vị trí banner đầu trang"
            features={bannerFeatures}
            isFormOpen={openBannerForm}
            onFormOpen={() => setOpenBannerForm(true)}
            onFormClose={() => setOpenBannerForm(false)}
            selectedImage={selectedImage}
            onImageChange={handleImageChange}
            onServicePurchase={handleServicePurchase}
            error={error}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <ServiceCard
            icon={OpenInNewIcon}
            title="Quảng cáo Popup"
            price={8000}
            description="Hiển thị popup quảng cáo khi người dùng truy cập website"
            features={popupFeatures}
            isFormOpen={openPopupForm}
            onFormOpen={() => setOpenPopupForm(true)}
            onFormClose={() => setOpenPopupForm(false)}
            selectedImage={selectedImage}
            onImageChange={handleImageChange}
            onServicePurchase={handleServicePurchase}
            error={error}
          />
        </Grid>

        <Grid item xs={12}>
          <JobPostPromotion
            jobPosts={jobPosts}
            selectedPosts={selectedPosts}
            onPostSelection={handlePostSelection}
          />
        </Grid>
      </Grid>

      <PurchaseHistory
        purchaseHistory={purchaseHistory}
        onStatusToggle={handleStatusToggle}
      />
    </Stack>
  );
};

export default AdvertisingPage;