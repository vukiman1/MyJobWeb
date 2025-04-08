// hooks/useAdsPopup.js
import { useEffect, useState } from 'react';
import axios from 'axios';

export const useAdsPopup = () => {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    axios.get('/api/ads/popups')
      .then((res) => {
        setAds(res.data?.data || []);
      })
      .catch((err) => {
        console.error('Lỗi lấy quảng cáo:', err);
      });
  }, []);

  return ads;
};
