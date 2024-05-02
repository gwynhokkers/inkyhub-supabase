export default defineNuxtRouteMiddleware((to, _from) => {
  const user = useSupabaseUser()
  const profileStore = useProfileStore()

  if (!user.value) { // user is not logged in
    return navigateTo('/login')
  } else {
	if (!profileStore.getName) {
	  profileStore.fetchSupabaseProfile()
	}
  }
})
