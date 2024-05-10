<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

const supabase = useSupabaseClient()

const groups = [{
  key: 'users',
  label: q => q && `Users matching “${q}”...`,
  search: async (q) => {
    if (!q) {
      const { data } = await supabase
        .from('users')
        .select('id, name, avatar, username')
      // .like('name', `%${q}%`)
      return data.map(user => ({ id: user.id, label: user.name, suffix: user.username }))
    }

    const { data, error } = await supabase
      .from('users')
      .select('id, name, avatar, username')
      .like('name', `%${q}%`)

    if (error) {
      console.error(error)
      return []
    }

    console.log(data)

    return data.map(user => ({ id: user.id, label: user.name, suffix: user.username }))
  }
}]

const emit = defineEmits(['close'])

const selectedUsers = ref([])

const state = reactive({
  name: undefined
//   members: undefined
//   location: undefined
})

// https://ui.nuxt.com/components/form
const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.name) errors.push({ path: 'name', message: 'Please enter a name.' })
  //   if (!state.email) errors.push({ path: 'email', message: 'Please enter an email.' })
  return errors
}

async function onSubmit(event: FormSubmitEvent<any>) {
  // Do something with data
  console.log(event.data, selectedUsers.value)

  emit('close')
}
</script>

<template>
  <UForm
    :validate="validate"
    :validate-on="['submit']"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormGroup
      label="Name"
      name="name"
    >
      <UInput
        v-model="state.name"
        placeholder="Chat name"
        autofocus
      />
    </UFormGroup>

    <UCommandPalette
      v-model="selectedUsers"
      multiple
      nullable
      :autoselect="false"
      :groups="groups"
      :fuse="{ resultLimit: 6, fuseOptions: { threshold: 0.1 } }"
    />
    <!-- <UFormGroup
      label="Members"
      name="members"
    >
      <UInput
        v-model="state.members"
        type="array"
        placeholder="john.doe@example.com"
      />
    </UFormGroup> -->

    <div class="flex justify-end gap-3">
      <UButton
        label="Cancel"
        color="gray"
        variant="ghost"
        @click="emit('close')"
      />
      <UButton
        type="submit"
        label="Save"
        color="black"
      />
    </div>
  </UForm>
</template>
