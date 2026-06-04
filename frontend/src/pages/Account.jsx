import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'
import { formatDate } from '../utils/constants'
import { User, Mail, Lock, Trash2, Save, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function Account() {
  const { user, updateUser, logout } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: user?.username || '', email: user?.email || '', password: '' })
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleUpdate = async (e) => {
    e.preventDefault()
    const payload = {}
    if (form.username !== user.username) payload.username = form.username
    if (form.email !== user.email) payload.email = form.email
    if (form.password) payload.password = form.password

    if (!Object.keys(payload).length) { toast('No changes to save'); return }

    setLoading(true)
    try {
      const updated = await authService.updateAccount(payload)
      updateUser(updated)
      setForm(f => ({ ...f, password: '' }))
      toast.success('Account updated!')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Permanently delete your account and all data? This cannot be undone.')) return
    setDeleting(true)
    try {
      await authService.deleteAccount()
      logout()
      navigate('/login')
      toast.success('Account deleted')
    } catch {
      toast.error('Failed to delete account')
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-white">Account</h1>
        <p className="text-subtle font-body mt-1">Manage your profile and preferences</p>
      </motion.div>

      {/* Profile card */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
          <div className="w-14 h-14 rounded-2xl bg-accent/15 border border-accent/20 flex items-center justify-center">
            <span className="font-display font-bold text-accent text-xl">
              {user?.username?.[0]?.toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-display font-semibold text-white text-lg">{user?.username}</p>
            <p className="text-muted text-sm font-body">{user?.email}</p>
            <p className="text-xs text-muted font-body mt-0.5 flex items-center gap-1">
              <ShieldCheck size={11} className="text-accent" />
              Member since {formatDate(user?.created_at)}
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
            <label className="text-xs text-muted font-body uppercase tracking-wider mb-2 flex items-center gap-1.5 block">
              <User size={11} /> Username
            </label>
            <input type="text" value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="input-field" />
          </div>

          <div>
            <label className="text-xs text-muted font-body uppercase tracking-wider mb-2 flex items-center gap-1.5 block">
              <Mail size={11} /> Email
            </label>
            <input type="email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input-field" />
          </div>

          <div>
            <label className="text-xs text-muted font-body uppercase tracking-wider mb-2 flex items-center gap-1.5 block">
              <Lock size={11} /> New Password
            </label>
            <input type="password" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Leave blank to keep current"
              className="input-field" />
          </div>

          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? 'Saving...' : <><Save size={14} /> Save Changes</>}
          </button>
        </form>
      </motion.div>

      {/* Danger Zone */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="rounded-xl border border-red-900/40 p-6"
        style={{ background: 'rgba(127, 29, 29, 0.05)' }}>
        <h2 className="font-display font-semibold text-danger mb-1 flex items-center gap-2">
          <Trash2 size={15} /> Danger Zone
        </h2>
        <p className="text-sm text-subtle font-body mb-4">
          Permanently delete your account and all associated data. This action cannot be reversed.
        </p>
        <button onClick={handleDelete} disabled={deleting}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-800/50 text-danger text-sm font-body
                     hover:bg-danger/10 transition-all duration-200 disabled:opacity-40">
          <Trash2 size={13} />
          {deleting ? 'Deleting...' : 'Delete my account'}
        </button>
      </motion.div>
    </div>
  )
}
