'use client'
import { createContext, useContext } from 'react'
import { useAuth } from '@/hooks/useAuth'

const AuthContext = createContext(null)

export function useAuthContext() {
  return useContext(AuthContext)
}

export default function Providers({ children }) {
  const auth = useAuth()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}
