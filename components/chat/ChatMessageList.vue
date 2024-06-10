<script setup lang="ts">
// import sodium from 'sodium-native'
import { Buffer } from 'buffer'
import nacl from 'tweetnacl'
import type { RealtimeChannel } from '@supabase/supabase-js'
import type { Chat } from '~/types'

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const props = defineProps({
	chat: {
		type: Object as PropType<Chat>,
		required: true
	}
})

let chatChannel: RealtimeChannel
const message = ref('')

// Fetch collaborators and get the refresh method provided by useAsyncData
const { data: messages, refresh: refreshMessages } = await useAsyncData('messages', async () => {
	// select all messages from the current chat
	const { data } = await supabase.from('messages').select('body, user, nonce, created_at, id').eq('chat', props.chat.id)
	// console.log('Messages:::', data)
	return data
})

// Once page is mounted, listen to changes on the `messages` table and refresh messages when receiving event
onMounted(() => {
	// Real time listener for new workouts
	chatChannel = supabase.channel(props.chat.title).on(
		'postgres_changes',
		{ event: '*', schema: 'public', table: 'messages' },
		() => {
			console.log('Message received')

			refreshMessages()
		}
	)

	chatChannel.subscribe()
})

// Don't forget to unsubscribe when user left the page
onUnmounted(() => {
	supabase.removeChannel(chatChannel)
})

// Function to encrypt a message
const encryptMessage = (keyBase64, message) => {
	const key = Buffer.from(keyBase64, 'base64')
	const nonce = nacl.randomBytes(nacl.secretbox.nonceLength)
	const messageUint8 = Buffer.from(message, 'utf-8')
	const box = nacl.secretbox(messageUint8, nonce, key)

	return {
		ciphertext: Buffer.from(box).toString('base64'),
		nonce: Buffer.from(nonce).toString('base64')
	}
}

// Function to decrypt a message
const decryptMessage = (keyBase64, ciphertextBase64, nonceBase64) => {
	const key = Buffer.from(keyBase64, 'base64')
	const nonce = Buffer.from(nonceBase64, 'base64')
	const ciphertext = Buffer.from(ciphertextBase64, 'base64')

	const messageUint8 = nacl.secretbox.open(ciphertext, nonce, key)

	if (!messageUint8) {
		throw new Error('Decryption failed')
	}

	return Buffer.from(messageUint8).toString('utf-8')
}

const onSubmitMessage = async (event: Event) => {
	event.preventDefault()
	// Do something with data
	// Encrypt the message
	const encrypted = encryptMessage(props.chat.key, message.value)

	// Save the encrypted message in Supabase
	const { data, error } = await supabase
		.from('messages')
		.insert([{
			chat: props.chat.id,
			body: encrypted.ciphertext,
			nonce: encrypted.nonce,
			user: user.value.id
		}])

	if (error) {
		console.error('Error saving message:', error)
		return
	}
	console.log('Message saved:', data)
	message.value = ''
}
</script>

<template>
	<UDashboardPanelContent>
		<div class="flex justify-between">
			<div class="flex items-center gap-4">
				<div class="min-w-0">
					<p class="text-gray-900 dark:text-white font-semibold">
						{{ chat.title }}
					</p>
				</div>
				<UAvatar
					v-for="chatUser in chat.chatsUsers"
					:key="chatUser.user.id"
					:alt="chatUser.user.name"
					size="xs"
				/>
			</div>

			<p class="font-medium text-gray-900 dark:text-white">
				<!-- {{ isToday(new Date(chat.date)) ? format(new Date(chat.date), 'HH:mm') : format(new Date(chat.date), 'dd MMM') }} -->
			</p>
		</div>

		<UDivider class="my-5" />

		<div class="flex-1 flex flex-col gap-4">
			<ChatMessage
				v-for="chatMessage in messages"
				:key="chatMessage.id"
				:body="decryptMessage(props.chat.key, chatMessage.body, chatMessage.nonce)"
				:user="chat.chatsUsers && chat.chatsUsers.find(chatUser => chatUser.user.id === chatMessage.user).user"
				:is-self="chatMessage.user === user.id"
				:created-at="chatMessage.created_at"
			/>
		</div>

		<UDivider class="my-5" />

		<form @submit="onSubmitMessage">
			<UTextarea
				v-model="message"
				color="gray"
				required
				size="xl"
				:rows="5"
				:placeholder="`Reply to ${chat.title}`"
			>
				<UButton
					type="submit"
					color="black"
					label="Send"
					icon="i-heroicons-paper-airplane"
					class="absolute bottom-2.5 right-3.5"
				/>
			</UTextarea>
		</form>
	</UDashboardPanelContent>
</template>
