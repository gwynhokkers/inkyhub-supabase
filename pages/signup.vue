<script setup lang="ts">
import { object, string, type InferType } from 'yup'


const userStore = useUserStore()
const supabase = useSupabaseClient()
const toast = useToast()

const error = ref<string | null>(null)

const schema = object({
  email: string().email('Invalid email').required('Required'),
  password: string()
    .min(8, 'Must be at least 8 characters')
    .required('Required')
})

const fields = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Enter your name'
  },
  {
    name: 'username',
    label: 'Username',
    type: 'text',
    placeholder: 'Enter your username'
  },
  {
    name: 'email',
    type: 'text',
    label: 'Email',
    placeholder: 'Enter your email'
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password'
  }
]

// const state = reactive({
//   email: undefined,
//   password: undefined,
//   name: undefined
// })

const onSubmit = async (formData) => {
  console.log('signing up...', formData.email)

  const { error, data } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        name: formData.name,
        username: formData.username
      }
    }
  })
  console.log(data, error)

  if (error) {
    console.log(error)

    error.value = error.message
  } else if (data) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password
      // options: {
      //   emailRedirectTo: 'http://localhost:3000/confirm'
      // }
    })
    if (error) {
      console.log(error)
      error.value = error.message
    }
    if (data) {
      try {
        await useAsyncData('user', () => userStore.fetchSupabaseUser()).then(() => {
          toast.add({
            title: 'User created',
            icon: 'i-heroicons-check-circle'
          })
          navigateTo('/')
        })
      } catch (error) {
        console.log(error)
        error.value = error.message
      }

    //   navigateTo('/')
    }
  }
}
</script>

<template>
  <!-- :validate-on="['submit']" -->
  <div class="flex justify-center flex-col gap-4 items-center w-full h-full">
    <UCard class="max-w-sm w-full">
      <UAuthForm
        title="Welcome to Inky Hub!"
        description="Enter your credentials to create your account."
        :schema="schema"
        :fields="fields"
        align="top"
        icon="i-heroicons-lock-closed"
        :ui="{ base: 'text-center', footer: 'text-center' }"
        :loading="false"
        @submit="onSubmit"
      >
        <template #description>
          Sign up to access your account.
        </template>

        <!-- <template #password-hint>
          <NuxtLink to="/" class="text-primary font-medium">
            Forgot password?
          </NuxtLink>
        </template> -->
        <template #validation>
          <UAlert v-if="error" color="red" icon="i-heroicons-information-circle-20-solid" title="Error signing in" />
        </template>
        <template #footer>
          By signing in, you agree to our <NuxtLink to="/" class="text-primary font-medium">
            Terms of Service
          </NuxtLink>.
        </template>
      </UAuthForm>
    </UCard>
  </div>
</template>
