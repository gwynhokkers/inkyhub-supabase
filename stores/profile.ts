import { set } from 'date-fns'
import { defineStore } from 'pinia'

export const useProfileStore = defineStore({
  id: 'profile-store',
  state: () => {
    return {
      name: '',
	  avatar: '',
	  username: '',
	  location: ''
    //   email: ''
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
	async fetchSupabaseProfile() {
		const user = useSupabaseUser()
		const supabase = useSupabaseClient()
		const { data } = await useAsyncData('profile', async () => {
			const { data } = await supabase
				.from('profiles')
				.select('name, avatar, location, username')
				.eq('id', user.value.id)
				.single()
			return data
		})
		// console.log(data.value);
		this.setName(data.value.name);
		this.setAvatar(data.value.avatar);
		this.setUsername(data.value.username);
		this.setLocation(data.value.location);
	}
  },
  getters: {
    getName: state => state.name
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProfileStore, import.meta.hot))
}
