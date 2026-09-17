import { createContext, useContext, useEffect, useState } from "react"
import api from "../api/axios"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("AccessToken")
    if (!token) return setLoading(false)

    api
      .get("/users/currentUser")
      .then((res) => setUser(res.data.data))
      .catch(() => localStorage.removeItem("AccessToken"))
      .finally(() => setLoading(false))
  }, [])

  const register = async ({ name, email, password }) => {
    await api.post("/users/register", { name, email, password })
  }

  const login = async ({ name, email, password }) => {
    const res = await api.post("/users/login", { name, email, password })
    const { AccessToken, user: loggedInUser } = res.data.data
    localStorage.setItem("AccessToken", AccessToken)
    setUser(loggedInUser)
    return loggedInUser
  }

  const logout = async () => {
    try {
      await api.post("/users/logout")
    } catch {
      // token invalid ho to bhi local session saaf karo
    }
    localStorage.removeItem("AccessToken")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)