"use client"

import * as React from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import Moment from "react-moment"
import "moment/locale/vi"
import { Badge, Box, Grid, IconButton, Menu, Stack, Typography } from "@mui/material"
import NotificationsIcon from "@mui/icons-material/Notifications"
import ClearIcon from "@mui/icons-material/Clear"

import { IMAGES } from "../../configs/constants"
import MuiImageCustom from "../MuiImageCustom"
import myjobService from "../../services/myjobService"

const PAGE_SIZE = 5

const NotificationCard = () => {
  const nav = useNavigate()
  const { currentUser } = useSelector((state) => state.user)
  const [count, setCount] = React.useState(0)
  const [badgeCount, setBadgeCount] = React.useState(0)
  const [notifications, setNotifications] = React.useState([])
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [page, setPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [loading, setLoading] = React.useState(false)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
    // Load notifications when menu is opened
    fetchNotifications()
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  // Fetch notifications from service
  const fetchNotifications = async (loadMore = false) => {
    if (loading) return

    try {
      setLoading(true)
      const currentPage = loadMore ? page + 1 : 1

      // Call your service
      const response = await myjobService.geNotification({
        page: currentPage,
        limit: PAGE_SIZE,
      })

      if (response.success) {
        const { notifications: newNotifications, pagination } = response.data

        if (loadMore) {
          setNotifications([...notifications, ...newNotifications])
        } else {
          setNotifications(newNotifications)
        }

        setPage(pagination.currentPage)
        setTotalPages(pagination.totalPages)
        setCount(pagination.totalItems)
        setBadgeCount(newNotifications.filter((n) => !n.read).length)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  // Load more notifications
  const loadMore = () => {
    if (page < totalPages) {
      fetchNotifications(true)
    }
  }

  // Mark notification as read
  const handleRead = async (id) => {
    try {
      const response = await myjobService.markNotificationAsRead(id)

      if (response.success) {
        // Update local state
        const index = notifications.findIndex((value) => value.id === id)
        if (index > -1) {
          const newNotifications = [...notifications]
          newNotifications[index].read = true
          setNotifications(newNotifications)
          setBadgeCount((prev) => Math.max(0, prev - 1))
        }
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  // Remove a notification
  const handleRemove = async (id) => {
    try {
      const response = await myjobService.deleteNotification(id)

      if (response.success) {
        // Remove from local state
        const index = notifications.findIndex((value) => value.id === id)
        if (index > -1) {
          const newNotifications = [...notifications]
          const removedNotification = newNotifications.splice(index, 1)[0]
          setNotifications(newNotifications)

          // Update counts
          setCount((prev) => prev - 1)
          if (!removedNotification.read) {
            setBadgeCount((prev) => Math.max(0, prev - 1))
          }
        }
      }
    } catch (error) {
      console.error("Error removing notification:", error)
    }
  }

  // Remove all notifications
  const handleRemoveAll = async () => {
    try {
      const response = await myjobService.deleteAllNotifications()

      if (response.success) {
        // Clear local state
        setNotifications([])
        setCount(0)
        setBadgeCount(0)
      }
    } catch (error) {
      console.error("Error removing all notifications:", error)
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).getTime()
    } catch (error) {
      return Date.now()
    }
  }

  // Handle notification click based on type
  const handleClickItem = (item) => {
    switch (item.type) {
      case "SYSTEM":
        handleRead(item.id)
        nav("/")
        break
      case "EMPLOYER_VIEWED_RESUME":
        handleRead(item.id)
        nav("/ung-vien/cong-ty-cua-toi")
        break
      case "EMPLOYER_SAVED_RESUME":
        handleRead(item.id)
        nav("/ung-vien/cong-ty-cua-toi")
        break
      case "APPLY_STATUS":
        handleRead(item.id)
        nav("/ung-vien/viec-lam-cua-toi")
        break
      case "COMPANY_FOLLOWED":
        handleRead(item.id)
        nav("/nha-tuyen-dung/danh-sach-ung-vien")
        break
      case "POST_VERIFY_RESULT":
        handleRead(item.id)
        nav("/nha-tuyen-dung/tin-tuyen-dung")
        break
      case "APPLY_JOB":
        handleRead(item.id)
        nav(`/nha-tuyen-dung/chi-tiet-ung-vien/${item.resumeSlug || ""}`)
        break
      default:
        break
    }

    handleClose()
  }

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <IconButton
          size="large"
          aria-label="show new notifications"
          color="inherit"
          onClick={handleClick}
          className={badgeCount > 0 ? "pulse-animation" : ""}
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
              {loading && notifications.length === 0 ? (
                <Typography textAlign="center" variant="body2" color="gray">
                  Đang tải thông báo...
                </Typography>
              ) : notifications.length === 0 ? (
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
                      bgcolor: value?.read ? "transparent" : "rgba(25, 118, 210, 0.08)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: "rgba(25, 118, 210, 0.12)",
                      },
                    }}
                  >
                    <Box sx={{ cursor: "pointer" }} onClick={() => handleClickItem(value)}>
                      <MuiImageCustom
                        width={65}
                        height={65}
                        src={value?.imageUrl || IMAGES.notificationImageDefault}
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
                    <Box sx={{ cursor: "pointer" }} flex={1} onClick={() => handleClickItem(value)}>
                      <Stack>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            fontSize={14}
                            style={{
                              fontWeight: value?.read === true ? "normal" : "bold",
                            }}
                          >
                            {value.title}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="#616161">
                            {value.message}
                          </Typography>
                        </Box>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="caption" fontSize={12} color="#bdbdbd">
                            <Moment fromNow>{formatDate(value.date)}</Moment>
                          </Typography>
                          <Typography variant="caption" fontSize={12}>
                            {value?.read === true ? (
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
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemove(value.id)
                        }}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Stack>
                ))
              )}
              {loading && notifications.length > 0 && (
                <Typography textAlign="center" variant="body2" color="gray">
                  Đang tải thêm...
                </Typography>
              )}
            </Stack>
          </Box>
          <Box>
            <Grid container>
              <Grid item xs={4}></Grid>
              <Grid item xs={4}>
                {!loading && notifications.length > 0 && page < totalPages && (
                  <Stack direction="row" alignItems="center" justifyContent="center">
                    <Typography
                      fontWeight="bold"
                      textAlign="center"
                      color="primary"
                      sx={{ cursor: "pointer" }}
                      onClick={loadMore}
                    >
                      Xem thêm
                    </Typography>
                  </Stack>
                )}
              </Grid>
              <Grid item xs={4}>
                {notifications.length > 0 && (
                  <Stack direction="row" justifyContent="flex-end">
                    <Typography
                      variant="caption"
                      color="error"
                      textAlign="center"
                      sx={{ cursor: "pointer" }}
                      onClick={handleRemoveAll}
                    >
                      Xóa tất cả
                    </Typography>
                  </Stack>
                )}
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Menu>
    </React.Fragment>
  )
}

export default NotificationCard
