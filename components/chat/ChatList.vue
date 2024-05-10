<script setup lang="ts">
import { format, isToday } from 'date-fns'
import type { Chat } from '~/types'

const props = defineProps({
  modelValue: {
    type: Object as PropType<Chat | null>,
    default: null
  },
  chats: {
    type: Array as PropType<Chat[]>,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const chatsRefs = ref<Element[]>([])

const selectedChat = computed({
  get() {
    return props.modelValue
  },
  set(value: Chat | null) {
    emit('update:modelValue', value)
  }
})

watch(selectedChat, () => {
  if (!selectedChat.value) {
    return
  }

  const ref = chatsRefs.value[selectedChat.value.id]
  if (ref) {
    ref.scrollIntoView({ block: 'nearest' })
  }
})

defineShortcuts({
  arrowdown: () => {
    const index = props.chats.findIndex(chat => chat.id === selectedChat.value?.id)

    if (index === -1) {
      selectedChat.value = props.chats[0]
    } else if (index < props.chats.length - 1) {
      selectedChat.value = props.chats[index + 1]
    }
  },
  arrowup: () => {
    const index = props.chats.findIndex(chat => chat.id === selectedChat.value?.id)

    if (index === -1) {
      selectedChat.value = props.chats[props.chats.length - 1]
    } else if (index > 0) {
      selectedChat.value = props.chats[index - 1]
    }
  }
})
</script>

<template>
  <UDashboardPanelContent class="p-0">
    <div
      v-for="(chat, index) in chats"
      :key="index"
      :ref="el => { chatsRefs[chat.id] = el as Element }"
    >
      <div
        class="p-4 text-sm cursor-pointer border-l-2"
        :class="[
          chat.unread ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300',
          selectedChat && selectedChat.id === chat.id ? 'border-primary-500 dark:border-primary-400 bg-primary-100 dark:bg-primary-900/25' : 'border-white dark:border-gray-900 hover:border-primary-500/25 dark:hover:border-primary-400/25 hover:bg-primary-100/50 dark:hover:bg-primary-900/10'
        ]"
        @click="selectedChat = chat"
      >
        <div
          class="flex items-center justify-between"
          :class="[chat.unread && 'font-semibold']"
        >
          <div class="flex items-center gap-3">
            {{ chat.title }}

            <UChip v-if="chat.unread" />
          </div>

          <!-- <span>{{ isToday(new Date(chat.date)) ? format(new Date(chat.date), 'HH:mm') : format(new Date(chat.date), 'dd MMM') }}</span> -->
        </div>
        <p class="text-gray-400 dark:text-gray-500 line-clamp-1">
          <!-- {{ chat.body }} -->
        </p>
      </div>

      <UDivider />
    </div>
  </UDashboardPanelContent>
</template>
