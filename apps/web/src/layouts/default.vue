<script setup lang="ts">
  import { ref } from 'vue'

  const menus = [
    {href: '/attachments' , label: 'Attachment', icon: 'icon-[mingcute--attachment-line]' },
    {href: '/histories' , label: 'History', icon: 'icon-[mingcute--album-2-line]' },
    {href: 'memories' , label: 'Memory', icon: 'icon-[mingcute--moment-line]' },
    {href: '/settings' , label: 'Setting', icon: 'icon-[mingcute--settings-5-line]' },
    {href: '/profile' , label: 'Profile', icon: 'icon-[mingcute--profile-line]' }
  ]
  const isLogin = ref(false)

  function toggle() {
    document.startViewTransition(() => {
      isLogin.value = !isLogin.value
    })
  }
</script>

<template>
  <div style="view-transition-name: layout;"
    class="absolute bottom-20 top-20 max-md:left-10 max-md:right-10 md:w-3xl rounded-lg flex flex-col p-4 justify-end bg-base-200">
    <main class="grow pb-4 overflow-hidden">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" :key="$route.fullPath" />
        </keep-alive>
      </router-view>
    </main>
    <footer class="w-full h-12 min-h-12 rounded-lg flex gap-4 items-center">
      <router-link to="/" class="bg-base-100 w-fit h-full rounded-md px-4 flex justify-center items-center">
        <span class="icon-[mingcute--sparkles-line] size-6"></span>
        New Chat
      </router-link>
      <ul class="flex items-center">
        <li v-for="menu in menus" :key="menu.href">
          <router-link :to="menu.href" v-slot="{isExactActive}"
            class="min-w-10 flex justify-center items-center gap-2 group" >
            <span :class="[menu.icon, 'size-6 opacity-50 group-hover:opacity-100 transition-opacity duration-300', isExactActive && 'opacity-100']" />
            <span class="hidden group-hover:block">
              {{ menu.label }}
            </span>
          </router-link>
        </li>
      </ul>
      <div class="ml-auto">
        <label class="swap swap-rotate opacity-50">
          <input type="checkbox" />
          <span class="swap-on icon-[mingcute--sun-line] size-7"></span>
          <span class="swap-off icon-[mingcute--moon-line] size-7"></span>
        </label>
      </div>
    </footer>
  </div>
  <div v-if="false"
    class="absolute bottom-30 top-30 max-sm:left-10 max-sm:right-10 sm:w-xl rounded-lg flex flex-col p-4 bg-base-200 px-16"
    style="view-transition-name: layout;">
    <div class="flex p-10 mx-auto">
      <h1 class="text-xl">Login to use Spark AI</h1>
    </div>
    <div class="space-y-4 max-w-xs mx-auto">
      <input type="text" placeholder="Username" class="input no-focus border-0">
      <input type="text" placeholder="password" class="input no-focus border-0">
    </div>
    <div class="py-8 max-w-xs mx-auto w-full flex justify-between gap-4">
      <button type="button" class="btn btn-primary grow" @click="toggle">
        Login
      </button>
      <button type="button" class="btn btn-success btn-soft" @click="toggle">
        Register
      </button>
    </div>
  </div>
</template>

<style scoped>
  ::view-transition-group(*) {
    animation: none;
    mix-blend-mode: normal;
  }
</style>