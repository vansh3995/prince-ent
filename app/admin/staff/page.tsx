"use client"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

export default function StaffManagementPage() {
  const { data: session } = useSession()
  const role = session?.user?.role
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (role === "superadmin") fetchUsers()
  }, [role])

  const fetchUsers = async () => {
    setLoading(true)
    const res = await fetch("/api/users")
    const data = await res.json()
    setUsers(data.users || [])
    setLoading(false)
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    await fetch(`/api/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    })
    fetchUsers()
  }

  if (role !== "superadmin") return <p>Access denied.</p>

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Staff Management</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Username</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td className="p-2">{u.username}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2">
                  <select
                    value={u.role}
                    onChange={e => handleRoleChange(u._id, e.target.value)}
                    disabled={u.email === session?.user?.email}
                    className="border px-2 py-1 rounded"
                  >
                    <option value="superadmin">Superadmin</option>
                    <option value="staff">Staff</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}