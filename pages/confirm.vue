<script setup lang="ts">
const user = useSupabaseUser()
const userStore = useUserStore()

// Get redirect path from cookies
const cookieName = useRuntimeConfig().public.supabase.cookieName
const redirectPath = useCookie(`${cookieName}-redirect-path`).value

watch(user, async () => {
  if (user.value) {
    // Clear cookie
    useCookie(`${cookieName}-redirect-path`).value = null
    // call fetchUser in store
    await useAsyncData('user', () => userStore.fetchSupabaseUser())

    // Redirect to path
    return navigateTo(redirectPath || '/')
  }
}, { immediate: true })
</script>

<template>
  <div>Waiting for login...</div>
</template>
