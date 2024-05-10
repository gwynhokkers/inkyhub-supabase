<script setup lang="ts">
import { object, string, type InferType } from 'yup'

// const userStore = useUserStore()
const user = useSupabaseUser()
const supabase = useSupabaseClient()

const error = ref<string | null>(null)

const fields = [{
  name: 'email',
  type: 'text',
  label: 'Email',
  placeholder: 'Enter your email'
}, {
  name: 'password',
  label: 'Password',
  type: 'password',
  placeholder: 'Enter your password'
}, {
  name: 'remember',
  label: 'Remember me',
  type: 'checkbox'
}]

const schema = object({
  email: string().email('Invalid email').required('Required'),
  password: string()
    .min(8, 'Must be at least 8 characters')
    .required('Required')
})

// const state = reactive({
//   email: undefined,
//   password: undefined
// })

const onSubmit = async (formData: any) => {
//   console.log('signing in...', state.email)
  console.log('signing in...', formData)

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password
    // options: {
    //   emailRedirectTo: 'http://localhost:3000/confirm'
    // }
  })
  if (error) console.log(error)
  if (data) {
    // user signed in successfully
    // redirect to home
    // fetch profile from API
    const { data } = await useAsyncData('profile', async () => {
      const { data } = await supabase
        .from('users')
        .select('name, avatar, status, location')
        .eq('id', user.value.id)
        .single()

      return data
    })
    console.warn('User Profile:::', data.value)

    navigateTo('/')
  }
}

// const resetPassword = async () => {
//   console.log('resetting password...', state.email)

//   const { error } = await supabase.auth.resetPasswordForEmail(state.email, {
//     redirectTo: 'http://localhost:3000/reset-password'
//   })
//   if (error) console.log(error)
// }
</script>

<template>
  <!-- :validate-on="['submit']" -->
  <div class="flex justify-center flex-col gap-4 items-center w-full h-full">
    <!-- <UForm
      :state="state"
      :schema="schema"
      class="space-y-4"
      @submit="onSubmit"
    >
      <UFormGroup
        label="Email"
        name="email"
      >
        <UInput
          v-model="state.email"
          type="email"
          placeholder="john.doe@example.com"
        />
      </UFormGroup>

      <UFormGroup
        label="Password"
        name="password"
      >
        <UInput
          v-model="state.password"
          type="password"
        />
      </UFormGroup>

      <div class="flex justify-end gap-3">
        <UButton
          type="submit"
          label="Submit"
          color="black"
        />
      </div>
    </UForm> -->
    <UCard class="max-w-sm w-full">
      <UAuthForm
        title="Welcome back!"
        description="Enter your credentials to access your account."
        :schema="schema"
        :fields="fields"
        align="top"
        icon="i-heroicons-lock-closed"
        :ui="{ base: 'text-center', footer: 'text-center' }"
        :loading="false"
        @submit="onSubmit"
      >
        <template #description>
          Don't have an account? <NuxtLink to="/signup" class="text-primary font-medium">
            Sign up
          </NuxtLink>.
        </template>

        <template #password-hint>
          <NuxtLink to="/" class="text-primary font-medium">
            Forgot password?
          </NuxtLink>
        </template>
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
    <!-- :providers="[{ label: 'GitHub', icon: 'i-simple-icons-github', color: 'gray' }]" -->
    <!-- <div class="flex flex-col gap-4 items-baseline">
      <p>
        Don't have an account?
        <ULink
          href="/signup"
          class="text-green-400"
        >
          Sign up
        </ULink>
      </p>
      <p>
        Forgotten your password?
        <ULink
          class="text-green-400"
          @click="resetPassword"
        >
          Reset password
        </ULink>
      </p>
    </div> -->
  </div>
</template>
