<template>
  <div class="flex min-h-screen max-w-screen">
    <RouterView name="Sidebar"></RouterView>
    <div class="w-full">
      <!-- <RouterView name="Header"></RouterView> -->
      <div class="m-8">
        <RouterView></RouterView>
      </div>
    </div>
</div>
  <router-view/>
</template>
