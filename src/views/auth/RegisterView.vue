<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
const auth = useAuthStore()
const router = useRouter()
const form = ref({ name: '', username: '', email: '', password: '', confirmPassword: '' })
const error = ref('')
const showPassword = ref(false)
const loading = ref(false)

function submit() {
  error.value = ''
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Passwords do not match.'
    return
  }
  if (form.value.password.length < 6) {
    error.value = 'Password must be at least 6 characters.'
    return
  }
  if (!form.value.email.includes('@')) {
    error.value = 'Please enter a valid email address.'
    return
  }
  loading.value = true
  const result = auth.register(form.value)
  loading.value = false
  if (!result.ok) return error.value = result.message
  router.push('/dashboard')
}
</script>

<template>
  <section class="auth-page page-container">
    <form class="auth-card" @submit.prevent="submit">
      <div class="auth-card__header">
        <div class="page-header__eyebrow">Start tracking</div>
        <h1>Create account</h1>
        <p class="text-muted">This school-project prototype stores accounts locally.</p>
      </div>
      <div class="form-grid">
        <div class="field">
          <label for="name">Name</label>
          <input id="name" v-model="form.name" required :disabled="loading" />
        </div>
        <div class="field">
          <label for="username">Username</label>
          <input id="username" v-model="form.username" required minlength="3" :disabled="loading" />
        </div>
        <div class="field">
          <label for="email">Email</label>
          <input id="email" v-model="form.email" type="email" required :disabled="loading" />
        </div>
        <div class="field">
          <label for="password">Password</label>
          <div class="password-input">
            <input
              id="password"
              :type="showPassword ? 'text' : 'password'"
              v-model="form.password"
              required
              minlength="6"
              :disabled="loading"
            />
            <button type="button" class="password-toggle" @click="showPassword = !showPassword" :disabled="loading">
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>
          </div>
        </div>
        <div class="field">
          <label for="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            :type="showPassword ? 'text' : 'password'"
            v-model="form.confirmPassword"
            required
            :disabled="loading"
          />
        </div>
        <p v-if="error" class="error-message">{{ error }}</p>
        <button class="btn btn--primary" type="submit" :disabled="loading" style="width: 100%;">
          <span v-if="loading">Creating account...</span>
          <span v-else>Create Account</span>
        </button>
      </div>
    </form>
  </section>
</template>