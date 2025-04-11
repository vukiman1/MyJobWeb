"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  Chip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
  Tooltip,
  IconButton,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material"
import { Visibility, Image, CalendarToday, Bolt, OpenInNew, Refresh } from "@mui/icons-material"
import Swal from "sweetalert2"
import companyService from "../../../../services/companyService"

// Định dạng ngày tháng
const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }
  return new Date(dateString).toLocaleDateString("vi-VN", options)
}

// Kiểm tra xem dịch vụ có hết hạn chưa
const isExpired = (endDate) => {
  return new Date(endDate) < new Date()
}

// Component chính
const ServiceManagement = ({ jobServices = [], bannerServices = [], onUpdateJobServices, onUpdateBannerServices }) => {
  const [tabValue, setTabValue] = useState(0)
  const [loading, setLoading] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: "",
    id: null,
    action: "",
    currentStatus: false,
  })
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
  const [previewDialog, setPreviewDialog] = useState({ open: false, imageUrl: "" })

  // Lưu trữ dữ liệu cục bộ để hiển thị
  const [localJobServices, setLocalJobServices] = useState(jobServices)
  const [localBannerServices, setLocalBannerServices] = useState(bannerServices)

  // Cập nhật dữ liệu cục bộ khi props thay đổi
  useEffect(() => {
    setLocalJobServices(jobServices)
    setLocalBannerServices(bannerServices)
  }, [jobServices, bannerServices])

  // Xử lý chuyển tab
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  // Xử lý bật/tắt dịch vụ
  const handleToggleService = (type, id, currentStatus) => {
    setConfirmDialog({
      open: true,
      type: type,
      id: id,
      action: currentStatus ? "tắt" : "bật",
      currentStatus: currentStatus,
    })
  }

  // Xác nhận thay đổi trạng thái
  const confirmToggleService = async () => {
    const { type, id, action, currentStatus } = confirmDialog
    setLoading(true)

    try {
      // Gọi API tương ứng dựa vào loại dịch vụ
      if (type === "banner") {
        await companyService.updateBannerStatus(id)

        // Cập nhật dữ liệu cục bộ trước
        const updatedBanners = localBannerServices.map((banner) =>
          banner.id === id ? { ...banner, isActive: !banner.isActive } : banner,
        )
        setLocalBannerServices(updatedBanners)

        // Thông báo cho component cha cập nhật state
        if (onUpdateBannerServices) {
          onUpdateBannerServices(updatedBanners)
        }
      } else if (type === "job") {
        await companyService.updateJobStatus(id)

        // Cập nhật dữ liệu cục bộ trước
        const updatedJobs = localJobServices.map((job) => (job.id === id ? { ...job, isUrgent: !job.isUrgent } : job))
        setLocalJobServices(updatedJobs)

        // Thông báo cho component cha cập nhật state
        if (onUpdateJobServices) {
          onUpdateJobServices(updatedJobs)
        }
      }

      // Hiển thị thông báo thành công
      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: `Đã ${action} dịch vụ thành công.`,
        confirmButtonText: "Đóng",
        confirmButtonColor: "#3085d6",
        background: "#f0f9ff",
        color: "#333",
        customClass: {
          popup: "rounded-xl shadow-md",
          title: "text-lg font-semibold",
        },
      })

      setSnackbar({
        open: true,
        message: `Đã ${action} dịch vụ thành công`,
        severity: "success",
      })
    } catch (error) {
      console.error("Error toggling service:", error)
      setSnackbar({
        open: true,
        message: `Có lỗi xảy ra: ${error.message || "Không thể thay đổi trạng thái dịch vụ"}`,
        severity: "error",
      })
    } finally {
      setLoading(false)
      setConfirmDialog({ ...confirmDialog, open: false })
    }
  }

  // Xem trước hình ảnh banner
  const handlePreviewImage = (imageUrl) => {
    setPreviewDialog({
      open: true,
      imageUrl,
    })
  }

  // Đóng dialog xem trước
  const handleClosePreview = () => {
    setPreviewDialog({
      ...previewDialog,
      open: false,
    })
  }

  // Đóng snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  // Làm mới dữ liệu
  const handleRefresh = async () => {
    setSnackbar({
      open: true,
      message: "Đang làm mới dữ liệu...",
      severity: "info",
    })

    try {
      // Gọi API để lấy dữ liệu mới
      const response = await companyService.getPaymentServices()

      // Cập nhật dữ liệu cục bộ
      setLocalJobServices(response.jobService)
      setLocalBannerServices(response.bannerService)

      // Thông báo cho component cha cập nhật state
      if (onUpdateJobServices) {
        onUpdateJobServices(response.jobService)
      }

      if (onUpdateBannerServices) {
        onUpdateBannerServices(response.bannerService)
      }

      setSnackbar({
        open: true,
        message: "Đã làm mới dữ liệu thành công",
        severity: "success",
      })
    } catch (error) {
      console.error("Error refreshing data:", error)
      setSnackbar({
        open: true,
        message: `Không thể làm mới dữ liệu: ${error.message}`,
        severity: "error",
      })
    }
  }

  return (
    <Card elevation={3}>
      <CardHeader
        title={
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Quản lý dịch vụ</Typography>
            <Tooltip title="Làm mới dữ liệu">
              <IconButton onClick={handleRefresh} size="small">
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
        }
        subheader="Bật/tắt banner và tin tuyển dụng gấp"
      />

      <Divider />

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab
            icon={<Image fontSize="small" />}
            iconPosition="start"
            label={`Banner (${localBannerServices.length})`}
            id="tab-0"
          />
          <Tab
            icon={<Bolt fontSize="small" />}
            iconPosition="start"
            label={`Tin tuyển dụng gấp (${localJobServices.length})`}
            id="tab-1"
          />
        </Tabs>
      </Box>

      <CardContent>
        {/* Tab Banner */}
        <TabPanel value={tabValue} index={0}>
          {localBannerServices.length > 0 ? (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Hình ảnh</TableCell>
                    <TableCell>Liên kết</TableCell>
                    <TableCell>Loại</TableCell>
                    <TableCell>Ngày hết hạn</TableCell>
                    <TableCell align="center">Trạng thái</TableCell>
                    <TableCell align="center">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {localBannerServices.map((banner) => {
                    const expired = isExpired(banner.endDate)

                    return (
                      <TableRow key={banner.id} hover>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<Visibility />}
                              onClick={() => handlePreviewImage(banner.imageUrl)}
                            >
                              Xem
                            </Button>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Link
                            href={
                              banner.buttonLink.startsWith("http") ? banner.buttonLink : `https://${banner.buttonLink}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                          >
                            {banner.buttonLink}
                            <OpenInNew fontSize="small" />
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Chip label={banner.type === "BANNER" ? "Banner" : "Popup"} color="primary" size="small" />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <CalendarToday fontSize="small" color="action" />
                            <Typography variant="body2" color={expired ? "error" : "textPrimary"}>
                              {formatDate(banner.endDate)}
                            </Typography>
                          </Box>
                          {expired && <Chip label="Đã hết hạn" color="error" size="small" sx={{ mt: 0.5 }} />}
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={!banner.isActive ? "Đã tắt" : "Đang hiển thị"}
                            color={!banner.isActive ? "default" : "success"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title={!banner.isActive ? "Bật hiển thị" : "Tắt hiển thị"}>
                            <Switch
                              checked={banner.isActive}
                              onChange={() => handleToggleService("banner", banner.id, banner.isActive)}
                              color="success"
                              disabled={expired}
                            />
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info" sx={{ mt: 2 }}>
              Bạn chưa có dịch vụ banner nào đang hoạt động.
            </Alert>
          )}
        </TabPanel>

        {/* Tab Tin tuyển dụng gấp */}
        <TabPanel value={tabValue} index={1}>
          {localJobServices.length > 0 ? (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tên công việc</TableCell>
                    <TableCell>Hạn nộp hồ sơ</TableCell>
                    <TableCell align="center">Trạng thái</TableCell>
                    <TableCell align="center">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {localJobServices.map((job) => {
                    const expired = isExpired(job.deadline)

                    return (
                      <TableRow key={job.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {job.jobName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <CalendarToday fontSize="small" color="action" />
                            <Typography variant="body2" color={expired ? "error" : "textPrimary"}>
                              {formatDate(job.deadline)}
                            </Typography>
                          </Box>
                          {expired && <Chip label="Đã hết hạn" color="error" size="small" sx={{ mt: 0.5 }} />}
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            icon={<Bolt />}
                            label={job.isUrgent ? "Đang hiển thị gấp" : "Bình thường"}
                            color={job.isUrgent ? "warning" : "default"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title={job.isUrgent ? "Tắt tin gấp" : "Bật tin gấp"}>
                            <Switch
                              checked={job.isUrgent}
                              onChange={() => handleToggleService("job", job.id, job.isUrgent)}
                              color="warning"
                              disabled={expired}
                            />
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info" sx={{ mt: 2 }}>
              Bạn chưa có tin tuyển dụng gấp nào đang hoạt động.
            </Alert>
          )}
        </TabPanel>
      </CardContent>

      {/* Dialog xác nhận thay đổi trạng thái */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}>
        <DialogTitle>Xác nhận thay đổi</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn {confirmDialog.action} dịch vụ này?
            {confirmDialog.type === "banner" && confirmDialog.action === "tắt" && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                Lưu ý: Banner sẽ không hiển thị cho đến khi bạn bật lại.
              </Typography>
            )}
            {confirmDialog.type === "job" && confirmDialog.action === "tắt" && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                Lưu ý: Tin tuyển dụng sẽ không còn được đánh dấu là "Gấp".
              </Typography>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ ...confirmDialog, open: false })} color="inherit">
            Hủy
          </Button>
          <Button
            onClick={confirmToggleService}
            color="primary"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Đang xử lý..." : "Xác nhận"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xem trước hình ảnh */}
      <Dialog open={previewDialog.open} onClose={handleClosePreview} maxWidth="md" fullWidth>
        <DialogTitle>Xem trước hình ảnh</DialogTitle>
        <DialogContent>
          <Box
            component="img"
            src={previewDialog.imageUrl}
            alt="Banner preview"
            sx={{
              width: "100%",
              height: "auto",
              maxHeight: "70vh",
              objectFit: "contain",
              borderRadius: 1,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview} color="primary">
            Đóng
          </Button>
          <Button
            component="a"
            href={previewDialog.imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
            variant="contained"
            startIcon={<OpenInNew />}
          >
            Mở trong tab mới
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  )
}

// Component TabPanel
function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  )
}

export default ServiceManagement
