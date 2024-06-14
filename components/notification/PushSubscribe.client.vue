<template>
	<div>
		<UModal v-model="isOpen">
			<div class="p-4">
				<UButton label="REquest Permission" @click="requestPermission" />
				<!-- <Placeholder class="h-48" /> -->
			</div>
		</UModal>
	</div>
</template>

<script setup>
// import { getMessaging, getToken } from 'firebase/messaging'
import { getToken } from 'firebase/messaging'

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const isOpen = ref(true)

const messaging = useFirebaseMessaging()

const requestPermission = async () => {
	console.log('Requesting permission...')
	Notification.requestPermission().then((permission) => {
		if (permission === 'granted') {
			console.log('Notification permission granted.')
		}
	})
	subscribe()
}

const subscribe = async () => {
	try {
		const serviceWorkerRegistration = await navigator.serviceWorker.getRegistration()
		console.log(serviceWorkerRegistration)
		const currentToken = await getToken(messaging, { serviceWorkerRegistration, vapidKey: 'BD0XHEQAh3DcCnRdrBZyZWqMNBIkc36f8CsK5T8a5tjN29vIb6o3va8OVSqnUHIlhE59gQ4n5xpCrfMk-r0TTtg' })
		if (currentToken) {
			// Send the token to your server to subscribe the user to notifications
			await subscribeTokenToServer(currentToken)
		} else {
			console.log('No registration token available. Request permission to generate one.')
		}
	} catch (error) {
		console.log('An error occurred while retrieving token. ', error)
	}
}

const subscribeTokenToServer = async (token) => {
	// add token to public.users fcm_token
	const { error } = await supabase
		.from('users')
		.update({ fcm_token: token })
		.eq('id', user.value.id)
	if (error) {
		console.error('Error creating notifcation token:', error.message)
	} else {
		console.log('Subscribed to notifications')
	}
}
</script>

<style lang="scss" scoped>

</style>
