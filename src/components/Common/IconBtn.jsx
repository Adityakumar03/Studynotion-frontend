export default function IconBtn({
  text,
  onclick,
  children,
  disabled,
  outline = false,
  customClasses,
  type,
}) {
  return (
    <button
      disabled={disabled}
      onClick={onclick}
      className={`flex items-center justify-center w-fit ${
        outline ? "border border-yellow-50 bg-transparent" : "bg-yellow-50"
      } cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 transition-all duration-200 hover:scale-95 disabled:bg-richblack-500 ${customClasses}`}
      type={type}
    >
      {children ? (
        <>
          <span className={`${outline ? "text-yellow-50" : "text-richblack-900"}`}>
            {text}
          </span>
          {children}
        </>
      ) : (
        text
      )}
    </button>
  )
}