<template>
	<UAlert
		class="lg:w-1/2"
		:class="isSelf ? 'self-end' : 'self-start'"
		:avatar="{
			src: user.avatar,
			alt: user.name
		}"
		:color="isSelf ? 'primary' : 'secondary'"
		variant="soft"
		:title="user.name"
		:description="body"
	/>
</template>

<script setup>
defineProps({
	body: String,
	user: Object,
	nonce: String,
	createdAt: String,
	isSelf: Boolean
})
</script>

<style lang="scss" scoped>

</style>
