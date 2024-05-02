<script setup lang="ts">
import { object, string, type InferType } from 'yup'

const supabase = useSupabaseClient()

const schema = object({
//   email: string().email('Invalid email').required('Required'),
  password: string()
    .min(8, 'Must be at least 8 characters')
    .required('Required')
})

const state = reactive({
  password: undefined
})

const onSubmit = async () => {
  console.log('changing password...')

  const { data, error } = await supabase.auth.updateUser({
    password: state.password
  })

  if (error) console.log(error)
  if (data) console.log('Password changed successfully')

}

</script>

<template>
<div class="">
    <UForm
      :state="state"
      :schema="schema"
      class="space-y-4"
      @submit="onSubmit"
    >
      <UFormGroup
        label="New Password"
        name="password"
      >
        <UInput
          v-model="state.password"
          type="password"
        />
      </UFormGroup>

      <div class="flex justify-end gap-3">
        <UButton
          type="submit"
          label="Submit"
          color="black"
        />
      </div>
    </UForm>
    <p>Reset password</p>
	<UButton
		label="Reset"
		color="black"
		@click="resetPassword"
	/>
  </div>
</template>

<style lang="scss" scoped>


</style>