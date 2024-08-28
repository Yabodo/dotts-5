<template>
    <div class="fixed bottom-4 right-4 z-50 space-y-2">
      <TransitionGroup name="notification">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="px-4 rounded-lg shadow-md max-w-sm"
          :class="{
            'bg-green-500 text-white': notification.type === 'success',
            'bg-red-500 text-white': notification.type === 'error',
            'bg-blue-500 text-white': notification.type === 'info',
            'bg-orange-500 text-white': notification.type === 'warning'
          }"
        >
          <div class="flex justify-between items-center">
            <p>{{ notification.message }}</p>
            <div @click="removeNotification(notification.id)" class="i-tabler-square-x ms-2" />
          </div>
        </div>
      </TransitionGroup>
    </div>
  </template>
  
  <script setup lang="ts">
  const { notifications, removeNotification } = useNotifications()
  </script>
  
  <style scoped>
  .notification-enter-active,
  .notification-leave-active {
    transition: all 0.3s ease;
  }
  .notification-enter-from,
  .notification-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
  </style>