import React, { useEffect, useState } from "react"
import ReactStars from "react-rating-stars-component"
import { Swiper, SwiperSlide } from "swiper/react"
import { FaStar } from "react-icons/fa"

// Swiper styles
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import "../../App.css"

// Swiper modules
import { Autoplay, FreeMode, Pagination } from "swiper/modules"

// API
import { apiConnector } from "../../services/apiConnector"
import { ratingsEndpoints } from "../../services/apis"

function ReviewSlider() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const truncateWords = 15

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await apiConnector(
          "GET",
          ratingsEndpoints.REVIEWS_DETAILS_API
        )
        if (data?.success) {
          const finalData = data?.data
          
          // Smooth Loop Fix: Duplicate data if less than 8 items
          if (finalData.length > 0 && finalData.length < 8) {
            setReviews([...finalData, ...finalData])
          } else {
            setReviews(finalData)
          }
        }
      } catch (error) {
        console.error("Error fetching reviews:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[150px] items-center justify-center text-white">
        <div className="spinner"></div> {/* Replace with your loader if you have one */}
      </div>
    )
  }

  return (
    <div className="text-white w-full">
      <div className="my-[50px] h-auto max-w-maxContentTab lg:max-w-maxContent mx-auto px-4">
        <Swiper
          key={reviews.length}
          loop={reviews.length > 1}
          spaceBetween={15}
          freeMode={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            // Mobile: Exactly 2 slides
            320: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            // Tablet: 2.2 slides (shows a peek of the 3rd)
            640: {
              slidesPerView: 3,
              spaceBetween: 15,
            },
            // Desktop
            1024: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            // Large Desktop
            1280: {
              slidesPerView: 4,
              spaceBetween: 25,
            },
          }}
          modules={[FreeMode, Pagination, Autoplay]}
          className="w-full pb-12"
        >
          {reviews.map((review, i) => (
            <SwiperSlide key={review?._id || i}>
              <div className="flex flex-col gap-2 md:gap-3 bg-richblack-800 p-3 md:p-4 text-[12px] md:text-[14px] text-richblack-25 rounded-lg min-h-[180px] md:min-h-[220px] border border-richblack-700 hover:scale-[1.02] transition-all duration-200">
                
                {/* User Info Header */}
                <div className="flex items-center gap-2 md:gap-4">
                  <img
                    src={
                      review?.user?.image ||
                      `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName}`
                    }
                    alt={`${review?.user?.firstName} profile`}
                    className="h-8 w-8 md:h-10 md:w-10 rounded-full object-cover border border-richblack-600"
                    loading="lazy"
                  />
                  <div className="flex flex-col min-w-0">
                    <p className="font-semibold text-richblack-5 truncate text-[13px] md:text-[16px]">
                      {review?.user?.firstName} {review?.user?.lastName}
                    </p>
                    <p className="text-[10px] md:text-[12px] font-medium text-richblack-500 truncate">
                      {review?.course?.courseName}
                    </p>
                  </div>
                </div>

                {/* Review Text with Line Clamping */}
                <p className="font-medium text-richblack-25 leading-snug md:leading-relaxed italic line-clamp-4 md:line-clamp-none">
                  "{review?.review.split(" ").length > truncateWords
                    ? `${review.review.split(" ").slice(0, truncateWords).join(" ")}...`
                    : review.review}"
                </p>

                {/* Rating Section */}
                <div className="flex items-center gap-2 mt-auto">
                  <span className="font-semibold text-yellow-100 text-[14px] md:text-[16px]">
                    {review.rating.toFixed(1)}
                  </span>
                  
                  {/* Star scaling for mobile */}
                  <div className="scale-[0.7] md:scale-100 origin-left">
                    <ReactStars
                      count={5}
                      value={review.rating}
                      size={20}
                      edit={false}
                      activeColor="#ffd700"
                      emptyIcon={<FaStar />}
                      fullIcon={<FaStar />}
                    />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default ReviewSlider