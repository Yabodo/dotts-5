<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog class="relative z-10">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              
            <div class="sm:mx-auto sm:w-full sm:max-w-sm">
              <svg class="mx-auto h-10 w-full mt-10" viewBox="0 0 1120 1280" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M640 320L0 0L88 1280H320L640 320Z" fill="#191970"/>
                <path d="M824 640L1008 960L824 1280H456L591.489 873.535L824 640Z" fill="#191970"/>
                <path d="M1108 1120L960 1204V1280H1120L1108 1120Z" fill="#191970"/>
              </svg>
              <h2 class="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Pick a nickname!</h2>
            </div>

            <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              
              <form
                @submit.prevent
                style="margin: 10px 0"
                class="space-y-6"
              >
                <div>
                  <div class="flex items-center justify-between">
                    <label for="nickname" class="block text-sm font-medium leading-6 text-gray-900">Nickname</label>
                  </div>
                  <div class="flex items-stretch relative mt-2">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                      <i class="i-tabler-user-question text-blue-600" />
                    </div>
                    <input v-model="username" id="username" name="username" type="text" autocomplete="nickname" class="block w-full rounded-md border-0 py-1.5 ps-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6" />
                  </div>
                </div>
                <ButtonPrimary @click="onSubmit" label="Save" icon="i-tabler-save" class="mb-4 flex w-full justify-center px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" />
                <div class="pb-5" />
              </form>
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
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'

const {
  insertUsername,
} = useSupabaseDatabase();

const { addNotification } = useNotifications()

const isOpen = ref(false)
const username = ref("")

async function onSubmit() {
  if (username.value == "") {
    return
  }
  const result = await insertUsername(username.value);
  if (result) {
    addNotification(`Set your username to ${username.value}`, 'success');
    username.value = '';
    close()
  } else {
    addNotification('Username already taken.', 'error');
  }
}

function toggle() {
  isOpen.value = !isOpen.value
}

function open() {
  isOpen.value = true
}

function close() {
  isOpen.value = false
}

defineExpose({
  toggle,
  open,
  close
})

</script>