<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import { useSocialStore } from '../../stores/socialStore'
import { useLibraryStore } from '../../stores/libraryStore'
import { anime } from '../../data/anime'
import { manga } from '../../data/manga'
import ReviewCard from '../../components/social/ReviewCard.vue'
import ActivityCard from '../../components/social/ActivityCard.vue'
import RatingStars from '../../components/common/RatingStars.vue'
import Modal from '../../components/common/Modal.vue'

const auth = useAuthStore()
const social = useSocialStore()
const library = useLibraryStore()

const activeTab = ref('activity')
const showReviewForm = ref(false)
const newReviewTitle = ref(null)
const newReviewRating = ref(0)
const newReviewText = ref('')

const allTitles = computed(() => [...anime, ...manga])

const recentReviews = computed(() => [...social.reviews]
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .slice(0, 20))

const recentActivity = computed(() => [...social.activities]
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .slice(0, 20))

const getTitle = (id) => allTitles.value.find(t => t.id === id)

function openReviewForm(title) {
  newReviewTitle.value = title
  newReviewRating.value = 0
  newReviewText.value = ''
  showReviewForm.value = true
}

function submitReview() {
  if (!newReviewTitle.value || !auth.currentUser || newReviewRating.value === 0) return
  social.addReview({
    userId: auth.currentUser.id,
    titleId: newReviewTitle.value.id,
    rating: newReviewRating.value,
    text: newReviewText.value
  })
  showReviewForm.value = false
  newReviewTitle.value = null
}

function getActivityTitle(activity) {
  return getTitle(activity.titleId)
}
</script>

<template>
  <section class="page-container">
    <header class="page-header">
      <div>
        <div class="page-header__eyebrow">FLAIRD</div>
        <h1>Community</h1>
        <p class="page-header__description">Reviews, ratings, comments, likes, and activity.</p>
      </div>
    </header>

    <div class="community-tabs">
      <button
        v-for="tab in ['activity', 'reviews']"
        :key="tab"
        class="community-tab"
        :class="{ active: activeTab === tab }"
        @click="activeTab = tab"
      >
        {{ tab === 'activity' ? 'Activity Feed' : 'Recent Reviews' }}
      </button>
    </div>

    <div v-if="activeTab === 'activity'" class="community-feed">
      <div v-if="recentActivity.length === 0" class="empty-state">
        <h3>No activity yet</h3>
        <p>Be the first to track titles and share reviews!</p>
      </div>
      <ActivityCard
        v-for="activity in recentActivity"
        :key="activity.id"
        :activity="activity"
        :title="getActivityTitle(activity)"
      />
    </div>

    <div v-if="activeTab === 'reviews'" class="community-reviews">
      <div v-if="auth.currentUser" class="write-review-bar">
        <button class="btn btn--primary" @click="openReviewForm(allTitles[0])">Write a Review</button>
      </div>

      <div v-if="recentReviews.length === 0" class="empty-state">
        <h3>No reviews yet</h3>
        <p>Start sharing your thoughts on titles you've watched or read.</p>
      </div>

      <ReviewCard
        v-for="review in recentReviews"
        :key="review.id"
        :review="review"
        :title="getTitle(review.titleId)"
        :can-edit="auth.currentUser && review.userId === auth.currentUser.id"
      />
    </div>

    <Modal v-if="showReviewForm" @close="showReviewForm = false" title="Write a Review">
      <template #default>
        <div class="form-group">
          <label>Title</label>
          <select v-model="newReviewTitle" class="select" required>
            <option value="" disabled>Select a title</option>
            <option v-for="title in allTitles" :key="title.id" :value="title">{{ title.title }} ({{ title.type }})</option>
          </select>
        </div>
        <div class="form-group">
          <label>Your Rating</label>
          <RatingStars v-model="newReviewRating" :max="5" size="md" />
        </div>
        <div class="form-group">
          <label>Review Text</label>
          <textarea v-model="newReviewText" rows="4" class="textarea" placeholder="Share your thoughts..." required />
        </div>
      </template>
      <template #actions>
        <button class="btn btn--primary" @click="submitReview" :disabled="!newReviewTitle || newReviewRating === 0">Post Review</button>
        <button class="btn btn--ghost" @click="showReviewForm = false">Cancel</button>
      </template>
    </Modal>
  </section>
</template>