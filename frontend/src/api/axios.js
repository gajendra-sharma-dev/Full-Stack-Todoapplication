import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ||  "http://localhost:4000/api/v1",
  withCredentials: true,
})

// har request me token laga do
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("AccessToken")
  if (token) config.headers.authorization = `Bearer ${token}`
  return config
})

// error ka message nikal ke seedha Error bana do
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const data = err.response?.data
    let message = "Kuch galat ho gaya. Dobara koshish karein."
    if (typeof data === "string") {
      const m = data.match(/<pre>Error: (.*?)<br>/)
      if (m) message = m[1]
    } else if (data?.message) {
      message = data.message
    } else if (err.message === "Network Error") {
      message = "Server se connection nahi ban raha."
    }
    return Promise.reject(new Error(message))
  }
)

export default api