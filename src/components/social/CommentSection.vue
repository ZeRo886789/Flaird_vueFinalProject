<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import { useSocialStore } from '../../stores/socialStore'

const props = defineProps({
  titleId: { type: Number, required: true }
})

const auth = useAuthStore()
const social = useSocialStore()

const newComment = ref('')

const titleReviews = computed(() =>
  social.reviews.filter(r => r.titleId === props.titleId)
)

const allComments = computed(() => {
  const reviewIds = titleReviews.value.map(r => r.id)
  return [...social.comments]
    .filter(c => reviewIds.includes(c.reviewId))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

function getCommentUser(comment) {
  return auth.users.find(u => u.id === comment.userId) || null
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString()
}

function addComment() {
  if (!auth.currentUser || !newComment.value.trim()) return
  const firstReview = titleReviews.value[0]
  if (firstReview) {
    social.addComment({
      reviewId: firstReview.id,
      userId: auth.currentUser.id,
      text: newComment.value.trim()
    })
    newComment.value = ''
  }
}
</script>

<template>
  <div class="comment-section">
    <h3>Comments</h3>

    <div v-if="allComments.length === 0" class="comment-section__empty">
      <p>No comments yet. Be the first to comment!</p>
    </div>

    <div v-else class="comments-list">
      <div v-for="comment in allComments" :key="comment.id" class="comment">
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

    <div v-if="auth.currentUser" class="comment-form">
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
</template>
