import { defineStore } from 'pinia'
import { load, save } from '../utils/storage'
import { useAuthStore } from './authStore'

export const useSocialStore = defineStore('social', {
  state: () => ({
    reviews: load('reviews', []),
    comments: load('comments', []),
    likes: load('likes', []),
    activities: load('activities', [])
  }),
  actions: {
    addReview(review) {
      const reviewObj = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...review
      }
      this.reviews.unshift(reviewObj)
      save('reviews', this.reviews)
      this.addActivity({
        userId: review.userId,
        type: 'reviewed',
        titleId: review.titleId,
        message: 'wrote a new review'
      })
      return reviewObj
    },
    deleteReview(id) {
      const auth = useAuthStore()
      const review = this.reviews.find(r => r.id === id)
      if (!review) return
      if (!auth.currentUser || review.userId !== auth.currentUser.id) return
      this.reviews = this.reviews.filter(r => r.id !== id)
      save('reviews', this.reviews)
    },
    updateReview(id, patch) {
      const auth = useAuthStore()
      const index = this.reviews.findIndex(r => r.id === id)
      if (index < 0) return
      if (!auth.currentUser || this.reviews[index].userId !== auth.currentUser.id) return
      this.reviews[index] = { ...this.reviews[index], ...patch }
      save('reviews', this.reviews)
    },
    addComment(comment) {
      const commentObj = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...comment
      }
      this.comments.push(commentObj)
      save('comments', this.comments)
      return commentObj
    },
    deleteComment(id) {
      const auth = useAuthStore()
      const comment = this.comments.find(c => c.id === id)
      if (!comment) return
      if (!auth.currentUser || comment.userId !== auth.currentUser.id) return
      this.comments = this.comments.filter(c => c.id !== id)
      save('comments', this.comments)
    },
    toggleLike(reviewId, userId) {
      const key = `${userId}:${reviewId}`
      const i = this.likes.indexOf(key)
      if (i >= 0) {
        this.likes.splice(i, 1)
      } else {
        this.likes.push(key)
      }
      save('likes', this.likes)
    },
    addActivity(activity) {
      const activityObj = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...activity
      }
      this.activities.push(activityObj)
      save('activities', this.activities)
    },
    getUser(userId) {
      const auth = useAuthStore()
      return auth.users.find(u => u.id === userId) || null
    },
    getReviewLikes(reviewId) {
      return this.likes.filter(l => l.endsWith(':' + reviewId)).length
    },
    isLikedByUser(reviewId, userId) {
      return this.likes.includes(`${userId}:${reviewId}`)
    }
  }
})
