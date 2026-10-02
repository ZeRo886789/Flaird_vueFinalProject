<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const email = ref('')
const password = ref('')
const error = ref('')
const showPassword = ref(false)
const loading = ref(false)

function submit() {
  error.value = ''
  loading.value = true
  const result = auth.login(email.value, password.value)
  loading.value = false
  if (!result.ok) return error.value = result.message
  const redirect = route.query.redirect || '/dashboard'
  router.push(redirect)
}
</script>

<template>
  <section class="auth-page page-container">
    <form class="auth-card" @submit.prevent="submit">
      <div class="auth-card__header">
        <div class="page-header__eyebrow">Welcome back</div>
        <h1>Log in</h1>
        <p class="text-muted">Access your local FLAIRD account.</p>
      </div>
      <div class="form-grid">
        <div class="field">
          <label for="email">Email</label>
          <input id="email" v-model="email" type="email" required autocomplete="email" :disabled="loading" />
        </div>
        <div class="field">
          <label for="password">Password</label>
          <div class="password-input">
            <input
              id="password"
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              required
              minlength="6"
              autocomplete="current-password"
              :disabled="loading"
            />
            <button type="button" class="password-toggle" @click="showPassword = !showPassword" :disabled="loading">
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>
          </div>
        </div>
        <p v-if="error" class="error-message">{{ error }}</p>
        <button class="btn btn--primary" type="submit" :disabled="loading" style="width: 100%;">
          <span v-if="loading">Logging in...</span>
          <span v-else>Log in</span>
        </button>
      </div>
      <div class="auth-card__footer">
        No account? <RouterLink to="/register" class="text-gradient">Create one</RouterLink>
      </div>
    </form>
  </section>
</template>