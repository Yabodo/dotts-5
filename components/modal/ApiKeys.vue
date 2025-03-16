<template>
  <TransitionRoot as="template" :show="isOpen" @close="isOpen = false">
    <Dialog as="div" class="relative z-10">
      <TransitionChild
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full justify-center p-4 text-center items-center">
          <TransitionChild
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">
                      API Keys
                    </DialogTitle>
                    
                    <!-- New Key Form -->
                    <div class="mt-4">
                      <form @submit.prevent="generateNewKey" class="flex gap-2">
                        <input
                          v-model="newKeyName"
                          type="text"
                          placeholder="Key name"
                          class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        />
                        <ButtonPrimary
                          @click="generateNewKey"
                          label="Generate"
                          icon="i-tabler-key"
                        />
                      </form>
                    </div>

                    <!-- New Key Display -->
                    <div v-if="newKey" class="mt-4 p-4 bg-gray-50 rounded-md">
                      <p class="text-sm font-medium text-gray-900">New API Key Generated</p>
                      <p class="mt-1 text-sm text-gray-500">Copy this key now. You won't be able to see it again!</p>
                      <div class="mt-2 flex gap-2">
                        <code class="block w-full p-2 bg-gray-100 rounded text-sm">{{ newKey }}</code>
                        <ButtonPrimaryIcon
                          @click="copyKey"
                          icon="i-tabler-copy"
                        />
                      </div>
                    </div>

                    <!-- Existing Keys List -->
                    <div class="mt-4">
                      <div v-for="key in apiKeys" :key="key.id" class="mb-4 p-4 bg-gray-50 rounded-md">
                        <div class="flex justify-between items-center">
                          <div>
                            <p class="font-medium">{{ key.name }}</p>
                            <p class="text-sm text-gray-500">
                              Created: {{ new Date(key.created_at).toLocaleDateString() }}
                            </p>
                            <p v-if="key.last_used_at" class="text-sm text-gray-500">
                              Last used: {{ new Date(key.last_used_at).toLocaleDateString() }}
                            </p>
                          </div>
                          <ButtonPrimary
                            v-if="key.is_active"
                            @click="revokeKey(key.id)"
                            label="Revoke"
                            icon="i-tabler-trash"
                            class="bg-red-600"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

const {
  generateApiKey,
  listApiKeys,
  revokeApiKey,
} = useSupabaseDatabase()

const { addNotification } = useNotifications()

const isOpen = ref(false)
const newKeyName = ref('')
const newKey = ref('')
const apiKeys = ref([])

const open = () => {
  isOpen.value = true
  loadKeys()
}

const loadKeys = async () => {
  apiKeys.value = await listApiKeys()
}

const generateNewKey = async () => {
  if (!newKeyName.value) {
    addNotification('Please enter a key name', 'warning')
    return
  }

  const key = await generateApiKey(newKeyName.value)
  if (key) {
    newKey.value = key
    newKeyName.value = ''
    await loadKeys()
    addNotification('API key generated successfully', 'success')
  }
}

const revokeKey = async (keyId) => {
  if (await revokeApiKey(keyId)) {
    await loadKeys()
    addNotification('API key revoked successfully', 'success')
  }
}

const copyKey = () => {
  navigator.clipboard.writeText(newKey.value)
  addNotification('API key copied to clipboard', 'success')
}

defineExpose({ open })
</script>