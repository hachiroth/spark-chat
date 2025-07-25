<script setup lang="ts">

</script>

<template>
  <div class="size-full flex flex-col gap-4">
    <div class="grow overflow-hidden">
      <router-view v-slot="{Component}">
        <keep-alive>
          <component :is="Component" :key="$route.fullPath"/>
        </keep-alive>
      </router-view>
    </div>
    <input type="text" class="input no-focus border-0 min-h-[38px]" placeholder="Type to chat">
  </div>
</template>

<style scoped></style>