<script setup lang="ts">
import { format, isToday } from 'date-fns'
import type { Chat } from '~/types'

defineProps({
  chat: {
    type: Object as PropType<Chat>,
    required: true
  },
  selected: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <UDashboardPanelContent>
    <div class="flex justify-between">
      <div class="flex items-center gap-4">
        <div class="min-w-0">
          <p class="text-gray-900 dark:text-white font-semibold">
            {{ chat.name }}
          </p>
          <!-- <p class="text-gray-500 dark:text-gray-400 font-medium">
			  {{ chat.subject }}
			</p> -->
        </div>
        <UAvatar
          v-for="chatUser in chat.chatsUsers"
          :key="chatUser.user.id"
          :alt="chatUser.user.name"
          size="xs"
        />
      </div>

      <p class="font-medium text-gray-900 dark:text-white">
        <!-- {{ isToday(new Date(chat.date)) ? format(new Date(chat.date), 'HH:mm') : format(new Date(chat.date), 'dd MMM') }} -->
      </p>
    </div>

    <UDivider class="my-5" />

    <div class="flex-1">
      <p class="text-lg">
        <!-- {{ chat.body }} -->
      </p>
    </div>

    <UDivider class="my-5" />

    <form @submit.prevent>
      <UTextarea
        color="gray"
        required
        size="xl"
        :rows="5"
        :placeholder="`Reply to ${chat.name}`"
      >
        <UButton
          type="submit"
          color="black"
          label="Send"
          icon="i-heroicons-paper-airplane"
          class="absolute bottom-2.5 right-3.5"
        />
      </UTextarea>
    </form>
  </UDashboardPanelContent>
</template>
