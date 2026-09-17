import { useState } from "react"
import api from "../api/axios"
import { useAuth } from "../context/AuthContext"

const inputClass =
  "px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"

export default function Profile() {
  const { user, setUser } = useAuth()
  const [details, setDetails] = useState({ name: user.name, email: user.email })
  const [pwd, setPwd] = useState({ oldpassword: "", newpassword: "" })
  const [note, setNote] = useState({ type: "", text: "" })

  const saveDetails = async (e) => {
    e.preventDefault()
    try {
      const res = await api.patch("/users/update", details)
      setUser(res.data.data)
      setNote({ type: "ok", text: "Details saved." })
    } catch (err) {
      setNote({ type: "error", text: err.message })
    }
  }

  const savePassword = async (e) => {
    e.preventDefault()
    try {
      await api.post("/users/updatepassword", pwd)
      setPwd({ oldpassword: "", newpassword: "" })
      setNote({ type: "ok", text: "Password changed." })
    } catch (err) {
      setNote({ type: "error", text: err.message })
    }
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Account</h1>
        <p className="text-gray-500 mt-1">Naam aur email yahan se badlein.</p>
      </div>

      {note.text && (
        <p className={`text-sm mb-4 ${note.type === "ok" ? "text-emerald-700" : "text-red-600"}`}>
          {note.text}
        </p>
      )}

      <form onSubmit={saveDetails} className="bg-white border border-gray-200 rounded-lg p-4 mb-6 flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm text-gray-600">
          Name
          <input
            value={details.name}
            onChange={(e) => setDetails({ ...details, name: e.target.value })}
            required
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-gray-600">
          Email
          <input
            type="email"
            value={details.email}
            onChange={(e) => setDetails({ ...details, email: e.target.value })}
            required
            className={inputClass}
          />
        </label>
        <button className="bg-emerald-700 text-white rounded-md py-2 mt-1">Save changes</button>
      </form>

      <form onSubmit={savePassword} className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm text-gray-600">
          Current password
          <input
            type="password"
            value={pwd.oldpassword}
            onChange={(e) => setPwd({ ...pwd, oldpassword: e.target.value })}
            required
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-gray-600">
          New password
          <input
            type="password"
            value={pwd.newpassword}
            onChange={(e) => setPwd({ ...pwd, newpassword: e.target.value })}
            minLength={6}
            required
            className={inputClass}
          />
        </label>
        <button className="bg-emerald-700 text-white rounded-md py-2 mt-1">Change password</button>
      </form>
    </>
  )
}