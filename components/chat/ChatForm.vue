<script setup lang="ts">
import { Buffer } from 'buffer'
import nacl from 'tweetnacl'
import type { FormError, FormSubmitEvent } from '#ui/types'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()

const groups = [{
	key: 'users',
	label: q => q && `Users matching “${q}”...`,
	search: async (q) => {
		if (!q) {
			const { data } = await supabase
				.from('users')
				.select('id, name, avatar, username')
				.neq('id', user.value.id)
			// .like('name', `%${q}%`)
			return data.map(user => ({ id: user.id, label: user.name, suffix: user.username }))
		}

		const { data, error } = await supabase
			.from('users')
			.select('id, name, avatar, username')
			.like('name', `%${q}%`)
			.neq('id', user.value.id)

		if (error) {
			console.error(error)
			return []
		}

		console.log(data)

		return data.map(user => ({ id: user.id, label: user.name, suffix: user.username }))
	}
}]

const emit = defineEmits(['close'])

const selectedUsers = ref([])

const state = reactive({
	name: undefined
//   members: undefined
//   location: undefined
})

// https://ui.nuxt.com/components/form
const validate = (state): FormError[] => {
	const errors = []
	if (!state.name) errors.push({ path: 'name', message: 'Please enter a name.' })
	//   if (!state.email) errors.push({ path: 'email', message: 'Please enter an email.' })
	return errors
}

const generateKey = () => {
	const key = nacl.randomBytes(nacl.secretbox.keyLength)
	return Buffer.from(key).toString('base64')
}

async function createGroup() {
	// Generate a new symmetric key
	// Convert key to base64 for storage
	const keyBase64 = generateKey()

	const memberIds = selectedUsers.value.map(user => user.id)

	// create chat
	const { data, error } = await supabase
		.rpc('create_chat_with_members', {
			chat_name: state.name,
			members: [
				user.value.id,
				...memberIds
			],
			key: keyBase64
		})

	if (error) {
		console.error(error)
		return
	}

	console.log(data)

	// use toast to show success
	toast.add({ title: 'Chat created!' })
	//   close modal
	emit('close')

//   emit('close')
}
</script>

<template>
	<UForm
		:validate="validate"
		:validate-on="['submit']"
		:state="state"
		class="space-y-4"
		@submit="createGroup"
	>
		<UFormGroup
			label="Name"
			name="name"
		>
			<UInput
				v-model="state.name"
				placeholder="Chat name"
				autofocus
			/>
		</UFormGroup>

		<UCommandPalette
			v-model="selectedUsers"
			multiple
			nullable
			:autoselect="false"
			:groups="groups"
			:fuse="{ resultLimit: 6, fuseOptions: { threshold: 0.1 } }"
		>
			<template #empty-state>
				<div class="flex flex-col items-center justify-center py-6 gap-3">
					<span class="italic text-sm">Nothing here! Search for users to add them</span>
					<UButton label="Add item" />
				</div>
			</template>
		</UCommandPalette>

		<div class="flex justify-end gap-3">
			<UButton
				label="Cancel"
				color="gray"
				variant="ghost"
				@click="emit('close')"
			/>
			<UButton
				type="submit"
				label="Save"
				color="black"
			/>
		</div>
	</UForm>
</template>
