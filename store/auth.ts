"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type UserRole = "customer" | "courier" | "staff" | "admin" | "super_admin"

export interface AuthUser {
  _id: string
  fullName: string
  email: string
  phone?: string
  userType: UserRole
  verified?: boolean
  employeeId?: string
  adminLevel?: number
  department?: string
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  isLoading: boolean
  setAuth: (user: AuthUser, token: string) => void
  clearAuth: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      setAuth: (user, token) => set({ user, token, isLoading: false }),
      clearAuth: () => set({ user: null, token: null }),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "shipgate-auth",
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
)
