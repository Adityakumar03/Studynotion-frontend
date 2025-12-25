import React from "react"
import { RiEditBoxLine } from "react-icons/ri"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import IconBtn from "../../../Common/IconBtn"

export default function MyProfile() {
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()

  // Data array for the Personal Details section to keep JSX clean
  const personalDetails = [
    { label: "First Name", value: user?.firstName },
    { label: "Last Name", value: user?.lastName },
    { label: "Email", value: user?.email, wrap: "break-all" },
    { 
        label: "Phone Number", 
        value: user?.additionalDetails?.contactNumber ?? "Add Contact Number" 
    },
    { 
        label: "Gender", 
        value: user?.additionalDetails?.gender ?? "Add Gender" 
    },
    { 
        label: "Date of Birth", 
        value: user?.additionalDetails?.dateOfBirth ?? "Add Date of Birth" 
    },
  ]

  return (
    <div className="flex flex-col gap-y-10 px-4 md:px-0">
      <h1 className="mb-1 mt-4 text-3xl font-medium text-richblack-5">
        My Profile
      </h1>

      {/* SECTION 1: Image, Name, and Email */}
      <div className="flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 md:p-8 md:px-12">
        <div className="flex items-center gap-x-4 min-w-0">
          <img
            src={user?.image}
            alt={`profile-${user?.firstName}`}
            className="aspect-square w-[60px] md:w-[78px] rounded-full object-cover border-2 border-richblack-700"
          />
          <div className="flex flex-col justify-center min-w-0">
            <p className="text-lg font-semibold text-richblack-5 truncate">
              {user?.firstName + " " + user?.lastName}
            </p>
            <p className="text-sm text-richblack-300 truncate">
              {user?.email}
            </p>
          </div>
        </div>
        <div className="flex-shrink-0">
          <IconBtn
            text="Edit"
            onclick={() => navigate("/dashboard/settings")}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>
      </div>

      {/* SECTION 2: About Card */}
      <div className="flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 md:p-8 md:px-12">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-lg font-semibold text-richblack-5">About</h2>
          <IconBtn
            text="Edit"
            onclick={() => navigate("/dashboard/settings")}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>
        <p className={`${user?.additionalDetails?.about ? "text-richblack-5" : "text-richblack-400"} text-sm font-medium leading-relaxed`}>
          {user?.additionalDetails?.about ?? "Write Something About Yourself"}
        </p>
      </div>

      {/* SECTION 3: Personal Details Grid */}
      <div className="flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 md:p-8 md:px-12">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-lg font-semibold text-richblack-5">Personal Details</h2>
          <IconBtn
            text="Edit"
            onclick={() => navigate("/dashboard/settings")}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>

        <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-2 lg:grid-cols-3">
          {personalDetails.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-y-1 min-w-0">
              <p className="text-xs text-richblack-600 uppercase font-semibold">
                {item.label}
              </p>
              <p className={`text-sm font-medium text-richblack-5 ${item.wrap || "truncate"}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}