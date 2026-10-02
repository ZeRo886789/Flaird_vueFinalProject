<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import { useSocialStore } from '../../stores/socialStore'
import { useLibraryStore } from '../../stores/libraryStore'
import RatingStars from '../common/RatingStars.vue'
import Modal from '../common/Modal.vue'
import ConfirmDialog from '../common/ConfirmDialog.vue'

const props = defineProps({
  review: { type: Object, required: true },
  title: { type: Object, default: null },
  user: { type: Object, default: null },
  canEdit: { type: Boolean, default: false }
})

const emit = defineEmits(['edit', 'delete'])

const auth = useAuthStore()
const social = useSocialStore()
const library = useLibraryStore()

const reviewUser = computed(() => {
  if (props.user) return props.user
  return auth.users.find(u => u.id === props.review.userId) || null
})

const showComments = ref(false)
const newComment = ref('')
const showDeleteConfirm = ref(false)

const liked = computed(() =>
  social.isLikedByUser(props.review.id, auth.currentUser?.id)
)

const likeCount = computed(() => social.getReviewLikes(props.review.id))

const reviewComments = computed(() => {
  return [...social.comments]
    .filter(c => c.reviewId === props.review.id)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
})

function toggleLike() {
  if (!auth.currentUser) return
  social.toggleLike(props.review.id, auth.currentUser.id)
}

function addComment() {
  if (!auth.currentUser || !newComment.value.trim()) return
  social.addComment({
    reviewId: props.review.id,
    userId: auth.currentUser.id,
    text: newComment.value.trim()
  })
  newComment.value = ''
}

function getCommentUser(comment) {
  return auth.users.find(u => u.id === comment.userId) || null
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString()
}
</script>

<template>
  <article class="review-card">
    <div class="review-card__header">
      <div class="review-card__user">
        <img
          v-if="reviewUser?.avatar"
          :src="reviewUser.avatar"
          :alt="reviewUser.name"
          class="avatar"
        />
        <div class="avatar" v-else>{{ reviewUser?.name?.charAt(0) || 'U' }}</div>
        <div class="review-card__user-info">
          <span class="review-card__username">{{ reviewUser?.name || 'Unknown' }}</span>
          <time class="review-card__date">{{ formatDate(review.createdAt) }}</time>
        </div>
      </div>
      <div v-if="canEdit" class="review-card__actions">
        <button class="btn btn--ghost btn--sm" @click="$emit('edit', review)">Edit</button>
        <button class="btn btn--ghost btn--sm btn--danger" @click="showDeleteConfirm = true">Delete</button>
      </div>
    </div>

    <div class="review-card__rating">
      <RatingStars :rating="review.rating" :max="5" :readonly="true" size="md" />
    </div>

    <p class="review-card__text">{{ review.text }}</p>

    <div class="review-card__footer">
      <button class="review-card__like" @click="toggleLike" :class="{ liked }">
        <span class="like-icon">{{ liked ? '♥' : '♡' }}</span>
        <span class="like-count">{{ likeCount }}</span>
      </button>
      <button class="review-card__comment" @click="showComments = !showComments">
        <span>💬</span>
        <span class="comment-count">{{ reviewComments.length }}</span>
      </button>
    </div>

    <div v-if="showComments" class="review-card__comments">
      <div class="comments-list">
        <div v-for="comment in reviewComments" :key="comment.id" class="comment">
          <div class="comment__avatar">
            <img
              v-if="getCommentUser(comment)?.avatar"
              :src="getCommentUser(comment).avatar"
              :alt="getCommentUser(comment).name"
            />
            <span v-else>{{ getCommentUser(comment)?.name?.charAt(0) || 'U' }}</span>
          </div>
          <div class="comment__content">
            <div class="comment__header">
              <span class="comment__username">{{ getCommentUser(comment)?.name || 'Unknown' }}</span>
              <time class="comment__date">{{ formatDate(comment.createdAt) }}</time>
            </div>
            <p class="comment__text">{{ comment.text }}</p>
          </div>
        </div>
      </div>

      <div class="comment-form" v-if="auth.currentUser">
        <input
          v-model="newComment"
          placeholder="Write a comment..."
          class="comment-form__input"
          @keydown.enter="addComment"
        />
        <button class="btn btn--primary btn--sm" @click="addComment" :disabled="!newComment.trim()">Post</button>
      </div>
      <p v-else class="comment-form__login">Log in to comment</p>
    </div>
  </article>

  <ConfirmDialog
    v-if="showDeleteConfirm"
    title="Delete Review"
    message="Are you sure you want to delete this review? This cannot be undone."
    @confirm="$emit('delete', review); showDeleteConfirm = false"
    @cancel="showDeleteConfirm = false"
    confirm-text="Delete"
    confirm-class="btn--danger"
  />
</template>
