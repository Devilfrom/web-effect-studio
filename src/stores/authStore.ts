import { create } from 'zustand'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth'
import { auth } from '@/lib/firebase'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
  initialized: boolean
  setUser: (user: User | null) => void
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  initialize: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  initialized: false,
  setUser: (user) => set({ user }),
  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      await signInWithEmailAndPassword(auth, email, password)
      set({ loading: false })
    } catch (error: any) {
      set({ loading: false, error: error.message })
      throw error
    }
  },
  register: async (email, password) => {
    set({ loading: true, error: null })
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      set({ loading: false })
    } catch (error: any) {
      set({ loading: false, error: error.message })
      throw error
    }
  },
  logout: async () => {
    set({ loading: true })
    try {
      await signOut(auth)
      set({ user: null, loading: false })
    } catch (error: any) {
      set({ loading: false, error: error.message })
      throw error
    }
  },
  initialize: () => {
    if (typeof window !== 'undefined') {
      onAuthStateChanged(auth, (user) => {
        set({ user, initialized: true })
      })
    }
  }
}))