import { defineStore } from 'pinia'
import { load, save, remove } from '../utils/storage'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    users: load('users', []),
    currentUser: load('current_user', null)
  }),
  actions: {
    register(payload) {
      const email = payload.email.trim().toLowerCase()
      if (this.users.some(u => u.email === email)) {
        return { ok: false, message: 'An account with that email already exists.' }
      }
      const user = {
        id: crypto.randomUUID(),
        name: payload.name.trim(),
        username: payload.username.trim(),
        email,
        password: payload.password,
        avatar: '',
        bio: 'New to FLAIRD.',
        joinedAt: new Date().toISOString()
      }
      this.users.push(user)
      save('users', this.users)
      this.currentUser = { ...user, password: undefined }
      save('current_user', this.currentUser)
      return { ok: true }
    },
    login(email, password) {
      const user = this.users.find(u => u.email === email.trim().toLowerCase() && u.password === password)
      if (!user) return { ok: false, message: 'Invalid email or password.' }
      const safeUser = { ...user }
      delete safeUser.password
      this.currentUser = safeUser
      save('current_user', safeUser)
      return { ok: true }
    },
    logout() {
      this.currentUser = null
      remove('current_user')
    },
    updateProfile(patch) {
      if (!this.currentUser) return
      this.currentUser = { ...this.currentUser, ...patch }
      this.users = this.users.map(u => u.id === this.currentUser.id ? { ...u, ...patch } : u)
      save('current_user', this.currentUser)
      save('users', this.users)
    }
  }
})
