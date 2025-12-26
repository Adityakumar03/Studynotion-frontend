import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Outlet, useParams } from "react-router-dom"
import { HiMenuAlt2 } from "react-icons/hi" // Standard menu icon

import CourseReviewModal from "../components/core/ViewCourse/CourseReviewModal"
import VideoDetailsSidebar from "../components/core/ViewCourse/VideoDetailsSidebar"
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI"
import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../slices/viewCourseSlice"

export default function ViewCourse() {
  const { courseId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [reviewModal, setReviewModal] = useState(false)
  const [sidebarActive, setSidebarActive] = useState(false) // State for mobile drawer

  useEffect(() => {
    ;(async () => {
      const courseData = await getFullDetailsOfCourse(courseId, token)
      dispatch(setCourseSectionData(courseData.courseDetails.courseContent))
      dispatch(setEntireCourseData(courseData.courseDetails))
      dispatch(setCompletedLectures(courseData.completedVideos))
      let lectures = 0
      courseData?.courseDetails?.courseContent?.forEach((sec) => {
        lectures += sec.subSection.length
      })
      dispatch(setTotalNoOfLectures(lectures))
    })()
  }, [])

  return (
    <>
      <div className="relative flex min-h-[calc(100vh-3.5rem)] flex-col md:flex-row">
        
        {/* Mobile Header (Only visible on small screens) */}
        <div className="flex h-[50px] items-center border-b border-richblack-700 px-4 md:hidden">
            <button 
                onClick={() => setSidebarActive(true)}
                className="text-richblack-100 text-2xl"
            >
                <HiMenuAlt2 />
            </button>
            <span className="ml-4 font-semibold text-richblack-50">Course Content</span>
        </div>

        {/* Sidebar Wrapper */}
        <div className={`
            fixed inset-0 z-[1000] transition-all duration-300 md:relative md:inset-auto md:z-0 md:block
            ${sidebarActive ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}>
            {/* Backdrop for mobile */}
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 md:hidden" 
                onClick={() => setSidebarActive(false)}
            />
            
            <div className="relative h-full w-[250px] md:w-[320px]">
                <VideoDetailsSidebar 
                    setReviewModal={setReviewModal} 
                    setSidebarActive={setSidebarActive} // Pass to close on selection
                />
            </div>
        </div>

        {/* Main Content */}
        <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
          <div className="mx-6 py-10">
            <Outlet />
          </div>
        </div>
      </div>
      
      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </>
  )
}