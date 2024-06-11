<script setup lang="ts">
import { object, string, type InferType } from 'yup'

const supabase = useSupabaseClient()

const fields = [
	{
		name: 'password',
		label: 'Password',
		type: 'password',
		placeholder: 'Enter your new password'
	},
	{
		name: 'confirmPassword',
		label: 'Confirm Password',
		type: 'password',
		placeholder: 'Confirm your new password'
	}
]

const state = reactive({
	password: undefined
})

const schema = object({
//   email: string().email('Invalid email').required('Required'),
	password: string()
		.min(8, 'Must be at least 8 characters')
		.required('Required'),
	confirmPassword: string()
		.oneOf([state.password], 'Passwords must match')
		.required('Required')
})

const onSubmit = async () => {
	console.log('changing password...')

	const { data, error } = await supabase.auth.updateUser({
		password: state.password
	})

	if (error) console.log(error)
	if (data) console.log('Password changed successfully')
}
</script>

<template>
	<div class="flex justify-center flex-col gap-4 items-center w-full h-full">
		<UCard class="max-w-sm w-full">
			<UAuthForm
				title="Reset Password"
				description="Create your new password."
				:schema="schema"
				:fields="fields"
				align="top"
				icon="i-heroicons-lock-closed"
				:ui="{ base: 'text-center', footer: 'text-center' }"
				:loading="false"
				@submit="onSubmit"
			>
				<template #validation>
					<UAlert
						v-if="error"
						color="red"
						icon="i-heroicons-information-circle-20-solid"
						title="Error signing setting password"
					/>
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
