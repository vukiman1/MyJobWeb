"use client"

import React, { useState } from "react"
import { Card, Box, Grid, Typography, Divider, Checkbox, Button, Paper, Snackbar, Alert } from "@mui/material"
import WorkIcon from "@mui/icons-material/Work"
import { JobPostCard } from "./StyledComponents"
import companyService from "../../../../services/companyService"
import { useSelector } from "react-redux"

const JobPostPromotion = ({ jobPosts, selectedPosts, onPostSelection }) => {
  const { currentUser } = useSelector((state) => state.user)
  const pricePerPost = 2000
  const [jobLists, setJobLists] = useState([])
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  const loadData = async () => {
    try {
      const resData = await companyService.getJobList(currentUser.id)
      console.log(resData)
      setJobLists(resData.data)
    } catch (error) {
      console.error("Error fetching companies:", error)
      setNotification({
        open: true,
        message: "Không thể tải danh sách tin tuyển dụng",
        severity: "error",
      })
    }
  }

  const handleSubmitSelectedPosts = async () => {
    setLoading(true)
    try {
      
      if (currentUser?.money < pricePerPost * selectedPosts.length) {
        setNotification({
          open: true,
          message: "Số dư không đủ để thực hiện giao dịch này",
          severity: "error",
        })
        throw new Error("Số dư không đủ để thực hiện giao dịch này")
      }
      await companyService.setUrgentJob(selectedPosts)
      console.log("Đã submit các tin:", selectedPosts)
      setNotification({
        open: true,
        message: "Đẩy tin tuyển dụng thành công!",
        severity: "success",
      })
      selectedPosts= ''
      // Reset selection after successful submission
      onPostSelection([], true) // Passing true to indicate a reset operation
      window.location.reload();
    } catch (error) {
      console.error("Error setting urgent jobs:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCloseNotification = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setNotification({ ...notification, open: false })
  }

  React.useEffect(() => {
    loadData()
  }, [])

  return (
    <Card sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 1 }}>
        <WorkIcon color="primary" sx={{ fontSize: 40 }} />
        <Typography variant="h5">Đẩy tin tuyển dụng</Typography>
      </Box>
      <Typography variant="body1" color="text.secondary" paragraph>
        Chọn tin tuyển dụng bạn muốn đẩy lên đầu trang -{" "}
        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(pricePerPost)}/tin
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            Danh sách tin tuyển dụng
          </Typography>
          {jobLists.map((post) => (
            <JobPostCard
              key={post.id}
              selected={selectedPosts.includes(post.id)}
              onClick={() => onPostSelection(post.id)}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Checkbox checked={selectedPosts.includes(post.id)} onChange={() => onPostSelection(post.id)} />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {post.jobName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {post.careerName} • Đăng ngày: {post.createAt}
                  </Typography>
                </Box>
              </Box>
            </JobPostCard>
          ))}
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, bgcolor: "rgba(68, 29, 160, 0.03)" }}>
            <Typography variant="h6" gutterBottom>
              Tổng thanh toán
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Số tin đã chọn: {selectedPosts.length}
            </Typography>
            <Typography variant="h5" color="primary" sx={{ fontWeight: "bold", mb: 2 }}>
              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                selectedPosts.length * pricePerPost,
              )}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              disabled={selectedPosts.length === 0 || loading}
              onClick={handleSubmitSelectedPosts}
            >
              {loading ? "Đang xử lý..." : "Đẩy tin đã chọn"}
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: "100%" }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Card>
  )
}

export default JobPostPromotion

