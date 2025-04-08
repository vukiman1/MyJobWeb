"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, EffectFade } from "swiper"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/autoplay"
import "swiper/css/effect-fade"
import { Modal } from "antd"
import { Button } from "@mui/material"
import { CloseOutlined } from "@ant-design/icons"



const PopupAdsSlider = () => {
  const [ads, setAds] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {

    setLoading(true)
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/myjob/web/popup`)
      .then((res) => {
        const list = res.data?.data || []
        if (list.length > 0) {
          setAds(list)
          setOpen(true)
        } 
        setLoading(false)
      })
      .catch((err) => {
        console.error("Lỗi gọi API:", err)
        setError("Không thể tải khuyến mãi")
      
        setLoading(false)
      })
  }, [])



  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      closable={false}
      centered
      width={800}
      bodyStyle={{ padding: 0, borderRadius: 12, overflow: "hidden" }}
      style={{ borderRadius: 12, overflow: "hidden", padding: 0 }}
    >
      <div className="relative">
        <Button
          variant="contained"
          size="small"
          style={{
            position: "absolute",
            right: 12,
            top: 12,
            zIndex: 50,
            minWidth: "unset",
            width: 36,
            height: 36,
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(4px)",
            color: "#333",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          }}
          onClick={() => setOpen(false)}
        >
          <CloseOutlined style={{ fontSize: 16 }} />
        </Button>

        <AdsSlider ads={ads} />
      </div>
    </Modal>
  )
}

// Separate component for the slider
const AdsSlider = ({ ads }) => {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="relative">
      <Swiper
        modules={[Autoplay, EffectFade]}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        effect="fade"
        loop={true}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        style={{ width: "100%", borderRadius: 12 }}
      >
        {ads.map((ad, index) => (
          <SwiperSlide key={index}>
            <div style={{ position: "relative" }}>
              <img
                src={ad.imageUrl || "/placeholder.svg"}
                alt={ad.description || "Khuyến mãi"}
                style={{
                  width: "100%",
                  aspectRatio: "16/9",
                  objectFit: "cover",
                  borderRadius: 12,
                }}
              />

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent, transparent)",
                  borderRadius: 12,
                  opacity: 0.9,
                }}
              />

              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: 16,
                  color: "white",
                }}
              >
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 500,
                    marginBottom: 12,
                  }}
                >
                  {ad.title}
                </h3>

                <a
                  href={ad.buttonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 14,
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(4px)",
                    padding: "8px 16px",
                    borderRadius: 24,
                    transition: "all 0.2s",
                    fontWeight: 500,
                    color: "white",
                    textDecoration: "none",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.3)"
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)"
                  }}
                >
                  Xem chi tiết
                  {/* <ExternalLink style={{ fontSize: 14 }} /> */}
                </a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        style={{
          position: "absolute",
          bottom: 12,
          right: 0,
          left: 0,
          zIndex: 10,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 6,
            padding: "4px 8px",
          }}
        >
          {ads.map((_, index) => (
            <span
              key={index}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                transition: "all 0.3s",
                backgroundColor: index === activeIndex ? "white" : "rgba(255, 255, 255, 0.4)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default PopupAdsSlider

