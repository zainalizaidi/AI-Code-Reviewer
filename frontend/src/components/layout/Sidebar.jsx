import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Code2, History, User, LogOut,
  Cpu, ChevronRight
} from 'lucide-react'

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/review', icon: Code2, label: 'Code Review' },
  { to: '/history', icon: History, label: 'History' },
  { to: '/account', icon: User, label: 'Account' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-60 flex flex-col z-30"
      style={{ background: 'rgba(10,10,15,0.95)', borderRight: '1px solid rgba(30,30,46,0.8)', backdropFilter: 'blur(20px)' }}>

      {/* Logo */}
      <div className="px-6 py-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center">
            <Cpu size={16} className="text-accent" />
          </div>
          <div>
            <p className="font-display font-700 text-white text-sm leading-none">CodeSense</p>
            <p className="text-xs text-muted mt-0.5 font-body">AI Reviewer</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-all duration-200 group relative
               ${isActive
                ? 'bg-accent/10 text-accent border border-accent/20'
                : 'text-subtle hover:text-white hover:bg-white/5'}`
            }>
            {({ isActive }) => (
              <>
                <Icon size={16} className={isActive ? 'text-accent' : 'text-muted group-hover:text-white transition-colors'} />
                <span>{label}</span>
                {isActive && (
                  <motion.div layoutId="activeNav"
                    className="absolute right-3 w-1 h-1 rounded-full bg-accent"
                    initial={false} />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-border">
        <div className="px-3 py-2 mb-2 rounded-lg bg-surface">
          <p className="text-white text-sm font-body font-medium truncate">{user?.username}</p>
          <p className="text-muted text-xs truncate">{user?.email}</p>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-body text-subtle
                     hover:text-danger hover:bg-danger/10 transition-all duration-200 group">
          <LogOut size={16} className="group-hover:text-danger transition-colors" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  )
}
