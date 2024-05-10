<script setup lang="ts">
import { object, string, type InferType } from 'yup'

const userStore = useUserStore()
const supabase = useSupabaseClient()
const toast = useToast()

const schema = object({
  email: string().email('Invalid email').required('Required'),
  password: string()
    .min(8, 'Must be at least 8 characters')
    .required('Required')
})

const state = reactive({
  email: undefined,
  password: undefined,
  name: undefined
})

const onSubmit = async () => {
  console.log('signing up...', state.email)

  const { error, data } = await supabase.auth.signUp({
    email: state.email,
    password: state.password,
    options: {
      data: {
        name: state.name
      }
    }
  })
  if (error) console.log(error)
  if (data) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: state.email,
      password: state.password
      // options: {
      //   emailRedirectTo: 'http://localhost:3000/confirm'
      // }
    })
  	if (error) console.log(error)
  	if (data) {
      await useAsyncData('user', () => userStore.fetchSupabaseUser())
      toast.add({ title: 'User created', icon: 'i-heroicons-check-circle' })
      navigateTo('/')
    }
  }
}
</script>

<template>
  <!-- :validate-on="['submit']" -->
  <div class="">
    <UForm
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
        label="Name"
        name="name"
      >
        <UInput
          v-model="state.email"
          type="text"
          placeholder="John Doe"
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
        <!-- <UButton
		label="Cancel"
			color="gray"
			variant="ghost"
			@click="emit('close')"
		  /> -->
        <UButton
          type="submit"
          label="Submit"
          color="black"
        />
      </div>
    </UForm>
  </div>
</template>
