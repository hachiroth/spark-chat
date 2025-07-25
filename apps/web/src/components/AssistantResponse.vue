<script setup lang="ts">
import { onlyTime } from '@/utils/timer';

const {data} = defineProps<{
  data: any
}>()
</script>

<template>
  <div class="assistant-response chat chat-receiver">
    <div class="chat-header">
      Spark Lite
      <time class="text-base-content/50">{{ onlyTime(data?.createdAt) }}</time>
    </div>
    <div class="chat-bubble" v-html="data?.content"></div>
  </div>
</template>

<style scoped></style>