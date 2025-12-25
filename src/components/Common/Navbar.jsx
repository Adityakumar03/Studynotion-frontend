import { useEffect, useState } from "react"
import { AiOutlineShoppingCart, AiOutlineClose, AiOutlineLogout, AiOutlineDashboard } from "react-icons/ai"
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
    setIsMobileMenuOpen(false)
    dispatch(logout(navigate))
  }

  return (
    <div className={`flex h-14 items-center justify-center border-b border-b-richblack-700 z-[100] sticky top-0 ${location.pathname !== "/" ? "bg-richblack-800" : "bg-richblack-900"} transition-all duration-200`}>
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="shrink-0">
          <img src={logo} alt="Logo" className="w-[120px] md:w-[160px] h-auto" loading="lazy" />
        </Link>

        {/* Desktop Nav Links (Unchanged) */}
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

        {/* Action Buttons Section */}
        <div className="flex items-center gap-x-4">
          {/* Cart Icon - Now visible on all devices if logged in and not an instructor */}
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

          {/* Desktop Auth Buttons (Unchanged) */}
          {!token && (
            <div className="hidden md:flex gap-x-4">
              <Link to="/login"><button className="rounded border border-richblack-700 px-3 py-2 text-richblack-100 bg-richblack-800">Log in</button></Link>
              <Link to="/signup"><button className="rounded border border-richblack-700 px-3 py-2 text-richblack-100 bg-richblack-800">Sign up</button></Link>
            </div>
          )}
          
          <div className="hidden md:block">
            {token && <ProfileDropdown />}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button 
            className="md:hidden cursor-pointer z-[2000] text-richblack-100" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <AiOutlineClose fontSize={28} /> : <HiMenuAlt3 fontSize={28} />}
          </button>
        </div>
      </div>

      {/* --- MOBILE SIDEBAR --- */}
      <div 
        className={`fixed inset-0 z-[1500] bg-black/60 backdrop-blur-sm transition-all duration-300 md:hidden ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} 
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div 
          className={`absolute right-0 top-0 h-[100dvh] w-[280px] bg-richblack-900 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`} 
          onClick={(e) => e.stopPropagation()}
        >
          {/* Sidebar Content Container */}
          <div className="flex flex-col h-full overflow-y-auto px-6 py-8">
            
            {/* User Profile Info */}
            {token && user && (
              <div className="flex items-center gap-x-3 pb-6 mb-6 border-b border-richblack-800 mt-8">
                <img src={user?.image} alt="user" className="aspect-square w-[50px] rounded-full object-cover border-2 border-yellow-50" />
                <div className="flex flex-col overflow-hidden">
                  <p className="text-richblack-5 font-semibold truncate">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-richblack-400 truncate">{user?.email}</p>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <div className="flex flex-col gap-y-2">
              {NavbarLinks.map((link, index) => (
                <div key={index}>
                  {link.title === "Catalog" ? (
                    <div className="flex flex-col">
                      <button 
                        className="flex items-center justify-between text-richblack-25 py-3 w-full text-left"
                        onClick={() => setIsCatalogOpen(!isCatalogOpen)}
                      >
                        <p className="text-lg font-medium">{link.title}</p>
                        <BsChevronDown className={`transition-transform duration-200 ${isCatalogOpen ? "rotate-180" : ""}`} />
                      </button>
                      {isCatalogOpen && (
                        <div className="flex flex-col gap-y-2 pl-4 mb-2 border-l-2 border-richblack-700">
                          {subLinks.map((sub, i) => (
                            <Link key={i} to={`/catalog/${sub.name.split(" ").join("-").toLowerCase()}`} className="text-richblack-200 py-2 hover:text-yellow-25">{sub.name}</Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link to={link.path} className={`text-lg font-medium block py-3 ${matchRoute(link.path) ? "text-yellow-25" : "text-richblack-25"}`}>{link.title}</Link>
                  )}
                </div>
              ))}

              <hr className="border-richblack-800 my-4" />

              {/* Dashboard Section */}
              {token && (
                <div className="flex flex-col">
                  <button 
                    className="flex items-center justify-between text-yellow-50 py-3 w-full"
                    onClick={() => setIsDashboardOpen(!isDashboardOpen)}
                  >
                    <div className="flex items-center gap-x-2">
                      <AiOutlineDashboard className="text-xl" />
                      <p className="text-lg font-medium">Dashboard</p>
                    </div>
                    <BsChevronDown className={`transition-transform duration-200 ${isDashboardOpen ? "rotate-180" : ""}`} />
                  </button>
                  
                  {isDashboardOpen && (
                    <div className="flex flex-col gap-y-2 pl-4 mt-2 border-l-2 border-yellow-50 mb-4">
                      {sidebarLinks.map((link) => {
                        if (link.type && user?.accountType !== link.type) return null;
                        return (
                          <Link key={link.id} to={link.path} className="text-richblack-200 py-2 hover:text-yellow-25">
                            {link.name}
                          </Link>
                        );
                      })}
                      <Link to="/dashboard/settings" className="text-richblack-200 py-2">Settings</Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Section: Auth Buttons or Logout */}
            <div className="mt-auto pt-6 border-t border-richblack-800">
              {!token ? (
                <div className="flex flex-col gap-y-3">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full rounded-md border border-richblack-700 bg-richblack-800 py-3 text-richblack-100 font-medium">Log in</button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full rounded-md bg-yellow-50 py-3 text-richblack-900 font-bold">Sign up</button>
                  </Link>
                </div>
              ) : (
                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-x-2 text-pink-200 text-lg font-medium w-full py-3"
                >
                  <AiOutlineLogout /> Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar