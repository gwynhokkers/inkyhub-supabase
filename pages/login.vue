<script setup lang="ts">
import { object, string, type InferType } from 'yup'
import type { LoginForm } from '~/types'

// const userStore = useUserStore()
// const user = useSupabaseUser()
const supabase = useSupabaseClient<Database>()

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

const onSubmit = async (formData: LoginForm) => {
	error.value = null

	const { data, error: signInError } = await supabase.auth.signInWithPassword({
		email: formData.email,
		password: formData.password
		// options: {
		//   emailRedirectTo: 'http://localhost:3000/confirm'
		// }
	})
	if (signInError) {
		error.value = signInError.message
		return
	}
	if (data) {
		navigateTo('/')
	}
}
</script>

<template>
	<!-- :validate-on="['submit']" -->
	<div class="flex justify-center flex-col gap-4 items-center w-full h-full">
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
					<NuxtLink to="/forgot-password" class="text-primary font-medium">
						Forgot password?
					</NuxtLink>
				</template>
				<template #validation>
					<UAlert v-if="error" color="red" icon="i-heroicons-information-circle-20-solid" :title="error" />
				</template>
				<template #footer>
					By signing in, you agree to our <NuxtLink to="/" class="text-primary font-medium">
						Terms of Service
					</NuxtLink>.
				</template>
			</UAuthForm>
		</UCard>
		<!-- :providers="[{ label: 'GitHub', icon: 'i-simple-icons-github', color: 'gray' }]" -->
	</div>
</template>
