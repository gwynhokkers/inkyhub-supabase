<template>
	<div>
		<UModal v-model="isOpen">
			<div class="p-4">
				<span>Subscribe to notifications to receive updates and alerts.</span>
				<UButton label="Request Permission" @click="requestPermission" />
			</div>
		</UModal>
	</div>
</template>

<script setup>
// import { getMessaging, getToken } from 'firebase/messaging'
import { getToken } from 'firebase/messaging'

const toast = useToast()
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const isOpen = ref(false)

const messaging = useFirebaseMessaging()

onMounted(() => {
	checkNotficationGranted()
})

// check if permission is has already been granted
const checkNotficationGranted = async () => {
	if (!user.value) return // if user does not exist, do not proceed
	const permission = await Notification.permission
	console.log(permission)
	if (permission === 'granted') {
		subscribe()
	} else {
		isOpen.value = true
	}
}

const requestPermission = async () => {
	console.log('Requesting permission...')
	Notification.requestPermission().then((permission) => {
		if (permission === 'granted') {
			console.log('Notification permission granted.')
			subscribe()
		}
	})
}

const subscribe = async () => {
	try {
		// get sw registration
		const serviceWorkerRegistration = await navigator.serviceWorker.getRegistration()
		if (!serviceWorkerRegistration) {
			console.log('No service worker registration.')
			toast.add({ title: 'No service worker registration.', icon: 'i-heroicons-x-circle' })
			return
		}
		// get new token
		const currentToken = await getToken(messaging, { serviceWorkerRegistration, vapidKey: 'BD0XHEQAh3DcCnRdrBZyZWqMNBIkc36f8CsK5T8a5tjN29vIb6o3va8OVSqnUHIlhE59gQ4n5xpCrfMk-r0TTtg' })
		if (currentToken) {
			// Send the token to your server to subscribe the user to notifications
			await subscribeTokenToServer(currentToken)
		} else {
			console.log('No registration token available. Request permission to generate one.')
		}
	} catch (error) {
		console.error('An error occurred while retrieving token.', error)
		// toast.add({ title: 'An error occurred while retrieving token.', icon: 'i-heroicons-x-circle' })
	}
}

const subscribeTokenToServer = async (token) => {
	// get all user device tokens
	const { data: tokens, error } = await supabase
		.from('users_fcm_tokens')
		.select('fcm_token')
		.eq('user', user.value.id)

	// check if token is already in the database
	if (tokens && tokens.length > 0) {
		const existingToken = tokens.find(t => t.fcm_token === token)
		if (existingToken) {
			console.log('Token already exists')
			toast.add({ title: 'Token already exists', icon: 'i-heroicons-check-circle' })
			isOpen.value = false
			return
		}
	}

	// if it does not already exist, add it.
	if (!existingToken) {
		// add token to public.users_fcm_tokens
		const { error: insertError } = await supabase
			.from('users_fcm_tokens')
			.insert({
				user: user.value.id,
				fcm_token: token
			})

		if (insertError) {
			console.error('Error creating notifcation token:', error.message)
			toast.add({ title: 'Error creating notifcation token', icon: 'i-heroicons-x-circle' })
		} else {
			createDeviceGroup(token)
			console.log('Subscribed to notifications')
			toast.add({ title: 'Subscribed to notifications', icon: 'i-heroicons-check-circle' })
			isOpen.value = false
		}
	}
}

const createDeviceGroup = async (token) => {
	// post request to createasync  device group
	const response = await fetch('https://fcm.googleapis.com/fcm/notification', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'access_token_auth': true,
			'Authorization': `Bearer AIzaSyBiZRWQ0wF32pBekAy1he3cZ_KWp2v2XJM`,
			'project_id': 'inky-hub'
		},
		body: JSON.stringify({
			operation: 'create',
			notification_key_name: 'inkyhub_' + user.value.id,
			registration_ids: [token]
		})
	})
	console.log(response)
}
</script>

<style lang="scss" scoped>

</style>
