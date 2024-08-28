<template>
  <TransitionRoot as="template" :show="open">
    <Dialog class="relative z-10">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full justify-center p-4 text-center items-center">
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel class="p-3 relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg">
              
            <div class="mx-auto w-full max-w-sm">
              <svg class="mx-auto h-10 w-full mt-10" viewBox="0 0 1120 1280" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M640 320L0 0L88 1280H320L640 320Z" fill="#191970"/>
                <path d="M824 640L1008 960L824 1280H456L591.489 873.535L824 640Z" fill="#191970"/>
                <path d="M1108 1120L960 1204V1280H1120L1108 1120Z" fill="#191970"/>
              </svg>
              <h2 class="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">{{ modalTitle }}</h2>
              <p v-if="modalNotification" class="text-center font-medium text-gray-900">{{ modalNotification }}</p>
            </div>

            <div class="mt-10 mx-auto w-full max-w-sm">
              <form class="space-y-6" @submit.prevent>
                <div v-if="isLogin || isRegister">
                  <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                  <div class="flex items-stretch relative mt-2">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                      <i class="i-tabler-mail text-blue-600" />
                    </div>
                    <input v-model="email" id="email" name="email" type="email" autocomplete="email" required="" class="block w-full rounded-md border-0 py-1.5 ps-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6" />
                  </div>
                </div>

                <div v-if="isLogin || isRegister">
                  <div class="flex items-center justify-between">
                    <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
                    <!-- TODO! <div class="text-sm">
                      <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
                    </div>-->
                  </div>
                  <div class="flex items-stretch relative mt-2">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                      <i class="i-tabler-password text-blue-600" />
                    </div>
                    <input v-model="password" id="password" name="password" type="password" autocomplete="current-password" required="" class="block w-full rounded-md border-0 py-1.5 ps-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6" />
                  </div>
                </div>

                <div v-if="isRegister" class="flex items-center">
                    <input v-model="acceptedTerms" id="link-checkbox" type="checkbox" required class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                    <label for="link-checkbox" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">I agree with the <a @click="modalState = 'terms'" class="text-blue-600 dark:text-blue-500 hover:underline">terms and conditions</a>.</label>
                </div>

                <div v-if="isTerms">
                  <ButtonText @click="modalState = 'register'" icon="i-tabler-arrow-left" label="Back" />
                  <ModalTerms />
                  <ButtonText @click="modalState = 'register'" icon="i-tabler-arrow-left" label="Back" />
                </div>

                <div>
                  <ButtonPrimary v-if="isLogin" @click="onLogin()" label="Login" icon="i-tabler-login" class="mb-4 flex w-full justify-center px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" />
                  <ButtonSecondary v-if="isLogin || isRegister" @click="onRegister()" label="Register" icon="i-tabler-signature" class="mb-4 flex w-full justify-center px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" />
                  <ButtonText v-if="isRegister" @click="modalState = 'login'" label="Log in instead." icon="i-tabler-login" />
                  <div class="mb-10" />
                </div>
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
  signIn,
  signUp,
} = useSupabaseDatabase();

const { addNotification } = useNotifications()

const open = ref(true)
const modalState = ref("login") // "login, register, terms"
const acceptedTerms = ref(true)
const email = ref("")
const password = ref("")
const modalNotification = ref("")

  const isRegister = computed(() => {
    return ['register'].includes(modalState.value)
  })

  const isLogin = computed(() => {
    return ['login'].includes(modalState.value)
  })

  const isTerms = computed(() => {
    return ['terms'].includes(modalState.value)
  })

const modalTitle = computed(() => {
  if (modalState.value == "login") {
    return "Sign in to your account"
  } else {
    return "Register for an account"
  }
})

async function onRegister() {
  modalNotification.value = ""
  if (modalState.value == "login") {
    modalState.value = "register"
    return
  }
  if (!acceptedTerms.value) {
    return
  }
  const result = await signUp(email.value, password.value)
  if (result) {
    let message = "Signed up successfully! Please check your mail or spam for confirmation link."
    addNotification(message, "success")
    modalNotification.value = message
    modalState.value = "login"
  } else {
    addNotification("Signing up account failed! Email probably in use or the password too insecure.", "error")
  }
}

async function onLogin() {
  modalNotification.value = ""
  if (email.value == "" || password.value == "") {
    return
  }
  let signedIn = await signIn(email.value, password.value)
  if (signedIn) {
    email.value = ""
    password.value = ""
    open.value = false
  }
}

</script>