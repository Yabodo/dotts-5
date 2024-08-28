import { ref } from 'vue'

interface Notification {
  id: number
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

const notifications = ref<Notification[]>([])

export const useNotifications = () => {
  const addNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = Date.now()
    notifications.value.push({ id, message, type })
    setTimeout(() => removeNotification(id), 4500)
  }

  const removeNotification = (id: number) => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  return {
    notifications,
    addNotification,
    removeNotification
  }
}