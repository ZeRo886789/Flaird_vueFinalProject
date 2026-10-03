<script setup>
import { ref } from 'vue'

defineProps({
  title: {
    type: String,
    default: ''
  },

  showClose: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])

const isOpen = ref(true)

function close() {
  if (!isOpen.value) {
    return
  }

  isOpen.value = false

  window.setTimeout(() => {
    emit('close')
  }, 200)
}
</script>

<template>
  <Teleport to="body">

    <Transition name="modal">

      <div
        v-if="isOpen"
        class="modal-overlay"
        @click="close"
      >

        <div
          class="modal"
          role="dialog"
          aria-modal="true"
          @click.stop
        >

          <header
            v-if="title || showClose"
            class="modal__header"
          >

            <h2 class="modal__title">
              {{ title }}
            </h2>

            <button
              v-if="showClose"
              type="button"
              class="modal__close"
              @click="close"
              aria-label="Close modal"
            >
              ×
            </button>

          </header>

          <div class="modal__body">
            <slot />
          </div>

          <footer class="modal__footer">

            <slot name="actions">

              <button
                type="button"
                class="btn btn--primary"
                @click="close"
              >
                Close
              </button>

            </slot>

          </footer>

        </div>

      </div>

    </Transition>

  </Teleport>
</template>
