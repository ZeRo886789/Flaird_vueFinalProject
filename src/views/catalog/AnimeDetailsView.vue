<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { anime } from '../../data/anime'
import { manga } from '../../data/manga'
import { useAuthStore } from '../../stores/authStore'
import { useLibraryStore } from '../../stores/libraryStore'
import { useSocialStore } from '../../stores/socialStore'
import { useAppStore } from '../../stores/appStore'
import RatingStars from '../../components/common/RatingStars.vue'
import ProgressBar from '../../components/common/ProgressBar.vue'
import GenreBadge from '../../components/common/GenreBadge.vue'
import StatusBadge from '../../components/common/StatusBadge.vue'
import ReviewCard from '../../components/social/ReviewCard.vue'
import CommentSection from '../../components/social/CommentSection.vue'
import Modal from '../../components/common/Modal.vue'
import ConfirmDialog from '../../components/common/ConfirmDialog.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const library = useLibraryStore()
const social = useSocialStore()
const app = useAppStore()

const title = computed(() => anime.find(a => a.id === Number(route.params.id)))
const userLibraryItem = computed(() => title.value && auth.currentUser
  ? library.library.find(x => x.userId === auth.currentUser.id && x.titleId === title.value.id)
  : null)
const titleReviews = computed(() => title.value
  ? social.reviews.filter(r => r.titleId === title.value.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  : [])
const userRating = computed(() => title.value && auth.currentUser
  ? library.ratings.find(r => r.key === `${auth.currentUser.id}:${title.value.id}`)
  : null)

const showAddReview = ref(false)
const showEditReview = ref(null)
const editReviewText = ref('')
const editReviewRating = ref(0)
const newReviewText = ref('')
const newReviewRating = ref(0)
const showDeleteConfirm = ref(null)

const addToLibrary = () => {
  if (title.value && auth.currentUser) {
    library.addToLibrary(title.value, 'planning')
  }
}

const toggleFavorite = () => {
  if (title.value) library.toggleFavorite(title.value.id)
}

const updateProgress = () => {
  if (title.value && userLibraryItem.value) {
    library.updateProgress(title.value.id, userLibraryItem.value.progress, userLibraryItem.value.status)
  }
}

const submitReview = () => {
  if (!title.value || !auth.currentUser || newReviewRating.value === 0) return
  social.addReview({
    userId: auth.currentUser.id,
    titleId: title.value.id,
    rating: newReviewRating.value,
    text: newReviewText.value
  })
  newReviewText.value = ''
  newReviewRating.value = 0
  showAddReview.value = false
}

const startEditReview = (review) => {
  showEditReview.value = review.id
  editReviewText.value = review.text
  editReviewRating.value = review.rating
}

const saveEditReview = (review) => {
  social.reviews = social.reviews.map(r => r.id === review.id ? { ...r, text: editReviewText.value, rating: editReviewRating.value } : r)
  localStorage.setItem('flaird_reviews', JSON.stringify(social.reviews))
  showEditReview.value = null
}

const confirmDeleteReview = (review) => {
  showDeleteConfirm.value = review.id
}

const deleteReview = () => {
  if (showDeleteConfirm.value) {
    social.deleteReview(showDeleteConfirm.value)
    showDeleteConfirm.value = null
  }
}

const rateTitle = (rating) => {
  if (title.value && auth.currentUser) {
    library.rateTitle(title.value.id, rating)
  }
}
</script>

<template>
  <section class="page-container">
    <div v-if="title" class="details-hero">
      <img class="details-hero__cover" :src="title.cover" :alt="title.title" loading="lazy" decoding="async" />
      <div class="details-hero__overlay"></div>
      <div class="details-hero__content">
        <div class="details-hero__main">
          <StatusBadge :status="title.status" />
          <h1 class="details-hero__title">{{ title.title }}</h1>
          <div class="details-hero__meta">
            <RatingStars :rating="title.score" :max="5" :readonly="true" size="lg" />
            <span class="details-hero__year">{{ title.year }}</span>
            <span class="details-hero__episodes">{{ title.episodes }} Episodes</span>
          </div>
          <div class="details-hero__genres">
            <GenreBadge v-for="g in title.genres" :key="g" :genre="g" />
          </div>
        </div>
        <div class="details-hero__actions">
          <button v-if="!userLibraryItem" class="btn btn--primary btn--lg" @click="addToLibrary">Add to Library</button>
          <div v-else class="details-actions-row">
            <select v-model="userLibraryItem.status" class="select" @change="updateProgress">
              <option value="planning">Planning</option>
              <option value="watching">Watching</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
              <option value="dropped">Dropped</option>
            </select>
            <ProgressBar :current="userLibraryItem.progress" :total="title.episodes" :show-label="true" />
            <button class="btn btn--outline" @click="updateProgress">Save Progress</button>
            <button class="btn btn--ghost" @click="toggleFavorite" :class="{ 'is-favorite': library.isFavorite(title.id) }">
              <span class="favorite-icon">{{ library.isFavorite(title.id) ? '♥' : '♡' }}</span> Favorite
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="details-content">
      <div class="details-section">
        <h2>About</h2>
        <p class="details-description">{{ title?.description }}</p>
      </div>

      <div class="details-section">
        <div class="section-header">
          <h2>Your Rating</h2>
          <div v-if="userRating" class="section-header__note">You rated this <strong>{{ userRating.rating }}/5</strong></div>
        </div>
        <RatingStars v-model="newReviewRating" :max="5" size="lg" @update:modelValue="rateTitle" />
      </div>

      <div class="details-section">
        <div class="section-header">
          <h2>Your Review</h2>
          <button v-if="!showAddReview && !auth.currentUser" class="btn btn--ghost btn--sm" @click="router.push({ name: 'login', query: { redirect: route.fullPath } })">Log in to review</button>
          <button v-else-if="!showAddReview && auth.currentUser" class="btn btn--primary btn--sm" @click="showAddReview = true">Write a Review</button>
        </div>

        <div v-if="showAddReview" class="review-form">
          <RatingStars v-model="newReviewRating" :max="5" size="md" />
          <textarea v-model="newReviewText" placeholder="Share your thoughts..." rows="4" class="textarea" />
          <div class="review-form__actions">
            <button class="btn btn--primary" @click="submitReview" :disabled="newReviewRating === 0">Post Review</button>
            <button class="btn btn--ghost" @click="showAddReview = false">Cancel</button>
          </div>
        </div>

        <div class="reviews-list">
          <ReviewCard
            v-for="review in titleReviews"
            :key="review.id"
            :review="review"
            :can-edit="auth.currentUser && review.userId === auth.currentUser.id"
            @edit="startEditReview"
            @delete="confirmDeleteReview"
          />
          <div v-if="titleReviews.length === 0" class="empty-state">
            <p>No reviews yet. Be the first to write one!</p>
          </div>
        </div>
      </div>

      <div class="details-section">
        <CommentSection :title-id="title?.id" />
      </div>
    </div>

    <Modal v-if="showEditReview" @close="showEditReview = null" title="Edit Review">
      <template #default>
        <RatingStars v-model="editReviewRating" :max="5" size="md" />
        <textarea v-model="editReviewText" rows="4" class="textarea" />
      </template>
      <template #actions>
        <button class="btn btn--primary" @click="saveEditReview({ id: showEditReview })">Save</button>
        <button class="btn btn--ghost" @click="showEditReview = null">Cancel</button>
      </template>
    </Modal>

    <ConfirmDialog
      v-if="showDeleteConfirm"
      title="Delete Review"
      message="Are you sure you want to delete this review? This cannot be undone."
      @confirm="deleteReview"
      @cancel="showDeleteConfirm = null"
      confirm-text="Delete"
      confirm-class="btn--danger"
    />
  </section>
</template>