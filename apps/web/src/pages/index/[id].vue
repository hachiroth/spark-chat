<script setup lang="ts">
  import apis from '@/apis'
import AssistantResponse from '@/components/AssistantResponse.vue'
import UserQuestion from '@/components/UserQuestion.vue'
  import { computed, onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()

  const conversationId = computed(() => route.params.id as string)
  const detail = ref()
  const histories = ref()

  onMounted(() => {
    apis.conversations.resume(conversationId.value).then(res => {
      detail.value = res.data.conversation
      histories.value = res.data.histories
      console.log(histories.value)
    })
  })
</script>

<template>
  <div class="size-full flex flex-col">
    <div class="pb-2">
      <h1 class="text-lg font-bold">{{ detail?.title || 'Unnamed conversation'}}</h1>
    </div>
    <div class="grow scroll-area px-2">
      <div v-for="item in histories" :key="item._id">
        <UserQuestion v-if="item.role === 'user'" :data="item" />
        <AssistantResponse v-else :data="item"/>
      </div>
    </div>
  </div>
</template>

<style scoped></style>