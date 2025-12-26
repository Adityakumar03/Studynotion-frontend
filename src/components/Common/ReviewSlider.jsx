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
  const truncateWords = 15

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await apiConnector(
          "GET",
          ratingsEndpoints.REVIEWS_DETAILS_API
        )
        if (data?.success) {
          const finalData = data?.data;
          
          // FIX: If there are too few slides for a loop (less than 8), 
          // we duplicate them to ensure the loop is always smooth and warning-free.
          if (finalData.length > 0 && finalData.length < 8) {
            setReviews([...finalData, ...finalData]);
          } else {
            setReviews(finalData);
          }
        }
      } catch (error) {
        console.error("Error fetching reviews:", error)
      }
    })()
  }, [])

  return (
    <div className="text-white w-full">
      <div className="my-[50px] h-auto max-w-maxContentTab lg:max-w-maxContent mx-auto">
        <Swiper
          // Key forces refresh when data loads
          key={reviews.length}
          // Loop is now safe because of our duplication logic above
          loop={reviews.length > 1}
          spaceBetween={20}
          freeMode={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          // RESPONSIVE BREAKPOINTS
          breakpoints={{
            // Mobile (Small)
            320: {
              slidesPerView: 2,
              spaceBetween: 8,
            },
            // Tablet
            640: {
              slidesPerView: 3,
              spaceBetween: 15,
            },
            // Desktop (Medium)
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
          className="w-full"
        >
          {reviews.map((review, i) => (
            <SwiperSlide key={i}>
              <div className="flex flex-col gap-3 bg-richblack-800 p-4 text-[14px] text-richblack-25 rounded-lg min-h-[180px] border border-richblack-700">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      review?.user?.image
                        ? review.user.image
                        : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                    }
                    alt={`${review?.user?.firstName} profile`}
                    className="h-10 w-10 rounded-full object-cover border border-richblack-600"
                  />
                  <div className="flex flex-col">
                    <h1 className="font-semibold text-richblack-5">
                      {review?.user?.firstName} {review?.user?.lastName}
                    </h1>
                    <h2 className="text-[12px] font-medium text-richblack-500">
                      {review?.course?.courseName}
                    </h2>
                  </div>
                </div>

                <p className="font-medium text-richblack-25 leading-relaxed">
                  {review?.review.split(" ").length > truncateWords
                    ? `${review.review
                        .split(" ")
                        .slice(0, truncateWords)
                        .join(" ")} ...`
                    : review.review}
                </p>

                <div className="flex items-center gap-2 mt-auto">
                  <h3 className="font-semibold text-yellow-100">
                    {review.rating.toFixed(1)}
                  </h3>
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
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default ReviewSlider