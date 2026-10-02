import { defineStore } from 'pinia'
import { load, save } from '../utils/storage'
import { useAuthStore } from './authStore'
import { anime } from '../data/anime'
import { manga } from '../data/manga'

export const useLibraryStore = defineStore('library', {
  state: () => ({
    library: load('library', []),
    favorites: load('favorites', []),
    ratings: load('ratings', [])
  }),

  getters: {
    currentUserItems() {
      const auth = useAuthStore()
      return this.library.filter(x => x.userId === auth.currentUser?.id)
    }
  },

  actions: {
    addToLibrary(title, status = 'planning') {
      const auth = useAuthStore()
      if (!auth.currentUser) return null
      const existing = this.library.find(
        x => x.userId === auth.currentUser.id && x.titleId === title.id
      )
      if (existing) return existing
      const item = {
        id: crypto.randomUUID(),
        userId: auth.currentUser.id,
        titleId: title.id,
        type: title.type,
        status,
        progress: 0,
        updatedAt: new Date().toISOString()
      }
      this.library.push(item)
      save('library', this.library)
      return item
    },

    removeFromLibrary(titleId) {
      const auth = useAuthStore()
      const index = this.library.findIndex(
        x => x.userId === auth.currentUser?.id && x.titleId === titleId
      )
      if (index >= 0) {
        this.library.splice(index, 1)
        save('library', this.library)
      }
    },

    updateProgress(titleId, progress, status) {
      const auth = useAuthStore()
      const title = [...this.library].find(
        x => x.userId === auth.currentUser?.id && x.titleId === titleId
      )
      if (!title) return

      const allTitles = [...anime, ...manga]
      const media = allTitles.find(t => t.id === title.titleId)

      const total = media
        ? media.type === 'anime'
          ? media.episodes
          : media.chapters
        : Number.MAX_SAFE_INTEGER

      const numericProgress = Math.min(
        Math.max(Number(progress) || 0, 0),
        total || Number.MAX_SAFE_INTEGER
      )

      title.progress = numericProgress

      if (status) {
        title.status = status
      }

      if (numericProgress >= total && total > 0) {
        title.status = 'completed'
      }

      title.updatedAt = new Date().toISOString()
      save('library', this.library)
    },

    toggleFavorite(titleId) {
      const auth = useAuthStore()
      if (!auth.currentUser) return
      const key = `${auth.currentUser.id}:${titleId}`
      const index = this.favorites.indexOf(key)
      if (index >= 0) {
        this.favorites.splice(index, 1)
      } else {
        this.favorites.push(key)
      }
      save('favorites', this.favorites)
    },

    isFavorite(titleId) {
      const auth = useAuthStore()
      return this.favorites.includes(`${auth.currentUser?.id}:${titleId}`)
    },

    rateTitle(titleId, rating) {
      const auth = useAuthStore()
      const key = `${auth.currentUser?.id}:${titleId}`
      const existing = this.ratings.find(x => x.key === key)
      if (existing) {
        existing.rating = rating
      } else {
        this.ratings.push({
          key,
          userId: auth.currentUser.id,
          titleId,
          rating
        })
      }
      save('ratings', this.ratings)
    },

    getUserRating(titleId) {
      const auth = useAuthStore()
      const key = `${auth.currentUser?.id}:${titleId}`
      const rating = this.ratings.find(x => x.key === key)
      return rating ? rating.rating : 0
    }
  }
})
