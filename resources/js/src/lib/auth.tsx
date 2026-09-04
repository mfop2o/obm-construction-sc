import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { http } from './api'

/* eslint-disable react-refresh/only-export-components */

/* ============================================================================
   auth — session-based authentication (Laravel Sanctum SPA).
   On load we check GET /api/user to learn if a session exists. login() and
   logout() talk to the Breeze auth endpoints and keep user state in sync.
   ========================================================================== */

interface User {
  id: number
  name: string
  email: string
  role?: string
}

interface ProfileInput {
  name: string
  email: string
  password?: string
}

interface AuthState {
  loading: boolean
  user: User | null
  login: (email: string, password: string) => Promise<void>
  updateProfile: (input: ProfileInput) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  const fetchUser = useCallback(async () => {
    try {
      const res = await http.get<User>('/api/user')
      setUser(res.data)
    } catch {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      await fetchUser()
      if (!cancelled) setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [fetchUser])

  const login = useCallback(
    async (email: string, password: string) => {
      await http.post('/login', { email, password })
      await fetchUser()
    },
    [fetchUser],
  )

  const updateProfile = useCallback(
    async (input: ProfileInput) => {
      if (!user) return
      await http.put(`/api/users/${user.id}`, input)
      await fetchUser()
    },
    [user, fetchUser],
  )

  const logout = useCallback(async () => {
    try {
      await http.post('/logout')
    } catch {
      // ignore — we clear local state regardless
    }
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ loading, user, login, updateProfile, logout }),
    [loading, user, login, updateProfile, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
