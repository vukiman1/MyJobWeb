"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Grid, Stack, Backdrop, CircularProgress } from "@mui/material"
import ImageIcon from "@mui/icons-material/Image"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import Swal from "sweetalert2"

import { TabTitle } from "../../../utils/generalFunction"
import ServiceCard from "./components/ServiceCard"
import JobPostPromotion from "./components/JobPostPromotion"
import PurchaseHistory from "./components/PurchaseHistory"
import ServiceManagement from "./components/ServiceManagement"
import myjobService from "../../../services/myjobService"
import companyService from "../../../services/companyService"

const AdvertisingPage = () => {
  TabTitle("Dịch vụ quảng cáo - Nhà tuyển dụng")
  const { currentUser } = useSelector((state) => state.user)
  const [selectedPosts, setSelectedPosts] = useState([])
  const [openBannerForm, setOpenBannerForm] = useState(false)
  const [openPopupForm, setOpenPopupForm] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Dữ liệu cho các dịch vụ
  const [jobServices, setJobServices] = useState([])
  const [bannerServices, setBannerServices] = useState([])
  const [purchaseHistory, setPurchaseHistory] = useState([
    { id: 1, service: "Banner Quảng cáo", date: "2024-02-12", price: 8000, status: "Đang hoạt động" },
    { id: 2, service: "Popup Quảng cáo", date: "2024-02-10", price: 8000, status: "Đã kết thúc" },
    { id: 3, service: "Đẩy tin tuyển dụng", date: "2024-02-08", price: 2000, status: "Đang hoạt động" },
  ])

  // Lấy dữ liệu dịch vụ từ API
  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await companyService.getPaymentServices()
      setJobServices(response.jobService)
      setBannerServices(response.bannerService)
    } catch (error) {
      console.error("Error fetching services:", error)
      setError("Không thể tải dữ liệu dịch vụ")
    } finally {
      setLoading(false)
    }
  }

  // Gọi API khi component được tải
  useEffect(() => {
    fetchServices()
  }, [])

  // Cập nhật dữ liệu job services
  const handleUpdateJobServices = (updatedJobs) => {
    setJobServices(updatedJobs)
  }

  // Cập nhật dữ liệu banner services
  const handleUpdateBannerServices = (updatedBanners) => {
    setBannerServices(updatedBanners)
  }

  const handlePostSelection = (postId) => {
    setSelectedPosts((prev) => (prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]))
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedImage(file)
      setError("")
    }
  }

  const handleServicePurchase = async (serviceType, price, url) => {
    if ((currentUser?.money || 0) < price) {
      setError("Số dư không đủ để thực hiện giao dịch này")
      return
    }

    try {
      setLoading(true)
      await myjobService.createUserBanner({
        link: url,
        file: selectedImage,
        type: serviceType,
      })

      setError("")
      setOpenBannerForm(false)
      setOpenPopupForm(false)
      setSelectedImage(null)

      // Làm mới dữ liệu sau khi mua dịch vụ thành công
      await fetchServices()

      Swal.fire({
        icon: "success",
        title: "Đã mua dịch vụ thành công!",
        text: `Cảm ơn bạn đã sử dụng dịch vụ ${serviceType}.`,
        confirmButtonText: "Đóng",
        confirmButtonColor: "#3085d6",
        background: "#f0f9ff",
        color: "#333",
        customClass: {
          popup: "rounded-xl shadow-md",
          title: "text-lg font-semibold",
        },
      })
    } catch (error) {
      setError("Đã xảy ra lỗi khi mua dịch vụ")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusToggle = (id) => {
    setPurchaseHistory((prevHistory) =>
      prevHistory.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: item.status === "Đang hoạt động" ? "Đã kết thúc" : "Đang hoạt động",
          }
        }
        return item
      }),
    )
  }

  const jobPosts = [
    { id: 1, title: "Senior Frontend Developer", company: "Tech Corp", date: "2024-02-12" },
    { id: 2, title: "Backend Engineer", company: "Digital Solutions", date: "2024-02-11" },
    { id: 3, title: "Full Stack Developer", company: "Web Systems", date: "2024-02-10" },
  ]

  const bannerFeatures = [
    {
      primary: "Kích thước banner: 1920x400 px",
      secondary: "Hiển thị trên tất cả các trang",
    },
    {
      primary: "Thời gian hiển thị: 7 ngày",
      secondary: "24/7 không giới hạn lượt xem",
    },
  ]

  const popupFeatures = [
    {
      primary: "Kích thước popup: 400x800 px",
      secondary: "Hiển thị ở giữa màn hình",
    },
    {
      primary: "Thời gian hiển thị: 5 ngày",
      secondary: "Tối đa 3 lần/người dùng/ngày",
    },
  ]

  return (
    <Stack spacing={3}>
      {/* Loading overlay */}
      <Backdrop open={loading} sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* <BalanceDisplay balance={currentUser?.balance} /> */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ServiceCard
            icon={ImageIcon}
            title="Quảng cáo Banner"
            price={8000}
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
          <JobPostPromotion jobPosts={jobPosts} selectedPosts={selectedPosts} onPostSelection={handlePostSelection} />
        </Grid>
      </Grid>

      <PurchaseHistory purchaseHistory={purchaseHistory} onStatusToggle={handleStatusToggle} />

      {/* Component quản lý dịch vụ với callback để cập nhật state */}
      <ServiceManagement
        jobServices={jobServices}
        bannerServices={bannerServices}
        onUpdateJobServices={handleUpdateJobServices}
        onUpdateBannerServices={handleUpdateBannerServices}
      />
    </Stack>
  )
}

export default AdvertisingPage
