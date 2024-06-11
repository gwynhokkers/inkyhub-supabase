<script setup lang="ts">
const colorMode = useColorMode()
const color = computed(() => colorMode.value === 'dark' ? '#111827' : 'white')
const userStore = useUserStore()
onBeforeMount(() => {
	userStore.fetchSupabaseUser()
})

useHead({
	meta: [
		{ charset: 'utf-8' },
		{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
		{ key: 'theme-color', name: 'theme-color', content: color }
	],
	link: [
		{ rel: 'icon', href: '/favicon.ico' }
	],
	htmlAttrs: {
		lang: 'en'
	}
})

const title = 'Inky Hub - A Hub for cephalopods'
const description = 'Inky Hub is a hub for cephalopods. It is a place where cephalopods can come together and share their thoughts and ideas.'

useSeoMeta({
	title,
	description,
	ogTitle: title,
	ogDescription: description,
	ogImage: 'https://dashboard-template.nuxt.dev/social-card.png',
	twitterImage: 'https://dashboard-template.nuxt.dev/social-card.png',
	twitterCard: 'summary_large_image'
})

const { $pwa } = useNuxtApp()

const toast = useToast()

onMounted(() => {
	if ($pwa.offlineReady)
		toast.add({ title: 'App ready to work offline' })
})
</script>

<template>
	<div>
		<VitePwaManifest />

		<NuxtLoadingIndicator />

		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>

		<UNotifications />
		<UModals />
	</div>
</template>
