import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError("")
    setBusy(true)
    try {
      await login(form)
      navigate("/")
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-10">
      <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
        Welcome Back!
      </h1>
      <p className="text-gray-500 mt-1 mb-6">Login to view your list.</p>

      <form onSubmit={submit} className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col gap-3">
        {/* backend login me name, email aur password teeno maangta hai */}
        <label className="flex flex-col gap-1 text-sm text-gray-600">
          Name
          <input
            name="name"
            value={form.name}
            onChange={change}
            autoComplete="username"
            required
            className="px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-gray-600">
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={change}
            required
            className="px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-gray-600">
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={change}
            autoComplete="current-password"
            required
            className="px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </label>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          disabled={busy}
          className="mt-1 bg-emerald-700 text-white rounded-md py-2 disabled:opacity-60"
        >
          {busy ? "Login..." : "login"}
        </button>
      </form>

      <p className="text-center text-gray-500 mt-4 text-sm">
        Create new account for sign-in? <Link to="/register" className="text-emerald-700">Create one</Link>
      </p>
    </div>
  )
}
