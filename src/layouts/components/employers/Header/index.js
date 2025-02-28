import React from 'react';
import { useSelector } from 'react-redux';
import {
  AppBar,
  Avatar,
  Box,
  Card,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';

import UserMenu from '../../commons/UserMenu';
import AccountSwitchMenu from '../../commons/AccountSwitchMenu';
import NotificationCard from '../../../../components/NotificationCard';
import ChatCard from '../../../../components/ChatCard';

const Header = ({ drawerWidth, handleDrawerToggle }) => {
  const { currentUser, isAuthenticated } = useSelector((state) => state.user);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const authArea = (
    <Box sx={{ flexGrow: 0, ml: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
      {/* Balance Display */}
      <Card
        variant="outlined"
        sx={{
          p: '6px 16px',
          borderRadius: 50,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderColor: '#7e57c2',
          backdropFilter: 'blur(8px)',
          display: {
            xs: 'none',
            sm: 'flex',
          },
          alignItems: 'center',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            transform: 'translateY(-1px)',
          },
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography
            variant="body2"
            sx={{
              color: 'white',
              opacity: 0.9,
              fontWeight: 500,
            }}
          >
            Số dư:
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentUser?.balance || 0)}
          </Typography>
        </Stack>
      </Card>

      <Card
        variant="outlined"
        onClick={handleOpenUserMenu}
        sx={{
          p: 0.5,
          borderRadius: 50,
          backgroundColor: 'transparent',
          borderColor: '#7e57c2',
          cursor: 'pointer',
        }}
      >
        <Stack direction="row" justifyContent="center" alignItems="center">
          <Avatar alt="Remy Sharp" src={currentUser?.avatarUrl} />
          <Typography
            variant="subtitle1"
            sx={{
              px: 1,
              color: (theme) =>
                theme.palette.mode === 'light' ? 'white' : 'white',
              display: {
                xs: 'none',
                sm: 'block',
                md: 'block',
                lg: 'block',
                xl: 'block',
              },
            }}
          >
            {currentUser?.fullName}
          </Typography>
        </Stack>
      </Card>
      {/* Start: User menu */}
      <UserMenu
        anchorElUser={anchorElUser}
        open={Boolean(anchorElUser)}
        handleCloseUserMenu={handleCloseUserMenu}
      />
      {/* End: User menu */}
    </Box>
  );

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { xl: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { xl: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Start: Account switch menu */}
          <AccountSwitchMenu />
          {/* Start: Account switch menu */}
        </Toolbar>

        <Toolbar>
          {/* start: NotificationCard */}
          {isAuthenticated && <NotificationCard />}
          {/* End: NotificationCard */}

          {/* start: ChatCard */}
          {isAuthenticated && <ChatCard />}
          {/* End: ChatCard */}

          {/* Start: authArea */}
          {authArea}
          {/* End: authArea */}
        </Toolbar>
      </Stack>
    </AppBar>
  );
};

export default Header;
