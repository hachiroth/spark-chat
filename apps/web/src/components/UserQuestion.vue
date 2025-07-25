<script setup lang="ts">
import { onlyTime } from '@/utils/timer';

const {data} = defineProps<{
  data: any
}>()
</script>

<template>
  <div class="user-question chat chat-sender">
    <div class="chat-header">
      You
      <time class="text-base-content/50">{{ onlyTime(data?.createdAt )}}</time>
    </div>
    <div class="chat-bubble" v-html="data?.content"></div>
  </div>
</template>

<style scoped></style>