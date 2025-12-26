import { useEffect, useState } from "react"
import { AiOutlineShoppingCart, AiOutlineClose, AiOutlineLogout, AiOutlineDashboard, AiOutlineExclamationCircle } from "react-icons/ai"
import { HiMenuAlt3 } from "react-icons/hi" 
import { BsChevronDown } from "react-icons/bs"
import { useSelector, useDispatch } from "react-redux"
import { Link, matchPath, useLocation, useNavigate } from "react-router-dom"

import logo from "../../assets/Logo/Logo-Full-Light.png"
import { NavbarLinks } from "../../data/navbar-links"
import { sidebarLinks } from "../../data/dashboard-links"
import { apiConnector } from "../../services/apiConnector"
import { categories } from "../../services/apis"
import { ACCOUNT_TYPE } from "../../utils/constants"
import ProfileDropdown from "../core/Auth/ProfileDropdown"
import { logout } from "../../services/operations/authAPI"

function Navbar() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { totalItems } = useSelector((state) => state.cart)
  
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [subLinks, setSubLinks] = useState([])
  const [loading, setLoading] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCatalogOpen, setIsCatalogOpen] = useState(false)
  const [isDashboardOpen, setIsDashboardOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const fetchSublinks = async () => {
    setLoading(true)
    try {
      const res = await apiConnector("GET", categories.CATEGORIES_API)
      setSubLinks(res?.data?.data || [])
    } catch (error) {
      console.log("Could not fetch Categories.", error)
      setSubLinks([])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchSublinks()
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsCatalogOpen(false)
    setIsDashboardOpen(false)
  }, [location.pathname])

  const matchRoute = (route) => {
    if (!route) return false;
    return matchPath({ path: route }, location.pathname)
  }

  const handleLogout = () => {
    setShowLogoutModal(false)
    setIsMobileMenuOpen(false)
    dispatch(logout(navigate))
  }

  // Desktop Button Styles
  const btnBase = "rounded-[8px] px-[18px] py-[8px] transition-all duration-300 font-medium active:scale-95"
  const loginStyle = `${btnBase} border border-richblack-700 bg-richblack-800 text-richblack-100 hover:bg-richblack-900 hover:text-richblack-5`
  const signupStyle = `${btnBase} bg-yellow-50 text-richblack-900 shadow-[2px_2px_0px_rgba(255,255,255,0.18)_inset]`

  return (
    <div className={`flex h-14 items-center justify-center border-b border-b-richblack-700 z-[100] sticky top-0 ${location.pathname !== "/" ? "bg-richblack-800" : "bg-richblack-900"} transition-all duration-200`}>
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="shrink-0">
          <img src={logo} alt="Logo" className="w-[120px] md:w-[160px] h-auto" loading="lazy" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:block">
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <div className="group relative flex cursor-pointer items-center gap-1">
                    <p className={`${matchRoute("/catalog/:catalogName") ? "text-yellow-25" : "text-richblack-25"}`}>{link.title}</p>
                    <BsChevronDown />
                    <div className="invisible absolute left-1/2 top-1/2 z-[1000] w-[300px] -translate-x-1/2 translate-y-[3em] rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100">
                      <div className="absolute left-1/2 top-0 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-richblack-5"></div>
                      {loading ? (<p className="text-center">Loading...</p>) : subLinks.length > 0 ? (
                        subLinks.map((subLink, i) => (
                          <Link key={i} to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`} className="block rounded-lg py-2 pl-4 hover:bg-richblack-50">{subLink.name}</Link>
                        ))
                      ) : (<p className="text-center">No Courses Found</p>)}
                    </div>
                  </div>
                ) : (
                  <Link to={link.path}>
                    <p className={`${matchRoute(link.path) ? "text-yellow-25" : "text-richblack-25"}`}>{link.title}</p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Icons and Mobile Toggle */}
        <div className="flex items-center gap-x-4">
          {user && user.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative mr-2 md:mr-0">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 grid h-5 w-5 place-items-center rounded-full bg-richblack-600 text-xs font-bold text-yellow-100 animate-bounce">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {!token && (
            <div className="hidden md:flex gap-x-4">
              <Link to="/login"><button className={loginStyle}>Log in</button></Link>
              <Link to="/signup"><button className={signupStyle}>Sign up</button></Link>
            </div>
          )}
          
          <div className="hidden md:block">
            {token && <ProfileDropdown />}
          </div>

          <button 
            className="md:hidden cursor-pointer z-[2000] text-richblack-100 p-1" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <AiOutlineClose fontSize={30} /> : <HiMenuAlt3 fontSize={30} />}
          </button>
        </div>
      </div>

      {/* --- MOBILE SIDEBAR --- */}
      <div 
        className={`fixed inset-0 z-[1500] bg-black/70 backdrop-blur-sm transition-all duration-300 md:hidden ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} 
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div 
          className={`absolute right-0 top-0 h-[100dvh] w-[300px] bg-richblack-900 shadow-[-10px_0_40px_rgba(0,0,0,0.8)] transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`} 
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col h-full overflow-y-auto px-6 py-10">
            
            {/* User Info */}
            {token && user && (
              <div className="flex items-center gap-x-4 pb-8 mb-6 border-b border-richblack-800 mt-6">
                <img src={user?.image} alt="user" className="aspect-square w-[55px] rounded-full object-cover border-2 border-yellow-50" />
                <div className="flex flex-col overflow-hidden">
                  <p className="text-richblack-5 text-lg font-bold truncate">{user?.firstName}</p>
                  <p className="text-sm text-richblack-400 truncate">{user?.email}</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex flex-col gap-y-4">
              {NavbarLinks.map((link, index) => (
                <div key={index}>
                  {link.title === "Catalog" ? (
                    <div className="flex flex-col items-start w-full">
                      <button 
                        className="flex items-center justify-between text-richblack-25 py-3 w-full"
                        onClick={() => setIsCatalogOpen(!isCatalogOpen)}
                      >
                        <p className="text-xl">{link.title}</p>
                        <BsChevronDown className={`text-xl transition-transform duration-200 ${isCatalogOpen ? "rotate-180" : ""}`} />
                      </button>
                      {isCatalogOpen && (
                        <div className="flex flex-col items-start gap-y-3 pl-6 mt-2 border-l-2 border-richblack-700 w-full mb-2">
                          {subLinks.map((sub, i) => (
                            <Link key={i} to={`/catalog/${sub.name.split(" ").join("-").toLowerCase()}`} className="text-richblack-200 text-lg hover:text-yellow-50">{sub.name}</Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link to={link.path} className={`text-xl block py-3 w-full ${matchRoute(link.path) ? "text-yellow-25" : "text-richblack-25"}`}>{link.title}</Link>
                  )}
                </div>
              ))}

              {token && (
                <div className="flex flex-col items-start w-full mt-4">
                  <hr className="border-richblack-800 w-full mb-6" />
                  
                  {/* Improved Dashboard Button */}
                  <button 
                    className="flex items-center justify-between text-yellow-50 py-4 w-full group hover:bg-richblack-800/50 rounded-xl px-2 transition-all" 
                    onClick={() => setIsDashboardOpen(!isDashboardOpen)}
                  >
                    <div className="flex items-center gap-x-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-50 text-richblack-900 shadow-[0px_0px_20px_rgba(255,214,10,0.3)]">
                        <AiOutlineDashboard className="text-2xl" />
                      </div>
                      <p className="text-xl font-bold tracking-wide">Dashboard</p>
                    </div>
                    <BsChevronDown className={`text-xl transition-transform duration-300 ${isDashboardOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isDashboardOpen && (
                    <div className="flex flex-col items-start gap-y-4 pl-8 mt-4 border-l-2 border-yellow-50/20 mb-6 ml-6 w-full">
                      {sidebarLinks.map((link) => (
                        (!link.type || user?.accountType === link.type) && (
                          <Link 
                            key={link.id} 
                            to={link.path} 
                            className={`text-lg py-2 transition-all w-full ${matchRoute(link.path) ? "text-yellow-50 font-bold" : "text-richblack-200 hover:text-richblack-5"}`}
                          >
                            {link.name}
                          </Link>
                        )
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Logout / Auth Bottom */}
            <div className="mt-auto pb-6">
              {!token ? (
                <div className="flex flex-col gap-y-4">
                  <Link to="/login"><button className={`${loginStyle} w-full py-4 text-xl`}>Log in</button></Link>
                  <Link to="/signup"><button className={`${signupStyle} w-full py-4 text-xl`}>Sign up</button></Link>
                </div>
              ) : (
                <button 
                  onClick={() => setShowLogoutModal(true)} 
                  className="group flex w-full items-center justify-center gap-x-4 rounded-2xl border border-pink-700/50 bg-pink-900/20 px-6 py-5 text-xl font-bold text-pink-200 transition-all hover:bg-pink-900/40 active:scale-95 shadow-[0px_4px_20px_rgba(255,100,100,0.2)]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-500/20 text-pink-200">
                    <AiOutlineLogout className="text-2xl" />
                  </div>
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- LOGOUT MODAL --- */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[3000] grid place-items-center px-4 bg-white/10 backdrop-blur-md">
          <div className="w-full max-w-[380px] rounded-3xl border border-richblack-700 bg-richblack-800 p-8 shadow-[0px_0px_50px_rgba(0,0,0,0.7)]">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 rounded-full bg-pink-900/40 p-4">
                <AiOutlineExclamationCircle className="text-5xl text-pink-200" />
              </div>
              <p className="text-3xl font-bold text-richblack-5">Are you sure?</p>
              <p className="mt-3 mb-8 text-richblack-300 text-lg leading-relaxed">You will be logged out of your current session.</p>
              <div className="flex w-full flex-col gap-y-4">
                <button onClick={handleLogout} className="w-full rounded-xl bg-pink-200 py-4 font-black text-richblack-900 text-lg hover:bg-pink-300 transition-all">Logout Now</button>
                <button onClick={() => setShowLogoutModal(false)} className="w-full rounded-xl bg-richblack-700 py-4 font-bold text-richblack-5 text-lg hover:bg-richblack-600 transition-all">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar