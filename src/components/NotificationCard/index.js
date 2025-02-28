import * as React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Moment from "react-moment";
import "moment/locale/vi";
import {
  Badge,
  Box,
  Grid,
  IconButton,
  Menu,
  Stack,
  Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ClearIcon from "@mui/icons-material/Clear";

// Comment out Firebase imports
/*
import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  query,
  where,
  startAfter,
  orderBy,
  updateDoc,
  doc,
  writeBatch,
} from 'firebase/firestore';
import db from '../../configs/firebase-config';
*/

import { IMAGES } from "../../configs/constants";
import MuiImageCustom from "../MuiImageCustom";

const PAGE_SIZE = 5;

const NotificationCard = () => {
  const nav = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [count, setCount] = React.useState(0);
  const [badgeCount, setBadgeCount] = React.useState(0);
  const [notifications, setNotifications] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  
  const handleClose = () => {
    setAnchorEl(null);
  };

  React.useEffect(() => {
    // Giả lập số thông báo chưa đọc
    setBadgeCount(0);
    return () => {};
  }, [currentUser.id]);

  React.useEffect(() => {
    // Giả lập tổng số thông báo
    setCount(0);
    return () => {};
  }, [currentUser.id]);

  React.useEffect(() => {
    // Giả lập danh sách thông báo rỗng
    setNotifications([]);
    return () => {};
  }, [currentUser.id]);

  const loadMore = async () => {
    // Không làm gì cả
    console.log("Load more disabled");
  };

  const handleRemove = (key) => {
    // Xóa thông báo khỏi state local
    const index = notifications.findIndex((value) => value.key === key);
    if (index > -1) {
      let newNotifications = [...notifications];
      newNotifications.splice(index, 1);
      setNotifications(newNotifications);
    }
  };

  const handleRead = (key) => {
    // Không làm gì cả
    console.log("Read notification disabled");
  };

  const handleRemoveAll = async () => {
    // Xóa tất cả thông báo khỏi state local
    setNotifications([]);
  };

  const handleClickItem = (item) => {
    switch (item.type) {
      case "SYSTEM":
        handleRead(item.key);
        nav("/");
        break;
      case "EMPLOYER_VIEWED_RESUME":
        handleRead(item.key);
        nav("/ung-vien/cong-ty-cua-toi");
        break;
      case "EMPLOYER_SAVED_RESUME":
        handleRead(item.key);
        nav("/ung-vien/cong-ty-cua-toi");
        break;
      case "APPLY_STATUS":
        handleRead(item.key);
        nav("/ung-vien/viec-lam-cua-toi");
        break;
      case "COMPANY_FOLLOWED":
        handleRead(item.key);
        nav("/nha-tuyen-dung/danh-sach-ung-vien");
        break;
      case "POST_VERIFY_RESULT":
        handleRead(item.key);
        nav("/nha-tuyen-dung/tin-tuyen-dung");
        break;
      case "APPLY_JOB":
        handleRead(item.key);
        nav(
          `/nha-tuyen-dung/chi-tiet-ung-vien/${item["APPLY_JOB"]?.resume_slug}`
        );
        break;
      default:
        break;
    }

    handleClose();
  };

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <IconButton
          size="large"
          aria-label="show new notifications"
          color="inherit"
          onClick={handleClick}
        >
          <Badge badgeContent={badgeCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="noti-menu"
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box style={{ width: 500, maxHeight: 500 }} sx={{ py: 1, px: 1.5 }}>
          <Box style={{ overflowY: "auto", maxHeight: 450 }}>
            <Stack spacing={2} sx={{ p: 1 }}>
              {notifications.length === 0 ? (
                <Typography textAlign="center" variant="body2" color="gray">
                  Chưa có thông báo nào
                </Typography>
              ) : (
                notifications.map((value, idx) => (
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    key={idx}
                    sx={{
                      boxShadow: 1,
                      p: 1,
                      borderRadius: 1.5,
                    }}
                  >
                    <Box
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleClickItem(value)}
                    >
                      <MuiImageCustom
                        width={65}
                        height={65}
                        src={value?.image || IMAGES.notificationImageDefault}
                        sx={{
                          p: 0.5,
                          borderRadius: 1.5,
                          maxHeight: 150,
                          border: 0.5,
                          borderColor: "#d1c4e9",
                        }}
                        duration={500}
                      />
                    </Box>
                    <Box
                      sx={{ cursor: "pointer" }}
                      flex={1}
                      onClick={() => handleClickItem(value)}
                    >
                      <Stack>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            fontSize={14}
                            style={{
                              fontWeight:
                                value?.is_read === true ? "normal" : "bold",
                            }}
                          >
                            {value.title}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="#616161">
                            {value.content}
                          </Typography>
                        </Box>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography
                            variant="caption"
                            fontSize={12}
                            color="#bdbdbd"
                          >
                            <Moment fromNow>
                              {value?.time?.seconds * 1000}
                            </Moment>
                          </Typography>
                          <Typography variant="caption" fontSize={12}>
                            {value?.is_read === true ? (
                              <span style={{ color: "#bdbdbd" }}>Đã đọc</span>
                            ) : (
                              <span style={{ color: "red" }}>Mới</span>
                            )}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Box>
                    <Box>
                      <IconButton
                        aria-label="delete"
                        color="error"
                        size="small"
                        onClick={() => handleRemove(value.key)}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Stack>
                ))
              )}
            </Stack>
          </Box>
          <Box>
            <Grid container>
              <Grid item xs={4}></Grid>
              <Grid item xs={4}>
                {Math.ceil(count / PAGE_SIZE) > 1 && (
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography
                      fontWeight="bold"
                      textAlign="center"
                      color="GrayText"
                    >
                      <span style={{ cursor: "pointer" }} onClick={loadMore}>
                        Xem thêm
                      </span>
                    </Typography>
                  </Stack>
                )}
              </Grid>
              <Grid item xs={4}>
                {notifications.length > 0 && (
                  <Stack direction="row" justifyContent="flex-end">
                    <Typography
                      variant="caption"
                      color="red"
                      textAlign="center"
                    >
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={handleRemoveAll}
                      >
                        Xóa tất cả
                      </span>
                    </Typography>
                  </Stack>
                )}
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Menu>
    </React.Fragment>
  );
};

export default NotificationCard;
