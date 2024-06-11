<script setup lang="ts">
import { object, string, type InferType } from 'yup'

const supabase = useSupabaseClient()

const fields = [
	{
		name: 'email',
		type: 'text',
		label: 'Email',
		placeholder: 'Enter your email'
	}
]

const email = ref('')

const schema = object({
	email: string().email('Invalid email').required('Required')
})

const onSubmit = async () => {
	try {
		// Call the Supabase API to send a password reset email
		// Check if the email exists in the users table
		const { data, error } = await supabase
			.from('users')
			.select('email')
			.eq('email', email.value)
			.single()
		if (error) {
			console.error(error)
			return
		}
		// Send the password reset email
		const { error: sendError } = await supabase.auth.resetPasswordForEmail(email.value, {
			redirectTo: 'https://inkyhub.pages.dev/reset-password'
		})
		if (sendError) {
			console.error(sendError)
			return
		}
	} catch (error) {
		console.error(error)
	}
}
</script>

<template>
	<div class="flex justify-center flex-col gap-4 items-center w-full h-full">
		<UCard class="max-w-sm w-full">
			<UAuthForm
				title="Forgot Password?"
				description="Enter your email to reset your password."
				:schema="schema"
				:fields="fields"
				align="top"
				icon="i-heroicons-lock-closed"
				:ui="{ base: 'text-center', footer: 'text-center' }"
				:loading="false"
				@submit="onSubmit"
			>
				<template #validation>
					<UAlert v-if="error" color="red" icon="i-heroicons-information-circle-20-solid" title="Error signing in" />
				</template>
				<!-- <template #footer>
					By signing in, you agree to our <NuxtLink to="/" class="text-primary font-medium">
						Terms of Service
					</NuxtLink>.
				</template> -->
			</UAuthForm>
		</UCard>
	</div>
</template>

<style lang="scss" scoped>

</style>
