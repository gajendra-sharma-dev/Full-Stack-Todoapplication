import { Link, NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <header className="flex items-center justify-between gap-4 px-6 py-4 border-b border-gray-200 bg-white">
      <Link to="/" className="text-xl font-semibold tracking-tight text-gray-900">
        todo
      </Link>

      {user && (
        <nav className="flex items-center gap-5 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
            }
          >
            Lists
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
            }
          >
            {user.name}
          </NavLink>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Log out
          </button>
        </nav>
      )}
    </header>
  )
}