import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../api/axios"
import { useAuth } from "../context/AuthContext"

export default function Lists() {
  const { user } = useAuth()
  const [lists, setLists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ name: "", description: "" })
  const [editing, setEditing] = useState(null) // { _id, name, description }

  const load = useCallback(async () => {
    try {
      const res = await api.get(`/todos/getUserlist/${user._id}`)
      setLists(res.data.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user._id])

  useEffect(() => { load() }, [load])

  const createList = async (e) => {
    e.preventDefault()
    setError("")
    try {
      await api.post("/todos/createTodolist", form)
      setForm({ name: "", description: "" })
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  const saveEdit = async (e) => {
    e.preventDefault()
    setError("")
    try {
      await api.patch(`/todos/updatetodoList/${editing._id}`, {
        name: editing.name,
        description: editing.description,
      })
      setEditing(null)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  const removeList = async (id) => {
    if (!confirm("You wants to delete this todo?")) return
    try {
      await api.delete(`/todos/deletetodoList/${id}`)
      setLists((prev) => prev.filter((l) => l._id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  const inputClass =
    "px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Your lists</h1>
        <p className="text-gray-500 mt-1">Now you add a todoList and add todos in todolist.</p>
      </div>

      <form
        onSubmit={createList}
        className="bg-white border border-gray-200 rounded-lg p-4 mb-6 flex flex-wrap gap-3 items-end"
      >
        <label className="flex-1 min-w-[180px] flex flex-col gap-1 text-sm text-gray-600">
          List name
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="TodoList name"
            required
            className={inputClass}
          />
        </label>
        <label className="flex-1 min-w-[180px] flex flex-col gap-1 text-sm text-gray-600">
          Description
          <input
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="description"
            required
            className={inputClass}
          />
        </label>
        <button className="bg-emerald-700 text-white rounded-md px-4 py-2">
          Add list
        </button>
      </form>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {loading ? (
        <p className="text-gray-500 py-6">Loading…</p>
      ) : lists.length === 0 ? (
        <p className="text-gray-500 py-6">Nothing Here.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {lists.map((list) => (
            <li
              key={list._id}
              className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-2"
            >
              {editing?._id === list._id ? (
                <form onSubmit={saveEdit} className="flex flex-col gap-2">
                  <input
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    required
                    className={inputClass}
                  />
                  <input
                    value={editing.description}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    className={inputClass}
                  />
                  <div className="flex gap-2">
                    <button className="bg-emerald-700 text-white rounded-md px-3 py-1.5 text-sm">
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(null)}
                      className="border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <Link
                    to={`/list/${list._id}`}
                    className="text-lg font-medium text-gray-900 hover:text-emerald-700"
                  >
                    {list.name}
                  </Link>
                  <p className="text-gray-500 text-sm">{list.description}</p>
                  <div className="flex gap-2 mt-auto pt-2">
                    <button
                      onClick={() => setEditing(list)}
                      className="border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-700"
                    >
                      Rename
                    </button>
                    <button
                      onClick={() => removeList(list._id)}
                      className="border border-gray-300 rounded-md px-3 py-1.5 text-sm text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}