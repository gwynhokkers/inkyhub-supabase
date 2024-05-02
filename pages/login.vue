<script setup lang="ts">
import { object, string, type InferType } from 'yup'
const profileStore = useProfileStore()
const user = useSupabaseUser()
const supabase = useSupabaseClient()

const schema = object({
  email: string().email('Invalid email').required('Required'),
  password: string()
    .min(8, 'Must be at least 8 characters')
    .required('Required')
})

const state = reactive({
  email: undefined,
  password: undefined
})


const onSubmit = async () => {
	console.log('signing in...', state.email)

	const { data, error } = await supabase.auth.signInWithPassword({
		email: state.email,
		password: state.password
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
				.from('profiles')
				.select('name, avatar, status, location')
				.eq('id', user.value.id)
				.single()

			return data
		})
		console.warn('Profile:::', data.value);

		navigateTo('/')
	}
}

const resetPassword = async () => {
	console.log('resetting password...', state.email)

	const { error } = await supabase.auth.resetPasswordForEmail(state.email, {
		redirectTo: 'http://localhost:3000/reset-password',
	})
	if (error) console.log(error)
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
    <p>Reset password</p>
	<UButton
		label="Reset"
		color="black"
		@click="resetPassword"
	/>
  </div>
</template>
