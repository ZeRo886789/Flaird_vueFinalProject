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

      if (!auth.currentUser) {
        return
      }

      const libraryItem = this.library.find(
        item =>
          item.userId === auth.currentUser.id &&
          item.titleId === titleId
      )

      if (!libraryItem) {
        return
      }

      const media = [
        ...anime,
        ...manga
      ].find(
        title => title.id === titleId
      )

      if (!media) {
        return
      }

      const rawTotal =
        media.type === 'anime'
          ? Number(media.episodes)
          : Number(media.chapters)

      const total =
        Number.isFinite(rawTotal) &&
        rawTotal > 0
          ? rawTotal
          : 0

      let numericProgress =
        Number(progress)

      if (!Number.isFinite(numericProgress)) {
        numericProgress = 0
      }

      numericProgress = Math.max(
        numericProgress,
        0
      )

      if (total > 0) {
        numericProgress = Math.min(
          numericProgress,
          total
        )
      }

      libraryItem.progress =
        Math.round(numericProgress)

      if (status) {
        libraryItem.status = status
      }

      /*
       * Automatically complete a title
       * when progress reaches the total.
       */
      if (
        total > 0 &&
        libraryItem.progress >= total
      ) {
        libraryItem.progress = total
        libraryItem.status = 'completed'
      }

      libraryItem.updatedAt =
        new Date().toISOString()

      save(
        'library',
        this.library
      )
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
