import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"
import Navbar from "./layout/Navbar"
import Login from "./layout/Login"
import Register from "./pages/Register"
import Lists from "./pages/Lists"
import ListDetail from "./pages/ListDetail"
import Profile from "./pages/Profile"

function Protected({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <p className="p-6 text-gray-500">Loading…</p>
  return user ? children : <Navigate to="/login" replace />
}

function PublicOnly({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <p className="p-6 text-gray-500">Loading…</p>
  return user ? <Navigate to="/" replace /> : children
}

export default function App() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-8">
        <Routes>
          <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
          <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />
          <Route path="/" element={<Protected><Lists /></Protected>} />
          <Route path="/list/:listId" element={<Protected><ListDetail /></Protected>} />
          <Route path="/profile" element={<Protected><Profile /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  )
}