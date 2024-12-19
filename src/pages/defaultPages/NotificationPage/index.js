import React from 'react';
import { Card } from '@mui/material';

import { TabTitle } from '../../../utils/generalFunction';
import NotificationCard from '../../components/defaults/NotificationCard';

const NotificationPage = () => {
  TabTitle("Thông báo mới")

  return (
    <Card sx={{ p: { xs: 2, sm: 2, md: 2, lg: 3, xl: 3 } }}>
      {/* Start: NotificationCard */}
      <NotificationCard title="Thông báo mới" />
      {/* End: NotificationCard  */}
    </Card>
  );
};

export default NotificationPage;
