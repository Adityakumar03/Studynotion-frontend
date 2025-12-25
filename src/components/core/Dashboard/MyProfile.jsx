import { RiEditBoxLine } from "react-icons/ri"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { formattedDate } from "../../../utils/dateFormatter"
import IconBtn from "../../Common/IconBtn"

export default function MyProfile() {
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()

  return (
    <div className="mx-auto w-full max-w-[1000px] py-4 md:py-10">
      <h1 className="mb-6 md:mb-10 text-2xl md:text-3xl font-medium text-richblack-5 px-4 md:px-0">
        My Profile
      </h1>

      {/* SECTION 1: Fixed Name Card */}
      <div className="flex flex-col gap-y-4 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-5 md:p-8 md:px-12 mx-4 md:mx-0 shadow-sm">
        {/* MOBILE: items-start + flex-col (Stacks button under text on the left)
            DESKTOP: md:flex-row + md:justify-between (Pushes button to far right)
        */}
        <div className="flex flex-col items-start gap-y-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-x-4">
            <img
              src={user?.image}
              alt={`profile-${user?.firstName}`}
              className="aspect-square w-[60px] md:w-[78px] rounded-full object-cover border-2 border-richblack-700"
            />
            <div className="flex flex-col min-w-0">
              <p className="text-lg font-semibold text-richblack-5 break-words leading-tight">
                {user?.firstName + " " + user?.lastName}
              </p>
              <p className="text-sm text-richblack-300 break-all md:break-normal">
                {user?.email}
              </p>
            </div>
          </div>
          
          {/* self-start pins the button to the LEFT on mobile */}
          <div className="self-end md:self-auto">
            <IconBtn
              text="Edit"
              onclick={() => navigate("/dashboard/settings")}
            >
              <RiEditBoxLine />
            </IconBtn>
          </div>
        </div>
      </div>

      {/* SECTION 2: About (Standard Layout) */}
      <div className="my-6 flex flex-col gap-y-4 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-5 md:p-8 md:px-12 mx-4 md:mx-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-richblack-5">About</h2>
          <IconBtn text="Edit" onclick={() => navigate("/dashboard/settings")}>
            <RiEditBoxLine />
          </IconBtn>
        </div>
        <p className={`${user?.additionalDetails?.about ? "text-richblack-5" : "text-richblack-400"} text-sm font-medium`}>
          {user?.additionalDetails?.about ?? "Write Something About Yourself"}
        </p>
      </div>

      {/* SECTION 3: Personal Details (Standard Layout) */}
      <div className="my-6 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-5 md:p-8 md:px-12 mx-4 md:mx-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-richblack-5">Personal Details</h2>
          <IconBtn text="Edit" onclick={() => navigate("/dashboard/settings")}>
            <RiEditBoxLine />
          </IconBtn>
        </div>
        <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 lg:max-w-[800px]">
          {[
            { label: "First Name", value: user?.firstName },
            { label: "Last Name", value: user?.lastName },
            { label: "Email", value: user?.email, wrap: "break-all" },
            { label: "Phone Number", value: user?.additionalDetails?.contactNumber ?? "Add Contact Number" },
            { label: "Gender", value: user?.additionalDetails?.gender ?? "Add Gender" },
            { label: "Date Of Birth", value: formattedDate(user?.additionalDetails?.dateOfBirth) ?? "Add Date Of Birth" },
          ].map((detail, index) => (
            <div key={index} className="space-y-1">
              <p className="text-xs text-richblack-600">{detail.label}</p>
              <p className={`text-sm font-medium text-richblack-5 ${detail.wrap || ""}`}>
                {detail.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}