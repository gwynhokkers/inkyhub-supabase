// import { set } from 'date-fns'
import { defineStore } from 'pinia'

export const useUserStore = defineStore({
	id: 'user-store',
	state: () => {
		return {
			name: '',
			avatar: '',
			username: '',
			location: '',
			email: ''
		}
	},
	actions: {
		setName(name: string) {
			this.name = name
		},
		setUsername(username: string) {
			this.username = username
		},
		setLocation(location: string) {
			this.location = location
		},
		setAvatar(avatar: string) {
			this.avatar = avatar
		},
		async fetchSupabaseUser() {
			const user = useSupabaseUser()
			const supabase = useSupabaseClient()
			if (!user.value) return
			const { data } = await supabase
				.from('users')
				.select('name, avatar, location, username')
				.eq('id', user.value.id)
				.single()

			this.setName(data.name)
			this.setAvatar(data.avatar)
			this.setUsername(data.username)
			this.setLocation(data.location)
			this.email = user.value.email

			return { data }
		}
	},
	getters: {
		getName: state => state.name
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
