export default function IconBtn({
  text,
  onClick,
  children,
  disabled,
  outline = false,
  customClasses,
  type = "button",
}) {
  return (
    <button
      disabled={disabled}
      onClick={(e) => {
        console.log("Button clicked!"); // Check your browser console (F12)
        if (onClick) onClick(e);
      }}
      className={`flex items-center justify-center w-fit relative z-30 ${
        outline ? "border border-yellow-50 bg-transparent" : "bg-yellow-50"
      } cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 transition-all duration-200 hover:scale-95 disabled:bg-richblack-500 ${customClasses}`}
      type={type}
    >
      {children ? (
        <div className="flex items-center gap-x-2 pointer-events-none">
          <span className={`${outline ? "text-yellow-50" : "text-richblack-900"}`}>
            {text}
          </span>
          {children}
        </div>
      ) : (
        text
      )}
    </button>
  )
}