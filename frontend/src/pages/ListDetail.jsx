import { useCallback, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import api from "../api/axios"

const STATUS = ["pending", "in-progress", "completed"]
const PRIORITY = ["low", "medium", "high"]

const emptyTodo = {
  title: "",
  description: "",
  Status: "pending",
  priority: "medium",
  dueAt: "",
}

const inputClass =
  "px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"

export default function ListDetail() {
  const { listId } = useParams()
  const [list, setList] = useState(null)
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [form, setForm] = useState(emptyTodo)
  const [editing, setEditing] = useState(null)
  const [filter, setFilter] = useState("all")

  const load = useCallback(async () => {
    setError("")
    try {
      const [listRes, todoRes] = await Promise.all([
        api.get(`/todos/getlistById/${listId}`),
        api.get(`/todo/getTodoByTodolist/${listId}`),
      ])
      setList(listRes.data.data)
      setTodos(todoRes.data.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [listId])

  useEffect(() => { load() }, [load])

  const createTodo = async (e) => {
    e.preventDefault()
    setError("")
    try {
      const res = await api.post(`/todo/createTodo/${listId}`, form)
      setTodos((prev) => [res.data.data, ...prev])
      setForm(emptyTodo)
    } catch (err) {
      setError(err.message)
    }
  }

  const patchTodo = async (id, payload) => {
    setError("")
    try {
      const res = await api.patch(`/todo/updateTodo/${id}`, payload)
      setTodos((prev) => prev.map((t) => (t._id === id ? res.data.data : t)))
      return true
    } catch (err) {
      setError(err.message)
      return false
    }
  }

  const toggleDone = (todo) =>
    patchTodo(todo._id, { Status: todo.Status === "completed" ? "pending" : "completed" })

  const saveEdit = async (e) => {
    e.preventDefault()
    const ok = await patchTodo(editing._id, {
      title: editing.title,
      description: editing.description,
      Status: editing.Status,
      priority: editing.priority,
      dueAt: editing.dueAt || "",
    })
    if (ok) setEditing(null)
  }

  const removeTodo = async (id) => {
    if (!confirm("Do you want to delete this Todo?")) return
    try {
      await api.delete(`/todo/deleteTodo/${id}`)
      setTodos((prev) => prev.filter((t) => t._id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  const shown = filter === "all" ? todos : todos.filter((t) => t.Status === filter)
  const doneCount = todos.filter((t) => t.Status === "completed").length

  if (loading) return <p className="text-gray-500 py-6">Loading…</p>

  const priorityBorder = { high: "border-red-500", medium: "border-amber-500", low: "border-emerald-600" }

  return (
    <>
      <Link to="/" className="inline-block mb-4 text-sm text-emerald-700">
        ← lists
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">{list?.name}</h1>
        <p className="text-gray-500 mt-1">
          {list?.description} · {doneCount}/{todos.length} done
        </p>
      </div>

      <form onSubmit={createTodo} className="bg-white border border-gray-200 rounded-lg p-4 mb-6 flex flex-col gap-3">
        <div className="flex flex-wrap gap-3">
          <label className="flex-1 min-w-[180px] flex flex-col gap-1 text-sm text-gray-600">
            Title
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Playing cricket"
              required
              className={inputClass}
            />
          </label>
          <label className="flex-1 min-w-[180px] flex flex-col gap-1 text-sm text-gray-600">
            Description
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="at night"
              required
              className={inputClass}
            />
          </label>
        </div>
        <div className="flex flex-wrap gap-3 items-end">
          <label className="flex flex-col gap-1 text-sm text-gray-600">
            Status
            <select value={form.Status} onChange={(e) => setForm({ ...form, Status: e.target.value })} className={inputClass}>
              {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm text-gray-600">
            Priority
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className={inputClass}>
              {PRIORITY.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm text-gray-600">
            Due date
            <input type="date" value={form.dueAt} onChange={(e) => setForm({ ...form, dueAt: e.target.value })} className={inputClass} />
          </label>
          <button className="bg-emerald-700 text-white rounded-md px-4 py-2">Add todo</button>
        </div>
      </form>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <div className="flex flex-wrap gap-2 mb-4">
        {["all", ...STATUS].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-sm px-3 py-1.5 rounded-full border ${
              filter === f
                ? "bg-gray-900 border-gray-900 text-white"
                : "border-gray-300 text-gray-500 hover:text-gray-900"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="text-gray-500 py-6">Nothing Here.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {shown.map((todo) => (
            <li
              key={todo._id}
              className={`bg-white border border-gray-200 border-l-4 ${priorityBorder[todo.priority] || "border-l-gray-300"} rounded-lg p-4 flex gap-4 items-start`}
            >
              {editing?._id === todo._id ? (
                <form onSubmit={saveEdit} className="flex-1 flex flex-col gap-2">
                  <input
                    value={editing.title}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    required
                    className={inputClass}
                  />
                  <input
                    value={editing.description || ""}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    className={inputClass}
                  />
                  <div className="flex flex-wrap gap-2">
                    <select value={editing.Status} onChange={(e) => setEditing({ ...editing, Status: e.target.value })} className={inputClass}>
                      {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select value={editing.priority} onChange={(e) => setEditing({ ...editing, priority: e.target.value })} className={inputClass}>
                      {PRIORITY.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <input
                      type="date"
                      value={editing.dueAt ? editing.dueAt.slice(0, 10) : ""}
                      onChange={(e) => setEditing({ ...editing, dueAt: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-emerald-700 text-white rounded-md px-3 py-1.5 text-sm">Save</button>
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
                  <input
                    type="checkbox"
                    checked={todo.Status === "completed"}
                    onChange={() => toggleDone(todo)}
                    aria-label={`${todo.title} complete`}
                    className="mt-1 w-4 h-4 accent-emerald-700"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${todo.Status === "completed" ? "line-through text-gray-400" : "text-gray-900"}`}>
                      {todo.title}
                    </p>
                    {todo.description && <p className="text-gray-500 text-sm">{todo.description}</p>}
                    <p className="text-gray-400 text-xs mt-1">
                      {todo.Status}
                      {todo.dueAt && ` · due ${new Date(todo.dueAt).toLocaleDateString()}`}
                      {` · ${todo.priority}`}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setEditing(todo)}
                      className="border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeTodo(todo._id)}
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