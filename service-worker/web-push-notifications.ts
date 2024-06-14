/// <reference lib="WebWorker" />
/// <reference types="vite/client" />

// self.addEventListener('message', (event) => {
// 	if (event.data === ELK_PAGE_LIFECYCLE_FROZEN)
// 		closeDatabaseConnections()
// })
import { initializeApp } from 'firebase/app'
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw'
import type { PushPayload } from '~/service-worker/types'

declare const self: ServiceWorkerGlobalScope

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
const firebaseApp = initializeApp({
	apiKey: 'AIzaSyBiZRWQ0wF32pBekAy1he3cZ_KWp2v2XJM',
	authDomain: 'inky-hub.firebaseapp.com',
	projectId: 'inky-hub',
	storageBucket: 'inky-hub.appspot.com',
	messagingSenderId: '988346246167',
	appId: '1:988346246167:web:53cc52ab80d8fd276c6852',
	measurementId: 'G-G22NS14SR9'
})

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = getMessaging(firebaseApp)

onBackgroundMessage(messaging, (payload) => {
	console.log('[firebase-messaging-sw.js] Received background message ', payload)
	// Customize notification here
	const notificationTitle = 'Background Message Title'
	const notificationOptions = {
		body: 'Background Message body.',
		icon: '/firebase-logo.png'
	}

	self.registration.showNotification(notificationTitle,
		notificationOptions)
})

export function onPush(event: PushEvent) {
	const options: PushPayload = event.data!.json()
	console.log('onPush', options)

	// const { messaging } = useFirebaseMessaging()

	// messaging.onBackgroundMessage((payload) => {
	// 	console.log('Received background message ', payload)
	// 	const notificationTitle = payload.notification.title
	// 	const notificationOptions = {
	// 		body: payload.notification.body,
	// 		icon: '/firebase-logo.png'
	// 	}

	// 	self.registration.showNotification(notificationTitle, notificationOptions)
	// })

	// const promise = isClientFocused().then((isFocused) => {
	// 	if (isFocused)
	// 		return Promise.resolve()
	// 	const options: PushPayload = event.data!.json()

	// 	return findNotification(options)
	// 		.catch((e) => {
	// 			console.error('unhandled error finding notification', e)
	// 			return Promise.resolve(undefined)
	// 		})
	// 		.then((notificationInfo) => {
	// 			return self.registration.showNotification(options.title, createNotificationOptions(options, notificationInfo))
	// 		})
	// })

	// event.waitUntil(promise)
}

export function onNotificationClick(event: NotificationEvent) {
	const reactToNotificationClick = new Promise((resolve) => {
		event.notification.close()
		resolve(openUrl(event.notification.data.url))
	})

	event.waitUntil(reactToNotificationClick)
}

function findBestClient(clients: WindowClient[]) {
	const focusedClient = clients.find(client => client.focused)
	const visibleClient = clients.find(client => client.visibilityState === 'visible')

	return focusedClient || visibleClient || clients[0]
}

async function openUrl(url: string) {
	const clients = await self.clients.matchAll({ type: 'window' })
	// Chrome 42-48 does not support navigate
	if (clients.length !== 0 && 'navigate' in clients[0]) {
		const client = findBestClient(clients as WindowClient[])
		await client.navigate(url).then(client => client?.focus())
	}

	await self.clients.openWindow(url)
}

function isClientFocused() {
	return self.clients
		.matchAll({ type: 'window', includeUncontrolled: true })
		.then(windowClients => Promise.resolve(windowClients.some(windowClient => windowClient.focused)))
}
