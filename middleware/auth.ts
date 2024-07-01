export default defineNuxtRouteMiddleware((to, _from) => {
	const session = useSupabaseSession()
	console.log('session', session.value)

	if (!session.value) {
		console.log('redirecting to login')

		return navigateTo('/login')
	}
})
