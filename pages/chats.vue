<script setup lang="ts">
import type { Chat } from '~/types'

const createChatModalOpen = ref(false)

const tabItems = [{
  label: 'All'
}, {
  label: 'Unread'
}]
const selectedTab = ref(0)

const dropdownItems = [
//   [{
//     label: 'Mark as unread',
//     icon: 'i-heroicons-check-circle'
//   }, {
//     label: 'Mark as important',
//     icon: 'i-heroicons-exclamation-circle'
//   }],
  [{
    label: 'Star thread',
    icon: 'i-heroicons-star'
  }, {
    label: 'Mute thread',
    icon: 'i-heroicons-pause-circle'
  }]]

const { data: chats } = await useFetch<Chat[]>('/api/chats', { default: () => [] })

// Filter chats based on the selected tab
const filteredChats = computed(() => {
  if (selectedTab.value === 1) {
    return chats.value.filter(chat => !!chat.unread)
  }

  return chats.value
})

const selectedChat = ref<Chat | null>()

const isChatPanelOpen = computed({
  get() {
    return !!selectedChat.value
  },
  set(value: boolean) {
    if (!value) {
      selectedChat.value = null
    }
  }
})

// Reset selected chat if it's not in the filtered chats
watch(filteredChats, () => {
  if (!filteredChats.value.find(chat => chat.id === selectedChat.value?.id)) {
    selectedChat.value = null
  }
})

// Create new chat
// const openCreateChat = () => {

// }
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel
      id="inbox"
      :width="400"
      :resizable="{ min: 300, max: 500 }"
    >
      <UDashboardNavbar
        title="Inbox"
        :badge="filteredChats.length"
      >
        <template #right>
          <UTabs
            v-model="selectedTab"
            :items="tabItems"
            :ui="{ wrapper: '', list: { height: 'h-9', tab: { height: 'h-7', size: 'text-[13px]' } } }"
          />
          <UButton
            icon="i-heroicons-plus"
            size="md"
            class="ml-1.5 rounded-full"
            @click="createChatModalOpen = true"
          />
          <UDashboardModal
            v-model="createChatModalOpen"
            title="New chat"
            description="Create a new chat and add members to it."
            :ui="{ width: 'sm:max-w-md' }"
          >
            <!-- ~/components/users/UsersForm.vue -->
            <ChatForm @close="createChatModalOpen = false" />
          </UDashboardModal>
        </template>
      </UDashboardNavbar>

      <!-- ~/components/inbox/InboxList.vue -->
      <ChatList
        v-model="selectedChat"
        :chats="filteredChats"
      />
    </UDashboardPanel>

    <UDashboardPanel
      v-model="isChatPanelOpen"
      collapsible
      grow
      side="right"
    >
      <template v-if="selectedChat">
        <UDashboardNavbar>
          <template #toggle>
            <UDashboardNavbarToggle icon="i-heroicons-x-mark" />

            <UDivider
              orientation="vertical"
              class="mx-1.5 lg:hidden"
            />
          </template>

          <template #left>
            <UTooltip text="Archive">
              <UButton
                icon="i-heroicons-archive-box"
                color="gray"
                variant="ghost"
              />
            </UTooltip>

            <UTooltip text="Move to junk">
              <UButton
                icon="i-heroicons-archive-box-x-mark"
                color="gray"
                variant="ghost"
              />
            </UTooltip>

            <UDivider
              orientation="vertical"
              class="mx-1.5"
            />

            <UPopover :popper="{ placement: 'bottom-start' }">
              <template #default="{ open }">
                <UTooltip
                  text="Snooze"
                  :prevent="open"
                >
                  <UButton
                    icon="i-heroicons-clock"
                    color="gray"
                    variant="ghost"
                    :class="[open && 'bg-gray-50 dark:bg-gray-800']"
                  />
                </UTooltip>
              </template>

              <template #panel="{ close }">
                <DatePicker @close="close" />
              </template>
            </UPopover>
          </template>

          <template #right>
            <UTooltip text="Reply">
              <UButton
                icon="i-heroicons-arrow-uturn-left"
                color="gray"
                variant="ghost"
              />
            </UTooltip>

            <UTooltip text="Forward">
              <UButton
                icon="i-heroicons-arrow-uturn-right"
                color="gray"
                variant="ghost"
              />
            </UTooltip>

            <UDivider
              orientation="vertical"
              class="mx-1.5"
            />

            <UDropdown :items="dropdownItems">
              <UButton
                icon="i-heroicons-ellipsis-vertical"
                color="gray"
                variant="ghost"
              />
            </UDropdown>
          </template>
        </UDashboardNavbar>

        <!-- ~/components/chat/ChatMessages.vue -->
        <!-- <ChatMessages :chat="selectedChat" /> -->
      </template>
      <div
        v-else
        class="flex-1 hidden lg:flex items-center justify-center"
      >
        <UIcon
          name="i-heroicons-inbox"
          class="w-32 h-32 text-gray-400 dark:text-gray-500"
        />
      </div>
    </UDashboardPanel>
  </UDashboardPage>
</template>
