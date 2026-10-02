<script setup>
import Modal from './Modal.vue'

const props = defineProps({
  title: { type: String, default: 'Confirm' },
  message: { type: String, default: 'Are you sure?' },
  confirmText: { type: String, default: 'Confirm' },
  cancelText: { type: String, default: 'Cancel' },
  confirmClass: { type: String, default: 'btn--primary' }
})

const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <Modal :title="title" @close="$emit('cancel')">
    <template #default>
      <p class="confirm-message">{{ message }}</p>
    </template>
    <template #actions>
      <button class="btn" :class="confirmClass" @click="$emit('confirm')">{{ confirmText }}</button>
      <button class="btn btn--ghost" @click="$emit('cancel')">{{ cancelText }}</button>
    </template>
  </Modal>
</template>
