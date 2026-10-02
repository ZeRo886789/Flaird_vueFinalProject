import { defineStore } from 'pinia'
import { load, save } from '../utils/storage'
import { demoUsers } from '../seed/demoUsers'
import { demoReviews } from '../seed/demoReviews'
import { demoActivities } from '../seed/demoActivities'

export const useAppStore = defineStore('app', {
  state: () => ({
    theme: load('theme', 'dark'),
    notifications: load('notifications', []),
    settings: load('settings', {
      compactCards: false,
      reducedMotion: false,
      autoplayPreviews: true
    })
  }),
  actions: {
    setTheme(theme) {
      this.theme = theme
      save('theme', theme)
      document.documentElement.dataset.theme = theme
    },
    updateSettings(patch) {
      this.settings = { ...this.settings, ...patch }
      save('settings', this.settings)
    },
    addNotification(userId, type, message) {
      const notification = {
        id: crypto.randomUUID(),
        userId,
        type,
        message,
        read: false,
        createdAt: new Date().toISOString()
      }
      this.notifications.push(notification)
      save('notifications', this.notifications)
    },
    markNotificationRead(id) {
      const notification = this.notifications.find(n => n.id === id)
      if (notification) {
        notification.read = true
        save('notifications', this.notifications)
      }
    },
    resetAll() {
      localStorage.clear()
      location.reload()
    },
    initializeSeedData() {
      const existingUsers = load('users', [])
      if (existingUsers.length === 0) {
        save('users', demoUsers)
      }
      const existingReviews = load('reviews', [])
      if (existingReviews.length === 0) {
        save('reviews', demoReviews)
      }
      const existingActivities = load('activities', [])
      if (existingActivities.length === 0) {
        save('activities', demoActivities)
      }
    }
  },
  getters: {
    unreadNotifications: (state) => (userId) => {
      return state.notifications.filter(n => n.userId === userId && !n.read).length
    }
  }
})
